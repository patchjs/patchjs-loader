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
  console.log('test 8');
};

index.init();
