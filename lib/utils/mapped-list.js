const loaderDefaults = require('../config').loader;
const getAllModules = require('./get-all-modules');
const isModuleShouldBeExtracted = require('./is-module-should-be-extracted');
const getLoaderOptions = require('./get-loader-options');
const getLoadersRules = require('./get-loaders-rules');
const getMatchedRule = require('./get-matched-rule');
const getModuleChunk = require('./get-module-chunk');
const hashTokens = require('./hash-tokens');

const spriteLoaderPath = require.resolve('../loader');

class MappedListItem {
  /**
   * @param {SpriteSymbol} symbol
   * @param {NormalModule} module
   * @param {string} spriteFilename
   */
  constructor(symbol, module, spriteFilename) {
    this.symbol = symbol;
    this.module = module;
    this.spriteFilename = spriteFilename;
    this.resource = symbol.request.file;
  }

  get url() {
    const { spriteFilename, symbol } = this;
    return `${spriteFilename}#${symbol.id}`;
  }

  get useUrl() {
    const { spriteFilename, symbol } = this;
    return `${spriteFilename}#${symbol.useId}`;
  }
}

class MappedList {
  /**
   * @param {SpriteSymbol[]} symbols
   * @param {Compilation} compilation
   */
  constructor(symbols, compilation) {
    const { compiler } = compilation;

    this.symbols = symbols;
    this.rules = getLoadersRules(compiler);
    this.allModules = getAllModules(compilation);
    this.spriteModules = this.allModules.filter(isModuleShouldBeExtracted);

    this.items = this.create();
  }

  /**
   * @param {MappedListItem[]} data
   * @return {Object<string, MappedListItem>}
   */
  static groupSymbolsBySprite(data) {
    return data
      .map(item => item.spriteFilename)
      .filter((value, index, self) => self.indexOf(value) === index)
      .reduce((acc, spriteFilename) => {
        acc[spriteFilename] = data.filter(item => item.spriteFilename === spriteFilename);
        return acc;
      }, {});
  }

  /**
   * @param {MappedListItem[]} data
   * @param {Function} [mapper] Custom grouper function
   * @return {Object<string, MappedListItem>}
   */
  static groupSpritesBySymbol(data, mapper) {
    return data.reduce((acc, item) => {
      if (mapper) {
        mapper(acc, item);
      } else {
        acc[item.resource] = item;
      }
      return acc;
    }, {});
  }

  /**
   * @return {MappedListItem[]}
   */
  create() {
    const { symbols, spriteModules, allModules, rules } = this;
    const data = symbols.reduce((acc, symbol) => {
      const resource = symbol.request.file;
      const module = spriteModules.find(m => m.resource === resource);
      const rule = getMatchedRule(resource, rules);
      const options = rule ? getLoaderOptions(spriteLoaderPath, rule) : null;
      let spriteFilename = (options && options.spriteFilename)
        ? options.spriteFilename
        : loaderDefaults.spriteFilename;

      const chunk = module ? getModuleChunk(module, allModules) : null;
      if (chunk) {
        spriteFilename = spriteFilename.replace('[chunkname]', chunk.name);
      }

      if (rule && module) {
        acc.push(new MappedListItem(symbol, module, spriteFilename));
      }

      return acc;
    }, []);

    // Additional pass to interpolate hash in spriteFilename
    const itemsBySpriteFilename = MappedList.groupSymbolsBySprite(data);
    const filenames = Object.keys(itemsBySpriteFilename);

    filenames.forEach((filename) => {
      const items = itemsBySpriteFilename[filename];
      const spriteSymbols = items.map(item => item.symbol);
      const content = spriteSymbols.map(s => s.render()).join('');
      const interpolatedName = hashTokens(filename, { spritehash: content });

      items
        .filter(item => item.spriteFilename !== interpolatedName)
        .forEach(item => item.spriteFilename = interpolatedName);
    });

    return data;
  }

  /**
   * @return {Object<string, MappedListItem>}
   */
  groupSymbolsBySprite() {
    return MappedList.groupSymbolsBySprite(this.items);
  }

  /**
   * @param {Function} [mapper] Custom grouper function
   * @return {Object<string, MappedListItem>}
   */
  groupSpritesBySymbol(mapper) {
    return MappedList.groupSpritesBySymbol(this.items, mapper);
  }
}

module.exports = MappedList;
