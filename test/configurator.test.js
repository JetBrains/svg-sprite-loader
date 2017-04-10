/* eslint-disable no-unused-expressions */
const { equal } = require('assert');
const configure = require('../lib/configurator');

describe('lib/configurator', () => {
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

  it('should properly autodetect runtime', () => {
    const options = context.options;

    options.target = 'web';
    equal(configure({ context }).runtime, 'browser');

    options.target = 'node';
    equal(configure({ context }).runtime, 'default');
  });

  it('should properly autodetect extract mode', () => {
    const issuer = context._module.issuer;

    ['css', 'scss', 'sass', 'styl', 'less', 'html'].forEach((ext) => {
      issuer.resource = `styles.${ext}`;
      equal(configure({ context }).extract, true);
    });

    ['js', 'jsx', 'ts'].forEach((ext) => {
      issuer.resource = `index.${ext}`;
      equal(configure({ context }).extract, false);
    });
  });

  it('should properly autodetect if export should be transpilers friendly', () => {
    context.version = 2;
    equal(configure({ context }).esModule, true);

    context.version = 1;
    equal(configure({ context }).esModule, false);

    // Should always be falsy if compiled in extract-text-webpack-plugin child compiler
    context.version = 2;
    context._compiler.name = 'extract-text-webpack-plugin';
    equal(configure({ context }).esModule, false);
  });
});
