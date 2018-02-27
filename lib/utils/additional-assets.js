const createSprite = require('./create-sprite');

function additionalAssets(plugin, compilation) {
  const itemsBySprite = plugin.map.groupItemsBySpriteFilename();
  const fileNames = Object.keys(itemsBySprite);

  return createSprite(fileNames, itemsBySprite, compilation, plugin.factory);
}

module.exports = additionalAssets;
