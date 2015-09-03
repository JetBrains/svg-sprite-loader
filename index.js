var path = require('path');
var loaderUtils = require('loader-utils');
var extend = require('extend');
var SVGDoc = require('./lib/svg-document');
var procs = require('./lib/processings');
var utils = require('./lib/utils');

/**
 * Default loader config
 *
 * @typedef {{
    name: String,
    prefix: String,
    svgo: Boolean|SVGOConfig,
    spriteModule: String,
 * }} loaderConfig
 */
var defaultConfig = {
   // Sprite image naming pattern. Supported patterns: `[name]`, `[pathhash]`.
  name: '[name]',

  // Use SVGO for optimization. Boolean or SVGO config supported.
  // See https://github.com/svg/svgo/blob/master/docs/how-it-works/en.md#1-config.
  svgo: true,

  // Sprite module name. You can define your own sprite module (based on `./lib/web/sprite` or not).
  spriteModule: path.resolve(__dirname, 'lib/web/global-sprite')
};

module.exports = function (content) {
  this.cacheable && this.cacheable();

  var query = loaderUtils.parseQuery(this.query);
  /** @type {loaderConfig} */
  var config = extend({}, defaultConfig, query);
  var resourcePath = this.resourcePath;
  var basename = path.basename(resourcePath);
  var isRasterImage = utils.isRasterImage(resourcePath);

  this.addDependency(resourcePath);

  if (isRasterImage)
    content = procs.rasterImageToSVG(resourcePath);

  if (config.svgo)
    content = procs.svgo(content, typeof config.svgo === 'boolean' ? null : config.svgo);

  var doc = new SVGDoc(content);
  var id = utils.generateIdFromFilepath(resourcePath, config.name);
  procs.prefixize(doc, id + '_');

  // Check raster image pixel ratio based on file name (e.g. image@2x.png)
  if (isRasterImage) {
    var pixelRatio = utils.getPixelRatioFromFilename(basename);
    var scale = Number((1 / pixelRatio).toFixed(1));
    if (scale !== 1)
      doc.$('image').attr('transform', 'scale('+ scale +')');
  }

  doc.$svg.attr('id', id);

  content = doc.toString(SVGDoc.OUTPUT_FORMAT.SYMBOL);

  return [
    'var sprite = require("' + config.spriteModule.replace(/\\/g, "/") + '")',
    'var image = ' + JSON.stringify(content),
    'sprite.add(image)',
    'module.exports = ' + JSON.stringify(id) + ';'
  ].join(';\n');
};
