import BrowserSprite from 'svg-baker-runtime/src/browser-sprite';
import domready from 'domready';

const sprite = new BrowserSprite();

const loadSprite = () => {
  const svg = sprite.mount(document.body, true);

  // :WORKAROUND:
  // IE doesn't evaluate <style> tags in SVGs that are dynamically added to the page.
  // This trick will trigger IE to read and use any existing SVG <style> tags.
  //
  // Reference: https://github.com/iconic/SVGInjector/issues/23
  const ua = window.navigator.userAgent || '';
  if (ua.indexOf('Trident') > 0 || ua.indexOf('Edge/') > 0) {
    const styles = svg.querySelectorAll('style');
    for (let i = 0, l = styles.length; i < l; i += 1) {
      styles[i].textContent += '';
    }
  }
};

if (document.body) {
  loadSprite();
} else {
  domready(loadSprite);
}

export default sprite;
