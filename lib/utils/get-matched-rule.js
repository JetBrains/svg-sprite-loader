/* eslint-disable global-require */
const getWebpackVersion = require('./get-webpack-version');

let getMatchedRule = null;

if (getWebpackVersion.IS_5) {
  // webpack5 and upper
  getMatchedRule = require('./get-matched-rule-5');
} else {
  // webpack4 and lower
  getMatchedRule = require('./get-matched-rule-4');
}

module.exports = getMatchedRule;
