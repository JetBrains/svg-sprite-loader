var path = require('path');
var loaderUtils = require('loader-utils');
var extend = require('extend');
var processing = require('./processing');
var svgSpriteModulePath = path.resolve(__dirname, 'web/svg-sprite');

var normalizePath = function (path_) {
  if (path.sep === '\\')
    return path_.replace(/\\/g, "/");

  return path_;
};

var generateIdFromFilepath = function(filepath) {
  var basename = path.basename(filepath);
  var nameParts = basename.split('.');
  nameParts.splice(-1);
  return nameParts.join('.');
};

module.exports = function (content) {
  this.cacheable && this.cacheable();
  var options = loaderUtils.parseQuery(this.query);
  var resourcePath = this.resourcePath;
  this.addDependency(resourcePath);

  var id = generateIdFromFilepath(resourcePath);

  content = processing(content, extend({
      id: id,
      prefix: id + '_',
      optimize: true,
      output: processing.OUTPUT.SYMBOL
    }, options));

  return [
    'var sprite = require("'+ normalizePath(svgSpriteModulePath) +'")()',
    'var resource = '+ JSON.stringify(content),
    'sprite.add(resource)',
    'module.exports = resource;'
  ].join(';\n');
};
