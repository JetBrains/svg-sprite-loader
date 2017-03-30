var Sprite = require('./sprite');
var globalSprite = new Sprite();

if (document.body) {
  globalSprite.elem = globalSprite.render(document.body);
} else {
  document.addEventListener('DOMContentLoaded', function () {
    globalSprite.elem = globalSprite.render(document.body);
  }, false);
}

module.exports = globalSprite;
