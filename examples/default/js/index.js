require('../css/index.css');

const utils = require('./util');

utils.format();

console.log('enter test..');

console.log('abcheliha...');

require.ensure([], function (require) {
  require('./dynamic.js');
}, 'dynamic');
