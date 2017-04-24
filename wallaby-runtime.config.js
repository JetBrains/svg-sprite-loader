/* eslint-disable import/no-extraneous-dependencies,global-require */
const wallabyWebpack = require('wallaby-webpack');
const webpackConfig = require('./webpack-runtime.config.js');

webpackConfig.devtool = false;

module.exports = (wallaby) => {
  const config = {
    files: [
      { pattern: 'runtime/**/*.js', load: false },

      // static files
      { pattern: 'test/fixtures/**/*', instrument: false, load: false }
    ],

    tests: [
      { pattern: 'test/runtime/**/*.test.js', load: false }
    ],

    testFramework: 'mocha',

    env: {
      runner: require('phantomjs-prebuilt').path
    },

    compilers: {
      '**/*.js': wallaby.compilers.babel()
    },

    postprocessor: wallabyWebpack(webpackConfig),

    reportConsoleErrorAsError: true,

    setup: () => {
      // eslint-disable-next-line no-undef
      window.__moduleBundler.loadTests();
    }
  };

  return config;
};
