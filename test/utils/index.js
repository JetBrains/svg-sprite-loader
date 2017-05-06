const merge = require('deepmerge');
const ExtractPlugin = require('extract-text-webpack-plugin');
const { isWebpack1 } = require('../../lib/utils');
const { loaderPath } = require('../_config');
const createCompiler = require('./create-compiler');

/**
 * @param {Object} [config]
 * @return {Promise<Compilation>}
 */
function compile(config) {
  return createCompiler(config).then(compiler => compiler.run());
}

/**
 * @param {Object} [config]
 * @return {Promise<Compilation>}
 */
function compileAndNotReject(config) {
  return createCompiler(config).then(compiler => compiler.run(false));
}

function rules(...data) {
  return {
    [isWebpack1 ? 'loaders' : 'rules']: [...data]
  };
}

function rule(data) {
  if (isWebpack1) {
    data.query = data.options;
    delete data.options;
  }

  return data;
}

function multiRule(data) {
  if (isWebpack1) {
    data.loaders = data.use.map((ruleData) => {
      return typeof ruleData !== 'string' ?
        `${ruleData.loader}?${JSON.stringify(ruleData.options)}` :
        ruleData;
    });
    delete data.use;
  }

  return data;
}

function loaderRule(opts) {
  const options = merge({}, opts || {});

  return rule({
    test: /\.svg$/,
    loader: loaderPath,
    options
  });
}

function extractCSSRule() {
  // webpack 1 compat
  const use = isWebpack1 ?
    ExtractPlugin.extract('css-loader').split('!') :
    ExtractPlugin.extract('css-loader');

  return multiRule({
    test: /\.css$/,
    use
  });
}

function extractHTMLRule() {
  return rule({
    test: /\.html$/,
    loader: ExtractPlugin.extract('html-loader')
  });
}

module.exports.rule = rule;
module.exports.rules = rules;
module.exports.multiRule = multiRule;
module.exports.loaderRule = loaderRule;
module.exports.extractCSSRule = extractCSSRule;
module.exports.compile = compile;
module.exports.compileAndNotReject = compileAndNotReject;
module.exports.createCompiler = createCompiler;
module.exports.extractHTMLRule = extractHTMLRule;
