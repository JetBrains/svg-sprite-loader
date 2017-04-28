import BrowserSprite from 'svg-baker-runtime/src/browser-sprite';
import domready from 'domready';

const sprite = new BrowserSprite();

domready(() => sprite.mount(document.body, true));

export default sprite;
