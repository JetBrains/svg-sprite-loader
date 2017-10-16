const { interpolateName, getOptions } = require('loader-utils');
const urlSlug = require('url-slug');
const SVGCompiler = require('svg-baker');

const { NAMESPACE } = require('./config');
const configure = require('./configurator');
const { getMatchedRules, getLoadersRules } = require('./utils');
const Exceptions = require('./exceptions');

let svgCompiler = new SVGCompiler();

// eslint-disable-next-line consistent-return
module.exports = function loader(content) {
  if (this.cacheable) {
    this.cacheable();
  }

  const done = this.async();
  const loaderContext = this;
  const { resourcePath, resource, context, loaderIndex } = loaderContext;
  // webpack 1 compat
  const resourceQuery = loaderContext.resourceQuery || '';
  const compiler = loaderContext._compiler;
  const isChildCompiler = compiler.isChild();
  const parentCompiler = isChildCompiler ? compiler.parentCompilation.compiler : null;
  const issuer = loaderContext._module && loaderContext._module.issuer;
  const matchedRules = getMatchedRules(resource, getLoadersRules(compiler), issuer);

  if (matchedRules.length > 1 && !compiler.isChild()) {
    this.emitWarning(new Exceptions.SeveralRulesAppliedException(resource, matchedRules));
  }

  if (!content.includes('<svg')) {
    throw new Exceptions.InvalidSvg(content, matchedRules);
  }

  /**
   * @type {SVGSpriteLoaderConfig}
   */
  const config = configure({
    config: getOptions(loaderContext),
    context: loaderContext
  });

  if (config.extract) {
    const plugin = parentCompiler
      ? parentCompiler.options.plugins.find(p => p.NAMESPACE && p.NAMESPACE === NAMESPACE)
      : this[NAMESPACE];

    if (typeof plugin === 'undefined') {
      throw new Exceptions.ExtractPluginMissingException();
    }

    if (loaderIndex > 0) {
      this.emitWarning(new Exceptions.RemainingLoadersInExtractModeException());
    }

    svgCompiler = plugin.svgCompiler;
  }

  let runtimeGenerator;
  try {
    runtimeGenerator = require(config.runtimeGenerator); // eslint-disable-line import/no-dynamic-require,global-require
  } catch (e) {
    throw new Exceptions.InvalidRuntimeException(e.message);
  }

  const idPattern = config.symbolId + (resourceQuery ? `--${urlSlug(resourceQuery)}` : '');
  const id = interpolateName(loaderContext, idPattern, {
    content,
    context: compiler.context,
    regExp: config.symbolRegExp
  });

  svgCompiler.addSymbol({ id, content, path: resourcePath + resourceQuery })
    .then((symbol) => {
      const runtime = runtimeGenerator({ symbol, config, context, loaderContext });
      done(null, runtime);
    }).catch(done);
};

module.exports.NAMESPACE = NAMESPACE;
