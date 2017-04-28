/* eslint-disable no-unused-expressions */
const { strictEqual, ok } = require('assert');
const configure = require('../lib/configurator');
const defaults = require('../lib/config');

const { PACKAGE_NAME } = defaults;
const loaderDefaults = defaults.loader;

describe('configurator', () => {
  let context;

  beforeEach(() => {
    context = {
      version: 2,

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
    const options = context.options;
    let config;

    options.target = 'node';
    config = configure({ context });
    strictEqual(config.spriteModule, loaderDefaults.spriteModule);
    strictEqual(config.symbolModule, loaderDefaults.symbolModule);

    options.target = 'web';
    config = configure({ context });
    ok(config.spriteModule.includes(`${PACKAGE_NAME}/runtime/browser-sprite`));
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

    // Should always be falsy if compiled in extract-text-webpack-plugin child compiler
    context.version = 2;
    context._compiler.name = 'extract-text-webpack-plugin';
    strictEqual(configure({ context }).esModule, false);
  });
});
