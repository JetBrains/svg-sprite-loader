/* eslint-disable import/no-extraneous-dependencies */
const Promise = require('bluebird');
const Chunk = require('webpack/lib/Chunk');
const SVGBaker = require('svg-baker');
const Sprite = require('svg-baker/lib/Sprite');

const NAMESPACE = require('./loader').NAMESPACE;
const utils = require('./utils');

let ExtractedModule;

try {
  // eslint-disable-next-line global-require
  ExtractedModule = require('extract-text-webpack-plugin/ExtractedModule');
} catch (e) {
  ExtractedModule = null;
}

class SVGSpritePlugin {
  constructor() {
    this.store = new SVGBaker();
  }

  get NAMESPACE() {
    return NAMESPACE; // eslint-disable class-methods-use-this
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

      // Replace placeholders with real URL to symbol (in modules extracted by extract-text-webpack-plugin)
      compilation.plugin('optimize-extracted-chunks', function replacePlaceholdersInExtractedChunks(chunks) {
        const map = utils.aggregate(symbols, this);
        const replacements = map.reduce((aac, resource) => {
          aac[resource] = map[resource].useUrl;
          return aac;
        }, Object.keys(map));

        chunks.forEach((chunk) => {
          chunk.modules
            .filter(module => module instanceof ExtractedModule)
            .forEach(module => utils.replaceInModuleSource(module, replacements));
        });
      });

      // Replace placeholders with real URL to symbol (in modules processed by sprite-loader)
      compilation.plugin('after-optimize-chunks', function replacePlaceholdersInModules() {
        const map = utils.aggregate(symbols, this);

        const replacements = map.reduce((aac, resource) => {
          aac[resource] = map[resource].url;
          return aac;
        }, Object.keys(map));

        map.forEach(({ module }) => utils.replaceInModuleSource(module, replacements));
      });

      // Create sprite chunk
      // TODO emit only built chunks
      compilation.plugin('additional-assets', function emitSpriteChunk(done) {
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
