/**
 * extract-text-webpack-plugin compatible
 * @param {Compilation} compilation
 * @return {NormalModule[]}
 */
function getAllModules(compilation) {
  let modules = compilation.modules;

  // Search in child compilations
  if (compilation.children.length > 0) {
    modules = compilation.children.reduce((acc, childCompilation) => {
      return acc.concat(childCompilation.modules);
    }, modules);
  }

  // TODO remove duplicates

  return modules;
}

module.exports = getAllModules;
