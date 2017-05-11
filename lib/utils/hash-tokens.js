const { getHashDigest } = require('loader-utils');

/**
 * Custom `[hash-*]` tokens interpolator
 * @param {string} input
 * @param {Object<name: string, content: string>} tokens
 * @return {string}
 * @example
 *   hashTokens('[chunkname]-[spritehash:6]', { spritehash: '<svg>...</svg>' })
 *   // => '[chunkname]-8e04fd'
 */
module.exports = function hashTokens(input, tokens) {
  let result = input;

  Object.keys(tokens).forEach((key) => {
    const content = tokens[key];
    /**
     * @see https://github.com/webpack/loader-utils/blob/fface/lib/interpolateName.js#L65
     */
    const re = new RegExp(`\\[(?:(\\w+):)?${key}(?::([a-z]+\\d*))?(?::(\\d+))?]`, 'ig');

    result = result.replace(re, (all, hashType, digestType, maxLength) => {
      return getHashDigest(content, hashType, digestType, parseInt(maxLength, 10));
    });
  });

  return result;
};
