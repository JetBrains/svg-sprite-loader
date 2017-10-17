const path = require('path');
const minimist = require('minimist');
const shell = require('shelljs');
const glob = require('glob');

/**
 * @return {Array<string>}
 */
function getCliArgs() {
  return minimist(process.argv.slice(2));
}

/**
 * @param {string} dir Absolute path to folder with env directories
 * @return {Array<Object{name: string, path: string}>}
 */
function getEnvsList(dir) {
  return glob
    .sync(`${dir}/env/*/`)
    .map((envPath) => {
      return {
        name: path.basename(envPath),
        path: envPath
      };
    })
    .sort((left, right) => {
      const l = left.name;
      const r = right.name;
      if (l === r) {
        return 0;
      }
      return l < r ? -1 : 1;
    });
}

/**
 * @param {string} cmd
 * @param {boolean} [returnErrorWhenFail=false]
 * @return {string|undefined}
 */
function exec(cmd, returnErrorWhenFail = false) {
  const res = shell.exec(cmd, { silent: true });
  const { stderr, code } = res;
  const stdout = res.stdout.trim();

  if (code !== 0 && returnErrorWhenFail) {
    const err = new Error(stderr);
    err.code = code;
    return err;
  }

  return stdout === '' ? undefined : stdout;
}

module.exports.getCliArgs = getCliArgs;
module.exports.getEnvsList = getEnvsList;
module.exports.exec = exec;
