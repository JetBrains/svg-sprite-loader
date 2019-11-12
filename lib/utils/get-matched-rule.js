// eslint-disable-next-line import/no-extraneous-dependencies
const RuleSetCompiler = require('webpack/lib/rules/RuleSetCompiler');

// TODO: need to push plugins here
// @see https://github.com/webpack/webpack/blob/master/lib/NormalModuleFactory.js#L110-L124
const ruleSetCompiler = new RuleSetCompiler([]);

const flattenAndExtractUse = rules => rules.reduce((pre, rule) => {
  if ('rules' in rule || 'oneOf' in rule) {
    return pre.concat(flattenAndExtractUse(rule.rules || rule.oneOf));
  }

  return pre.concat(rule.use || []);
}, []);

module.exports = (compiler) => {
  const rawRules = compiler.options.module.rules;
  const { rules } = ruleSetCompiler.compile(rawRules);
  const rule = flattenAndExtractUse(rules)
    .find((item) => {
      return /svg-sprite-loader/.test(item.loader);
    }) || {};

  return rule.options || {};
};
