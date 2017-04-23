import BrowserSprite from 'svg-baker-runtime/src/browser-sprite';

var sprite = new BrowserSprite();

document.addEventListener('DOMContentLoaded', function() {
  sprite.mount(document.body, true);
}, false);

export default sprite;
