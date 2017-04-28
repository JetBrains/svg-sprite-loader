const { generateExport, stringify } = require('../../lib/utils');

module.exports = () => {
  return generateExport(stringify('olala'));
};
