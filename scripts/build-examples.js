/* eslint-disable global-require,import/no-dynamic-require,import/no-extraneous-dependencies */
const path = require('path');
const glob = require('glob');
const webpack = require('webpack');

const examplesDir = path.resolve(__dirname, '../examples');

glob.sync(`${examplesDir}/*/webpack.config.js`, {
  nodir: true,
  absolute: true
}).forEach((p) => {
  const config = require(p);
  webpack(config, (err) => {
    if (err) {
      throw err;
    }
  });
});
