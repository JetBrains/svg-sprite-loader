/* eslint-disable no-unused-expressions */
const { strictEqual } = require('assert');
const configure = require('../lib/configurator');
const defaults = require('../lib/config');

const loaderDefaults = defaults.loader;

describe('configurator', () => {
  let context;

  beforeEach(() => {
    context = {
      version: 2,

      target: 'web',

      options: {
        target: 'web'
      },

      _module: {
        issuer: {
          resource: '/foo/index.js'
        }
      },

      _compiler: {
        name: undefined
      }
    };
  });

  it('should properly autodetect runtime modules', () => {
    let config;

    config = configure({ context, target: 'web' });
    strictEqual(config.spriteModule, loaderDefaults.spriteModule);
    strictEqual(config.symbolModule, loaderDefaults.symbolModule);

    config = configure({ context, target: 'node' });
    strictEqual(config.spriteModule, require.resolve('../runtime/sprite.build'));
    strictEqual(config.symbolModule, require.resolve('svg-baker-runtime/symbol'));
  });

  it('should properly autodetect extract mode', () => {
    const issuer = context._module.issuer;

    ['css', 'scss', 'sass', 'styl', 'less', 'html'].forEach((ext) => {
      issuer.resource = `styles.${ext}`;
      strictEqual(configure({ context }).extract, true);
    });

    ['js', 'jsx', 'ts'].forEach((ext) => {
      issuer.resource = `index.${ext}`;
      strictEqual(configure({ context }).extract, false);
    });
  });

  it('should properly autodetect if export should be transpilers friendly', () => {
    context.version = 2;
    strictEqual(configure({ context }).esModule, true);

    context.version = 1;
    strictEqual(configure({ context }).esModule, false);

    /**
     * Should always be falsy if compiled with extract-text-webpack-plugin or html-webpack-plugin
     */
    context.version = 2;
    context._compiler.name = 'extract-text-webpack-plugin';
    strictEqual(configure({ context }).esModule, false);

    context._compiler.name = 'html-webpack-plugin';
    strictEqual(configure({ context }).esModule, false);
  });
});
