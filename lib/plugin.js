/* eslint-disable import/no-extraneous-dependencies */
const merge = require('deepmerge');
const SVGCompiler = require('svg-baker');
const spriteFactory = require('svg-baker/lib/sprite-factory');
const { NAMESPACE } = require('./config');
const {
  additionalAssets,
  generateSprites,
  getReplacements,
  MappedList,
  replaceInModuleSource
} = require('./utils');

const defaultConfig = {
  plainSprite: false,
  spriteAttrs: {}
};

class SVGSpritePlugin {
  constructor(cfg = {}) {
    const config = merge.all([defaultConfig, cfg]);
    this.config = config;

    const spriteFactoryOptions = {
      attrs: config.spriteAttrs
    };

    if (config.plainSprite) {
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

  getReplacements() {
    const isPlainSprite = this.config.plainSprite === true;
    // TODO clarify what the hell `SymbolFile` means here
    const replacements = this.map.groupItemsBySymbolFile((acc, item) => {
      acc[item.resource] = isPlainSprite ? item.url : item.useUrl;
    });
    return replacements;
  }

  replaceSpriteInModuleSource(compilation) {
    const { symbols } = this.svgCompiler;
    this.map = new MappedList(symbols, compilation);
    this.replacements = this.getReplacements(symbols, compilation, 1);
    this.map.items.forEach(item => replaceInModuleSource(item.module, this.replacements));
  }

  replaceInModuleSource(compilation, chunks) {
    chunks.forEach((chunk) => {
      const modules = chunk.modules || Array.from(chunk.modulesIterable);

      modules.forEach(() => {
        if (Object.hasOwnProperty.call(module, '_originalModule')) {
          replaceInModuleSource(module, this.replacements);
        }
      });
    });
  }

  // TODO optimize MappedList instantiation in each hook
  apply(compiler) {
    const useNewTapableAPI = !!compiler.hooks;

    const { symbols } = this.svgCompiler;

    if (useNewTapableAPI) {
      compiler.hooks
      .thisCompilation
      .tap(NAMESPACE, (compilation) => {
        compilation.hooks
          .normalModuleLoader
          .tap(NAMESPACE, loaderContext => loaderContext[NAMESPACE] = this);

        compilation.hooks.afterOptimizeChunks
          .tap(NAMESPACE, () => this.replaceSpriteInModuleSource(compilation));

        compilation.hooks.optimizeExtractedChunks
          .tap(NAMESPACE, chunks => this.replaceInModuleSource(compilation, chunks));

        if (compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration) {
          compilation.hooks
            .htmlWebpackPluginBeforeHtmlGeneration
            .tapAsync(NAMESPACE, (htmlPluginData, callback) => {
              htmlPluginData.assets.sprites = generateSprites(this, compilation, symbols);

              callback();
            });
        }

        if (compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing) {
          compilation.hooks
            .htmlWebpackPluginBeforeHtmlProcessing
            .tapAsync(NAMESPACE, (htmlPluginData, callback) => {
              htmlPluginData.html = getReplacements(this, compilation, symbols, htmlPluginData);

              callback();
            });
        }

        compilation.hooks.additionalAssets
          .tapPromise(NAMESPACE, () => additionalAssets(this, compilation, symbols).then(() => true));
      });
    } else {
      // Handle only main compilation
      compiler.plugin('this-compilation', (compilation) => {
        // Share svgCompiler with loader
        compilation.plugin('normal-module-loader', (loaderContext) => {
          loaderContext[NAMESPACE] = this;
        });

        // Replace placeholders with real URL to symbol (in modules processed by svg-sprite-loader)
        compilation.plugin('after-optimize-chunks', () => this.replaceSpriteInModuleSource(compilation));

        // Hook into extract-text-webpack-plugin to replace placeholders with real URL to symbol
        // compilation.plugin('optimize-extracted-chunks', chunks => this.replaceInModuleSource(compilation, chunks));

        // Hook into html-webpack-plugin to add `sprites` variable into template context
        compilation.plugin('html-webpack-plugin-before-html-generation', (htmlPluginData, done) => {
          htmlPluginData.assets.sprites = generateSprites(this, compilation, symbols);
          done(null, htmlPluginData);
        });

        // Hook into html-webpack-plugin to replace placeholders with real URL to symbol
        compilation.plugin('html-webpack-plugin-before-html-processing', (htmlPluginData, done) => {
          htmlPluginData.html = getReplacements(this, compilation, symbols, htmlPluginData);
          done(null, htmlPluginData);
        });

        // Create sprite chunk
        compilation.plugin('additional-assets', (done) => {
          return additionalAssets(this, compilation, symbols)
            .then(() => {
              done();

              return true;
            })
            .catch(done);
        });
      });
    }
  }
}

module.exports = SVGSpritePlugin;
Error.stackTraceLimit = Infinity;
