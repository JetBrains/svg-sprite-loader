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
     * @type {string}
     */
    symbolId: '[name]',

    /**
     * Path to Node.js module which generates client runtime.
     * @type {string}
     */
    runtimeGenerator: require.resolve('./runtime-generator'),

    /**
     * Path to sprite module which will be compiled and executed at runtime.
     * By default depends on 'target' webpack config option:
     * - `svg-sprite-loader/runtime/browser-sprite` for 'web' target.
     * - `svg-sprite-loader/runtime/sprite` for all other targets.
     * @type {string}
     */
    spriteModule: 'svg-sprite-loader/runtime/sprite.build',

    /**
     * Path to sprite symbol module.
     * @type {string}
     */
    symbolModule: 'svg-sprite-loader/runtime/symbol.build',

    /**
     * Configures whether to transpile the module to an ES-compatible format.
     * If `true` the loader will produce `module.exports.__esModule = true; module.exports['default'] = svg`.
     * Default is `false` (useful for transpilers other than Babel).
     * By default depends on used Webpack version. `true` in Webpack >= 2, `false` otherwise.
     * @type {boolean}
     */
    esModule: true,

    /**
     * Turns loader in extract mode.
     * @type {boolean}
     */
    extract: false,

    /**
     * Filename for generated sprite. `[chunkname]` placeholder can be used.
     * @type {string}
     */
    spriteFilename: 'sprite.svg'
  }
};
