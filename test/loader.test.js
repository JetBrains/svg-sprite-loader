const path = require('path');
const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');

const { isWebpack1 } = require('../lib/utils');
const webpackVersion = require('../lib/utils/get-webpack-version');
const { loaderPath, fixturesPath } = require('./_config');
const {
  rule,
  rules,
  multiRule,
  svgRule,
  svgInsideOneOfRule,
  svgInsideRulesRule,
  compile,
  extractPlugin,
  extractCSSRule,
  extractHTMLRule,
  compileAndNotReject
} = require('./utils');

const SpritePlugin = require('../lib/plugin');
const loaderDefaults = require('../lib/config').loader;
const Exceptions = require('../lib/exceptions');

const defaultSpriteFilename = loaderDefaults.spriteFilename;

describe('loader and plugin', () => {
  describe('normal mode', () => {
    describe('exceptions', () => {
      it('should emit error if invalid runtime passed', async () => {
        const { errors } = await compileAndNotReject({
          entry: './entry',
          module: rules(
            svgRule({ runtimeGenerator: 'qwe', symbolId: 'qwe' })
          )
        });

        errors.should.be.lengthOf(1);
        errors[0].error.should.be.instanceOf(Exceptions.InvalidRuntimeException);
      });
    });

    it('should allow to use custom runtime generator', async () => {
      const customRuntimeGeneratorPath = path.resolve(fixturesPath, 'custom-runtime-generator.js');

      const { assets } = await compile({
        entry: './entry',
        module: rules(
          svgRule({ runtimeGenerator: customRuntimeGeneratorPath })
        )
      });

      assets['main.js'].source().should.contain('olala');
    });
  });

  describe('extract mode', () => {
    function cssRule() {
      return rule({ test: /\.css$/, loader: 'css-loader' });
    }

    describe('exceptions', () => {
      it('should emit error if loader used without plugin in extract mode', async () => {
        const { errors } = await compileAndNotReject({
          entry: './entry',
          module: rules(
            svgRule({ extract: true })
          )
        });

        errors.should.be.lengthOf(1);
        errors[0].error.should.be.instanceOf(Exceptions.ExtractPluginMissingException);
      });

      it('should warn if there is remaining loaders in extract mode', async () => {
        const v4Config = {};
        if (webpackVersion.IS_4) {
          v4Config.mode = 'development';
          v4Config.devtool = false;
        }

        const { warnings } = await compile(Object.assign(v4Config, {
          entry: './entry',
          module: rules(
            multiRule({
              test: /\.svg$/,
              use: [
                'file-loader',
                { loader: loaderPath, options: { extract: true } },
                'svgo-loader'
              ]
            })
          ),
          plugins: [new SpritePlugin()]
        }));

        warnings.should.be.lengthOf(1);
        warnings[0].warning.should.be.instanceOf(Exceptions.RemainingLoadersInExtractModeException);
      });
    });

    describe('extract-text-webpack-plugin interop', () => {
      it('should properly extract sprite file and refer to it', async () => {
        const spriteFilename = defaultSpriteFilename;
        const extractor = extractPlugin('[name].css');
        const { assets } = await compile({
          entry: './styles3.css',
          module: rules(
            svgRule({ spriteFilename }),
            extractCSSRule(extractor)
          ),
          plugins: [new SpritePlugin(), extractor]
        });

        const cssSource = assets['main.css'].source();

        Object.keys(assets).should.be.lengthOf(3);
        assets.should.have.property(spriteFilename);

        cssSource.should.be.equal(`.a {background-image: url(${spriteFilename}#image-usage);}
.a2 {background-image: url(${spriteFilename}#image-usage);}
.b {background-image: url(${spriteFilename}#image2-usage);}
.b2 {background-image: url(${spriteFilename}#image2-usage);}
`);
      });

      it('should properly extract sprite file and refer to it in `plainSprite` mode', async () => {
        const spriteFilename = defaultSpriteFilename;
        const extractor = extractPlugin('[name].css');
        const { assets } = await compile({
          entry: './styles3.css',
          module: rules(
            svgRule({ spriteFilename }),
            extractCSSRule(extractor)
          ),
          plugins: [
            new SpritePlugin({
              plainSprite: true
            }),
            extractor
          ]
        });

        const cssSource = assets['main.css'].source();

        Object.keys(assets).should.be.lengthOf(3);
        assets.should.have.property(spriteFilename);

        cssSource.should.be.equal(`.a {background-image: url(${spriteFilename}#image);}
.a2 {background-image: url(${spriteFilename}#image);}
.b {background-image: url(${spriteFilename}#image2);}
.b2 {background-image: url(${spriteFilename}#image2);}
`);
      });

      it('should properly extract sprite file by function spriteFilename `svgPath -> spritePath`', async () => {
        const spriteFilename = svgPath => `sprite${svgPath.substr(-4)}`;
        const universalResult = spriteFilename('path/to/some/icon.svg');
        const extractor = extractPlugin('[name].css');
        const { assets } = await compile({
          entry: './styles3.css',
          module: rules(
            svgRule({ spriteFilename }),
            extractCSSRule(extractor)
          ),
          plugins: [new SpritePlugin(), extractor]
        });

        const cssSource = assets['main.css'].source();

        Object.keys(assets).should.be.lengthOf(3);
        assets.should.have.property(universalResult);

        cssSource.should.be.equal(`.a {background-image: url(${universalResult}#image-usage);}
.a2 {background-image: url(${universalResult}#image-usage);}
.b {background-image: url(${universalResult}#image2-usage);}
.b2 {background-image: url(${universalResult}#image2-usage);}
`);
      });

      it('should work properly with `allChunks: true` config option', async () => {
        const spriteFilename = 'qwe.svg';
        const extractor = extractPlugin('[name].css', { allChunks: true });

        const { assets } = await compile({
          entry: {
            styles: './styles.css',
            styles2: './styles2.css'
          },
          module: rules(
            svgRule({ spriteFilename }),
            extractCSSRule(extractor)
          ),
          plugins: [
            new SpritePlugin(),
            extractor
          ]
        });

        Object.keys(assets).should.be.lengthOf(5);
        assets.should.have.property(spriteFilename);
        assets['styles.css'].source().should.contain(spriteFilename);
        assets['styles2.css'].source().should.contain(spriteFilename);
      });

      /**
       * TODO test in webpack 1 with allChunks: true and [chunkname]
       * Currently [chunkname] will not work in webpack 1 with extract-text-webpack-plugin(allChunks: true)
       */
      it('should emit sprite for each extracted chunk if [chunkname] provided in `spriteFilename`', async () => {
        const extractor = extractPlugin('[name].css', { allChunks: true });

        const v4Config = {};
        if (webpackVersion.IS_4) {
          v4Config.mode = 'development';
          v4Config.devtool = false;
        }

        const { assets } = await compile(Object.assign(v4Config, {
          entry: {
            entry: './entry-with-styles',
            entry2: './entry-with-styles2'
          },
          module: rules(
            svgRule({ spriteFilename: '[chunkname].svg' }),
            extractCSSRule(extractor)
          ),
          plugins: [extractor, new SpritePlugin()]
        }));

        /**
         * Chunk.name is undefined in webpack 1 with extract-text-webpack-plugin(allChunks: true),
         * so it will be only 1 sprite file instead of 2
         */
        Object.keys(assets).should.be.lengthOf(isWebpack1 ? 5 : 6);
        if (isWebpack1) {
          return;
        }

        assets.should.have.property('entry.svg');
        assets.should.have.property('entry2.svg');
        assets['entry.css'].source().should.contain('entry.svg');
        assets['entry2.css'].source().should.contain('entry2.svg');
      });

      if (!webpackVersion.IS_4) {
        it('should work in combination with CommonsChunkPlugin', async () => {
          const extractor = extractPlugin('[name].css');
          const { assets } = await compile({
            context: path.resolve(fixturesPath, 'extract-text-webpack-plugin/with-commons-chunk-plugin'),
            entry: {
              entry: './entry',
              entry2: './entry2',
              entry3: './entry3'
            },
            module: rules(
              svgRule({ spriteFilename: '[chunkname].svg' }),
              extractCSSRule(extractor)
            ),
            plugins: [
              extractor,
              new SpritePlugin(),
              new webpack.optimize.CommonsChunkPlugin({
                name: 'common'
              })
            ]
          });

          assets['common.css'].source().should.contain('common.svg');
        });
      }
    });

    describe('html-loader interop', () => {
      it('should work in combination with html-loader and extract-text-webpack-plugin', async () => {
        const spriteFilename = defaultSpriteFilename;
        const extractor = extractPlugin('[name].html');

        const { assets } = await compile({
          entry: './entry.html',
          module: rules(
            svgRule({ spriteFilename }),
            extractHTMLRule(extractor)
          ),
          plugins: [
            new SpritePlugin(),
            extractor
          ]
        });

        assets['main.html'].source().should.contain(`img src="${spriteFilename}#`);
      });
    });

    describe('html-webpack-plugin interop', () => {
      it('should work', async () => {
        const { assets } = await compile({
          entry: './entry',
          module: rules(
            svgRule({ extract: true }),
            rule({
              test: /template\.ejs$/,
              loader: 'html-loader'
            })
          ),
          plugins: [
            new HtmlPlugin({
              filename: 'index.html',
              template: path.resolve(fixturesPath, 'html-webpack-plugin/template.ejs')
            }),
            new SpritePlugin()
          ]
        });

        assets['index.html'].source().should.contain(defaultSpriteFilename);
      });
    });

    // webpack 3 scope hoisting interop
    if (webpackVersion.IS_3) {
      // eslint-disable-next-line global-require,import/no-unresolved
      const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin');

      describe('webpack ModuleConcatenationPlugin interop', () => {
        it('should work', async () => {
          const spriteFilename = 'qwe.svg';
          const { assets } = await compile({
            entry: './entry-es6-import',
            module: rules(
              svgRule({ extract: true, spriteFilename })
            ),
            plugins: [
              new SpritePlugin(),
              new ModuleConcatenationPlugin()
            ]
          });

          Object.keys(assets).should.be.lengthOf(2);
          assets.should.have.property(spriteFilename);
        });

        // TODO
        it('should properly interpolate [chunkname]', () => {

        });
      });
    }

    it('should automatically detect modules to extract', async () => {
      const { assets } = await compile({
        entry: './entry',
        module: rules(
          svgRule()
        ),
        plugins: [new SpritePlugin()]
      });

      Object.keys(assets).should.be.lengthOf(1);
    });

    it('should support `oneOf` composition of rule', async () => {
      const { assets } = await compile({
        entry: './entry',
        module: rules(
          svgInsideOneOfRule()
        ),
        plugins: [new SpritePlugin()]
      });

      Object.keys(assets).should.be.lengthOf(1);
    });

    it('should support `rules` composition of rule', async () => {
      const { assets } = await compile({
        entry: './entry',
        module: rules(
          svgInsideRulesRule()
        ),
        plugins: [new SpritePlugin()]
      });

      Object.keys(assets).should.be.lengthOf(1);
    });

    it('should allow to specify custom sprite filename', async () => {
      const spriteFilename = 'qwe.svg';

      const { assets } = await compile({
        entry: './styles.css',
        module: rules(
          svgRule({ spriteFilename }),
          cssRule()
        ),
        plugins: [new SpritePlugin()]
      });

      Object.keys(assets).should.be.lengthOf(2);
      assets.should.have.property(spriteFilename);
    });

    it('should emit sprite for each chunk if [chunkname] presented in sprite filename', async () => {
      const { assets } = await compile({
        entry: {
          entry: './entry-with-styles',
          entry2: './entry-with-styles2'
        },
        module: rules(
          multiRule({
            test: /\.svg$/,
            use: [
              { loader: loaderPath, options: { spriteFilename: '[chunkname]-sprite.svg' } },
              'svgo-loader'
            ]
          }),
          cssRule()
        ),
        plugins: [new SpritePlugin()]
      });

      Object.keys(assets).should.be.lengthOf(4);
      assets.should.have.property('entry-sprite.svg');
      assets.should.have.property('entry2-sprite.svg');
    });

    // Fails when webpack buildin runtime will change
    it('should replace with proper publicPath', async () => {
      const publicPath = '/olala/';
      const spriteFilename = defaultSpriteFilename;

      const v4Config = {};
      if (webpackVersion.IS_4) {
        v4Config.mode = 'development';
        v4Config.devtool = false;
      }

      const { assets } = await compile(Object.assign(v4Config, {
        entry: './entry',
        output: { publicPath },
        module: rules(
          svgRule({ extract: true, spriteFilename })
        ),
        plugins: [new SpritePlugin()]
      }));

      assets['main.js'].source().should.contain(`__webpack_require__.p + "${spriteFilename}`);
    });

    it('should emit only built chunks', () => {
      // TODO test with webpack-recompilation-emulator
    });

    it('should emit sprite svg when using resourceQuery', async () => {
      const { assets } = await compile({
        entry: './styles4.css',
        module: rules(
          Object.assign(svgRule({ extract: true }), {
            resourceQuery: /sprite/
          }),
          cssRule()
        ),
        plugins: [new SpritePlugin()]
      });

      Object.keys(assets).should.be.lengthOf(2);
    });
  });
});
