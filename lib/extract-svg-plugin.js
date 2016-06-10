var ExtractPlugin = require('extract-text-webpack-plugin');
var format = require('util').format;

var SVGDeclarationHeader = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs>';
var SVGDeclarationFooter = '</defs></svg>';

function ExtractSVGPlugin(id, filename, options) {
  this.id = id;
  this.filename = filename;
  this.options = options;
  this.initExtractPlugin();
}

ExtractSVGPlugin.extract = ExtractPlugin.extract;

ExtractSVGPlugin.prototype.initExtractPlugin = function () {
  if (!this.extractPlugin) {
    this.extractPlugin = new ExtractPlugin(this.id, this.filename, this.options);
    this.extract = this.extractPlugin.extract.bind(this.extractPlugin);
  }
  return this.extractPlugin;
}

ExtractSVGPlugin.prototype.apply = function (compiler) {
  var extractPlugin = this.initExtractPlugin();

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
