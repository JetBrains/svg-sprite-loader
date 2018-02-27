const Chunk = require('webpack/lib/Chunk');
const Promise = require('bluebird');
const Sprite = require('svg-baker/lib/sprite');

/**
 * Because of extract-text-webpack-plugin interop returns just absolute path to filepath
 * @param {string} filepath
 * @return {string}
 */
function createSprite(fileNames, itemsBySprite, compilation, factory) {
  return Promise.map(fileNames, (fileName) => {
    const spriteSymbols = itemsBySprite[fileName].map(item => item.symbol);

    return Sprite
      .create({
        symbols: spriteSymbols,
        factory
      })
      .then((sprite) => {
        const content = sprite.render();
        const chunkName = fileName.replace(/\.svg$/, '');
        const chunk = new Chunk(chunkName);
        chunk.ids = [];
        chunk.files.push(fileName);

        compilation.assets[fileName] = {
          source() { return content; },
          size() { return content.length; }
        };

        compilation.chunks.push(chunk);
      });
  });
}

module.exports = createSprite;
