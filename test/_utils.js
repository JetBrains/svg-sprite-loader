const path = require('path');
const { ok } = require('assert');
const Promise = require('bluebird');
const merge = require('deepmerge');
const ExtractPlugin = require('extract-text-webpack-plugin');
const packageName = require('../package.json').name;
const { webpack1 } = require('../lib/utils');
const {
  InMemoryCompiler,
  MemoryFileSystem,
  createCachedInputFileSystem
} = require('webpack-toolkit');

const fixturesPath = path.resolve(__dirname, 'fixtures');
module.exports.fixturesPath = fixturesPath;

const loaderPath = require.resolve('..');
module.exports.loaderPath = loaderPath;

const rootDir = path.resolve(__dirname, '..');
module.exports.rootDir = rootDir;

function notOk(value, message) {
  ok(!value, message);
}

module.exports.notOk = notOk;

/**
 * @param {Object} [config]
 * @return {Promise<InMemoryCompiler>}
 */
function createCompiler(config = {}) {
  const cfg = merge({
    context: fixturesPath,
    resolve: {
      alias: {
        [packageName]: rootDir
      }
    }
  }, config);

  if (!cfg.files) {
    const inputFS = createCachedInputFileSystem();
    return Promise.resolve(
      new InMemoryCompiler(cfg, { inputFS })
    );
  }

  const promisedInputFS = new MemoryFileSystem();

  return Promise.map(Object.keys(cfg.files), (filename) => {
    const rawContent = cfg.files[filename];
    const content = rawContent instanceof Buffer === false ? new Buffer(rawContent) : rawContent;
    const filepath = path.resolve(cfg.context, filename);

    return promisedInputFS.writep(filepath, content);
  })
    .then(() => {
      delete cfg.files;
      return new InMemoryCompiler(cfg, { inputFS: promisedInputFS.fs });
    });
}

module.exports.createCompiler = createCompiler;

/**
 * @param {Object} [config]
 * @return {Promise<Compilation>}
 */
function compile(config) {
  return createCompiler(config).then(compiler => compiler.run());
}

module.exports.compile = compile;

/**
 * @param {Object} [config]
 * @return {Promise<Compilation>}
 */
function compileAndNotReject(config) {
  return createCompiler(config).then(compiler => compiler.run(false));
}

module.exports.compileAndNotReject = compileAndNotReject;


function rules(...data) {
  return {
    [webpack1 ? 'loaders' : 'rules']: [...data]
  };
}

module.exports.rules = rules;

function rule(data) {
  if (webpack1) {
    data.query = data.options;
    delete data.options;
  }

  return data;
}

module.exports.rule = rule;

function multiRule(data) {
  if (webpack1) {
    data.loaders = data.use.map((ruleData) => {
      return typeof ruleData !== 'string' ?
        `${ruleData.loader}?${JSON.stringify(ruleData.options)}` :
        ruleData;
    });
    delete data.use;
  }

  return data;
}

module.exports.multiRule = multiRule;

function loaderRule(opts) {
  const options = merge({}, opts || {});

  return rule({
    test: /\.svg$/,
    loader: loaderPath,
    options
  });
}

module.exports.loaderRule = loaderRule;

function extractCSSRule() {
  return multiRule({
    test: /\.css$/,
    use: ExtractPlugin.extract('css-loader').split('!')
  });
}

module.exports.extractCSSRule = extractCSSRule;

function extractHTMLRule() {
  return rule({
    test: /\.html$/,
    loader: ExtractPlugin.extract('html-loader')
  });
}

module.exports.extractHTMLRule = extractHTMLRule;
