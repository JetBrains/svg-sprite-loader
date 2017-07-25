# SVG sprite loader [![TravisCI](https://img.shields.io/travis/kisenka/svg-sprite-loader.svg?style=flat-square)](https://travis-ci.org/kisenka/svg-sprite-loader) [![Code Climate](https://img.shields.io/codeclimate/github/kisenka/svg-sprite-loader.svg?style=flat-square)](https://codeclimate.com/github/kisenka/svg-sprite-loader) [![Inch CI](https://inch-ci.org/github/kisenka/svg-sprite-loader.svg?branch=master&style=flat-square)](https://inch-ci.org/github/kisenka/svg-sprite-loader)

Webpack loader for creating SVG sprites.

> :tada: 2.0 is out, please read the [migration guide & overview](2.0.md).

> :warning: For old v0.x versions see [the README in the v0 branch](https://github.com/kisenka/svg-sprite-loader/blob/v0/README.md).

## Table of contents

- [Why it's cool](#why-its-cool)
- [Installation](#installation)
- [Configuration](#configuration)
  - [`symbolId`](#symbolid-default-name)
  - [`esModule`](#esmodule-default-true-autoconfigured)
  - [Runtime configuration](#runtime-configuration)
    - [`spriteModule`](#spritemodule-autoconfigured)
    - [`symbolModule`](#symbolmodule-autoconfigured)
    - [`runtimeGenerator`](#runtimegenerator-default-generator)
    - [`runtimeCompat`](#runtimecompat-default-false-deprecated)
    - [`runtimeOptions`](#runtimeoptions)
  - [Extract configuration](#extract-configuration)
    - [`extract`](#extract-default-false-autoconfigured)
    - [`spriteFilename`](#spritefilename-default-spritesvg)
- [Examples](#examples)
- [Contributing guidelines](#contributing-guidelines)
- [License](#license)
- [Credits](#credits)

## Why it's cool

- **Minimum initial configuration**. Most of the options are configured automatically.
- **Runtime for browser**. Sprites are rendered and injected in pages automatically, you just refer to images via `<svg><use xlink:href="#id"></use></svg>`.
- **Isomorphic runtime for node/browser**. Can render sprites on server or in browser manually.
- **Customizable**. Write/extend runtime module to implement custom sprite behaviour. Write/extend runtime generator to produce your own runtime, e.g. React component configured with imported symbol.
- **External sprite file** is generated for images imported from css/scss/sass/less/styl/html ([SVG stacking technique](https://css-tricks.com/svg-fragment-identifiers-work/#article-header-id-4)).

## Installation

```bash
npm install svg-sprite-loader -D
# via yarn
yarn add svg-sprite-loader -D
```

## Configuration

<details>

<summary>Example config</summary>

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
</details>


### `symbolId` (default `[name]`)

How `<symbol>` `id` attribute should be named.
Complete list of supported patterns: [loader-utils#interpolatename docs](https://github.com/webpack/loader-utils#interpolatename).

### `symbolRegExp` (default `''`)
Passed to the symbolId interpolator to support the [N] pattern in the loader-utils name interpolator

### `esModule` (default `true`, autoconfigured)

Generated export format:
- when `true` loader will produce `export default ...`.
- when `false` the result is `module.exports = ...`.

By default depends on used webpack version: `true` for webpack >= 2, `false` otherwise.

## Runtime configuration

When you require an image, loader transforms it to SVG `<symbol>`, adds it to the special sprite storage and returns class instance 
that represents symbol. It contains `id`, `viewBox` and `content` fields and can later be used for referencing the sprite image, e.g: 

```js
import twitterLogo from './logos/twitter.svg';
// twitterLogo === SpriteSymbol<id: string, viewBox: string, content: string>

const rendered = `
<svg viewBox="${twitterLogo.viewBox}">
  <use xlink:href="#${twitterLogo.id}" />
</svg>`;
```

When browser event `DOMContentLoaded` is fired, sprite will be automatically rendered and injected in the `document.body`.
If custom behaviour is needed (e.g. a different mounting target) default sprite module could be overridden via `spriteModule` option. Check example below.

### `spriteModule` (autoconfigured)

Path to sprite module that will be compiled and executed at runtime.
By default it depends on [`target`](https://webpack.js.org/configuration/target) webpack config option:
- `svg-sprite-loader/runtime/browser-sprite.build` for 'web' target.
- `svg-sprite-loader/runtime/sprite.build` for other targets.

If you need custom behavior, use this option to specify a path of your sprite implementation module. 
Path will be resolved relative to the current webpack build folder, e.g. `utils/sprite.js` placed in current project dir should be written as `./utils/sprite`.
 
Example of sprite with custom mounting target (copypasted from [browser-sprite](https://github.com/kisenka/svg-sprite-loader/blob/master/runtime/browser-sprite.js)): 

```js
import BrowserSprite from 'svg-baker-runtime/src/browser-sprite';
import domready from 'domready';

const sprite = new BrowserSprite();
domready(() => sprite.mount('#my-custom-mounting-target'));

export default sprite; // don't forget to export!
```

It's highly recommended to extend default sprite classes:
- [for browser-specific env](https://github.com/kisenka/svg-baker/blob/master/packages/svg-baker-runtime/src/browser-sprite.js)
- [for isomorphic env](https://github.com/kisenka/svg-baker/blob/master/packages/svg-baker-runtime/src/sprite.js)

### `symbolModule` (autoconfigured)

Same as `spriteModule`, but for sprite symbol. By default also depends on `target` webpack config option:
- `svg-sprite-loader/runtime/browser-symbol.build` for 'web' target.
- `svg-sprite-loader/runtime/symbol.build` for other targets.

### `runtimeGenerator` ([default generator](https://github.com/kisenka/svg-sprite-loader/blob/master/lib/runtime-generator.js))

Path to node.js script that generates client runtime. 
Use this option if you need to produce your own runtime, e.g. React component configured with imported symbol. [Example](https://github.com/kisenka/svg-sprite-loader/tree/master/examples/custom-runtime-generator).

### `runtimeCompat` (default `false`, deprecated)

Should runtime be compatible with earlier v0.x loader versions. This option will be removed in the next major version release.

### `runtimeOptions`

Arbitrary data passed to runtime generator. Reserved for future use when other runtime generators will be created.

## Extract configuration

In the extract mode loader should be configured with plugin, otherwise an error is thrown. Example:

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

### `extract` (default `false`, autoconfigured)

Switches loader to the extract mode.
Enabled automatically for images imported from css/scss/sass/less/styl/html files.

### `spriteFilename` (default `sprite.svg`)

Filename of extracted sprite. Multiple sprites can be generated by specifying different loader rules restricted with `include` option.
In case of any conflicts loader will produce a warning:

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

It is also possible to generate sprite for each chunk by using `[chunkname]` pattern in spriteFilename option. 
This is experimental feature, so use with caution!

## Examples

See [examples](examples) folder.

## Contributing guidelines

TODO

## License

MIT

## Credits

TODO
