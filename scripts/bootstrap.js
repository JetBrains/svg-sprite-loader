const path = require('path');
const shell = require('shelljs');

const { exec } = shell;
const projectDir = path.resolve(__dirname, '..');

exec('yarn');
exec(`node ${projectDir}/node_modules/husky/bin/install`);
