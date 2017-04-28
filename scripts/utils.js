const minimist = require('minimist');

function getCliArgs() {
  return minimist(process.argv.slice(2));
}

module.exports.getCliArgs = getCliArgs;
