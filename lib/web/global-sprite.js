var Sprite = require('./sprite');
var globalSprite = new Sprite();

document.addEventListener('DOMContentLoaded', function () {
  globalSprite.elem = globalSprite.render(document.body);
}, false);

module.exports = globalSprite;