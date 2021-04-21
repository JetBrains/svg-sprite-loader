// eslint-disable-next-line import/no-extraneous-dependencies
const webpackPkg = require("webpack/package.json") || {};
const webpackVersion = webpackPkg.version || require("webpack").version;

const webpackMajorVersion = parseInt(webpackVersion.split(".")[0], 10);

module.exports = webpackMajorVersion === 1;
