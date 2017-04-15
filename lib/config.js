const fs = require('fs');
const PACKAGE_NAME = require('../package.json').name;

/**
 * Overridable loader options
 */
module.exports = {
  symbolId: '[name]',

  // Runtime
  runtimeGenerator: require.resolve('./runtime-generator'),
  spriteModule: 'svg-sprite-loader/runtime/sprite',
  symbolModule: 'svg-sprite-loader/runtime/symbol',
  esModule: true,

  // Extracting
  extract: false,
  spriteFilename: 'sprite.svg'
};

module.exports.NAMESPACE = fs.realpathSync(__dirname);
module.exports.PACKAGE_NAME = PACKAGE_NAME;
module.exports.MODULE_TO_EXTRACT_ISSUER_REGEXP = /\.(css|sass|scss|less|styl|html)$/i;
module.exports.SPRITE_PLACEHOLDER_REGEXP = /\[sprite-filename\|([^\]]*)\];?/gi;
