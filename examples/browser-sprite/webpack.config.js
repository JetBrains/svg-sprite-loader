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

  module: {
    rules: [
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              symbolId: '[name]_[hash:base64:8]'
            }
          },
          'svgo-loader'
        ]
      }
    ]
  },

  plugins: [
    new SpritePlugin()
  ]
});

module.exports = config;
