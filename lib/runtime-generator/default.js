const merge = require('lodash.merge');
const { stringifyRequest } = require('loader-utils');
const defaultOptions = require('../config').runtime.default;
const { stringifySymbol, generateSpritePlaceholder } = require('../utils');

function defaultRuntimeGenerator({ config, symbol, context }) {
  const { extract } = config;
  const runtimeOptions = merge(defaultOptions, config.runtimeOptions || {});

  let content;
  let exports;

  if (extract) {
    content = '';
    exports = JSON.stringify(generateSpritePlaceholder(symbol.request.toString()));
  } else {
    // var sprite = require(${stringifyRequest(context, runtimeOptions.spriteModule)});
    content = `      
      var symbol = sprite.add(${stringifySymbol(symbol)});`;

    exports = 'symbol';
  }

  return { content, export: exports };
}

module.exports = defaultRuntimeGenerator;
module.exports.defaultOptions = defaultOptions;
