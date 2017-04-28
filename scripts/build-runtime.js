/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const Promise = require('bluebird');
const rollup = require('rollup');
const resolvePlugin = require('rollup-plugin-node-resolve');
const commonjsPlugin = require('rollup-plugin-commonjs');
const bublePlugin = require('rollup-plugin-buble');

const root = path.resolve(__dirname, '..');
const runtimeDir = path.resolve(root, 'runtime');

const entries = [
  {
    src: `${runtimeDir}/sprite.js`,
    dest: `${runtimeDir}/sprite.build.js`,
    moduleName: 'Sprite'
  },
  {
    src: `${runtimeDir}/browser-sprite.js`,
    dest: `${runtimeDir}/browser-sprite.build.js`,
    moduleName: 'BrowserSprite'
  }
];

Promise.map(entries, ({ src, dest, moduleName }) => {
  return rollup.rollup({
    entry: src,
    plugins: [
      resolvePlugin(),
      commonjsPlugin(),
      bublePlugin()
    ]
  }).then((bundle) => {
    return bundle.write({
      dest,
      moduleName,
      format: 'umd'
    });
  });
});
