// eslint-disable-next-line import/no-extraneous-dependencies
// require.main.require('webpack/package.json') could throw 'Cannot find module 'webpack/package.json'
// while running IDE code assistance analyzer of webpack.config.js
let webpackVersion;
try {
  webpackVersion = require.main.require('webpack/package.json').version;
} catch (e) {
  console.error(e);
  try {
    require.main = { require };
    webpackVersion = require.main.require('webpack/package.json').version;
  } catch (e0) {
    console.error(e0);
    webpackVersion = '4';
  }
}

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

module.exports = getWebpackVersion;
