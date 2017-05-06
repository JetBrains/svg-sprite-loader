const merge = require('deepmerge');
const defaults = require('./config');
const utils = require('./utils');

const loaderDefaults = defaults.loader;
const isomorphicSpriteModule = 'svg-sprite-loader/runtime/sprite.build';
const isomorphicSymbolModule = 'svg-baker-runtime/symbol';

/**
 * @param {Object} params
 * @param {Object} [params.config] Parsed loader config {@see SVGSpriteLoaderConfig}
 * @param {LoaderContext} context Loader context {@see https://webpack.js.org/api/loaders/#the-loader-context}
 * @return {Object}
 */
module.exports = function configurator({ config, context }) {
  const target = context.options.target;
  const module = context._module;
  const compiler = context._compiler;

  const autoConfigured = {
    spriteModule: target === 'web' ? loaderDefaults.spriteModule : isomorphicSpriteModule,
    symbolModule: target === 'web' ? loaderDefaults.symbolModule : isomorphicSymbolModule,
    extract: utils.isModuleShouldBeExtracted(module),
    esModule: context.version && context.version >= 2
  };

  const finalConfig = merge.all([loaderDefaults, autoConfigured, config || {}]);

  /**
   * Fix for extract-text-webpack-plugin loader which executes module source as node module,
   * so export should be always in commonjs style
   * @see https://git.io/vS7Sn
   */
  if (compiler.name === defaults.EXTRACT_TEXT_PLUGIN_COMPILER_NAME) {
    finalConfig.esModule = false;
  }

  return finalConfig;
};
