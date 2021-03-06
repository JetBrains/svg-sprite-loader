/* eslint-disable global-require */

let getMatchedRule = null;

try {
  getMatchedRule = require('./get-matched-rule-4');
} catch (e) {
  getMatchedRule = require('./get-matched-rule-5');
}

module.exports = getMatchedRule;
