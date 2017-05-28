/* eslint-disable global-require,import/no-dynamic-require,import/no-extraneous-dependencies,no-console */
const path = require('path');
const glob = require('glob');
const webpack = require('webpack');

const examplesDir = path.resolve(__dirname, '../examples');

glob.sync(`${examplesDir}/*/webpack.dll.config.js`, {
  nodir: true,
  absolute: true
}).forEach((p) => {
  const config = require(p);
  const exampleDir = path.basename(path.dirname(p));

  webpack(config, (err, stats) => {
    if (err) {
      throw err;
    }

    const msgs = [];
    const { errors, warnings } = stats.compilation;

    if (warnings.length > 0) {
      msgs.push(`BUILD EXAMPLES WARNINGS\n${warnings.map(w => w.message).join('\n\n')}`);
    }

    if (errors.length > 0) {
      msgs.push(`BUILD EXAMPLES ERRORS\n${errors.map(e => e.message).join('\n\n')}`);
    }

    if (msgs.length > 0) {
      throw new Error(msgs.join('\n'));
    }

    console.log(`${exampleDir} built`);
  });
});
