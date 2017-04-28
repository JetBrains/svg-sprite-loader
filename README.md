# SVG sprite loader

Webpack loader for creating SVG sprites.

> :tada: 2.0 is out, please read the [migration guide & overview](2.0.md).

> :warning: For old v0.x versions of this loader, see [the README in the v0 branch](https://github.com/kisenka/svg-sprite-loader/blob/v0/README.md).

## Why it's cool

- **Minimum initial configuration**. Most of options configured automatically.
- **Runtime for browser**. Sprite rendered and injected in the page automatically, you just refers on image via `<svg><use xlink:href="#id"></use></svg>`.
- **Isomorphic runtime for node/browser**. Makes possible to render sprite on server/browser manually.
- **Customizable**. Write/extend runtime module to implement custom sprite behaviour. Write/extend runtime generator to produce your own runtime, e.g. React component configured with imported symbol.
- **External sprite file** generates for images imported from css/scss/sass/less/styl/html ([SVG stacking technique](https://css-tricks.com/svg-fragment-identifiers-work/#article-header-id-4)).

## Installation

```bash
npm install svg-sprite-loader -D
# via yarn
yarn add svg-sprite-loader -D
```

## Configuration

Example config:

```js
// webpack 1
{
  test: /\.svg$/,
  loader: 'svg-sprite-loader',
  query: { ... }
}

// webpack 1 multiple loaders
{
  test: /\.svg$/,
  loaders: [
    `svg-sprite-loader?${JSON.stringify({ ... })}`,
    'svg-fill-loader',
    'svgo-loader'
  ]
}

// webpack 2
{
  test: /\.svg$/,
  loader: 'svg-sprite-loader',
  options: { ... }
}

// webpack 2 multiple loaders
{
  test: /\.svg$/,
  use: [
    { loader: 'svg-sprite-loader', options: { ... } },
    'svg-fill-loader',
    'svgo-loader'
  ]
}
```

### `symbolId` (default `[name]`)

How `<symbol>` `id` attribute should be named.
Full list of supported patterns see in [loader-utils#interpolatename docs](https://github.com/webpack/loader-utils#interpolatename).

### `esModule` (default `true`, autoconfigured)

Generated export format:
- when `true` loader will produce `export default ...`.
- when `false` the result is `module.exports = ...`.

By default depends on used webpack version: `true` for webpack >= 2, `false` otherwise.

## Runtime configuration

When you require an image, loader transforms it to SVG `<symbol>`, add to the special sprite store and return class instance 
which represents symbol. It contains `id`, `viewBox` and `content` fields. It can be used later for referencing the sprite image, e.g: 

```js
import twitterLogo from './logos/twitter.svg';
// symbol === SpriteSymbol<id: string, viewBox: string, content: string>

const rendered = `
<svg viewBox="${twitterLogo.viewBox}">
  <use xlink:href="#${twitterLogo.id}" />
</svg>`;
```

When browser event `DOMContentLoaded` fires sprite will be rendered and injected in the `document.body` automatically.
If custom behaviour needed e.g. to specify different mounting point you can override default sprite:
  
```js
import BrowserSprite from 'svg-baker-runtime/src/browser-sprite';
import domready from 'domready';

const sprite = new BrowserSprite();
domready(() => sprite.mount('#my-custom-mounting-point'));

export default sprite; // don't forget to export!
```

### `spriteModule` (autoconfigured)

Path to sprite module which will be compiled and executed at runtime.
By default it depends on [`target`](https://webpack.js.org/configuration/target) webpack config option:
- `svg-sprite-loader/runtime/browser-sprite.build` for 'web' target.
- `svg-sprite-loader/runtime/sprite.build` for other targets.

If you need custom behavior, use this option to specify the path of your sprite implementation module. 
Path will be resolved relatively to current webpack build folder, e.g. `utils/sprite.js` placed in current project dir should be written as `./utils/sprite`. 

It's highly recommended to extend default sprite classes:
- [for browser-specific env](https://github.com/kisenka/svg-baker/blob/master/packages/svg-baker-runtime/src/browser-sprite.js)
- [for isomorphic env](https://github.com/kisenka/svg-baker/blob/master/packages/svg-baker-runtime/src/sprite.js)

### `symbolModule` (autoconfigured)

Same as `spriteModule` but for sprite symbol. By default also depends on `target` webpack config option:
- `svg-sprite-loader/runtime/browser-symbol.build` for 'web' target.
- `svg-sprite-loader/runtime/symbol.build` for other targets.

### `runtimeCompat` (default `false`)

Should runtime be compatible with earlier v0.x loader versions. Will be removed in the next major version.

### `runtimeGenerator` ([default generator](https://github.com/kisenka/svg-sprite-loader/blob/2.0/lib/runtime-generator.js))

Path to node.js script which generates client runtime. 
Use this option if you need to produce your own runtime, e.g. React component configured with imported symbol. [Example](examples/custom-runtime-generator).

### `runtimeOptions`

Arbitrary data passed to runtime generator. Reserved for future use.

## Extract configuration

In extract mode loader should be configured with plugin, otherwise error is thrown. Example:

```js
// webpack.config.js
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

...

{
  plugins: [
    new SpriteLoaderPlugin()
  ]
}
```

#### `extract` (default `false`, autoconfigured)

Turns loader in extract mode.
Enables automatically if image was imported from css/scss/sass/less/styl/html files.

#### `spriteFilename` (default `sprite.svg`)

Filename of extracted sprite. Several sprites could be generated by specifying different loader rules restricted with `include` option.
If rules intersects loader will warn about it. Example:

```js
module: {
  rules: [
    // images from img/flags goes to flags-sprite.svg
    {
      test: /\.svg$/,
      loader: 'svg-sprite-loader',
      include: path.resolve('./img/flags'), 
      options: {
        extract: true,
        spriteFilename: 'flags-sprite.svg'
      }
    },
    
    // images from img/icons goes to icons-sprite.svg
    {
      test: /\.svg$/,
      loader: 'svg-sprite-loader',
      include: path.resolve('./img/icons'),
      options: {
        extract: true,
        spriteFilename: 'icons-sprite.svg'
      }
    }    
  ]
}
```

Also it is possible to generate sprite for each chunk by using `[chunkname]` pattern in spriteFilename option. 
This is experimental feature, use with caution!
