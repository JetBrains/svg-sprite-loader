const merge = require('webpack-merge');
const TextExtractPlugin = require('extract-text-webpack-plugin');
const baseConfig = require('../base-webpack.config');
const SpritePlugin = require('../../plugin');

const CSSExtractor = new TextExtractPlugin('[name].css');
const HTMLExtractor = new TextExtractPlugin('[name].html');

module.exports = (env = {}) => {
  return merge(baseConfig(env), {
    module: {
      rules: [
        {
          test: /\.svg$/,
          loader: 'svg-sprite-loader',
          options: {
            extract: true,
            spriteFilename: 'sprite-[hash:6].svg'
          }
        },
        {
          test: /\.css$/,
          loader: CSSExtractor.extract({ use: 'css-loader' })
        },
        {
          test: /\.html$/,
          loader: HTMLExtractor.extract({ use: 'html-loader' })
        }
      ]
    },

    plugins: [
      CSSExtractor,
      HTMLExtractor,
      new SpritePlugin()
    ]
  });
};
