/* eslint-disable no-unused-expressions */
const { strictEqual, ok } = require('assert');
const { loaderPath } = require('./_config');
const {
  generateSpritePlaceholder,
  replaceSpritePlaceholder,
  replaceInModuleSource,
  isModuleShouldBeExtracted,
  getMatchedRule,
  isWebpack1
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
    const optionsProp = isWebpack1 ? 'query' : 'options';

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
    const compilerMock = {
      options: {
        module: {
          rules: [
            { test: /\.svg$/, loader: 'svg-sprite-loader', options: { extra: true } },
            { test: /\.svg$/, loader: 'another-loader' },
            { test: /\.foo$/, loader: 'foo-loader' }
          ]
        }
      }
    };

    const compilerMock2 = {
      options: {
        module: {
          rules: [
            {
              test: /\.svg$/,
              use: [
                { loader: 'svg-sprite-loader', options: { extra: true, a: 1 } },
                'svgo-loader'
              ]
            },
            { test: /\.svg$/, loader: 'another-loader' },
            { test: /\.foo$/, loader: 'foo-loader' }
          ]
        }
      }
    };

    it('should get the right options', () => {
      const rule = getMatchedRule(compilerMock);
      rule.should.be.deep.equal({ extra: true });
    });

    it('should get the right options when mutiple loader', () => {
      const rule = getMatchedRule(compilerMock2);
      rule.should.be.deep.equal({ extra: true, a: 1 });
    });
  });
});
