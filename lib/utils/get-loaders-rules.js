/**
 * @param {Compiler} compiler
 * @return {Rule[]}
 */
function getLoadersRules(compiler) {
  const moduleConfig = compiler.options.module;
  // webpack 1 compat
  return moduleConfig.rules || moduleConfig.loaders;
}

module.exports = getLoadersRules;
