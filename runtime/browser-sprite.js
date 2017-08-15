import BrowserSprite from 'svg-baker-runtime/src/browser-sprite';
import domready from 'domready';

const globaVarName = '__SVG_SPRITE__';
const isSpriteExists = !!window[globaVarName];

// eslint-disable-next-line import/no-mutable-exports
let sprite;

if (isSpriteExists) {
  sprite = window[globaVarName];
} else {
  sprite = new BrowserSprite();
  window[globaVarName] = sprite;
}

const loadSprite = () => {
  sprite.mount(document.body, true);
};

if (document.body) {
  loadSprite();
} else {
  domready(loadSprite);
}

export default sprite;
