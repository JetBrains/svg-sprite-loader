const merge = require('deepmerge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
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

function svgRule(opts) {
  const options = merge({}, opts || {});

  return rule({
    test: /\.svg$/,
    loader: loaderPath,
    options
  });
}

function svgInsideOneOfRule(opts) {
  const options = merge({}, opts || {});

  return rule({
    oneOf: [{
      test: /\.svg$/,
      loader: loaderPath,
      options
    }]
  });
}

function svgInsideRulesRule(opts) {
  const options = merge({}, opts || {});

  return rule({
    rules: [{
      test: /\.svg$/,
      loader: loaderPath,
      options
    }]
  });
}

/**
 * @see for webpack 1 - https://github.com/webpack-contrib/extract-text-webpack-plugin/blob/webpack-1/README.md#api
 * @see for webpack 2 - https://github.com/webpack-contrib/extract-text-webpack-plugin#options
 * @param {string} filename
 * @param {Object} [options]
 * @return {ExtractTextPlugin}
 */
function extractPlugin(filename, options) {
  // webpack 1 compat
  if (isWebpack1) {
    return new ExtractTextPlugin(filename, options);
  }

  let args = filename;
  if (typeof options !== 'object') {
    args = Object.assign({}, options);
    args.filename = filename;
  }

  return new ExtractTextPlugin(args);
}

/**
 * @see for webpack 1 - https://github.com/webpack-contrib/extract-text-webpack-plugin/blob/webpack-1/README.md#api
 * @see for webpack 2 - https://github.com/webpack-contrib/extract-text-webpack-plugin#options
 * @param {ExtractTextPlugin} plugin
 * @return {Rule}
 */
function extractCSSRule(plugin) {
  // webpack 1 compat
  return multiRule({
    test: /\.css$/,
    use: isWebpack1
      ? plugin.extract('css-loader').split('!')
      : plugin.extract('css-loader')
  });
}

function extractHTMLRule(plugin) {
  return multiRule({
    test: /\.html$/,
    use: isWebpack1
      ? plugin.extract('html-loader').split('!')
      : plugin.extract('html-loader')
  });
}

module.exports.rule = rule;
module.exports.rules = rules;
module.exports.multiRule = multiRule;
module.exports.svgRule = svgRule;
module.exports.svgInsideOneOfRule = svgInsideOneOfRule;
module.exports.svgInsideRulesRule = svgInsideRulesRule;
module.exports.compile = compile;
module.exports.compileAndNotReject = compileAndNotReject;
module.exports.createCompiler = createCompiler;
module.exports.extractHTMLRule = extractHTMLRule;
module.exports.extractCSSRule = extractCSSRule;
module.exports.extractPlugin = extractPlugin;
