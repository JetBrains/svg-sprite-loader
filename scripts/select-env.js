const path = require('path');
const fs = require('fs');
const shell = require('shelljs');

const { cd, echo, exec } = shell;
const rootDir = path.resolve(__dirname, '..');
const env = process.argv[2];

if (!env) {
  throw new Error('env name should be provided as exclusive argument, e.g. node scripts/select-env webpack-1');
}
const envDir = path.resolve(rootDir, `${rootDir}/env/${env}`);
// eslint-disable-next-line import/no-dynamic-require
const packagesToLink = require(`${envDir}/package.json`).packagesToLink;

const envData = {
  name: env,
  linkedPackages: []
};

packagesToLink.forEach((packageName) => {
  const packageDir = `${envDir}/node_modules/${packageName}`;
  // eslint-disable-next-line import/no-dynamic-require,global-require
  const version = require(`${packageDir}/package.json`).version;
  envData.linkedPackages.push(`${packageName}@${version}`);

  cd(packageDir);
  exec('yarn unlink || true');
  exec('yarn link');
});

cd(rootDir);
packagesToLink.forEach(packageName => exec(`yarn link ${packageName} || true`));

const envFileData = JSON.stringify(envData, null, 2);

fs.writeFileSync(`${rootDir}/.current-env`, envFileData);

echo(`
Env "${env}" was selected, linked packages are:
 
 - ${envData.linkedPackages.join('\n - ')}

Data saved in ${rootDir}/.current-env
`);
