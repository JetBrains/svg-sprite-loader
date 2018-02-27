const replaceSpritePlaceholder = require('./replace-sprite-placeholder');

function getReplacements(plugin, compilation, symbols, data) {
  const replacements = plugin.getReplacements(symbols, compilation);

  return replaceSpritePlaceholder(data.html, replacements);
}

module.exports = getReplacements;
