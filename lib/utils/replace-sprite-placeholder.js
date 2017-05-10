const escapeRegExpSpecialChars = require('escape-string-regexp');

const isWindows = /^win/i.test(process.platform);

/**
 * @param {string} content
 * @param {Object<string, string>} replacements
 * @return {string}
 */
function replaceSpritePlaceholder(content, replacements) {
  let result = content;
  Object.keys(replacements)
    .map((subj) => {
      const normalizedSubj = isWindows ? subj.replace(/\\/g, '\\\\') : subj;
      return {
        subj,
        re: new RegExp(escapeRegExpSpecialChars(normalizedSubj), 'g')
      };
    })
    .forEach(({ subj, re }) => {
      result = result.replace(re, replacements[subj]);
    });

  return result;
}

module.exports = replaceSpritePlaceholder;
