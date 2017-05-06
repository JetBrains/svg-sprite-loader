/**
 * TODO implement [chunkhash]
 * @param {string} filename
 * @param {Object} options
 * @param {string} options.chunkName
 * @param {string} options.context
 * @param {string} options.content
 * @return {string}
 */
function interpolateSpriteFilename(filename, options) {
  return filename.replace(/\[chunkname\]/g, options.chunkName);
}

module.exports = interpolateSpriteFilename;
