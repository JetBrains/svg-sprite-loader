const path = require('path');
const pascalCase = require('pascal-case');
const { stringifyRequest } = require('loader-utils');
const { stringifySymbol, stringify } = require('../../lib/utils');

module.exports = function runtimeGenerator({ symbol, config, context, loaderContext }) {
  const { spriteModule, symbolModule, runtimeOptions } = config;
  const compilerContext = loaderContext._compiler.context;

  const iconModulePath = path.resolve(compilerContext, runtimeOptions.iconModule);
  const iconModuleRequest = stringify(
    path.relative(path.dirname(symbol.request.file), iconModulePath)
  );

  const spriteRequest = stringifyRequest({ context }, spriteModule);
  const symbolRequest = stringifyRequest({ context }, symbolModule);
  const displayName = `${pascalCase(symbol.id)}Icon`;

  return `
    import React, {PureComponent} from 'react';
    import SpriteSymbol from ${symbolRequest};
    import sprite from ${spriteRequest};
    import Icon from ${iconModuleRequest};
    
    const symbol = new SpriteSymbol(${stringifySymbol(symbol)});
    sprite.add(symbol);
    
    export default class ${displayName} extends Icon {}
    
    ${displayName}.defaultProps.glyph = '${symbol.id}';
  `;
};
