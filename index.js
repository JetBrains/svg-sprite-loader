var path = require('path');
var loaderUtils = require('loader-utils');
var extend = require('extend');
var convertToSymbol = require('./lib/convertToSymbol');
var optimize = require('./lib/optimize');

var defaults = {
  prefix: null,
  optimize: true
};

var getIdFromFilepath = function(filepath) {
  var basename = path.basename(filepath);
  var nameParts = basename.split('.');
  nameParts.splice(-1);
  return nameParts.join('.');
};

module.exports = function (content) {
  this.cacheable && this.cacheable();
  var options = extend({}, defaults, loaderUtils.parseQuery(this.query));
  var filepath = this.resourcePath;
  this.addDependency(filepath);

  var symbolId = (options.prefix ? options.prefix + '_' : '') + getIdFromFilepath(filepath);

  if (options.optimize)
    content = optimize(content);

  content = convertToSymbol(content, symbolId);

  return 'module.exports = ' + JSON.stringify(content);
};
