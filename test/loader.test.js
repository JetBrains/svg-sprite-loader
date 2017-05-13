const path = require('path');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const HtmlPlugin = require('html-webpack-plugin');

const { isWebpack1 } = require('../lib/utils');
const { loaderPath, fixturesPath } = require('./_config');
const {
  rule,
  rules,
  multiRule,
  svgRule,
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

      it('should warn if several rules applied to module', async () => {
        const { warnings } = await compile({
          entry: './entry',
          module: rules(
            svgRule(),
            rule({ test: /\.svg$/, loader: loaderPath })
          )
        });

        // TODO loader applies 2 times so warning also will me emitted 2 times
        warnings.should.be.lengthOf(2);
        warnings[0].warning.should.be.instanceOf(Exceptions.SeveralRulesAppliedException);
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
        const { warnings } = await compile({
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
        });

        warnings.should.be.lengthOf(1);
        warnings[0].warning.should.be.instanceOf(Exceptions.RemainingLoadersInExtractModeException);
      });
    });

    describe('extract-text-webpack-plugin interop', () => {
      it('should properly extract sprite from extractable CSS', async () => {
        const extractor = extractPlugin('[name].css');
        const { assets } = await compile({
          entry: './entry.css',
          module: rules(
            svgRule(),
            extractCSSRule(extractor)
          ),
          plugins: [new SpritePlugin(), extractor]
        });

        Object.keys(assets).should.be.lengthOf(3);
        assets.should.have.property(defaultSpriteFilename);
        assets['main.css'].source().should.contain(defaultSpriteFilename);
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
        const { assets } = await compile({
          entry: {
            entry: './entry-with-styles',
            entry2: './entry-with-styles2'
          },
          module: rules(
            svgRule({ spriteFilename: '[chunkname].svg' }),
            extractCSSRule(extractor)
          ),
          plugins: [extractor, new SpritePlugin()]
        });

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
            new CommonsChunkPlugin({
              name: 'common'
            })
          ]
        });

        assets['common.css'].source().should.contain('common.svg');
      });
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
              test: /\.html$/,
              loader: 'html-loader'
            })
          ),
          plugins: [
            new SpritePlugin(),
            new HtmlPlugin({
              filename: 'index.html',
              template: path.resolve(fixturesPath, 'html-webpack-plugin/template.html')
            })
          ]
        });

        assets['index.html'].source().should.contain(defaultSpriteFilename);
      });
    });

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

    it('should allow to use [hash] substitution token in `spriteFilename`', async () => {
      const { assets } = await compile({
        entry: './entry',
        module: rules(
          svgRule({ extract: true, spriteFilename: 'sprite-[hash:8].svg' })
        ),
        plugins: [new SpritePlugin()]
      });

      assets.should.have.property('sprite-f016181b.svg');
    });

    // Fails when webpack buildin runtime will change
    it('should replace with proper publicPath', async () => {
      const publicPath = '/olala/';
      const spriteFilename = defaultSpriteFilename;

      const { assets } = await compile({
        entry: './entry',
        output: { publicPath },
        module: rules(
          svgRule({ extract: true, spriteFilename })
        ),
        plugins: [new SpritePlugin()]
      });

      assets['main.js'].source().should.contain(`__webpack_require__.p + "${spriteFilename}`);
    });

    it('should emit only built chunks', () => {
      // TODO test with webpack-recompilation-emulator
    });
  });
});
