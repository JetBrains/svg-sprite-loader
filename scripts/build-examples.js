/* eslint-disable global-require,import/no-dynamic-require,import/no-extraneous-dependencies,no-console */
const path = require('path');
const glob = require('glob');
const { exec, echo } = require('shelljs');

const projectDir = path.resolve(__dirname, '..');

const configsPaths = glob.sync(
  `${projectDir}/examples/*/webpack.config.js`,
  { nodir: true, absolute: true }
);

configsPaths.forEach((configPath) => {
  const dirname = path.basename(path.dirname(configPath));
  const result = exec(
    `node ${projectDir}/node_modules/webpack/bin/webpack.js --config ${configPath}`,
    { silent: true }
  );

  if (result.code === 0) {
    echo(`Example "${dirname}" successfully built`);
  } else {
    echo(result);
    process.exit(result.code);
  }
});
