const path = require('path');
const merge = require('lodash.merge');
const {
  InMemoryCompiler,
  createCachedInputFileSystem
} = require('webpack-toolkit');

const fixturesPath = path.resolve(__dirname, 'fixtures');
const loaderPath = require.resolve('../lib/loader.js');

function compile(config) {
  const cfg = merge({ context: fixturesPath }, config);
  const inputFS = createCachedInputFileSystem();
  return new InMemoryCompiler(cfg, { inputFS }).run(false);
}

module.exports = {
  compile,
  fixturesPath,
  loaderPath
};
