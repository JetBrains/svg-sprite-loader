# Webpack SVG sprite loader

```js
// Create sprite instance
var SvgSprite = require('node_modules/svg-sprite-loader/web/svg-sprite');
var sprite = new SvgSprite();

// Add single image to the sprite
sprite.add(require('svg-sprite!images/logos/logo.svg'));

// ...or bunch of them
sprite.add(require.context('svg-sprite!images/logos', false, /\.svg$/));

// Render the sprite
sprite.render(document.body);

// PROFIT!
```