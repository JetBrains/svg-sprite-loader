const merge = require('webpack-merge');
const baseConfig = require('../base-webpack.config');

module.exports = (env = {}) => {
  return merge(baseConfig(env), {
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
    }
  });
};
