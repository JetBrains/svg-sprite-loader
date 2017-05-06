const loaderDefaults = require('../config').loader;
const getAllModules = require('./get-all-modules');
const isModuleShouldBeExtracted = require('./is-module-should-be-extracted');
const getLoaderOptions = require('./get-loader-options');
const getLoadersRules = require('./get-loaders-rules');
const getMatchedRule = require('./get-matched-rule');
const getModuleChunk = require('./get-module-chunk');
const interpolateSpriteFilename = require('./interpolate-sprite-filename');

const spriteLoaderPath = require.resolve('../loader');

  /**
 * @param {SpriteSymbol[]} symbols
 * @param {Compilation} compilation
 * @return {Object<string, Object<module: NormalModule[], spriteFilename: string>>[]}
 */
function aggregate(symbols, compilation) {
  const { compiler } = compilation;
  const allModules = getAllModules(compilation);
  const modules = allModules.filter(isModuleShouldBeExtracted);
  const publicPath = compiler.options.output.publicPath || '';
  const rules = getLoadersRules(compiler);
  const aggregated = [];

  return symbols.reduce((acc, symbol) => {
    const resource = symbol.request.toString();
    const module = modules.find(m => m.resource === resource);
    const rule = getMatchedRule(symbol.request.file, rules);

    if (module && rule) {
      // webpack 1 compat
      const options = getLoaderOptions(spriteLoaderPath, rule);
      const spriteFilenameOption = (options && options.spriteFilename) ?
        options.spriteFilename :
        loaderDefaults.spriteFilename;
      const chunk = getModuleChunk(module, allModules);

      const spriteFilename = interpolateSpriteFilename(spriteFilenameOption, {
        chunkName: chunk.name
      });

      acc.push({
        symbol,
        module,
        resource,
        spriteFilename,
        url: `${publicPath}${spriteFilename}#${symbol.id}`,
        useUrl: `${publicPath}${spriteFilename}#${symbol.useId}`
      });
    }

    return acc;
  }, aggregated);
}

module.exports = aggregate;
