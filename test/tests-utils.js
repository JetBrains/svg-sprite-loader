const path = require('path');
const { ok } = require('assert');
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

const notOk = (value, message) => ok(!value, message);

module.exports = {
  compile,
  notOk,
  fixturesPath,
  loaderPath
};
