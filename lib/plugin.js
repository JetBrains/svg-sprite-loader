/* eslint-disable import/no-extraneous-dependencies */
const Promise = require('bluebird');
const Chunk = require('webpack/lib/Chunk');
const SVGCompiler = require('svg-baker');
const Sprite = require('svg-baker/lib/Sprite'); // eslint-disable-line import/no-unresolved
const { NAMESPACE } = require('./config');
const utils = require('./utils');

class SVGSpritePlugin {
  constructor() {
    this.store = new SVGCompiler();
  }

  /**
   * This need to find plugin from loader context
   */
  // eslint-disable-next-line class-methods-use-this
  get NAMESPACE() {
    return NAMESPACE;
  }

  /**
   * @param {Object} symbol
   * @param {string} symbol.id
   * @param {string} symbol.path
   * @param {string} symbol.content
   * @return {Promise.<SpriteSymbol>}
   */
  addSymbol(symbol) {
    return this.store.addSymbol(symbol);
  }

  apply(compiler) {
    const plugin = this;
    const { symbols } = this.store;

    // Handle only main compilation
    compiler.plugin('this-compilation', (compilation) => {
      // Share store with loader
      compilation.plugin('normal-module-loader', (loaderContext) => {
        loaderContext[NAMESPACE] = plugin;
      });

      // Replace placeholders with real URL to symbol (in modules processed by sprite-loader)
      compilation.plugin('after-optimize-chunks', function replacePlaceholdersInModules() {
        const map = utils.aggregate(symbols, this);
        const replacements = map.reduce((acc, item) => {
          acc[item.resource] = item.url;
          return acc;
        }, {});

        map.forEach(item => utils.replaceInModuleSource(item.module, replacements));
      });

      // Replace placeholders with real URL to symbol (in modules extracted by extract-text-webpack-plugin)
      compilation.plugin('optimize-extracted-chunks', function replacePlaceholdersInExtractedChunks(chunks) {
        const map = utils.aggregate(symbols, this);
        const replacements = map.reduce((acc, item) => {
          acc[item.resource] = item.useUrl;
          return acc;
        }, {});

        chunks.forEach((chunk) => {
          chunk.modules
            // dirty hack to identify modules extracted by extract-text-webpack-plugin
            // TODO refactor
            .filter(module => '_originalModule' in module)
            .forEach(module => utils.replaceInModuleSource(module, replacements));
        });
      });

      // Create sprite chunk
      compilation.plugin('additional-assets', function emitSpriteChunks(done) {
        const sprites = utils.groupSymbolsBySprites(utils.aggregate(symbols, this));
        const filenames = Object.keys(sprites);

        return Promise.map(filenames, (spriteFilename) => {
          const spriteSymbols = sprites[spriteFilename];

          return Sprite.create({ symbols: spriteSymbols, filename: spriteFilename })
            .then((sprite) => {
              const content = sprite.render();
              const chunk = new Chunk(spriteFilename);
              chunk.ids = [];
              chunk.files.push(spriteFilename);

              compilation.assets[spriteFilename] = {
                source() { return content; },
                size() { return content.length; }
              };

              compilation.chunks.push(chunk);
            });
        })
          .then(() => done())
          .catch(e => done(e));
      });
    });
  }
}

module.exports = SVGSpritePlugin;
