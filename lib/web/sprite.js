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

var svgOpening = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink= "http://www.w3.org/1999/xlink"';
var svgClosing = '</svg>';
var contentPlaceHolder = '{content}';

/**
 * Representation of SVG sprite
 * @constructor
 */
function Sprite() {
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
 */
Sprite.prototype.add = function (content) {
  if (this.svg) {
    this.appendSymbol(content);
  }

  this.content.push(content);

  if (this.delayed) {
    // Wait for thread end
    setTimeout(function () {
      this.render.apply(this, this.delayed);
      this.delayed = null;
    }.bind(this), 0);
  }
};

Sprite.prototype.wrapSVG = function (content, template) {
  var svgString = template.replace(contentPlaceHolder, content);

  return new DOMParser().parseFromString(svgString, 'image/svg+xml').documentElement;
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
  if (!this.content.length) {
    this.delayed = [target, prepend];
    return;
  }

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
