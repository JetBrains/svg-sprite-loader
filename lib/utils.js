/* eslint-disable import/no-extraneous-dependencies,no-trailing-spaces */
const ruleMatcher = require('webpack/lib/ModuleFilenameHelpers').matchObject;
const WEBPACK_VERSION = parseInt(require('webpack/package.json').version, 10);

const loaderPath = require.resolve('./loader');
const defaults = require('./config');

/**
 * @param {string} filepath
 * @return {string}
 */
function generateSpritePlaceholder(filepath) {
  return `[sprite-filename|${filepath}]`;
}

exports.generateSpritePlaceholder = generateSpritePlaceholder;

/**
 * @param {string} content
 * @param {Object<string, string>} replacements
 * @param {RegExp} [regexp]
 * @return {string}
 */
function replaceSpritePlaceholder(content, replacements) {
  const regexp = defaults.spritePlaceholderRegExp;
  return content.replace(regexp, (match, p1) => {
    return p1 ? replacements[p1] : match;
  });
}

exports.replaceSpritePlaceholder = replaceSpritePlaceholder;

/**
 * @param {string} content
 * @param {boolean} [esModule=false]
 * @return {string}
 */
function generateExport(content, esModule = false) {
  return esModule ?
    `module.exports.__esModule = true;\nmodule.exports["default"] = ${content};` :
    `module.exports = ${content};`;
}

exports.generateExport = generateExport;

/**
 * @param {SpriteSymbol} symbol
 * @return {string}
 */
function stringifySymbol(symbol) {
  return JSON.stringify({
    id: symbol.id,
    use: symbol.useId,
    viewBox: symbol.viewBox,
    content: symbol.render()
  });
}

exports.stringifySymbol = stringifySymbol;

/**
 * @param {NormalModule|ExtractedModule} module
 * @param {Object<string, string>} replacements
 * @return {NormalModule|ExtractedModule}
 */
function replaceInModule(module, replacements) {
  const source = module._source;

  if (typeof source === 'string') {
    module._source = replaceSpritePlaceholder(source, replacements);
  } else if (typeof source === 'object' && typeof source._value === 'string') {
    source._value = replaceSpritePlaceholder(source._value, replacements);
  }

  return module;
}

exports.replaceInModuleSource = replaceInModule;

/**
 * @param {NormalModule} module
 * @return {boolean}
 */
function isModuleShouldBeExtracted(module) {
  const { request, issuer, loaders } = module;
  const rule = loaders && loaders.find(l => l.loader === loaderPath);
  const issuerResource = issuer && issuer.resource;

  if (!request.includes(loaderPath) || !rule) {
    return false;
  }

  return !!(
    (rule.options && rule.options.extract) ||
    (issuer && defaults.extractIssuerRegExp.test(issuerResource))
  );
}

exports.isModuleShouldBeExtracted = isModuleShouldBeExtracted;

/**
 * @param {string} request
 * @param {Rule[]} rules Webpack loaders config
 * @return {Rule} Webpack rule
 */
function getMatchedRule(request, rules) {
  const matched = rules.filter(rule => ruleMatcher(rule, request));

  // always return last matched rule
  return matched[matched.length - 1];
}

exports.getMatchedRule = getMatchedRule;

/**
 * Find nearest module chunk (not sure that is reliable method, but who cares).
 * @see http://stackoverflow.com/questions/43202761/how-to-determine-all-module-chunks-in-webpack
 * @param {NormalModule} module
 * @return {Chunk?}
 */
function getModuleChunk(module) {
  const { chunks, issuer } = module;

  if (Array.isArray(chunks) && chunks.length > 0) {
    return chunks[chunks.length - 1];
  } else if (issuer) {
    return getModuleChunk(issuer);
  }

  return null;
}

exports.getModuleChunk = getModuleChunk;

/**
 * @param {SpriteSymbol[]} symbols
 * @param {Compilation} compilation
 * @return {Object<string, Object<module: NormalModule[], spriteFilename: string>>[]}
 */
function aggregate(symbols, compilation) {
  const { compiler } = compilation;
  const modules = compilation.modules.filter(isModuleShouldBeExtracted);
  const publicPath = compiler.options.output.publicPath || '';
  const rules = compiler.options.module['rules' || 'loaders'];

  const defaultSpriteFilename = defaults.loader.spriteFilename;
  const chunkNamePlaceholder = '[chunkname]';
  const aggregated = [];

  return symbols.reduce((aac, symbol) => {
    const resource = symbol.request.toString();
    const module = modules.find(m => m.resource === resource);
    const rule = getMatchedRule(symbol.request.file, rules);

    // TODO get spriteFilename from rule
    if (module && rule) {
      let spriteFilename = defaultSpriteFilename;

      if (spriteFilename.includes(chunkNamePlaceholder)) {
        const chunk = getModuleChunk(module);
        spriteFilename = spriteFilename.replace(chunkNamePlaceholder, chunk.name);
      }

      aac.push({
        symbol,
        module,
        resource,
        spriteFilename,
        url: `${publicPath}${spriteFilename}#${symbol.id}`,
        useUrl: `${publicPath}${spriteFilename}#${symbol.useId}`
      });
    }

    return aac;
  }, aggregated);
}

exports.aggregate = aggregate;

function groupSymbolsBySprites(aggregated) {
  return aggregated.map(item => item.spriteFilename)
    .filter((value, index, self) => self.indexOf(value) === index)
    .reduce((aac, spriteFilename) => {
      aac[spriteFilename] = aggregated
        .filter(item => item.spriteFilename === spriteFilename)
        .map(item => item.symbol);

      return aac;
    }, {});
}

exports.groupSymbolsBySprites = groupSymbolsBySprites;
