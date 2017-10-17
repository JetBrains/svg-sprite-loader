const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('../base-webpack.config');

module.exports = (env = {}) => {
  return merge(baseConfig(env), {
    entry: {
      dll: ['./dll']
    },

    output: {
      library: 'dll'
    },

    module: {
      rules: [
        {
          test: /\.svg$/,
          use: [
            'svg-sprite-loader',
            'svgo-loader'
          ]
        }
      ]
    },

    plugins: [
      new webpack.DllPlugin({
        path: path.join(__dirname, 'build', '[name]-manifest.json'),
        name: 'dll'
      })
    ]
  });
};
