const path = require('path');
const packageName = require('../package.json').name;

const config = {
  output: {
    filename: '[name].js'
  },

  resolve: {
    alias: {
      [packageName]: path.resolve(__dirname, '..')
    }
  },

  resolveLoader: {
    alias: {
      [packageName]: path.resolve(__dirname, '..')
    }
  }
};

module.exports = config;
