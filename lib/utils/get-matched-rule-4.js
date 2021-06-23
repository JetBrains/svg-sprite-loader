/* eslint-disable import/no-unresolved */
const path = require('path');

const ruleSetDir = path.dirname(require.resolve('webpack/lib/RuleSet'));
const webpackDir = path.dirname(require.resolve('webpack'));

if (ruleSetDir !== webpackDir) {
  throw new Error('RuleSet not found in local webpack installation');
}

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
