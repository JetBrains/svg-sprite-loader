# SVG Sprite Webpack Loader

It's like [style-loader](https://github.com/webpack/style-loader), but for SVGs. Features:

- Create a single SVG sprite from a set of images
- Raster image support (PNG, JPG and GIF)
- Custom sprite implementations

## How it works
When you require an image, SVG sprite webpack loader will transform it into an SVG symbol and add it to the array using a special [sprite](lib/web/sprite.js) class.
When the browser event `DOMContentLoaded` fires, an image sprite will then be rendered and injected as the first child of `document.body`.

By default, require statements like `require('svg-sprite!./image.svg')` will return a symbol ID, so you can reference it later
with SVG's `<use>` tag:

```html
<svg>
	<use xlink:href="#id" />
</svg>```

Raster images  will be inlined (using base64) and wrapped with an `<image>` tag.
Files like `image@2x.png` will be transformed with proper scale.

### Custom sprite implementation
If you need custom behavior, use the `spriteModule` config option to specify the path of your sprite implementation module.

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
or, using regular expressions to capture the SVG's filename:
```js
module.exports = {
  module: {
    loaders: [{
      test: /\.svg$/,
      loader: 'svg-sprite?' + JSON.stringify({
        name: 'icon-[1]',
        prefixize: true,
        regExp: './my-folder/(.*)\\.svg'
      })
    }]
  }
};
// path-to-project/my-foleder/name.svg > #icon-name
```

## Configuration
* `name` configures a custom symbol ID naming. Default is `[name]`. The ollowing name patterns are supported:
  * `[ext]` - the extension of the image
  * `[name]` - the basename of the image
  * `[path]` - the path of the image
  * `[hash]` - the hash or the image content
  * `[pathhash]` - the hash or the image path
* `angularBaseWorkaround` adds a workaround for issues with combining `<base>` and the history API (which is [typical for Angular.js](https://github.com/angular/angular.js/issues/8934)). Default is `false`.
* `prefixize` isolates an image content by prefixing its `id`, `xlink:href` and `url(#id)` elements. Default is `true`.
* `spriteModule` defines [custom sprite implementation](#custom-sprite-implementation) module path
* `esModule` configures whether to transpile the module to an ES-compatible format. When this option is set to `true`, the loader will produce `module.exports.__esModule = true; module.exports['default'] = svg`. Default is `false`. (This is useful for transpilers other than Babel.)

## Examples

Single image:
```js
var id = require('svg-sprite!./image.svg');
// => 'image'
```

Set of images:
```js
var files = require.context('svg-sprite!images/logos', false, /(twitter|facebook|youtube)\.svg$/);
files.keys().forEach(files);
```

Custom sprite behavior:
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

Using with React:
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

Using with React 0.14+:
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
