var path = require('path');
var crypto = require('crypto');

exports.objectToAttrString = function (obj) {
  if (Object.prototype.toString.call(obj) !== '[object Object]')
    throw new TypeError('Must be an object');

  return Object.keys(obj)
    .map(function (key) {
      return key + '="' + obj[key] + '"';
    }).join(' ');
};

exports.isRasterImage = function (imagepath) {
  var re = /\.(jpe?g|png|gif)$/i;
  return re.test(imagepath);
};

exports.getPixelRatioFromFilename = function (filename) {
  var ratioMatch = filename.substring(0, filename.lastIndexOf('.')).match(/\@([0-9])x$/);
  var ratio = ratioMatch !== null ? parseInt(ratioMatch[1]) : 1;
  return ratio;
};

/**
 * @param {String} filepath
 * @param {String} [pattern="name"] Naming pattern. Patterns `[name]` and `[pathhash]` supported
 * @returns {String}
 */
exports.generateIdFromFilepath = function (filepath, pattern) {
  var pattern = pattern || '[name]';
  var basename = path.basename(filepath);
  var basenameWithoutExt = basename.substr(0, basename.lastIndexOf('.'));
  var id;

  switch (pattern) {
    default:
    case '[name]':
      id = basenameWithoutExt;
      break;

    case '[pathhash]':
      id = crypto.createHash('md5').update(filepath).digest("hex");
      break;
  }

  return id;
};