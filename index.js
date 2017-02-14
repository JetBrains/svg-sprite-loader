var path = require('path');
var loaderUtils = require('loader-utils');
var extend = require('extend');
var defaultConfig = require('./config');
var SVGDoc = require('./lib/svg-document');
var procs = require('./lib/processings');
var utils = require('./lib/utils');

module.exports = function (content) {
  this.cacheable && this.cacheable();
  /** @type {SVGSpriteLoaderConfig} */
  var config;

  var query = loaderUtils.parseQuery(this.query);
  if ('config' in query) {
    config = extend({}, defaultConfig, loaderUtils.getLoaderConfig(this, query.config));
  } else {
    config = extend({}, defaultConfig, query);
  }

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
    content: content,
    regExp: config.regExp
  });
  if (config.name.indexOf('[pathhash]') !== -1)
    id = utils.generateHashFromPath(resourcePath);

  if (config.prefixize)
    procs.prefixize(doc, id + '_');

  procs.prefixCssSelectors(doc, '#' + id);

  // Check raster image pixel ratio from file name (e.g. image@2x.png)
  if (isRasterImage) {
    var pixelRatio = utils.getPixelRatioFromFilename(basename);
    var scale = Number((1 / pixelRatio).toFixed(1));
    if (scale !== 1)
      doc.$('image').attr('transform', 'scale('+ scale +')');
  }

  doc.$svg.attr('id', id);

  content = doc.toString(SVGDoc.OUTPUT_FORMAT.SYMBOL);
  var output;

  var exportCode = config.esModule
    ? 'module.exports.__esModule = true;\n module.exports["default"] = '
    : 'module.exports = ';

  var extractMode = config.extract === true
    || this.loaders[0].path.indexOf('extract-text-webpack-plugin') != -1
    || this._compiler.name == 'extract-text-webpack-plugin';

  if (extractMode) {
    output = [exportCode + JSON.stringify(content) + ';'];
  } else {
    output = [
      config.angularBaseWorkaround ? 'require("' + path.resolve(__dirname, 'lib/web/angular-base-workaround').replace(/\\/g, "/") + '");' : '',
      'var sprite = require("' + config.spriteModule.replace(/\\/g, "/") + '");',
      'var image = ' + JSON.stringify(content) + ';',
      exportCode + 'sprite.add(image, "' + id + '");'
    ];
  }

  return output.join('\n');
};
