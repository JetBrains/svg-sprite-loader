/* eslint-disable import/no-extraneous-dependencies */
const ruleMatcher = require('webpack/lib/ModuleFilenameHelpers').matchObject;
const isWebpack1 = require('./is-webpack-1');
const RuleSet = !isWebpack1 ? require('webpack/lib/RuleSet') : null;

/**
 * @param {string} request
 * @param {Rule[]} rules Webpack loaders config
 * @return {Rule[]}
 */
function getMatchedRules(request, rules, issuer) {
  const matchedRules = rules.filter((rule) => {
    return typeof rule.test === 'function'
      ? rule.test(request)
      : ruleMatcher(rule, request);
  });

  if (issuer) {
    return matchedRules.filter((rule) => {
      // If rule doesn't have an issuer or RuleSet is not available
      if (!rule.issuer || !RuleSet) {
        return true;
      }

      const matcher = RuleSet.normalizeCondition(rule.issuer);
      return matcher(issuer);
    });
  }

  return matchedRules;
}

module.exports = getMatchedRules;
