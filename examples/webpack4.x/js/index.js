require('../css/index.css');

const utils = require('./util');

utils.format();

console.log('enter test..');

require.ensure([], function (require) {
  require('./dynamic.js');
}, 'dynamic');
