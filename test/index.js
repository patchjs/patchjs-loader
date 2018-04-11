describe('Patch.js Unit Tests', function () {
  before(function() {
    for (var p in localStorage) {
      if (/^patch-/.test(p)) {
        localStorage.removeItem(p);
      }
    }
  });

  it('patchjs.config (config)', function () {
    patchjs.config({
      cache: true,
      increment: true
    });
  });

  it('patchjs.load (urlConfig, callback) - simple', function (done) {
    patchjs.config({
      path: './simple/patch-test-data/',
      cache: true,
      increment: true,
      version: '1.0.1'
    }).load('test.js', function () {
      expect(patchjstest.getFullYear(new Date())).to.be(new Date().getFullYear());
      delete window.patchjstest;
      done();
    });
  });

  it('patchjs.load (urlConfig, callback) - antd mobile', function (done) {
    patchjs.config({
      path: './antd-mobile/demo/',
      cache: true,
      increment: true,
      version: '1.0.1'
    }).load('shared.js').wait().load('index.js', function (url) {
      if (/index\.js/.test(url)) {
        expect(document.querySelectorAll('#example .am-navbar').length).to.be(1);
        done();
      }
    });;
  });

  it('patchjs.withinCertainDiffRange (localVersion)', function () {
    var patchjsObj = patchjs.config({
      version: '1.0.1'
    });

    expect(patchjsObj.withinCertainDiffRange(null)).to.be(false);
    expect(patchjsObj.withinCertainDiffRange('1.0.0')).to.be(true);
    expect(patchjsObj.withinCertainDiffRange('1.0.1')).to.be(false);
    expect(patchjsObj.withinCertainDiffRange('1.0.2')).to.be(false);
  });

  it('patchjs.combineReqUrl (url, increment, localVersion)', function () {
    var patchjsObj = patchjs.config({
      path: 'http://koubei.com/',
      cache: true,
      increment: true,
      version: '1.0.1'
    });
    expect(patchjsObj.combineReqUrl('file.js', true, '1.0.0')).to.be('http://koubei.com/1.0.1/file-1.0.0.js');
    expect(patchjsObj.combineReqUrl('file.js', false, '1.0.0')).to.be('http://koubei.com/1.0.1/file.js');
  });

  it('patchjs.mergeCode (source, chunkSize, diffCodeArray)', function () {
    var source = '"use strict";window.patchjstest={};';
    var diffCodeArray = [[0, 2], "hjstest={},patchjstest.getFullYear=function(t){return t.get","FullYear()};"];
    expect(patchjs.mergeCode(source, 12, diffCodeArray)).to.be('"use strict";window.patchjstest={},patchjstest.getFullYear=function(t){return t.getFullYear()};');
  });
});
