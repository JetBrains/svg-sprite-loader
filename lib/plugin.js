/* eslint-disable import/no-extraneous-dependencies */
const Promise = require('bluebird');
const Chunk = require('webpack/lib/Chunk');
const SVGCompiler = require('svg-baker');
const Sprite = require('svg-baker/lib/sprite');
const { NAMESPACE } = require('./config');
const {
  MappedList,
  replaceInModuleSource,
  replaceSpritePlaceholder,
  getWebpackVersion
} = require('./utils');

const webpackVersion = parseInt(getWebpackVersion(), 10);

class SVGSpritePlugin {
  constructor() {
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

      // Replace placeholders with real URL to symbol (in modules processed by sprite-loader)
      compilation.plugin('after-optimize-chunks', function replacePlaceholdersInModules() {
        const map = new MappedList(symbols, this);
        const replacements = map.groupItemsBySymbolFile((acc, item) => acc[item.resource] = item.useUrl);
        map.items.forEach(item => replaceInModuleSource(item.module, replacements));
      });

      // Hook into extract-text-webpack-plugin event to replace placeholders with real URL to symbol
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

      // Hook into html-webpack-plugin event to replace placeholders with real URL to symbol
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

          return Sprite.create({ symbols: spriteSymbols })
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
