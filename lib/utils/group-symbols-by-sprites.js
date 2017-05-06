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

module.exports = groupSymbolsBySprites;
