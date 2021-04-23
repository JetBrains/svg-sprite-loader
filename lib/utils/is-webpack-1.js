// eslint-disable-next-line import/no-extraneous-dependencies, import/no-unresolved, global-require
const webpackPkg = require('webpack/package.json') || {};
// eslint-disable-next-line import/no-extraneous-dependencies, import/no-unresolved, global-require
const webpackVersion = webpackPkg.version || require('webpack').version;

const webpackMajorVersion = parseInt(webpackVersion.split('.')[0], 10);

module.exports = webpackMajorVersion === 1;
