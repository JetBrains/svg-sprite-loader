const path = require('path');
const packageName = require('./package.json').name;

const loaderPath = require.resolve('./');
const Plugin = require('./lib/plugin');

const config = {
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js'
  },

  resolve: {
    alias: {
      [packageName]: __dirname
    }
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.svg$/,
        use: [
          // 'babel-loader',
          loaderPath,
          'svgo-loader'
        ]
      }
    ]
  },

  plugins: [
    new Plugin()
  ]
};

module.exports = config;
