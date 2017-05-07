const { getHashDigest } = require('loader-utils');

/**
 * Partially stolen from loader-utils#interpolateName
 * @param {string} input
 * @param {Object<string, string>} tokensToHash
 * @return {string}
 * @see https://github.com/webpack/loader-utils#interpolatename
 * @example
 *   hashTokens('[chunkname]-[spritehash:6]', { spritehash: '<svg>...</svg>' })
 *   // => '[chunkname]-8e04fd'
 */
module.exports = function hashTokens(input, tokensToHash) {
  let result = input;

  Object.keys(tokensToHash).forEach((key) => {
    const content = tokensToHash[key];
    // eslint-disable-next-line no-useless-escape
    const re = new RegExp(`\\[(?:(\\w+):)?${key}(?::([a-z]+\\d*))?(?::(\\d+))?]`, 'ig');

    result = result.replace(re, (all, hashType, digestType, maxLength) => {
      return getHashDigest(content, hashType, digestType, parseInt(maxLength, 10));
    });
  });

  return result;
};
