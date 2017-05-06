const escapeRegExpSpecialChars = require('escape-string-regexp');

/**
 * @param {string} content
 * @param {Object<string, string>} replacements
 * @return {string}
 */
function replaceSpritePlaceholder(content, replacements) {
  let result = content;
  Object.keys(replacements)
    .map((subj) => {
      return {
        subj,
        re: new RegExp(escapeRegExpSpecialChars(subj), 'g')
      };
    })
    .forEach(({ subj, re }) => {
      result = result.replace(re, replacements[subj]);
    });

  return result;
}

module.exports = replaceSpritePlaceholder;
