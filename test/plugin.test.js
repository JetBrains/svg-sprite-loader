const { strictEqual, ok } = require('assert');
const { compile, fixturesPath, loaderPath } = require('./tests-utils');
const Plugin = require('../lib/plugin');

describe('plugin', () => {
  it('works ok', (done) => {
    compile({
      entry: './styles.css',
      module: {
        rules: [
          {
            test: /\.svg$/,
            loader: loaderPath,
            options: {
              extract: true,
              spriteFilename: '[chunkname].svg'
            }
          },
          {
            test: /\.css$/,
            loader: 'css-loader'
          }
        ]
      },
      plugins: [new Plugin()]
    }).then(e => {
      debugger;
      done()
    })

  });
});
