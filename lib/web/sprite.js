/**
 * List of SVG attributes to fix url target in them
 * @type {string[]}
 */
var fixAttributes = [
  'clipPath',
  'colorProfile',
  'src',
  'cursor',
  'fill',
  'filter',
  'marker',
  'markerStart',
  'markerMid',
  'markerEnd',
  'mask',
  'stroke'
];

/**
 * Query to find'em
 * @type {string}
 */
var fixAttributesQuery = '[' + fixAttributes.join('],[') + ']';
/**
 * @type {RegExp}
 */
var URI_FUNC_REGEX = /^url\((.*)\)$/;

/**
 * Convert array-like to array
 * @param {Object} arrayLike
 * @returns {Array.<T>}
 */
function arrayFrom(arrayLike) {
  return Array.prototype.slice.call(arrayLike, 0);
}

/**
 * Add prefix to all relative `url()`s
 * @param {Element} svg
 * @param {string} urlPrefix
 */
function baseUrlWorkAround(svg, urlPrefix) {
  var nodes = svg.querySelectorAll(fixAttributesQuery);

  if (!nodes) {
    return;
  }

  var attributes = arrayFrom(nodes).reduce(function (attributes, node) {
    arrayFrom(node.attributes).forEach(function (attribute) {
      if (fixAttributes.indexOf(attribute.localName) !== -1) {
        attributes.push(attribute);
      }
    });

    return attributes;
  }, []);

  attributes.forEach(function (attribute) {
    var match = URI_FUNC_REGEX.exec(attribute.value);

    // Skip possible external links
    if (match && match[1].indexOf('#') === 0) {
      attribute.value = 'url(' + urlPrefix + match[1] + ')'
    }
  });
}

/**
 * Firefox #353575 bug workaround
 * @see https://bugzilla.mozilla.org/show_bug.cgi?id=353575
 * @param {Element} svg
 */
var FirefoxSymbolBugWorkaround = function (svg) {
  var defs = svg.querySelector('defs');
  var moveToDefsElems = svg.querySelectorAll('linearGradient, radialGradient, pattern');
  for (var i = 0, len = moveToDefsElems.length; i < len; i++) {
    defs.appendChild(moveToDefsElems[i]);
  }
};

/**
 * @type {string}
 */
var svgOpening = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink= "http://www.w3.org/1999/xlink"';
/**
 * @type {string}
 */
var svgClosing = '</svg>';
/**
 * @type {string}
 */
var contentPlaceHolder = '{content}';

/**
 * Representation of SVG sprite
 * @constructor
 */
function Sprite() {
  var baseElement = document.getElementsByTagName('base')[0];
  var currentUrl = window.location.href.split('#')[0];
  var baseUrl = baseElement && baseElement.href;
  this.urlPrefix = baseUrl && baseUrl !== currentUrl ? currentUrl : '';

  this.content = [];
}

Sprite.styles = ['position:absolute', 'width:0', 'height:0', 'visibility:hidden'];

Sprite.spriteTemplate = svgOpening + ' style="'+ Sprite.styles.join(';') +'"><defs>' + contentPlaceHolder + '</defs>' + svgClosing;
Sprite.symbolTemplate = svgOpening + '>' + contentPlaceHolder + svgClosing;

/**
 * @type {Array<String>}
 */
Sprite.prototype.content = null;

/**
 * @param {String} content
 * @param {String} id
 */
Sprite.prototype.add = function (content, id) {
  if (this.svg) {
    this.appendSymbol(content);
  }

  this.content.push(content);

  return this.urlPrefix + '#' + id;
};

/**
 *
 * @param content
 * @param template
 * @returns {Element}
 */
Sprite.prototype.wrapSVG = function (content, template) {
  var svgString = template.replace(contentPlaceHolder, content);

  var svg = new DOMParser().parseFromString(svgString, 'image/svg+xml').documentElement;

  if (this.urlPrefix) {
    baseUrlWorkAround(svg, this.urlPrefix);
  }

  return svg;
};

Sprite.prototype.appendSymbol = function (content) {
  var symbol = this.wrapSVG(content, Sprite.symbolTemplate).childNodes[0];

  this.svg.querySelector('defs').appendChild(symbol);
};

/**
 * @returns {String}
 */
Sprite.prototype.toString = function () {
  var wrapper = document.createElement('div');
  wrapper.appendChild(this.render());
  return wrapper.innerHTML;
};

/**
 * @param {HTMLElement} [target]
 * @param {Boolean} [prepend=true]
 * @returns {HTMLElement} Rendered sprite node
 */
Sprite.prototype.render = function (target, prepend) {
  target = target || null;
  prepend = typeof prepend === 'boolean' ? prepend : true;

  var svg = this.wrapSVG(this.content.join(''), Sprite.spriteTemplate);

  // Because of Firefox bug #353575 gradients and patterns don't work if they are within a symbol.
  // To workaround this we move the gradient definition outside the symbol element
  // @see https://bugzilla.mozilla.org/show_bug.cgi?id=353575
  if (/firefox/i.test(navigator.userAgent)) FirefoxSymbolBugWorkaround(svg);

  if (target) {
    if (prepend && target.childNodes[0]) {
      target.insertBefore(svg, target.childNodes[0]);
    } else {
      target.appendChild(svg);
    }
  }

  this.svg = svg;

  return svg;
};

module.exports = Sprite;
