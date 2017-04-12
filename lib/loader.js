const fs = require('fs');
const { interpolateName, getOptions } = require('loader-utils');
const urlSlug = require('url-slug');

const utils = require('./utils');
const configure = require('./configurator');
const generators = require('./runtime-generator');

const NAMESPACE = fs.realpathSync(__dirname);

// eslint-disable-next-line consistent-return
module.exports = function loader(content) {
  this.cacheable();

  const done = this.async();
  const loaderContext = this;
  const compiler = loaderContext._compiler;
  const parentCompiler = compiler.isChild() ? compiler.parentCompilation.compiler : null;

  // Find plugin
  const plugin = parentCompiler
    ? parentCompiler.options.plugins.find(p => p.NAMESPACE && p.NAMESPACE === NAMESPACE)
    : this[NAMESPACE];

  if (plugin === undefined) {
    throw new Error('svg-sprite-loader is used without the corresponding plugin');
  }

  // TODO warn if other loaders after this in extract mode

  const { store } = plugin;
  const { resourcePath, resourceQuery, context } = loaderContext;
  const config = configure({
    config: getOptions(loaderContext),
    context: loaderContext
  });
  const idPattern = config.symbolId + (resourceQuery ? `--${urlSlug(resourceQuery)}` : '');
  const id = interpolateName(loaderContext, idPattern, { content, context });

  const generateRuntime = generators[config.runtime];
  if (!generateRuntime) {
    throw new Error(`Invalid runtime "${config.runtime}", possible values: ${Object.keys(generators).join(', ')}`);
  }

  store.addSymbol({ id, content, path: resourcePath + resourceQuery })
    .then((symbol) => {
      const runtime = generateRuntime({ symbol, config, context: loaderContext });
      const result = [
        runtime.content,
        utils.generateExport(runtime.export, config.esModule)
      ].join('\n');

      done(null, result);
    }).catch(done);
};

module.exports.NAMESPACE = NAMESPACE;
