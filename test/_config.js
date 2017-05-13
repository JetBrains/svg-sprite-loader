const path = require('path');

module.exports.fixturesPath = path.resolve(__dirname, 'fixtures');
module.exports.loaderPath = require.resolve('..');
module.exports.rootDir = path.resolve(__dirname, '..');
