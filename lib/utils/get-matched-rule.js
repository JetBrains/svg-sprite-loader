const RuleSet = require('webpack/lib/RuleSet');

module.exports = (compiler) => {
  const rawRules = compiler.options.module.rules;
  const { rules } = new RuleSet(rawRules);
  const rule = rules
    .reduce((pre, cur) => {
      if (cur.oneOf) {
        const use = cur.oneOf.map(item => item.use);
        return Array.prototype.concat.apply(pre, use);
      }
      return pre.concat(cur.use || []);
    }, [])
    .find((item) => {
      return /svg-sprite-loader/.test(item.loader);
    });

  return rule.options || {};
};
