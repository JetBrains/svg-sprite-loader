var ExtractPlugin = require('extract-text-webpack-plugin');
var ConcatSource = require("webpack-sources").ConcatSource;

var SVGDeclarationHeader = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs>';
var SVGDeclarationFooter = '</defs></svg>';

function ExtractSVGPlugin() {
  ExtractPlugin.apply(this, arguments);
}

ExtractSVGPlugin.extract = ExtractPlugin.extract;

ExtractSVGPlugin.prototype = Object.create(ExtractPlugin.prototype);

ExtractSVGPlugin.prototype.renderExtractedChunk = function(chunk) {
  var source = ExtractPlugin.prototype.renderExtractedChunk.call(this, chunk);

  source.children.unshift(SVGDeclarationHeader);
  source.children.push(SVGDeclarationFooter);

	return source;
};

module.exports = ExtractSVGPlugin;
