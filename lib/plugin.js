/* eslint-disable import/no-extraneous-dependencies */
const Promise = require('bluebird');
const Chunk = require('webpack/lib/Chunk');
const SVGCompiler = require('svg-baker');
const Sprite = require('svg-baker/lib/sprite');
const { NAMESPACE } = require('./config');
const { MappedList, replaceInModuleSource } = require('./utils');

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
        const replacements = map.groupSpritesBySymbol((acc, item) => acc[item.resource] = item.url);
        map.items.forEach(item => replaceInModuleSource(item.module, replacements));
      });

      // Replace placeholders with real URL to symbol (in modules extracted by extract-text-webpack-plugin)
      compilation.plugin('optimize-extracted-chunks', function replacePlaceholdersInExtractedChunks(chunks) {
        const map = new MappedList(symbols, this);
        const replacements = map.groupSpritesBySymbol((acc, item) => acc[item.resource] = item.useUrl);

        chunks.forEach((chunk) => {
          chunk.modules
            // dirty hack to identify modules extracted by extract-text-webpack-plugin
            // TODO refactor
            .filter(module => '_originalModule' in module)
            .forEach(module => replaceInModuleSource(module, replacements));
        });
      });

      // Create sprite chunk
      compilation.plugin('additional-assets', function emitSpriteChunks(done) {
        const map = new MappedList(symbols, this);
        const sprites = map.groupSymbolsBySprite();
        const filenames = Object.keys(sprites);

        return Promise.map(filenames, (spriteFilename) => {
          const spriteSymbols = sprites[spriteFilename];

          return Sprite.create({ symbols: spriteSymbols })
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
        }).then(() => {
          done();
          return true;
        }).catch(e => done(e));
      });
    });
  }
}

module.exports = SVGSpritePlugin;
