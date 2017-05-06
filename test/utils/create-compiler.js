const path = require('path');
const merge = require('deepmerge');
const Promise = require('bluebird');
const { InMemoryCompiler, MemoryFileSystem, createCachedInputFileSystem } = require('webpack-toolkit');
const packageName = require('../../lib/config').PACKAGE_NAME;
const { fixturesPath, rootDir } = require('../_config');

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

module.exports = createCompiler;
