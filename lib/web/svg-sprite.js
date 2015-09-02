var spriteStyles = ['position:absolute', 'width:0', 'height:0', 'visibility:hidden'];
var spriteTemplate = '<svg xmlns="http://www.w3.org/2000/svg" style="'+ spriteStyles.join(';') +'"><defs>{content}</defs></svg>';

var singleton = new SVGSprite();

function SVGSprite() {
  var that = this;

  if (!(this instanceof SVGSprite))
    return singleton;

  this.content = [];

  document.addEventListener('DOMContentLoaded', function () { that.render(document.body) }, false);
}

/**
 * @type {HTMLElement} Sprite DOM Node
 */
SVGSprite.prototype.elem = null;

/**
 * @type {Array<String>}
 */
SVGSprite.prototype.content = null;

/**
 * @param {String} content
 */
SVGSprite.prototype.add = function(content) {
  this.content.push(content);
};

SVGSprite.prototype.toString = function () {
  return spriteTemplate.replace('{content}', this.content.join(''));
};

/**
 * @param {HTMLElement} [target]
 * @param {Boolean} [prepend=true]
 * @returns {HTMLElement} Rendered sprite node
 */
SVGSprite.prototype.render = function(target, prepend) {
  var target = target || null;
  var prepend = typeof prepend === 'boolean' ? prepend : true;
  var sprite = this.toString();

  if (target) {
    sprite = new DOMParser().parseFromString(sprite, 'image/svg+xml').documentElement;
    prepend
      ? target.insertBefore(sprite, target.childNodes[0])
      : target.appendChild(sprite);
    this.elem = sprite;
  }

  return sprite;
};

SVGSprite.prototype.destroy = function() {
  this.elem.parentNode.removeChild(this.elem);
  this.elem = null;
};

module.exports = SVGSprite;