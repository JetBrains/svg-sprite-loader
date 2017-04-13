const fs = require('fs');
const { interpolateName, getOptions } = require('loader-utils');
const urlSlug = require('url-slug');
const utils = require('./utils');
const configure = require('./configurator');
const generators = require('./runtime-generator');
const Exceptions = require('./exceptions');

const NAMESPACE = fs.realpathSync(__dirname);

// eslint-disable-next-line consistent-return
module.exports = function loader(content) {
  this.cacheable();

  const done = this.async();
  const loaderContext = this;
  const { resourcePath, resourceQuery, resource, context, loaderIndex } = loaderContext;
  const compiler = loaderContext._compiler;
  const isChildCompiler = compiler.isChild();
  const parentCompiler = isChildCompiler ? compiler.parentCompilation.compiler : null;

  // Find plugin
  const plugin = parentCompiler
    ? parentCompiler.options.plugins.find(p => p.NAMESPACE && p.NAMESPACE === NAMESPACE)
    : this[NAMESPACE];

  if (plugin === undefined) {
    throw new Exceptions.PluginMissingException();
  }

  const config = configure({
    config: getOptions(loaderContext),
    context: loaderContext
  });

  if (config.extract && loaderIndex > 0) {
    this.emitWarning(new Exceptions.RemainingLoadersInExtractModeException());
  }

  const matchedRules = utils.getMatchedRules(resource, utils.getLoadersConfig(compiler));
  if (matchedRules.length > 1 && !compiler.isChild()) {
    this.emitWarning(new Exceptions.SeveralRulesAppliedException(resource, matchedRules));
  }

  const runtimeGenerator = generators[config.runtime];
  if (!runtimeGenerator) {
    const possibleRuntimes = Object.keys(generators).join(', ');
    throw new Exceptions.InvalidRuntimeException(config.runtime, possibleRuntimes);
  }

  const idPattern = config.symbolId + (resourceQuery ? `--${urlSlug(resourceQuery)}` : '');
  const id = interpolateName(loaderContext, idPattern, { content, context });

  plugin.addSymbol({ id, content, path: resourcePath + resourceQuery })
    .then((symbol) => {
      const runtime = runtimeGenerator({ symbol, config, context: loaderContext });
      const result = [
        runtime.content,
        utils.generateExport(runtime.export, config.esModule)
      ].join('\n');

      done(null, result);
    }).catch(done);
};

module.exports.NAMESPACE = NAMESPACE;
