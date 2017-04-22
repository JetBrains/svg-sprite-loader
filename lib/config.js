const fs = require('fs');
const PACKAGE_NAME = require('../package.json').name;

module.exports = {
  PACKAGE_NAME,
  NAMESPACE: fs.realpathSync(__dirname),
  EXTRACTABLE_MODULE_ISSUER_PATTERN: /\.(css|sass|scss|less|styl|html)$/i,
  SPRITE_PLACEHOLDER_PATTERN: /\[sprite-filename\|([^\]]*)\];?/gi,

  /**
   * Overridable loader options
   */
  loader: {
    /**
     * Symbol tag `id` attribute.
     * Full list of supported patterns see at https://github.com/webpack/loader-utils#interpolatename.
     */
    symbolId: '[name]',

    /**
     * Path to Node.js module which generates client runtime.
     */
    runtimeGenerator: require.resolve('./runtime-generator'),

    /**
     * Path to sprite module which will be compiled and executed at runtime.
     * By default depends on 'target' webpack config option:
     * - `svg-sprite-loader/runtime/browser-sprite` for 'web' target.
     * - `svg-sprite-loader/runtime/sprite` for all other targets.
     */
    spriteModule: 'svg-sprite-loader/runtime/sprite',

    /**
     * Path to sprite symbol module.
     */
    symbolModule: 'svg-sprite-loader/runtime/symbol',

    /**
     * Configures whether to transpile the module to an ES-compatible format.
     * If `true` the loader will produce `module.exports.__esModule = true; module.exports['default'] = svg`.
     * Default is `false` (useful for transpilers other than Babel).
     * By default depends on used Webpack version. `true` in Webpack >= 2, `false` otherwise.
     */
    esModule: true,

    /**
     * Turns loader in extract mode.
     */
    extract: false,

    /**
     * Filename for generated sprite. `[chunkname]` placeholder can be used.
     */
    spriteFilename: 'sprite.svg'
  }
};
