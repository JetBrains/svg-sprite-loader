import BrowserSprite from 'svg-baker-runtime/lib/browser-sprite';

const sprite = new BrowserSprite();

if (document.body) {
  sprite.mount(document.body, true);
} else {
  document.addEventListener('DOMContentLoaded', () => {
    sprite.mount(document.body, true);
  }, false);
}

export default sprite;
