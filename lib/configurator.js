const merge = require('lodash.merge');
const defaults = require('./config');

const extractTextPluginCompilerName = 'extract-text-webpack-plugin';

module.exports = function configurator({ config = {}, context }) {
  const target = context.options.target;
  const issuer = context._module.issuer.resource;

  const autodetected = {
    runtime: target === 'web' ? 'browser' : 'default',
    extract: defaults.extractIssuerRegExp.test(issuer),
    esModule: context.version && context.version >= 2
  };

  const finalConfig = merge(defaults.loader, autodetected, config);

  // Fix for extract-text-webpack-plugin
  // https://github.com/webpack-contrib/extract-text-webpack-plugin/blob/master/loader.js#L112
  // TODO report issue
  if (context._compiler.name === extractTextPluginCompilerName) {
    finalConfig.esModule = false;
  }

  return finalConfig;
};
