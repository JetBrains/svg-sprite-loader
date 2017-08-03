const path = require('path');
const fs = require('fs');
const shell = require('shelljs');
const { getCliArgs } = require('./utils');

const { cd, echo, exec } = shell;
const env = getCliArgs().env;
const rootDir = path.resolve(__dirname, '..');

if (!env) {
  throw new Error('--env option should be provided');
}
const envDir = path.resolve(rootDir, `${rootDir}/env/${env}`);
// eslint-disable-next-line import/no-dynamic-require
const packagesToLink = require(`${envDir}/package.json`).packagesToLink;

const envData = {
  name: env,
  packages: []
};

packagesToLink.forEach((packageName) => {
  const packageDir = `${envDir}/node_modules/${packageName}`;
  // eslint-disable-next-line import/no-dynamic-require,global-require
  const version = require(`${packageDir}/package.json`).version;
  envData.packages.push(`${packageName}@${version}`);

  cd(packageDir);
  exec('yarn unlink || true');
  exec('yarn link');
});

cd(rootDir);
packagesToLink.forEach(packageName => exec(`yarn link ${packageName} || true`));

const envFileData = JSON.stringify(envData, null, 2);

echo(envFileData);
fs.writeFileSync(`${rootDir}/.current-env`, envFileData);
