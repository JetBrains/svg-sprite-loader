const path = require('path');
const fs = require('fs');
const shell = require('shelljs');
const { getCliArgs } = require('./utils');

const rootDir = path.resolve(__dirname, '..');
const envDir = path.resolve(rootDir, 'env');

const packagesToLink = [
  'webpack',
  'extract-text-webpack-plugin',
  'enhanced-resolve'
];

const env = getCliArgs().env;
const targetDir = `${envDir}/${env}/node_modules`;

packagesToLink.forEach((pkg) => {
  shell.exec(`cd ${targetDir}/${pkg} && yarn unlink && yarn link`);
});

packagesToLink.forEach((pkg) => {
  shell.exec(`cd ${rootDir} && yarn link ${pkg}`);
});

fs.writeFileSync(`${rootDir}/.current-env`, env);
