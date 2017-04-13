const { strictEqual, equal, ok } = require('assert');
const merge = require('lodash.merge');
const { compile, fixturesPath, loaderPath } = require('./tests-utils');
const Plugin = require('../lib/plugin');
const ExtractPlugin = require('extract-text-webpack-plugin');

const spriteLoaderRule = (cfg) => {
  return merge({
    test: /\.svg$/,
    loader: loaderPath
  }, cfg || {});
};

const extractPluginRule = () => {
  return {
    test: /\.css$/,
    loader: ExtractPlugin.extract({ use: 'css-loader' })
  };
};

/**
 * TODO should emit only built chunks
 */

describe('plugin', () => {
  it('should properly detect modules to extract', async () => {
    const compilation = await compile({
      entry: './entry',
      module: { rules: [spriteLoaderRule()] },
      plugins: [new Plugin()]
    });

    const assetsCount = Object.keys(compilation.assets).length;
    equal(assetsCount, 1);
  });
});
