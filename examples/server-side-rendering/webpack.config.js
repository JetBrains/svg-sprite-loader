const path = require('path');
const merge = require('deepmerge');
const baseConfig = require('../base-webpack.config');

module.exports = merge(baseConfig, {
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
  }
});
