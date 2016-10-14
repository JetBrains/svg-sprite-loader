var path = require('path');

/**
 * SVG sprite loader config.
 *
 * @typedef  {Object} SVGSpriteLoaderConfig
 * @property {Boolean} [angularBaseWorkaround=false] Add workaround for Angular.js with base tag issue.
 * @property {String} [name="[name]"] Sprite symbol naming pattern. Supported patterns: `[ext]`, `[name]`, `[path]`, `[hash]` and `[pathhash]`.
 * @property {Boolean} [prefixize=true] Add prefix to all elements in SVG.
 * @property {String} [spriteModule] Sprite module name. You can define your own sprite module based on `./lib/web/sprite`.
 * @property {Boolean} [extract] Extract mode
*/

module.exports = {
  angularBaseWorkaround: false,
  name: '[name]',
  prefixize: true,
  spriteModule: path.resolve(__dirname, 'lib/web/global-sprite'),
  extract: false,
  esModule: false,
  regExp: null
};
