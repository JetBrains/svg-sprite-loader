const { ok } = require('assert');
const ExtractPlugin = require('extract-text-webpack-plugin');
const {
  compile,
  loaderPath,
  extractCSSRule,
  extractHTMLRule,
  spriteLoaderRule,
  compileAndNotReject
} = require('./tests-utils');

const Plugin = require('../lib/plugin');
const defaults = require('../lib/config');
const Exceptions = require('../lib/exceptions');

const defaultSpriteFilename = defaults.loader.spriteFilename;

describe('plugin', () => {
  let CSSExtractor;
  let HTMLExtractor;

  beforeEach(() => {
    CSSExtractor = new ExtractPlugin('[name].css');
    HTMLExtractor = new ExtractPlugin('[name].html');
  });

  describe('handle errors', () => {
    it('should emit error if loader used without plugin', async () => {
      const { errors } = await compileAndNotReject({
        entry: './entry',
        module: { rules: [spriteLoaderRule()] }
      });

      ok(errors.length === 1);
      ok(errors[0].error instanceof Exceptions.LoaderException);
    });

    it('should emit error if invalid runtime passed', async () => {
      const { errors } = await compileAndNotReject({
        entry: './entry',
        module: { rules: [spriteLoaderRule({ options: { runtime: 'qwe' } })] },
        plugins: [new Plugin()]
      });

      ok(errors.length === 1);
      ok(errors[0].error instanceof Exceptions.InvalidRuntimeException);
    });
  });

  describe('handle warnings', () => {
    it('should warn if several rules applied to module', async () => {
      const { warnings } = await compile({
        entry: './entry',
        module: { rules: [
          spriteLoaderRule(),
          { test: /\.svg$/, loader: loaderPath }
        ] },
        plugins: [new Plugin()]
      });

      // TODO loader applies 2 times so warning also will me emitted 2 times
      ok(warnings.length === 2);
      ok(warnings[0].warning instanceof Exceptions.SeveralRulesAppliedException);
    });

    it('should warn if other loaders after this in extract mode', async () => {
      const { warnings } = await compile({
        entry: './entry',
        module: { rules: [{
          test: /\.svg$/,
          use: [
            'file-loader',
            { loader: loaderPath, options: { extract: true } },
            'svgo-loader'
          ]
        }] },
        plugins: [new Plugin()]
      });

      ok(warnings.length === 1);
      ok(warnings[0].warning instanceof Exceptions.RemainingLoadersInExtractModeException);
    });
  });

  it('should properly detect modules to extract', async () => {
    const { assets } = await compile({
      entry: './entry',
      module: { rules: [spriteLoaderRule()] },
      plugins: [new Plugin()]
    });

    ok(Object.keys(assets).length === 1);
  });

  it('should allow to specify custom sprite filename', async () => {
    const spriteFilename = 'qwe.svg';

    const { assets } = await compile({
      entry: './styles.css',
      module: { rules: [
        spriteLoaderRule({ options: { spriteFilename } }),
        extractCSSRule()
      ] },
      plugins: [new Plugin(), CSSExtractor]
    });

    ok(Object.keys(assets).length === 3);
    ok(spriteFilename in assets);
  });

  it('should emit sprite for each chunk if [chunkname] presented in sprite filename', async () => {
    const { assets } = await compile({
      entry: {
        styles: './styles.css',
        styles2: './styles2.css'
      },
      module: { rules: [
        spriteLoaderRule({ options: { spriteFilename: '[chunkname]-sprite.svg' } }),
        extractCSSRule()
      ] },
      plugins: [new Plugin(), CSSExtractor]
    });

    ok(Object.keys(assets).length === 6);
    ok('styles-sprite.svg' in assets);
    ok('styles2-sprite.svg' in assets);
  });

  it('should replace with proper publicPath', async () => {
    const publicPath = '/olala/';
    const spriteFilename = defaultSpriteFilename;

    const { assets } = await compile({
      entry: './entry',
      output: { publicPath },
      module: { rules: [
        spriteLoaderRule({ options: { extract: true, spriteFilename } })
      ] },
      plugins: [new Plugin()]
    });

    ok(assets['main.js'].source().includes(publicPath + spriteFilename));
  });

  it('should work with html-loader', async () => {
    const spriteFilename = defaultSpriteFilename;

    const { assets } = await compile({
      entry: './page.html',
      module: { rules: [
        spriteLoaderRule({ options: { spriteFilename } }),
        extractHTMLRule()
      ] },
      plugins: [new Plugin(), HTMLExtractor]
    });

    ok(assets['main.html'].source().includes(`src="${spriteFilename}#`));
  });

  it('should allow to use custom runtime generator', () => {
    // TODO
  });

  it('should emit only built chunks', () => {
    // TODO test with webpack-recompilation-emulator
  });
});
