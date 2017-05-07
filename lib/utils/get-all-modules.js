const unique = require('make-unique');

/**
 * Get all modules main & child compilations.
 * @param {Compilation} compilation
 * @param {boolean} filterByRequest Filter out modules with the same request
 * @return {NormalModule[]}
 */
function getAllModules(compilation, filterByRequest = true) {
  let modules = compilation.modules;

  // Search in child compilations
  if (compilation.children.length > 0) {
    modules = compilation.children.reduce((acc, childCompilation) => {
      return acc.concat(childCompilation.modules);
    }, modules);
  }

  if (filterByRequest) {
    modules = unique(modules, (a, b) => a.request && b.request && a.request === b.request);
  }

  return modules;
}

module.exports = getAllModules;
