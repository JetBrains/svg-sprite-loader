function generateSprites(plugin) {
  const itemsBySprite = plugin.map.groupItemsBySpriteFilename();

  const sprites = {};

  itemsBySprite.forEach((fileName) => {
    sprites[fileName] = plugin.assets[fileName].source();
  });

  return sprites;
}

module.exports = generateSprites;
