var ExtractPlugin = require('extract-text-webpack-plugin');
var format = require('util').format;

var SVGDeclarationHeader = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs>';
var SVGDeclarationFooter = '</defs></svg>';

function ExtractSVGPlugin(id, filename, options) {
  this.id = id;
  this.filename = filename;
  this.options = options;
}

ExtractSVGPlugin.extract = ExtractPlugin.extract;

ExtractSVGPlugin.prototype.extract = ExtractPlugin.prototype.extract;

ExtractSVGPlugin.prototype.apply = function (compiler) {
  var id = this.id;
  var filename = this.filename;
  var options = this.options;
  var extractPlugin = new ExtractPlugin(id, filename, options);

  compiler.apply(extractPlugin);

  compiler.plugin('emit', function (compilation, done) {
    var filename = extractPlugin.filename;

    if (filename.match(/\[(name|id|contenthash)\]/) !== null) {
      throw new Error('Placeholders in filename is not supported');
    }

    if (!(filename in compilation.assets)) {
      throw new Error(format('There is no %s in compiled assets. Check file name', filename));
    }

    var source = compilation.assets[filename];
    source.children.unshift(SVGDeclarationHeader);
    source.children.push(SVGDeclarationFooter);

    done();
  });
};

module.exports = ExtractSVGPlugin;