window.patchjstest = {};

patchjstest.getFullYear = function (date) {
  console.log('add by heli.');
  return date.getFullYear();
};
