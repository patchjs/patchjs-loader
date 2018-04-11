describe('Cache Unit Tests', function () {
  it('patchjs.cache.set (key, value, callback)', function () {
    patchjs.cache.set('a.js', {code: 'jscode', version: '1.21.1'}, function (result) {
      expect(result).to.be(true);
    });
  });
  it('patchjs.cache.get (key)', function () {
    patchjs.cache.get('a.js', function (result) {
      expect(result.version).to.be('1.21.1');
      expect(result.code).to.be('jscode');
    });
  });
  it('patchjs.cache.remove (key)', function () {
    patchjs.cache.remove('a.js');
  });
});
