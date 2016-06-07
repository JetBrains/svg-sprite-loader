var path = require('path');
var loaderUtils = require('loader-utils');
var extend = require('extend');
var defaultConfig = require('./config');
var SVGDoc = require('./lib/svg-document');
var procs = require('./lib/processings');
var utils = require('./lib/utils');

module.exports = function (content) {
  this.cacheable && this.cacheable();

  var query = loaderUtils.parseQuery(this.query);
  /** @type {SVGSpriteLoaderConfig} */
  var config = extend({}, defaultConfig, query);
  var resourcePath = this.resourcePath;
  var basename = path.basename(resourcePath);
  var isRasterImage = utils.isRasterImage(resourcePath);

  this.addDependency(resourcePath);

  if (isRasterImage)
    content = procs.rasterImageToSVG(resourcePath);

  var doc = new SVGDoc(content);

  // Calculate sprite symbol id
  var id = loaderUtils.interpolateName(this, config.name, {
    context: this.options.context,
    content: content
  });
  if (config.name.indexOf('[pathhash]') !== -1)
    id = utils.generateHashFromPath(resourcePath);

  if (config.prefixize)
    procs.prefixize(doc, id + '_');

  // Check raster image pixel ratio from file name (e.g. image@2x.png)
  if (isRasterImage) {
    var pixelRatio = utils.getPixelRatioFromFilename(basename);
    var scale = Number((1 / pixelRatio).toFixed(1));
    if (scale !== 1)
      doc.$('image').attr('transform', 'scale('+ scale +')');
  }

  doc.$svg.attr('id', id);

  content = doc.toString(SVGDoc.OUTPUT_FORMAT.SYMBOL);

  return [
    config.angularBaseWorkaround ? 'require("' + path.resolve(__dirname, 'lib/web/angular-base-workaround').replace(/\\/g, "/") + '");' : '',
    'var sprite = require("' + config.spriteModule.replace(/\\/g, "/") + '");',
    'var image = ' + JSON.stringify(content),
    'module.exports = sprite.add(image, "' + id + '");'
  ].join(';\n');
};
