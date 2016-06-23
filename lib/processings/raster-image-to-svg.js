var path = require('path');
var fs = require('fs');
var sizeOf = require('image-size');
var extend = require('extend');
var objToAttrString = require('../utils').objectToAttrString;

var template = [
  '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink= "http://www.w3.org/1999/xlink" viewBox="0 0 {width} {height}">',
    '<image width="{width}" height="{height}" xlink:href="{src}" />',
  '</svg>'
].join('');

/**
 * @param {String} filepath Path to raster image
 * @returns {String} SVG with encoded raster image
 */
module.exports = function (filepath) {
  var imageAttrs = {};
  var src = fs.readFileSync(path.resolve(filepath), 'base64');
  var info = sizeOf(filepath);

  return template
    .replace(/\{width\}/g, info.width)
    .replace(/\{height\}/g, info.height)
    .replace(/\{src\}/g, 'data:image/'+ info.type +';base64,' + src)
};
