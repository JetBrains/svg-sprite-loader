# Webpack SVG sprite loader

It's like [style-loader](https://github.com/webpack/style-loader) but for SVG:

- Creates a single SVG sprite from a set of images.
- Raster images support (PNG, JPG and GIF).
- Custom sprite implementation support.

## How it works

When you require an image, loader transforms it to SVG symbol and add it to the array in special [sprite](lib/web/sprite.js) class.
When browser event `DOMContentLoaded` fires sprite will be rendered and injected as first child of `document.body`.
Require statement e.g. `require('svg-sprite!./image.svg')` returns a symbol id, so you can reference it later
in `<svg><use xlink:href="#id"/></svg>`. Raster images  will be inlined (base64) and wrapped with an `<image>` tag.
Files like `image@2x.png` will be transformed with proper scale.

### Custom sprite implementation

By default sprite renders when `DOMContentLoaded` event fires and injects as first child in `document.body`.
If you need custom behavior, use `spriteModule` config option to specify module path of your sprite implementation.
You can extend a default [`lib/web/sprite.js`](lib/web/sprite.js), or create your own.
In the latter case you only need to implement the `add` method that accepts the symbol data as a string.

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
        spriteModule: 'utils/my-custom-sprite'
      })
    }]
  }
};
```

## Configuration

* `name` configures a custom symbol id naming. Default is `[name]`. Following name patterns are supported:
  * `[ext]` the extension of the image.
  * `[name]` the basename of the image.
  * `[path]` the path of the image.
  * `[hash]` the hash or the image content.
  * `[pathhash]` the hash or the image path.
* `angularBaseWorkaround` Adds workaround for issue with combination of `<base>` and History API which is [typical for Angular.js](https://github.com/angular/angular.js/issues/8934). Default is `false`.
* `prefixize` isolates an image content by prefixing its `id`, `xlink:href` and `url(#id)` elements. Default is `true`.
* `spriteModule` defines [custom sprite implementation](#custom-sprite-implementation) module path.
* `esModule` whether to transpile module to ES compatible format. When this option is set to `true`, loader will produce `module.exports.__esModule = true; module.exports['default'] = svg`. Default is `false`. Useful for transpilers other than Babel.

## Examples

Single image
```js
var id = require('svg-sprite!./image.svg');
// => 'image'
```

Set of images
```js
var files = require.context('svg-sprite!images/logos', false, /(twitter|facebook|youtube)\.svg$/);
files.keys().forEach(files);
```

Custom sprite behavior
```js
// my-sprite.js
var Sprite = require('node_modules/svg-sprite-loader/lib/web/sprite');
module.exports = new Sprite();

// my-app.jsx
var sprite = require('my-sprite');

class MyApplication extends React.Component {
  componentWillMount() {
    sprite.elem = sprite.render(document.body);
  }

  componentWillUnmount() {
    sprite.elem.parentNode.removeChild(sprite.elem);
  }
}
```

Using with React
```js
// icon.jsx
var GLYPHS = {
  PONY: require('img/pony.svg'),
  UNICORN: require('img/unicorn.svg')
};

class Icon extends React.Component {
  render() {
    var glyph = this.props.glyph;
    return (
      <svg className="icon" dangerouslySetInnerHTML={{__html: '<use xlink:href="' + glyph + '"></use>'}}/>
    )
  }
}

module.exports = Icon;
module.exports.GLYPHS = GLYPHS;

// some-component.jsx
var Icon = require('components/icon');
<Icon glyph={Icon.GLYPHS.UNICORN}>
```

Usage with React 0.14

```js
// icon.jsx
export default function Icon({glyph, width = 16 , height = 16, className = 'icon'}){
  return (
    <svg className={className} width={width} height={height}>
      <use xlinkHref={glyph} />
    </svg>
  );
}

// some-component.jsx
import Icon from './icon';
import help from './images/icons/Help.svg';

<Icon glyph={help} />
```


