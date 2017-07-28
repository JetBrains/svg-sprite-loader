import BrowserSprite from 'svg-baker-runtime/src/browser-sprite';
import domready from 'domready';

const sprite = new BrowserSprite();

if (document.body) {
  sprite.mount(document.body, true);
} else {
  domready(() => sprite.mount(document.body, true));
}

export default sprite;
