const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('../base-webpack.config');

module.exports = (env = {}) => {
  return merge(baseConfig(env), {
    entry: './main.jsx',

    module: {
      rules: [
        {
          test: /\.svg$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                babelrc: path.resolve(__dirname, '../.babelrc')
              }
            },
            {
              loader: 'svg-sprite-loader',
              options: {
                runtimeGenerator: require.resolve('./svg-to-icon-component-runtime-generator'),
                runtimeOptions: {
                  iconModule: './icon.jsx' // Relative to current build context folder
                }
              }
            }
          ]
        }
      ]
    }
  });
};
