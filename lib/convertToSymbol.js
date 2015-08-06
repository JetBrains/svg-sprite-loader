var fs = require('fs');
var cheerio = require('cheerio');

/**
 * @param {String} content
 * @param {String} symbolId
 * @returns {String}
 */
module.exports = function (content, symbolId) {
  if (!symbolId) throw new Error('You must provide symbol id');

  var $source = cheerio.load(content, {normalizeWhitespace: true, xmlMode: true});
  var $svg = $source('svg');

  // Rename id's
  $source('[id]').each(function() {
    var $elem = $source(this);
    var elemId = $elem.attr('id');
    $elem.attr('id', symbolId + '_' + elemId);
  });

  var $result = cheerio.load('<symbol>' + $svg.html() + '</symbol>', {xmlMode: true});
  var $symbol = $result('symbol').first();

  // Add id
  $symbol.attr('id', symbolId);

  // Add viewBox
  var viewBox = $svg.attr('viewBox');
  var width = $svg.attr('width');
  var height = $svg.attr('height');
  if (!viewBox && width && height) {
    var pxSize = /^\d+(\.\d+)?(px)?$/;
    if (pxSize.test(width) && pxSize.test(height))
      viewBox = [0, 0, parseFloat(width), parseFloat(height)].join(' ');
  }
  viewBox && $symbol.attr('viewBox', viewBox);

  return $result.html();
};