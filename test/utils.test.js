/* eslint-disable no-unused-expressions */
const { strictEqual, ok } = require('assert');
const { loaderPath } = require('./tests-utils');
const {
  generateSpritePlaceholder,
  replaceSpritePlaceholder,
  replaceInModuleSource,
  getAffectedModules,
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

  describe('getAffectedModules', () => {
    const fixtures = [
      { request: `${loaderPath}!./img.svg` },
      { request: 'css-loader!./img.svg' }
    ];

    it('should work like a charm', () => {
      const res = getAffectedModules(fixtures);
      strictEqual(res.length, 1);
      strictEqual(res[0], fixtures[0]);
    });
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
