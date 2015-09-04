var SVGO = require('svgo');

/**
 * @param {String} content SVG content
 * @param {SVGOConfig} [config] SVGO configuration
 * @see https://github.com/svg/svgo/blob/master/docs/how-it-works/en.md#1-config
 * @returns {String}
 */
module.exports = function (content, config) {
  var svgo = new SVGO(config || {});
  var optimizedContent = null;

  svgo.optimize(content, function (result) {
    optimizedContent = result.data;
  });

  return optimizedContent;
};