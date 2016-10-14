/**
 * Based on grunt-svg-store
 * @see https://github.com/FWeinb/grunt-svgstore/blob/master/tasks/svgstore.js
 */

// Matching an url() reference. To correct references broken by making ids unique to the source svg
var urlPattern = /url\(\s*#([^ ]+?)\s*\)/g;

/**
 *
 * @param {SVGDocument} doc
 * @param prefix
 */
module.exports = function (doc, prefix) {
  var $ = doc.$;

  // Map to store references from id to uniqueId + id;
  var mappedIds = {};

  $('[id]').each(function () {
    var $elem = $(this);
    var id = $elem.attr('id');
    var newId = prefix + id;
    mappedIds[id] = {
      id: newId,
      referenced: false,
      $elem: $elem
    };
    $elem.attr('id', newId);
  });

  $('*').each(function () {
    var $elem = $(this);
    var isStyleTag = $elem[0].name === 'style';
    var attrs = $elem.attr();

    if (isStyleTag) {
      var content = $elem.text();
      var id;
      var match;

      while ((match = urlPattern.exec(content)) !== null) {
        id = match[1];
        if (!!mappedIds[id]) {
          mappedIds[id].referenced = true;
          content = content.replace(match[0], 'url(#' + mappedIds[id].id + ')');
        }
      }

      id && $elem.text(content);
    }

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
};
