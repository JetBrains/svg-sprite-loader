const path = require('path');
const Promise = require('bluebird');
const merge = require('lodash.merge');
const { ok } = require('assert');
const { InMemoryCompiler, MemoryFileSystem, createCachedInputFileSystem } = require('webpack-toolkit');

const packageName = require('../package.json').name;
const fixturesPath = path.resolve(__dirname, 'fixtures');
exports.fixturesPath = fixturesPath;

const loaderPath = require.resolve('../lib/loader.js');
exports.loaderPath = loaderPath;

const rootDir = path.resolve(__dirname, '..');
exports.rootDir = rootDir;

exports.notOk = (value, message) => ok(!value, message);

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

exports.createCompiler = createCompiler;

/**
 * @param {Object} [config]
 * @return {Promise<Compilation>}
 */
function compile(config) {
  return createCompiler(config).then(compiler => compiler.run());
}

exports.compile = compile;

/**
 * @param {Object} [config]
 * @return {Promise<Compilation>}
 */
function compileAndNotReject(config) {
  return createCompiler(config).then(compiler => compiler.run(false));
}

exports.compileAndNotReject = compileAndNotReject;
