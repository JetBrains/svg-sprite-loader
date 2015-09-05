/**
 * Firefox #353575 bug workaround
 * @see https://bugzilla.mozilla.org/show_bug.cgi?id=353575
 */
var FirefoxSymbolBugWorkaround = function (svg) {
  var defs = svg.querySelector('defs');
  var moveToDefsElems = svg.querySelectorAll('linearGradient, radialGradient, pattern');
  for (var i = 0, len = moveToDefsElems.length; i < len; i++) {
    defs.appendChild(moveToDefsElems[i]);
  }
};

/**
 * Representation of SVG sprite
 * @constructor
 */
function Sprite() {
  this.content = [];
}

Sprite.styles = ['position:absolute', 'width:0', 'height:0', 'visibility:hidden'];

Sprite.template = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink= "http://www.w3.org/1999/xlink" style="'+ Sprite.styles.join(';') +'"><defs>{content}</defs></svg>';

/**
 * @type {Array<String>}
 */
Sprite.prototype.content = null;

/**
 * @param {String} content
 */
Sprite.prototype.add = function (content) {
  this.content.push(content);
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
  var target = target || null;
  var prepend = typeof prepend === 'boolean' ? prepend : true;

  var svgString = Sprite.template.replace('{content}', this.content.join(''));
  var svg = new DOMParser().parseFromString(svgString, 'image/svg+xml').documentElement;

  // Because of Firefox bug #353575 gradients and patterns don't work if they are within a symbol.
  // To workaround this we move the gradient definition outside the symbol element
  // @see https://bugzilla.mozilla.org/show_bug.cgi?id=353575
  if (/firefox/i.test(navigator.userAgent)) FirefoxSymbolBugWorkaround(svg);

  if (target) {
    prepend
      ? target.insertBefore(svg, target.childNodes[0])
      : target.appendChild(svg);
  }

  return svg;
};

module.exports = Sprite;