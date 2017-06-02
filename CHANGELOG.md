# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="3.0.5"></a>
## [3.0.5](https://github.com/kisenka/webpack-svg-sprite-loader/compare/v3.0.4...v3.0.5) (2017-06-02)


### Bug Fixes

* **loader:** replace sprite filename in whole source ([d4d4429](https://github.com/kisenka/webpack-svg-sprite-loader/commit/d4d4429))



<a name="3.0.4"></a>
## [3.0.4](https://github.com/kisenka/webpack-svg-sprite-loader/compare/v3.0.3...v3.0.4) (2017-05-31)


### Bug Fixes

* **utils:** properly replace path to image with sprite name on Windows ([6bdd6cd](https://github.com/kisenka/webpack-svg-sprite-loader/commit/6bdd6cd))



<a name="3.0.3"></a>
## [3.0.3](https://github.com/kisenka/webpack-svg-sprite-loader/compare/v3.0.2...v3.0.3) (2017-05-29)


### Bug Fixes

* **configuration:** proper configurator runtime selection based on \`target\` loader context ([a7365a2](https://github.com/kisenka/webpack-svg-sprite-loader/commit/a7365a2))



<a name="3.0.2"></a>
## [3.0.2](https://github.com/kisenka/webpack-svg-sprite-loader/compare/v3.0.1...v3.0.2) (2017-05-24)


### Bug Fixes

* **loader:** check module request properly in isModuleShouldBeExtracted with DLL Plugin ([ffb7b04](https://github.com/kisenka/webpack-svg-sprite-loader/commit/ffb7b04))



<a name="3.0.1"></a>
## [3.0.1](https://github.com/kisenka/webpack-svg-sprite-loader/compare/v3.0.0...v3.0.1) (2017-05-22)


### Bug Fixes

* **runtime-generator:** runtime generator in extract mode return object instead of string ([208b6dc](https://github.com/kisenka/webpack-svg-sprite-loader/commit/208b6dc))



<a name="3.0.0"></a>
# [3.0.0](https://github.com/kisenka/webpack-svg-sprite-loader/compare/v2.1.0...v3.0.0) (2017-05-21)


### Features

* **loader:** runtime exports an object in extract mode ([f0af0eb](https://github.com/kisenka/webpack-svg-sprite-loader/commit/f0af0eb))


### Reverts

* **tools:** rollback to standart-version :) ([b948e65](https://github.com/kisenka/webpack-svg-sprite-loader/commit/b948e65))


### BREAKING CHANGES

* **loader:** Generated runtime in extract mode is changed from string to object

ISSUES CLOSED: #123



<a name="2.1.0"></a>
# [2.1.0](https://github.com/kisenka/webpack-svg-sprite-loader/compare/v2.0.6...v2.1.0) (2017-05-13)


### Bug Fixes

* **multiple:** update svg-baker deps ([ead7d68](https://github.com/kisenka/webpack-svg-sprite-loader/commit/ead7d68)), closes [#101](https://github.com/kisenka/webpack-svg-sprite-loader/issues/101) [#103](https://github.com/kisenka/webpack-svg-sprite-loader/issues/103) [#112](https://github.com/kisenka/webpack-svg-sprite-loader/issues/112)
* **runtime:** update svg-baker-runtime with fixed angular workaround ([1543029](https://github.com/kisenka/webpack-svg-sprite-loader/commit/1543029)), closes [#103](https://github.com/kisenka/webpack-svg-sprite-loader/issues/103)


### Features

* add [hash] token substitution support ([87110f4](https://github.com/kisenka/webpack-svg-sprite-loader/commit/87110f4)), closes [#98](https://github.com/kisenka/webpack-svg-sprite-loader/issues/98) [#111](https://github.com/kisenka/webpack-svg-sprite-loader/issues/111)


<a name="2.0.6"></a>
## [2.0.6](https://github.com/kisenka/webpack-svg-sprite-loader/compare/v2.0.5...v2.0.6) (2017-05-13)


### Bug Fixes

* **configure:** use `browser-sprite``browser-symbol` for `electron-renderer` target ([b9a3ed0](https://github.com/kisenka/webpack-svg-sprite-loader/commit/b9a3ed0))


<a name="2.1.0-3"></a>
## [2.1.0-3](https://github.com/kisenka/webpack-svg-sprite-loader/compare/v2.1.0-2...v2.1.0-3) [beta] (2017-05-10)


### Bug Fixes

* **plugin:** properly replace paths on Windows ([0c70caa](https://github.com/kisenka/webpack-svg-sprite-loader/commit/0c70caa)), closes [#106](https://github.com/kisenka/webpack-svg-sprite-loader/issues/106)



<a name="2.1.0-2"></a>
## [2.1.0-2](https://github.com/kisenka/webpack-svg-sprite-loader/compare/v2.1.0-1...v2.1.0-2) [beta] (2017-05-09)


### Bug Fixes

* **loader:** symbol id interpolation ([18edd99](https://github.com/kisenka/webpack-svg-sprite-loader/commit/18edd99))



<a name="2.1.0-1"></a>
## [2.1.0-1](https://github.com/kisenka/webpack-svg-sprite-loader/compare/v2.1.0-0...v2.1.0-1) [beta] (2017-05-08)


### Bug Fixes

* **plugin:** properly generate symbol url in extract mode ([6af7230](https://github.com/kisenka/webpack-svg-sprite-loader/commit/6af7230))



<a name="2.1.0-0"></a>
## [2.1.0-0](https://github.com/kisenka/webpack-svg-sprite-loader/compare/v2.0.5...v2.1.0-0) [beta] (2017-05-07)


### Bug Fixes

* **utils:** fix default import ([0c34daa](https://github.com/kisenka/webpack-svg-sprite-loader/commit/0c34daa))


### Features

* **interop:** extract-text-webpack-plugin & html-webpack-plugin interop ([a38fdcc](https://github.com/kisenka/webpack-svg-sprite-loader/commit/a38fdcc))
* **interop:** extract-text-webpack-plugin with allChunks: true interoperability ([63d347d](https://github.com/kisenka/webpack-svg-sprite-loader/commit/63d347d))
* **spritehash:** add ability to use `[spritehash]` substitution token in spriteFilename ([f9eba1b](https://github.com/kisenka/webpack-svg-sprite-loader/commit/f9eba1b))


<a name="2.0.5"></a>
## [2.0.5](https://github.com/kisenka/webpack-svg-sprite-loader/compare/v2.0.4...v2.0.5) (2017-05-05)
