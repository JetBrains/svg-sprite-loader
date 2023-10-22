const imageSize = require('image-size');

/**
 * detect whether content is an image
 * @param {Buffer} content
 * @return {boolean}
 */
function isImage(content) {
  try {
    imageSize(content);
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * detect whether content is an image
 * @param {string} content
 * @return {boolean}
 */
function isSVG(content) {
  return content.includes('<svg');
}

exports.isImage = isImage;
exports.isSVG = isSVG;
