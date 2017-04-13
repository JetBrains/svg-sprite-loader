/* eslint-disable no-unused-expressions */
const { strictEqual, ok } = require('assert');
const { loaderPath, notOk } = require('./tests-utils');
const {
  generateSpritePlaceholder,
  replaceSpritePlaceholder,
  replaceInModuleSource,
  isModuleShouldBeExtracted,
  getMatchedRule
} = require('../lib/utils');

describe('utils', () => {
  describe('generateSpritePlaceholder', () => {
    it('should work like a charm', () => {
      ok(generateSpritePlaceholder('tralala').includes('tralala'));
    });
  });

  describe('replaceSpritePlaceholder', () => {
    it('should work like a charm', () => {
      const fixture = generateSpritePlaceholder('foo');
      const replacements = { foo: 'bar' };
      const expected = 'bar';

      strictEqual(replaceSpritePlaceholder(fixture, replacements), expected);
      strictEqual(replaceSpritePlaceholder('qwe', replacements), 'qwe');
    });
  });

  describe('replaceInModuleSource', () => {
    const fixture = `module.exports = "${generateSpritePlaceholder('foo')}"`;
    const replacements = { foo: 'bar' };
    const expected = 'module.exports = "bar"';

    it('should replace if module source is text', () => {
      const mock = { _source: fixture };
      strictEqual(replaceInModuleSource(mock, replacements)._source, expected);
    });

    it('should replace if module source is object', () => {
      const mock = { _source: { _value: fixture } };
      strictEqual(replaceInModuleSource(mock, replacements)._source._value, expected);
    });
  });

  describe('isModuleShouldBeExtracted', () => {
    const request = `${loaderPath}!./img.svg`;

    notOk(isModuleShouldBeExtracted({
      request,
      loaders: [{ loader: loaderPath }]
    }));

    ok(isModuleShouldBeExtracted({
      request,
      loaders: [{ loader: loaderPath, options: { extract: true } }]
    }));

    ok(isModuleShouldBeExtracted({
      request,
      loaders: [{ loader: loaderPath }],
      issuer: { resource: 'style.css' }
    }));
  });

  describe('getMatchedRule', () => {
    const rules = [
      { test: /\.svg$/, loader: 'first-matched-loader' },
      { test: /\.svg$/, loader: 'second-matched-loader' },
      { test: /\.foo$/, loader: 'foo-loader' }
    ];

    it('should always return last matched rule', () => {
      strictEqual(getMatchedRule('image.svg', [rules[0]]), rules[0]);
      strictEqual(getMatchedRule('image.svg', rules), rules[1]);
    });
  });
});
