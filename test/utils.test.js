/* eslint-disable no-unused-expressions */
const { strictEqual, ok } = require('assert');
const { loaderPath } = require('./_utils');
const {
  generateSpritePlaceholder,
  replaceSpritePlaceholder,
  replaceInModuleSource,
  isModuleShouldBeExtracted,
  getMatchedRule,
  getLoadersRules,
  webpack1
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
    const optionsProp = webpack1 ? 'query' : 'options';

    isModuleShouldBeExtracted({
      request,
      loaders: [{ loader: loaderPath }]
    }).should.be.false;

    isModuleShouldBeExtracted({
      request,
      loaders: [{ loader: loaderPath, [optionsProp]: { extract: true } }]
    }).should.be.true;

    // webpack 1 format
    isModuleShouldBeExtracted({
      request,
      loaders: [`${loaderPath}?extract=true`]
    }).should.be.true;

    isModuleShouldBeExtracted({
      request,
      loaders: [{ loader: loaderPath }],
      issuer: { resource: 'style.css' }
    }).should.be.true;
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

  describe('getLoadersRules', () => {
    const rules = [{ test: /\.svg$/, loader: 'tralala-loader' }];
    let compilerMock;

    beforeEach(() => {
      compilerMock = {
        options: {
          module: {}
        }
      };
    });

    it('should work with webpack 1', () => {
      compilerMock.options.module.loaders = rules;
      getLoadersRules(compilerMock).should.be.deep.equal(rules);
    });

    it('should work with webpack 2', () => {
      compilerMock.options.module.rules = rules;
      getLoadersRules(compilerMock).should.be.deep.equal(rules);
    });
  });
});
