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
SVGDocument.prototype.toString = function (format, removeAttrs) {
  var result;
  var $ = this.$;
  var $svg = this.$svg;
  var OUTPUT_FORMAT = SVGDocument.OUTPUT_FORMAT;
  var attrs = $svg.attr();
  var attrsStr = objToAttrString(attrs);
  var namespaces = this.getNamespaces();

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
	  
	  //removeAttrs
	  if(removeAttrs instanceof Array) {
		  removeAttrs.forEach(function(element) {
			  if(!element.selector || !element.attr)
				  return;
			  try {
				$(element.selector).removeAttr(element.attr); 
			  } catch(ex) {
				  console.log(ex);
			  }
		  }.bind(this))
	  }
	  
      var symbolAttrs = [];

      // preserve following attributes
      ['viewBox', 'id', 'class', 'preserveAspectRatio'].forEach(function (attr) {
        var attrValue = $svg.attr(attr);
        attrValue && symbolAttrs.push(attr + '="' + attrValue +'"');
      });

      if (namespaces) {
        // remove default namespace
        if (namespaces.hasOwnProperty('xmlns'))
          delete namespaces.xmlns;

        symbolAttrs.push(objToAttrString(namespaces));
      }

      result = '<symbol '+ symbolAttrs.join(' ') + '>' + $svg.html() + '</symbol>';
      break;
  }

  return result;
};

/**
 * @returns {Object<String, String>|null}
 */
SVGDocument.prototype.getNamespaces = function () {
  var $ = this.$;
  var namespaces = null;

  $('*').each(function (i, elem) {
    var attrs = $(elem).attr();
    for (var name in attrs) {
      if (name.indexOf('xmlns') !== -1 || name.indexOf('xmlns:') !== -1) {
        if (namespaces === null) namespaces = {};
        namespaces[name] = attrs[name];
      }
    }
  });

  return namespaces;
};

module.exports = SVGDocument;
