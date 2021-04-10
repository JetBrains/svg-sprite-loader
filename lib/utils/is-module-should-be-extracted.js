const defaults = require('../config');
const normalizeRule = require('./normalize-rule');
// eslint-disable-next-line import/no-extraneous-dependencies
const { ModuleGraph, version } = require('webpack');


const isWebpackGreaterThan5 = version[0] >= 5;
const spriteLoaderPath = require.resolve('../loader');

/**
 * @param {NormalModule} module
 * @return {boolean}
 */
function isModuleShouldBeExtracted(module) {
  const { request, loaders } = module;
  const { issuer } = isWebpackGreaterThan5 ? ModuleGraph : module;
  let rule = null;

  if (Array.isArray(loaders) && loaders.length > 0) {
    // Find loader rule
    rule = loaders.map(normalizeRule).find(data => data.loader === spriteLoaderPath);
  }

  let issuerResource = null;
  if (issuer) {
    // webpack 1 compat
    issuerResource = typeof issuer === 'string' ? issuer : issuer.resource;
  }

  if (typeof request === 'string' && (!request.includes(spriteLoaderPath) || !rule)) {
    return false;
  }

  return !!(
    (issuer && defaults.EXTRACTABLE_MODULE_ISSUER_PATTERN.test(issuerResource)) ||
    (rule && rule.options && rule.options.extract)
  );
}

module.exports = isModuleShouldBeExtracted;
