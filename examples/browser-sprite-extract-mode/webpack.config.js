const merge = require('webpack-merge');
const baseConfig = require('../base-webpack.config');
const SpritePlugin = require('../../plugin');

module.exports = (env = {}) => {
  return merge(baseConfig(env), {
    output: {
      publicPath: 'build/'
    },

    module: {
      rules: [
        {
          test: /\.svg$/,
          use: [
            {
              loader: 'svg-sprite-loader',
              options: { extract: true }
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
};
