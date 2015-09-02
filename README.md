# Webpack SVG sprite loader

```js
// Add single image to the sprite
require('svg-sprite!images/logos/logo.svg');

// ...or bunch of them
var files = require.context('svg-sprite!images/logos', false, /\.svg$/);
files.keys().forEach(files);

// Use it somewhere on the page
<svg><use xlink:href="#logo"></use></svg>

// PROFIT!
```