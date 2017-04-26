const path = require('path');
const shell = require('shelljs');
const { getCliArgs } = require('./utils');

const rootDir = path.resolve(__dirname, '..');
const envDir = path.resolve(rootDir, 'env');
const packagesToLink = [
  'webpack',
  'extract-text-webpack-plugin'
];

const env = getCliArgs().env;
const targetDir = `${envDir}/${env}/node_modules`;

packagesToLink.forEach((pkg) => {
  shell.exec(`cd ${targetDir}/${pkg} && yarn unlink && yarn link`);
});

packagesToLink.forEach((pkg) => {
  shell.exec(`cd ${rootDir} && yarn link ${pkg}`);
});
