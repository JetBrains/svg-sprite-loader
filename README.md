# Webpack SVG sprite loader

It's like [style-loader](https://github.com/webpack/style-loader) but for SVG.

- Create a single SVG sprite from a set of images in the browser runtime.
  When you require an image like `require('svg-sprite!./image.svg')` it will return a symbol id so you can reference it later in `<svg><use xlink:href="#id"/></svg>`.
- Raster images (PNG, JPG and GIF) will be wrapped with an `<image>` tag. Files like `image@2x.png` will be transformed with proper scale.
- By default sprite renders when `DOMContentLoaded` event fires and injects as first child in `document.body`.
  If you need custom behavior, use `spriteModule` config option to specify module path of your sprite implementation.
  You can extend a default [`lib/web/sprite.js`](lib/web/sprite.js), or create your own. In the latter case you only need to implement the `add` method that accepts the symbol data as a string.
- [SVGO](https://github.com/svg/svgo) is included.

## Installation

```bash
npm install svg-sprite-loader --save-dev
```

## Example config

```js
module.exports = {
  module: {
    loaders: [{
      test: /\.svg$/,
      loader: 'svg-sprite?' + JSON.stringify({
        name: '[name]_[hash]',
        prefixize: true,
        svgo: {
          plugins: [{
            cleanupIDs: false
          }]
        },
        spriteModule: 'utils/my-custom-sprite'
      })
    }
    ]
  }
};
```

## Configuration

* `name` - configures a custom symbol id naming. Default is `[name]`. Followning name patterns are supported:
  * `[ext]` the extension of the image.
  * `[name]` the basename of the image.
  * `[path]` the path of the image.
  * `[hash]` the hash or the image content.
  * `[pathhash]` the hash or the image path.
* `prefixize` - isolates an image content by prefixing its `id`, `xlink:href` è `url(#id)` elements. Default is `true`.
* `svgo` - image optimization. Can be true/false or an [SVGO config object](https://github.com/svg/svgo/blob/master/docs/how-it-works/en.md#1-config). Default is `true`.
* `spriteModule` - defines custom sprite implementation module path.

## Examples

Single image
```js
require('svg-sprite!./image.svg');
```

Set of images
```js
var files = require.context('svg-sprite!images/logos', false, /\.svg$/);
files.keys().forEach(files);
```