var cheerio = require('cheerio');
var objToAttrString = require('./utils').objectToAttrString;

function SVGDocument(content) {
  var $ = cheerio.load(content, {normalizeWhitespace: true, xmlMode: true});
  var $svg = $('svg');
  this.$ = $;
  this.$svg = $svg;
}

/**
 * @enum
 */
SVGDocument.OUTPUT_FORMAT = {
  SVG: 'svg',
  SYMBOL: 'symbol'
};

/**
 *
 * @param {String} format
 * @returns {*}
 */
SVGDocument.prototype.toString = function (format) {
  var result;
  var $svg = this.$svg;
  var OUTPUT_FORMAT = SVGDocument.OUTPUT_FORMAT;
  var attrs = $svg.attr();
  var attrsStr = objToAttrString(attrs);

  switch (format) {
    default:
    case OUTPUT_FORMAT.SVG:
      result = [
        '<svg '+ attrsStr + '>',
        $svg.html(),
        '</svg>'
      ].join('');
      break;

    case OUTPUT_FORMAT.SYMBOL:
      var symbolAttrs = [];
      $svg.attr('viewBox') && symbolAttrs.push('viewBox="'+ $svg.attr('viewBox') +'"');
      $svg.attr('id') && symbolAttrs.push('id="' + $svg.attr('id') + '"');
      result = '<symbol '+ symbolAttrs.join(' ') + '>' + $svg.html() + '</symbol>';
      break;
  }

  return result;
};

module.exports = SVGDocument;