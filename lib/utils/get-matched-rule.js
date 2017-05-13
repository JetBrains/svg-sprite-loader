const getMatchedRules = require('./get-matched-rules');

/**
 * Always returns last matched rule
 * @param {string} request
 * @param {Rule[]} rules Webpack loaders config
 * @return {Rule} Webpack rule
 */
function getMatchedRule(request, rules) {
  const matched = getMatchedRules(request, rules);
  return matched[matched.length - 1];
}

module.exports = getMatchedRule;
