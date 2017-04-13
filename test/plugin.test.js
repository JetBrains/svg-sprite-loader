const path = require('path');
const fs = require('fs');
const { strictEqual, equal, ok } = require('assert');
const merge = require('lodash.merge');

const { compile, createCompiler, fixturesPath, loaderPath, rootDir } = require('./tests-utils');
const Plugin = require('../lib/plugin');
const ExtractPlugin = require('extract-text-webpack-plugin');
const InMemoryCompiler = require('webpack-toolkit').InMemoryCompiler;
const MemoryFS = require('memory-fs');

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
  const svg = '<svg></svg>';
  let CSSExtractor;

  beforeEach(() => CSSExtractor = new ExtractPlugin('[name].css'));

  it('should properly detect modules to extract', async () => {
    const { assets } = await compile({
      entry: './entry',
      module: { rules: [spriteLoaderRule()] },
      plugins: [new Plugin()],
      files: {
        'entry.js': 'require("./image.svg")',
        'image.svg': svg
      }
    });

    ok(Object.keys(assets).length === 1);
  });

  it('should allow to specify custom sprite filename', async () => {
    const spriteFilename = 'qwe.svg';

    const { assets } = await compile({
      entry: './styles.css',
      module: { rules: [
        spriteLoaderRule({ options: { spriteFilename } }),
        extractPluginRule()
      ] },
      plugins: [new Plugin(), CSSExtractor]
    });

    ok(Object.keys(assets).length === 3);
    ok(spriteFilename in assets);
  });

  it('should support [chunkname] placeholder in sprite filename', async () => {

  });

  it('should replace with proper publicPath', () => {

  });

  it('should work with html-loader', () => {

  });

  it('should warn if several rules applies to module', () => {

  });
});
