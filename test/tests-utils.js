const path = require('path');
const { ok } = require('assert');
const Promise = require('bluebird');
const merge = require('lodash.merge');
const { InMemoryCompiler, MemoryFileSystem, createCachedInputFileSystem } = require('webpack-toolkit');

const fixturesPath = path.resolve(__dirname, 'fixtures');
const loaderPath = require.resolve('../lib/loader.js');
const rootDir = path.resolve(__dirname, '..');

/**
 * @param {Object} [config]
 * @return {InMemoryCompiler}
 */
function createCompiler(config = {}) {
  const cfg = merge({
    context: fixturesPath
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

/**
 * @param {Object} [config]
 * @return {Promise<Compilation>}
 */
function compile(config) {
  return createCompiler(config).then(compiler => compiler.run());
}

const notOk = (value, message) => ok(!value, message);

module.exports = {
  createCompiler,
  compile,
  notOk,
  fixturesPath,
  loaderPath,
  rootDir
};
