/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-restricted-syntax */
// eslint-disable-next-line import/no-extraneous-dependencies

const isSpriteLoader = (rule) => {
  if (!Object.prototype.hasOwnProperty.call(rule, 'loader')) return false;
  return /svg-sprite-loader/.test(rule.loader);
};

module.exports = (compiler) => {
  const rawRules = compiler.options.module.rules;
  let spriteLoader = null;
  for (const rawRule of rawRules) {
    if (isSpriteLoader(rawRule)) {
      spriteLoader = rawRule;
    } else if (Object.prototype.hasOwnProperty.call(rawRule, 'use')) {
      const rawRuleUse = Array.isArray(rawRule.use)
        ? rawRule.use
        : [rawRule.use];
      for (const subLoader of rawRuleUse) {
        if (isSpriteLoader(subLoader)) {
          spriteLoader = subLoader;
        }
      }
    }
    if (spriteLoader !== null) break;
  }
  return (spriteLoader !== null && spriteLoader.options !== undefined) ? spriteLoader.options : {};
};
