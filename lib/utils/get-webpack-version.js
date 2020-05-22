// eslint-disable-next-line import/no-extraneous-dependencies
// require.main is undefined while running WebStorm code assistance analyzer of webpack.config.js
if (!require.main) {
  require.main = { require };
}
const webpackVersion = require.main.require('webpack/package.json').version;

/**
 * @param {boolean} [onlyMajor=true]
 * @return {string}
 */
function getWebpackVersion(onlyMajor = true) {
  return onlyMajor ? webpackVersion.split('.')[0] : webpackVersion;
}

getWebpackVersion.IS_1 = getWebpackVersion() === '1';
getWebpackVersion.IS_2 = getWebpackVersion() === '2';
getWebpackVersion.IS_3 = getWebpackVersion() === '3';
getWebpackVersion.IS_4 = getWebpackVersion() === '4';
getWebpackVersion.IS_5 = getWebpackVersion() === '5';
module.exports = getWebpackVersion;
