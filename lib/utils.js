/* eslint-disable import/no-extraneous-dependencies,no-trailing-spaces */
const webpackPkg = require('webpack/package.json');
const ruleMatcher = require('webpack/lib/ModuleFilenameHelpers').matchObject;
const defaults = require('./config');

const webpackMajorVersion = parseInt(webpackPkg.version.split('.')[0], 10);
const webpack1 = webpackMajorVersion === 1;
const loaderDefaults = defaults.loader;
const loaderPath = require.resolve('./loader');
const stringifiedRegexp = /^'|".*'|"$/;

/**
 * If already stringified - return original content
 * @param {Object|Array} content
 * @return {string}
 */
function stringify(content) {
  if (typeof content === 'string' && stringifiedRegexp.test(content)) {
    return content;
  }
  return JSON.stringify(content, null, 2);
}

/**
 * @param {SpriteSymbol} symbol
 * @return {string}
 */
function stringifySymbol(symbol) {
  return stringify({
    id: symbol.id,
    use: symbol.useId,
    viewBox: symbol.viewBox,
    content: symbol.render()
  });
}

/**
 * @param {string} content
 * @param {Object<string, string>} replacements
 * @return {string}
 */
function replaceSpritePlaceholder(content, replacements) {
  const regexp = defaults.SPRITE_PLACEHOLDER_PATTERN;
  return content.replace(regexp, (match, p1) => {
    return p1 ? replacements[p1] : match;
  });
}

/**
 * @param {NormalModule|ExtractedModule} module
 * @param {Object<string, string>} replacements
 * @return {NormalModule|ExtractedModule}
 */
function replaceInModuleSource(module, replacements) {
  const source = module._source;

  if (typeof source === 'string') {
    module._source = replaceSpritePlaceholder(source, replacements);
  } else if (typeof source === 'object' && typeof source._value === 'string') {
    source._value = replaceSpritePlaceholder(source._value, replacements);
  }

  return module;
}

/**
 * @param {string} filepath
 * @return {string}
 */
function generateSpritePlaceholder(filepath) {
  return `[sprite-filename|${filepath}]`;
}

function generateImport(symbol, module, esModule = loaderDefaults.esModule) {
  return esModule ?
    `import ${symbol} from ${stringify(module)}` :
    `var ${symbol} = require(${stringify(module)})`;
}

/**
 * @param {string} content
 * @param {boolean} [esModule=false]
 * @return {string}
 */
function generateExport(content, esModule = defaults.esModule) {
  return esModule ?
    `export default ${content}` :
    `module.exports = ${content}`;
}

/**
 * @param {NormalModule} module
 * @return {boolean}
 */
function isModuleShouldBeExtracted(module) {
  const { request, issuer, loaders } = module;
  let rule = null;

  if (Array.isArray(loaders) && loaders.length > 0) {
    rule = loaders.map((ruleData) => {
      let data = ruleData;

      // webpack 1 compat
      if (typeof ruleData === 'string') {
        const parts = ruleData.split('?');
        data = {
          loader: parts[0],
          options: parts[1] ? JSON.parse(parts[1]) : {}
        };
      }

      return data.loader === loaderPath ? data : null;
    }).filter(ruleData => ruleData !== null)[0];
  }

  let issuerResource = null;
  if (issuer) {
    // webpack 1 compat
    issuerResource = typeof issuer === 'string' ? issuer : issuer.resource;
  }

  if (request && (!request.includes(loaderPath) || !rule)) {
    return false;
  }

  return !!(
    (issuer && defaults.EXTRACTABLE_MODULE_ISSUER_PATTERN.test(issuerResource)) ||
    (rule && rule.options && rule.options.extract)
  );
}

/**
 * @param {Compiler} compiler
 * @return {Rule[]}
 */
function getLoadersRules(compiler) {
  // webpack 1 compat
  return compiler.options.module[webpack1 ? 'loaders' : 'rules'];
}

