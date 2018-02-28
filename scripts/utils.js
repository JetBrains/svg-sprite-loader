const minimist = require('minimist');

/**
 * @return {Array<string>}
 */
function getCliArgs() {
  return minimist(process.argv.slice(2));
}
module.exports.getCliArgs = getCliArgs;
