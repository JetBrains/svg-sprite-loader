const replaceSpritePlaceholder = require('./replace-sprite-placeholder');

/**
 * @param {NormalModule|ExtractedModule} module
 * @param {Object<string, string>} replacements
 * @return {NormalModule|ExtractedModule}
 */
function replaceInModuleSource(module, replacements) {
  const source = module._source;

  if (typeof source === 'string') {
    module._source = replaceSpritePlaceholder(source, replacements);
  } else if (typeof source === 'object' && typeof source._value === 'string') {
    source._value = replaceSpritePlaceholder(source._value, replacements);
    source._valueAsBuffer = undefined;
    source._valueAsString = undefined;
  }

  return module;
}

module.exports = replaceInModuleSource;
