/* eslint-disable global-require */
/* eslint-disable-next-line import/no-extraneous-dependencies */
const webpackPkg = require('webpack/package.json');

const webpackMajorVer = Number((/^\d+/).exec(webpackPkg.version));

let getMatchedRule = null;

if (webpackMajorVer >= 5) {
  getMatchedRule = require('./get-matched-rule-5');
} else {
  getMatchedRule = require('./get-matched-rule-4');
}

module.exports = getMatchedRule;
