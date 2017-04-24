const merge = require('deepmerge');
const defaults = require('./config').loader;
const utils = require('./utils');

const extractTextPluginCompilerName = 'extract-text-webpack-plugin';
const browserSpriteModule = 'svg-sprite-loader/runtime/browser-sprite.build';

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

  const autodetected = {
    spriteModule: target === 'web' ? browserSpriteModule : defaults.spriteModule,
    symbolModule: defaults.symbolModule,
    extract: utils.isModuleShouldBeExtracted(module),
    esModule: context.version && context.version >= 2
  };

  const finalConfig = merge.all([defaults, autodetected, config || {}]);

  /**
   * Fix for extract-text-webpack-plugin loader which executes module source as node module,
   * so export should be always in commonjs style
   * @see https://git.io/vS7Sn
   */
  if (compiler.name === extractTextPluginCompilerName) {
    finalConfig.esModule = false;
  }

  return finalConfig;
};
