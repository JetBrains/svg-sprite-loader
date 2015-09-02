/**
 * Based on grunt-svg-store
 * @see https://github.com/FWeinb/grunt-svgstore/blob/master/tasks/svgstore.js
 */

var extend = require('extend');
var cheerio = require('cheerio');
var optimize = require('./optimize');

/**
 * @enum
 */
var OUTPUT = {
  SVG: 'svg',
  SYMBOL: 'symbol'
};

/**
 * @typedef {{
 *   id: String|null,
 *   prefix: String|null,
 *   optimize: boolean,
 *   output: string
 * }} processingConfig
 */
var defaultConfig = {
  id: null,
  prefix: null,
  optimize: true,
  output: OUTPUT.SVG
};

// Matching an url() reference. To correct references broken by making ids unique to the source svg
var urlPattern = /url\(\s*#([^ ]+?)\s*\)/g;

/**
 * @param {String} content
 * @param {processingConfig} config
 * @returns {String}
 */
module.exports = function (content, config) {
  /** @type processingConfig */
  var config = extend({}, defaultConfig, config);

  if (config.optimize)
    content = optimize(content, typeof config.optimize === 'boolean' ? null : config.optimize);

  var $ = cheerio.load(content, {normalizeWhitespace: true, xmlMode: true});
  var $svg = $('svg');

  // viewBox
  var viewBox = $svg.attr('viewBox');
  var width = $svg.attr('width');
  var height = $svg.attr('height');
  if (!viewBox && width && height)
    $svg.attr('viewBox', [0, 0, parseFloat(width), parseFloat(height)].join(' '));

  // Prefix
  if (config.prefix) {
    // Map to store references from id to uniqueId + id;
    var mappedIds = {};

    $('[id]').each(function() {
      var $elem = $(this);
      var id = $elem.attr('id');
      var newId = config.prefix + id;
      mappedIds[id] = {
        id: newId,
        referenced: false,
        $elem: $elem
      };
      $elem.attr('id', newId);
    });

    $('*').each(function () {
      var $elem = $(this);
      var attrs = $elem.attr();

      Object.keys(attrs).forEach(function (key) {
        var value = attrs[key];
        var id;
        var match;

        while ((match = urlPattern.exec(value)) !== null) {
          id = match[1];
          if (!!mappedIds[id]) {
            mappedIds[id].referenced = true;
            $elem.attr(key, value.replace(match[0], 'url(#' + mappedIds[id].id + ')'));
          }
        }

        if (key === 'xlink:href') {
          id = value.substring(1);
          var idObj = mappedIds[id];
          if (!!idObj) {
            idObj.referenced = false;
            $elem.attr(key, '#' + idObj.id);
          }
        }
      });
    });
  }

  // id
  if (config.id) $svg.attr('id', config.id);

  var result;
  switch (config.output) {
    case OUTPUT.SVG:
      result = $.html();
      break;

    case OUTPUT.SYMBOL:
      var attrs = [];
      $svg.attr('viewBox') && attrs.push('viewBox="'+ $svg.attr('viewBox') +'"');
      $svg.attr('id') && attrs.push('id="' + $svg.attr('id') + '"');
      result = '<symbol '+ attrs.join(' ') + '>' + $svg.html() + '</symbol>';
      break;
  }

  return result;
};

module.exports.OUTPUT = OUTPUT;