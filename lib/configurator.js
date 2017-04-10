const merge = require('lodash.merge');

const extractIssuerRegExp = /\.(css|sass|scss|less|styl|html)$/i;

const defaultConfig = {
  symbolId: '[name]',

  // Runtime
  runtime: undefined,
  runtimeOptions: {},
  esModule: undefined,

  // Extracting
  extract: undefined,
  spriteFilename: 'sprite.svg'
};

module.exports = ({ config = {}, context }) => {
  const target = context.options.target;
  const issuer = context._module.issuer.resource;

  const autodetected = {
    runtime: target === 'web' ? 'browser' : 'default',
    extract: extractIssuerRegExp.test(issuer),
    esModule: context.version && context.version >= 2
  };

  const finalConfig = merge(defaultConfig, autodetected, config);

  // Fix for extract-text-webpack-plugin
  // https://github.com/webpack-contrib/extract-text-webpack-plugin/blob/master/loader.js#L112
  // TODO report issue
  if (context._compiler.name === 'extract-text-webpack-plugin') {
    finalConfig.esModule = false;
  }

  return finalConfig;
};

module.exports.defaultConfig = defaultConfig;

