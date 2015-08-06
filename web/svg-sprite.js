function Sprite() {
  this.content = [];
}

/**
 * @type {HTMLElement}
 */
Sprite.prototype.elem = null;

/**
 * @type {Array<String|Function>}
 */
Sprite.prototype.content = null;

/**
 * @param {String|Function} content String or Webpack context module
 * @see http://webpack.github.io/docs/context.html#context-module
 */
Sprite.prototype.add = function(content) {
  if (typeof content === 'string') {
    this.content.push(content);
  }
  else if (typeof content === 'function') {
    content.keys().forEach(function (moduleKey) {
      this.add(content(moduleKey));
    }.bind(this));
  }
};

/**
 * @returns {String}
 */
Sprite.prototype.renderToString = function() {
  return ['<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">']
    .concat(this.content)
    .concat(['</svg>'])
    .join('');
};

/**
 * @param {HTMLElement} [target]
 * @param {Boolean} [prepend=true]
 * @returns {HTMLElement} Rendered sprite node
 */
Sprite.prototype.render = function(target, prepend) {
  var prepend = typeof prepend === 'boolean' ? prepend : true;
  var content = this.renderToString();
  var sprite = new DOMParser().parseFromString(content, 'image/svg+xml').documentElement;
  sprite.setAttribute('style', ['position:absolute', 'width:0', 'height:0', 'visibility:hidden'].join(';'));

  if (target) {
    prepend
      ? target.insertBefore(sprite, target.childNodes[0])
      : target.appendChild(sprite);
  }

  this.elem = sprite;
  return sprite;
};

Sprite.prototype.destroy = function() {
  this.elem.parentNode.removeChild(this.elem);
  this.elem = null;
};

module.exports = Sprite;