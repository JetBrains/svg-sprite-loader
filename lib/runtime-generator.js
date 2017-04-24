const { stringifyRequest } = require('loader-utils');
const {
  stringify,
  stringifySymbol,
  generateImport,
  generateExport,
  generateSpritePlaceholder
} = require('./utils');

/**
 * @param {Object} params
 * @param {SpriteSymbol} params.symbol Sprite symbol instance {@see https://git.io/v9k8g}
 * @param {Object} params.config Parsed loader config {@see SVGSpriteLoaderConfig}
 * @param {string} params.context Loader context {@see https://webpack.js.org/api/loaders/#the-loader-context}
 * @return {string}
 */
function runtimeGenerator({ symbol, config, context }) {
  const { extract, esModule, spriteModule, symbolModule } = config;
  let runtime;

  if (extract) {
    const spritePlaceholder = generateSpritePlaceholder(symbol.request.toString());

    runtime = generateExport(
      stringify(spritePlaceholder),
      esModule
    );
  } else {
    const spriteRequest = stringifyRequest({ context }, spriteModule);
    const symbolRequest = stringifyRequest({ context }, symbolModule);

    runtime = [
      generateImport('SpriteSymbol', symbolRequest, esModule),
      generateImport('sprite', spriteRequest, esModule),

      `var symbol = new SpriteSymbol(${stringifySymbol(symbol)})`,
      'sprite.add(symbol)',

      generateExport('symbol', esModule)
    ].join(';\n');
  }

  return runtime;
}

module.exports = runtimeGenerator;
