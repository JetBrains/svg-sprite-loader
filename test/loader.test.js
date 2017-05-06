const path = require('path');
const {
  rule,
  rules,
  multiRule,
  svgRule,
  compile,
  loaderPath,
  fixturesPath,
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

    describe('interoperability', () => {
      describe('extract-text-webpack-plugin', () => {
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
          assets['main.css'].source().should.includes(defaultSpriteFilename);
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
          assets['styles.css'].source().should.includes(spriteFilename);
          assets['styles2.css'].source().should.includes(spriteFilename);
        });

        it('should emit sprite for each extracted chunk if [chunkname] provided in `spriteFilename`', async () => {
          const extractor = extractPlugin('[name].css');
          const { assets } = await compile({
            entry: {
              'entry-with-styles': './entry-with-styles',
              'entry-with-styles2': './entry-with-styles2'
            },
            module: rules(
              svgRule({ extract: true, spriteFilename: '[chunkname].svg' }),
              extractCSSRule(extractor)
            ),
            plugins: [new SpritePlugin(), extractor]
          });

          Object.keys(assets).should.be.lengthOf(6);
          assets.should.have.property('entry-with-styles.svg');
          assets.should.have.property('entry-with-styles2.svg');
          assets['entry-with-styles.css'].source().should.includes('entry-with-styles.svg');
          assets['entry-with-styles2.css'].source().should.includes('entry-with-styles2.svg');
        });
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
          extractCSSRule()
        ),
        plugins: [
          CSSExtractor,
          new SpritePlugin()
        ]
      });

      Object.keys(assets).should.be.lengthOf(3);
      assets.should.have.property(spriteFilename);
    });

    it('should emit sprite for each chunk if [chunkname] presented in sprite filename', async () => {
      const { assets } = await compile({
        entry: {
          styles: './styles.css',
          styles2: './styles2.css'
        },
        module: rules(
          multiRule({
            test: /\.svg$/,
            use: [
              { loader: loaderPath, options: { spriteFilename: '[chunkname]-sprite.svg' } },
              'svgo-loader'
            ]
          }),
          extractCSSRule()
        ),
        plugins: [
          CSSExtractor,
          new SpritePlugin()
        ]
      });

      Object.keys(assets).should.be.lengthOf(6);
      assets.should.have.property('styles-sprite.svg');
      assets.should.have.property('styles2-sprite.svg');
    });

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

      assets['main.js'].source().should.contain(publicPath + spriteFilename);
    });

    it('should work with html-loader', async () => {
      const spriteFilename = defaultSpriteFilename;

      const { assets } = await compile({
        entry: './page.html',
        module: rules(
          svgRule({ spriteFilename }),
          extractHTMLRule()
        ),
        plugins: [
          new SpritePlugin(),
          HTMLExtractor
        ]
      });

      assets['main.html'].source().should.contain(`img src="${spriteFilename}#`);
    });

    it('should emit only built chunks', () => {
      // TODO test with webpack-recompilation-emulator
    });
  });
});
