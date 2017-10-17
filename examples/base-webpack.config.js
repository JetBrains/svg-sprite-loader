const path = require('path');
const spriteLoaderPackageName = require('../package.json').name;

const spriteLoaderPackageRoot = path.resolve(__dirname, '..');
const babelRcPath = path.resolve(__dirname, '.babelrc');

module.exports = (env = {}) => {
  // folder with target webpack.config.js file
  const workingDir = env.cwd || process.cwd();

  return {
    context: workingDir,

    entry: './main',

    output: {
      filename: '[name].js',
      path: path.resolve(workingDir, 'build')
    },

    resolve: {
      alias: {
        [spriteLoaderPackageName]: spriteLoaderPackageRoot
      }
    },

    resolveLoader: {
      alias: {
        [spriteLoaderPackageName]: spriteLoaderPackageRoot
      }
    },

    module: {
      rules: [
        {
          test: /\.jsx$/,
          loader: 'babel-loader',
          options: {
            babelrc: babelRcPath
          }
        }
      ]
    }
  };
};
