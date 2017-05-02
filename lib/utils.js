// eslint-disable-next-line import/no-extraneous-dependencies
const webpackPkg = require('webpack/package.json');
// eslint-disable-next-line import/no-extraneous-dependencies
const ruleMatcher = require('webpack/lib/ModuleFilenameHelpers').matchObject;
const { parseQuery } = require('loader-utils');

const defaults = require('./config');

const loaderDefaults = defaults.loader;
const spriteLoaderPath = require.resolve('./loader');
const stringifiedRegexp = /^'|".*'|"$/;

const webpackMajorVersion = parseInt(webpackPkg.version.split('.')[0], 10);
module.exports.webpackMajorVersion = webpackMajorVersion;

const webpack1 = webpackMajorVersion === 1;
module.exports.webpack1 = webpack1;

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

module.exports.stringify = stringify;

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

module.exports.stringifySymbol = stringifySymbol;

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

module.exports.replaceSpritePlaceholder = replaceSpritePlaceholder;

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

module.exports.replaceInModuleSource = replaceInModuleSource;

/**
 * @param {string} filepath
 * @return {string}
 */
function generateSpritePlaceholder(filepath) {
  return `{{sprite-filename|${filepath}}}`;
}

module.exports.generateSpritePlaceholder = generateSpritePlaceholder;

/**
 * @param {string} symbol - Symbol name
 * @param {string} module - Module name
 * @param {boolean} esModule
 * @return {string}
 */
function generateImport(symbol, module, esModule = loaderDefaults.esModule) {
  return esModule ?
    `import ${symbol} from ${stringify(module)}` :
    `var ${symbol} = require(${stringify(module)})`;
}

module.exports.generateImport = generateImport;

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

module.exports.generateExport = generateExport;

/**
 * webpack 1 compat rule normalizer
 * @param {string|Rule} rule (string - webpack 1, Object - webpack 2)
 * @return {Object<loader: string, options: Object|null>}
 */
function normalizeRule(rule) {
  if (!rule) {
    throw new Error('Rule should be string or object');
  }

  let data;

  if (typeof rule === 'string') {
    const parts = rule.split('?');
    data = {
      loader: parts[0],
      options: parts[1] ? parseQuery(`?${parts[1]}`) : null
    };
  } else {
    const options = webpack1 ? rule.query : rule.options;
    data = {
      loader: rule.loader,
      options: options || null
    };
  }

  return data;
}

module.exports.normalizeRule = normalizeRule;

/**
 * @param {NormalModule} module
 * @return {boolean}
 */
function isModuleShouldBeExtracted(module) {
  const { request, issuer, loaders } = module;
  let rule = null;

  if (Array.isArray(loaders) && loaders.length > 0) {
    // Find loader rule
    rule = loaders.map(normalizeRule).find(data => data.loader === spriteLoaderPath);
  }

  let issuerResource = null;
  if (issuer) {
    // webpack 1 compat
    issuerResource = typeof issuer === 'string' ? issuer : issuer.resource;
  }

  if (request && (!request.includes(spriteLoaderPath) || !rule)) {
    return false;
  }

  return !!(
    (issuer && defaults.EXTRACTABLE_MODULE_ISSUER_PATTERN.test(issuerResource)) ||
    (rule && rule.options && rule.options.extract)
  );
}

module.exports.isModuleShouldBeExtracted = isModuleShouldBeExtracted;

/**
 * @param {Compiler} compiler
 * @return {Rule[]}
 */
function getLoadersRules(compiler) {
  const moduleConfig = compiler.options.module;
  // webpack 1 compat
  return moduleConfig.rules || moduleConfig.loaders;
}

module.exports.getLoadersRules = getLoadersRules;

/**
 * @param {string} request
 * @param {Rule[]} rules Webpack loaders config
 * @return {Rule[]}
 */
function getMatchedRules(request, rules) {
  return rules.filter(rule => ruleMatcher(rule, request));
}

module.exports.getMatchedRules = getMatchedRules;

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

module.exports.getMatchedRule = getMatchedRule;

/**
 * webpack 1 compat loader options finder
 * @param {string} loaderPath
 * @param {Object|Rule} rule
 * @return {Object|null}
 */
function getLoaderOptions(loaderPath, rule) {
  const multiRuleProp = webpack1 ? 'loaders' : 'use';
  const multiRule = typeof rule === 'object' && Array.isArray(rule[multiRuleProp]) ? rule[multiRuleProp] : null;
  let options;

  if (multiRule) {
    options = multiRule.map(normalizeRule).find(r => r.loader === loaderPath).options;
  } else {
    options = normalizeRule(rule).options;
  }

  return options;
}

module.exports.getLoaderOptions = getLoaderOptions;

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

function getSizedMatch(replacement, str) {
  const size = parseInt((str.match(/\d/) || [])[0], 10);

  return (replacement || '').substr(0, size || replacement.length);
}

module.exports.getModuleChunk = getModuleChunk;

/**
 * // TODO implement [chunkhash]
 * @param {string} filename
 * @param {Object} options
 * @param {string} options.chunkName
 * @param {string} options.context
 * @param {string} options.fullHash
 * @param {string} options.content
 * @return {string}
 */
function interpolateSpriteFilename(filename, options) {
  return filename
    .replace(/\[hash(:\d)?]/g, getSizedMatch.bind(this, options.fullHash))
    .replace(/\[chunkname\]/g, options.chunkName);
}

module.exports.interpolateSpriteFilename = interpolateSpriteFilename;

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
        chunkName: chunk.name,
        fullHash: compilation.fullHash
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

module.exports.aggregate = aggregate;

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

module.exports.groupSymbolsBySprites = groupSymbolsBySprites;
