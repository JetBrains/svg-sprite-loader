const merge = require('lodash.merge');
const defaultOptions = require('../config').runtime.browser;
const defaultGenerator = require('./default');

function browserRuntimeGenerator({ symbol, config, context }) {
  const runtimeOptions = merge(defaultOptions, config.runtimeOptions);
  const total = merge({ runtimeOptions }, config);

  return defaultGenerator({ symbol, config: total, context });
}

module.exports = browserRuntimeGenerator;
module.exports.defaultOptions = defaultOptions;
