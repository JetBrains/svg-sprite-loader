/**
 * Get all modules main & child compilations.
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

  return modules;
}

module.exports = getAllModules;
