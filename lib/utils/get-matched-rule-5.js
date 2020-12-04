/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-restricted-syntax */
// eslint-disable-next-line import/no-extraneous-dependencies
const BasicEffectRulePlugin = require('webpack/lib/rules/BasicEffectRulePlugin');
const BasicMatcherRulePlugin = require('webpack/lib/rules/BasicMatcherRulePlugin');
const RuleSetCompiler = require('webpack/lib/rules/RuleSetCompiler');
const UseEffectRulePlugin = require('webpack/lib/rules/UseEffectRulePlugin');

const ruleSetCompiler = new RuleSetCompiler([
  new BasicMatcherRulePlugin('test', 'resource'),
  new BasicMatcherRulePlugin('include', 'resource'),
  new BasicMatcherRulePlugin('exclude', 'resource', true),
  new BasicMatcherRulePlugin('resource'),
  new BasicMatcherRulePlugin('conditions'),
  new BasicMatcherRulePlugin('resourceQuery'),
  new BasicMatcherRulePlugin('realResource'),
  new BasicMatcherRulePlugin('issuer'),
  new BasicMatcherRulePlugin('compiler'),
  new BasicEffectRulePlugin('type'),
  new BasicEffectRulePlugin('sideEffects'),
  new BasicEffectRulePlugin('parser'),
  new BasicEffectRulePlugin('resolve'),
  new UseEffectRulePlugin()
]);

// const RuleSet = require('webpack/lib/RuleSet');

const flattenAndExtractUse = rules => rules.reduce((pre, rule) => {
  // if ('rules' in rule || 'oneOf' in rule) {
  //   return pre.concat(flattenAndExtractUse(rule.rules || rule.oneOf));
  // }
  return pre.concat(rule || []);
}, []);

module.exports = (compiler) => {
  const rawRules = compiler.options.module.rules;
  const rulesUse = [];
  for (const rawRule of rawRules) {
    const clonedRawRule = Object.assign({}, rawRule);
    delete clonedRawRule.include;
    const ruleSet = ruleSetCompiler.compile([{
      rules: [clonedRawRule]
    }]);
    rulesUse.push(ruleSet.exec({
      resource: '.svg'
    }));
  }

  // const {
  //   rules
  // } = ruleSet;

  const rule = flattenAndExtractUse(rulesUse)
    .find((item) => {
      return /svg-sprite-loader/.test(item.value.loader);
    }) || {};

  return rule.value ? rule.value.options : {};
};
