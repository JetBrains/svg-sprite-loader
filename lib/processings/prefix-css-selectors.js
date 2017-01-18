var postcss = require('postcss');

var prefixSelectorPlugin = postcss.plugin('postcss-prefix-selectors', function (prefix) {
  return function (css, result) {
    css.walkRules(function (rule) {
      rule.selector = prefix + ' ' + rule.selector;
    });
  };
});

module.exports = function (doc, prefix) {
  var $ = doc.$;

  $('style').each(function () {
    var $elem = $(this);
    var content = $elem.text();

    content = postcss([prefixSelectorPlugin(prefix)]).process(content).css;

    $elem.text(content);
  });
}