/**
 * @param {string} request
 * @param {Rule[]} rules Webpack loaders config
 * @return {Rule[]}
 */
function getMatchedRules(request, rules) {
  return rules.filter(rule => ruleMatcher(rule, request));
}

/**
 * Always returns last matched rule
 * @param {string} request
 * @param {Rule[]} rules Webpack loaders config
 * @return {Rule} Webpack rule
 */
function getMatchedRule(request, rules) {
  const matched = getMatchedRules(request, rules);
  return matched[matched.length - 1];
}

/**
 * Find nearest module chunk (not sure that is reliable method, but who cares).
 * @see http://stackoverflow.com/questions/43202761/how-to-determine-all-module-chunks-in-webpack
 * @param {NormalModule} module
 * @param {NormalModule[]} modules - webpack 1 compat
 * @return {Chunk?}
 */
function getModuleChunk(module, modules) {
  const { chunks } = module;
  // webpack 1 compat
  const issuer = typeof module.issuer === 'string' ?
    modules.find(m => m.request === module.issuer) :
    module.issuer;

  if (Array.isArray(chunks) && chunks.length > 0) {
    return chunks[chunks.length - 1];
  } else if (issuer) {
    return getModuleChunk(issuer);
  }

  return null;
}

/**
 * @param {SpriteSymbol[]} symbols
 * @param {Compilation} compilation
 * @return {Object<string, Object<module: NormalModule[], spriteFilename: string>>[]}
 */
function aggregate(symbols, compilation) {
  const { compiler } = compilation;
  const allModules = compilation.modules;
  const modules = allModules.filter(isModuleShouldBeExtracted);
  const publicPath = compiler.options.output.publicPath || '';
  const rules = getLoadersRules(compiler);

  const defaultSpriteFilename = loaderDefaults.spriteFilename;
  const chunkNamePlaceholder = '[chunkname]';
  const aggregated = [];

  return symbols.reduce((acc, symbol) => {
    const resource = symbol.request.toString();
    const module = modules.find(m => m.resource === resource);
    const rule = getMatchedRule(symbol.request.file, rules);

    // TODO get spriteFilename from rule
    if (module && rule) {
      // webpack 1 compat
      const options = webpack1 ? rule.query : rule.options;

      let spriteFilename = (options && options.spriteFilename) ?
        options.spriteFilename :
        defaultSpriteFilename;

      if (spriteFilename.includes(chunkNamePlaceholder)) {
        const chunk = getModuleChunk(module, allModules);
        spriteFilename = spriteFilename.replace(chunkNamePlaceholder, chunk.name);
      }

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

/**
 * @param {Object} aggregated {@see aggregate}
 * @return {Object<string, SpriteSymbol[]>}
 */
function groupSymbolsBySprites(aggregated) {
  return aggregated.map(item => item.spriteFilename)
    .filter((value, index, self) => self.indexOf(value) === index)
    .reduce((acc, spriteFilename) => {
      acc[spriteFilename] = aggregated
        .filter(item => item.spriteFilename === spriteFilename)
        .map(item => item.symbol);

      return acc;
    }, {});
}

exports.webpackMajorVersion = webpackMajorVersion;
exports.webpack1 = webpack1;

exports.stringify = stringify;
exports.stringifySymbol = stringifySymbol;
exports.replaceSpritePlaceholder = replaceSpritePlaceholder;
exports.replaceInModuleSource = replaceInModuleSource;

exports.generateSpritePlaceholder = generateSpritePlaceholder;
exports.generateImport = generateImport;
exports.generateExport = generateExport;

exports.isModuleShouldBeExtracted = isModuleShouldBeExtracted;
exports.getModuleChunk = getModuleChunk;
exports.getLoadersRules = getLoadersRules;
exports.getMatchedRules = getMatchedRules;
exports.getMatchedRule = getMatchedRule;

exports.aggregate = aggregate;
exports.groupSymbolsBySprites = groupSymbolsBySprites;
