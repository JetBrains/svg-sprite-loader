const path = require('path');
const merge = require('deepmerge');
const baseConfig = require('../base-webpack.config');
const SpritePlugin = require('../../plugin');

const config = merge(baseConfig, {
  context: __dirname,

  entry: './entry',

  output: {
    path: path.resolve(__dirname, 'build')
  },

  /**
   * When target is 'node' svg-sprite-loader will use isomorphic runtime sprite module.
   * @see svg-sprite-loader/runtime/sprite.js
   */
  target: 'node',

  module: {
    rules: [
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader'
      }
    ]
  },

  plugins: [new SpritePlugin()]
});

module.exports = config;
