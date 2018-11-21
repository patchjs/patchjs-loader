require('../css/index.css');

const utils = require('./util');

utils.format();

require.ensure([], function (require) {
  require('./dynamic.js');
}, 'dynamic');
