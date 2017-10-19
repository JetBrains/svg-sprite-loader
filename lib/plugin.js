/* eslint-disable import/no-extraneous-dependencies */
const merge = require('deepmerge');
const Promise = require('bluebird');
const Chunk = require('webpack/lib/Chunk');
const SVGCompiler = require('svg-baker');
const spriteFactory = require('svg-baker/lib/sprite-factory');
const Sprite = require('svg-baker/lib/sprite');
const { NAMESPACE } = require('./config');
const {
  MappedList,
  replaceInModuleSource,
  replaceSpritePlaceholder,
  getWebpackVersion
} = require('./utils');

const webpackVersion = parseInt(getWebpackVersion(), 10);

const defaultConfig = {
  plainSprite: false
};

class SVGSpritePlugin {
  constructor(config = {}) {
    this.config = merge.all([defaultConfig, config]);
    const { plainSprite } = this.config;

    const spriteFactoryOptions = {};

    if (plainSprite) {
      spriteFactoryOptions.styles = false;
      spriteFactoryOptions.usages = false;
    }

    this.factory = ({ symbols }) => {
      const opts = merge.all([spriteFactoryOptions, { symbols }]);
      return spriteFactory(opts);
    };

    this.svgCompiler = new SVGCompiler();
  }

  /**
   * This need to find plugin from loader context
   */
  // eslint-disable-next-line class-methods-use-this
  get NAMESPACE() {
    return NAMESPACE;
  }

  // TODO optimize MappedList instantiation in each hook
  apply(compiler) {
    const plugin = this;
    const { symbols } = this.svgCompiler;

    // Handle only main compilation
    compiler.plugin('this-compilation', (compilation) => {
      // Share svgCompiler with loader
      compilation.plugin('normal-module-loader', (loaderContext) => {
        loaderContext[NAMESPACE] = plugin;
      });

      // Replace placeholders with real URL to symbol (in modules processed by svg-sprite-loader)
      compilation.plugin('after-optimize-chunks', function replacePlaceholdersInModules() {
        const map = new MappedList(symbols, this);
        const replacements = map.groupItemsBySymbolFile((acc, item) => acc[item.resource] = item.useUrl);
        map.items.forEach(item => replaceInModuleSource(item.module, replacements));
      });

      // Hook into extract-text-webpack-plugin to replace placeholders with real URL to symbol
      compilation.plugin('optimize-extracted-chunks', function replacePlaceholdersInExtractedChunks(chunks) {
        const map = new MappedList(symbols, this);
        const replacements = map.groupItemsBySymbolFile((acc, item) => acc[item.resource] = item.useUrl);

        chunks.forEach((chunk) => {
          const modules = webpackVersion < 3 ? chunk.modules : chunk.mapModules();

          modules
            // dirty hack to identify modules extracted by extract-text-webpack-plugin
            // TODO refactor
            .filter(module => '_originalModule' in module)
            .forEach(module => replaceInModuleSource(module, replacements));
        });
      });

      // Hook into html-webpack-plugin to add `sprites` variable into template context
      compilation.plugin('html-webpack-plugin-before-html-generation', function htmlPluginHook(htmlPluginData, done) {
        const { assets } = this;
        const map = new MappedList(symbols, this);
        const itemsBySprite = map.groupItemsBySpriteFilename();
        const sprites = Object.keys(itemsBySprite).reduce((acc, filename) => {
          acc[filename] = assets[filename].source();
          return acc;
        }, {});

        htmlPluginData.assets.sprites = sprites;
        done(null, htmlPluginData);
      });

      // Hook into html-webpack-plugin to replace placeholders with real URL to symbol
      compilation.plugin('html-webpack-plugin-before-html-processing', function htmlPluginHook(htmlPluginData, done) {
        const map = new MappedList(symbols, this);
        const replacements = map.groupItemsBySymbolFile((acc, item) => acc[item.resource] = item.useUrl);
        htmlPluginData.html = replaceSpritePlaceholder(htmlPluginData.html, replacements);
        done(null, htmlPluginData);
      });

      // Create sprite chunk
      compilation.plugin('additional-assets', function emitSpriteChunks(done) {
        const map = new MappedList(symbols, this);
        const itemsBySprite = map.groupItemsBySpriteFilename();
        const filenames = Object.keys(itemsBySprite);

        return Promise.map(filenames, (filename) => {
          const spriteSymbols = itemsBySprite[filename].map(item => item.symbol);

          return Sprite.create({
            symbols: spriteSymbols,
            factory: plugin.factory
          })
            .then((sprite) => {
              const content = sprite.render();
              const chunkName = filename.replace(/\.svg$/, '');
              const chunk = new Chunk(chunkName);
              chunk.ids = [];
              chunk.files.push(filename);

              compilation.assets[filename] = {
                source() { return content; },
                size() { return content.length; }
              };

              compilation.chunks.push(chunk);
            });
        }).then(() => {
          done();
          return true;
        }).catch(e => done(e));
      });
    });
  }
}

module.exports = SVGSpritePlugin;
