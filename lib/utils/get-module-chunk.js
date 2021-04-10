/**
 * Find nearest module chunk (not sure that is reliable method, but who cares).
 * @see http://stackoverflow.com/questions/43202761/how-to-determine-all-module-chunks-in-webpack
 * @param {NormalModule} module
 * @param {NormalModule[]} modules - webpack 1 compat
 * @param {moduleGraph} module graph
 * @param {chunkGraph} chunk graph
 * @return {Chunk|null}
 */
function getModuleChunk(module, modules, moduleGraph, chunkGraph) {
  let chunks;

  if (chunkGraph && chunkGraph.getOrderedModuleChunksIterable) {
    chunks = Array.from(chunkGraph.getOrderedModuleChunksIterable(module));
  } else if (module.chunksIterable) {
    chunks = Array.from(module.chunksIterable);
  } else if (module.mapChunks) {
    chunks = module.mapChunks();
  } else {
    chunks = module.chunks;
  }

  let issuer;
  if (moduleGraph && moduleGraph.getIssuer) {
    issuer = moduleGraph.getIssuer(module);
  } else {
    // webpack 1 compat
    issuer = typeof module.issuer === 'string'
      ? modules.find(m => m.request === module.issuer)
      : module.issuer;
  }

  if (Array.isArray(chunks) && chunks.length > 0) {
    return chunks[chunks.length - 1];
  } else if (issuer) {
    return getModuleChunk(issuer, modules);
  }

  return null;
}

module.exports = getModuleChunk;
