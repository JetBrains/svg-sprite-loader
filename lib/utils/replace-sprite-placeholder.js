const isWindows = /^win/i.test(process.platform);

/**
 * @param {string} content
 * @param {Object<string, string>} replacements
 * @return {string}
 */
function replaceSpritePlaceholder(content, replacements) {
  let result = content;
  Object.keys(replacements)
    .forEach((subj) => {
      result = result.replace(subj, replacements[subj]);

      if (isWindows) {
        result = result.replace(/\\\\/g, '\\').replace(subj, replacements[subj]);
      }
    });

  return result;
}

module.exports = replaceSpritePlaceholder;
