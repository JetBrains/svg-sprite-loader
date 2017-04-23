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
