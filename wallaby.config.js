/* eslint-disable import/no-extraneous-dependencies,global-require */
module.exports = () => {
  const config = {
    files: [
      { pattern: 'lib/**/*.js' },
      { pattern: 'test/_*.js', instrument: false },

      // static files
      { pattern: 'test/fixtures/**', load: false, instrument: false },
      { pattern: 'package.json', load: false }
    ],

    tests: [
      { pattern: 'test/*.test.js' }
    ],

    testFramework: 'mocha',

    env: {
      type: 'node',
      runner: 'node'
    },

    // eslint-disable-next-line no-shadow
    setup: (wallaby) => {
      const mocha = wallaby.testFramework;
      mocha.ui('bdd');

      const webpackToolkit = require('webpack-toolkit');
      const { PACKAGE_NAME } = require('./lib/config');

      const OldInMemoryCompiler = webpackToolkit.InMemoryCompiler;
      if (!OldInMemoryCompiler.patched) {
        // eslint-disable-next-line no-multi-assign
        const NewInMemoryCompiler = webpackToolkit.InMemoryCompiler = function patched(cfg) {
          cfg.resolve = {
            alias: {
              [PACKAGE_NAME]: `${wallaby.localProjectDir}`
            }
          };

          cfg.resolveLoader = {
            modules: [`${wallaby.localProjectDir}/node_modules`]
          };

          NewInMemoryCompiler.prototype = OldInMemoryCompiler.prototype;
          // eslint-disable-next-line prefer-rest-params
          return OldInMemoryCompiler.apply(this, arguments);
        };
        NewInMemoryCompiler.patched = true;
      }
    }
  };

  return config;
};
