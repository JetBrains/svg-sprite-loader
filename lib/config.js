/* eslint-disable max-len */
const fs = require('fs');
const PACKAGE_NAME = require('../package.json').name;

module.exports = {
  PACKAGE_NAME,
  NAMESPACE: fs.realpathSync(__dirname),
  EXTRACTABLE_MODULE_ISSUER_PATTERN: /\.(css|sass|scss|less|styl|html)$/i,
  SPRITE_PLACEHOLDER_PATTERN: /\[sprite-filename\|([^\]]*)\];?/gi,

  /**
   * Overridable loader options
   * @typedef {Object} SVGSpriteLoaderConfig
   */
  loader: {
    /**
     * How `<symbol id>` should be named.
     * Full list of supported patterns see at [loader-utils#interpolatename docs](https://github.com/webpack/loader-utils#interpolatename).
     * @type {string}
     */
    symbolId: '[name]',

    /**
     * Path to Node.js module which generates client runtime.
     * @type {string}
     */
    runtimeGenerator: require.resolve('./runtime-generator'),

    /**
     * Arbitrary data passed to runtime generator.
     * @type {*}
     */
    runtimeOptions: undefined,

    /**
     * Should runtime be compatible with earlier v0.* loader versions.
     * Will be removed in 3 version.
     * @type {boolean}
     * @deprecated
     */
    runtimeCompat: false,

    /**
     * Path to sprite module which will be compiled and executed at runtime.
     * By default depends on 'target' webpack config option:
     * - `svg-sprite-loader/runtime/browser-sprite.build` for 'web' target.
     * - `svg-sprite-loader/runtime/sprite.build` for all other targets.
     * @type {string}
     * @autoconfigurable
     */
    spriteModule: 'svg-sprite-loader/runtime/sprite.build',

    /**
     * Path to symbol module.
     * By default depends on 'target' webpack config option:
     * - `svg-sprite-loader/runtime/browser-symbol.build` for 'web' target.
     * - `svg-sprite-loader/runtime/symbol.build` for all other targets.
     * @type {string}
     * @autoconfigurable
     */
    symbolModule: 'svg-sprite-loader/runtime/symbol.build',

    /**
     * Generated export format:
     * - when `true` loader will produce `export default ...`.
     * - when `false` the result is `module.exports = ...`.
     * By default depends on used webpack version. `true` for Webpack >= 2, `false` otherwise.
     * @type {boolean}
     * @autoconfigurable
     */
    esModule: true,

    /**
     * Turns loader in extract mode.
     * Enables automatically if SVG image was imported from css/scss/sass/less/styl/html.
     * @type {boolean}
     * @autoconfigurable
     */
    extract: false,

    /**
     * Filename for generated sprite. `[chunkname]` placeholder can be used.
     * @type {string}
     */
    spriteFilename: 'sprite.svg'
  }
};
