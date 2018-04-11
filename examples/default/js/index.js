const index = {};

index.init = () => {
  const time = document.getElementById('time');
  time.textContent = utils.format(new Date());
  console.log('heli..');
  console.log('heli again..');
  console.log('test');
  console.log('test 3+');
  console.log('test 4');
  console.log('test 5');
  console.log('test 7');
  console.log('by heli.0.0.3777777heli...');
  console.log('0.2.11 add by xiaohui hahah123a....');
  // throw new Error('error');
};

window.addEventListener('load', function (event) {
  alert('script..');
}, false);

window.addEventListener('DOMContentLoad', function (event) {
  alert('DOMContentLoaded.');
}, false);

index.init();
