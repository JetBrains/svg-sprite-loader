const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('../base-webpack.config');
const dllManifest = require('./build/dll-manifest.json');

module.exports = (env = {}) => {
  return merge(baseConfig(env), {
    context: __dirname,

    entry: './main',

    output: {
      path: path.resolve(__dirname, 'build')
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
      new webpack.DllReferencePlugin({
        manifest: dllManifest
      })
    ]
  });
};
