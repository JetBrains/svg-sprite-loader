// eslint-disable-next-line import/no-extraneous-dependencies
const ruleMatcher = require('webpack/lib/ModuleFilenameHelpers').matchObject;

/**
 * @param {string} request
 * @param {Rule[]} rules Webpack loaders config
 * @return {Rule[]}
 */
function getMatchedRules(request, rules) {
  return rules.filter(rule => {
    return typeof rule.test === 'function'
      ? rule.test(request)
      : ruleMatcher(rule, request)
  });
}

module.exports = getMatchedRules;
