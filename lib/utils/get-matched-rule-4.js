/* eslint-disable import/no-unresolved */
// eslint-disable-next-line import/no-extraneous-dependencies
const RuleSet = require('webpack/lib/RuleSet');

const flattenAndExtractUse = rules => rules.reduce((pre, rule) => {
  if ('rules' in rule || 'oneOf' in rule) {
    return pre.concat(flattenAndExtractUse(rule.rules || rule.oneOf));
  }

  return pre.concat(rule.use || []);
}, []);

module.exports = (compiler) => {
  const rawRules = compiler.options.module.rules;
  const { rules } = new RuleSet(rawRules);
  const rule = flattenAndExtractUse(rules)
    .find((item) => {
      return /svg-sprite-loader/.test(item.loader);
    }) || {};

  return rule.options || {};
};
