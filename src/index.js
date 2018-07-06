;(function () {
  'use strict';
  var defaultOptions = {
    cache: false,
    increment: false,
    diffCount: 5,
    env: ''
  };

  function AssetsManager () {
    this.queue = [];
  }
  
  AssetsManager.prototype = {
    push: function (asset) {
      if (asset.url) {
        this.queue.push(asset);
      } else if (asset.wait) {
        this.queue.push(assign(asset, {
          complete: false
        }));
      }
    },
    update: function (url, options) {
      for (var i = 0, len = this.queue.length; i < len; i++) {
        var asset = this.queue[i];
        if (asset.url === url) {
          assign(asset, options);
          break;
        }
      }
      this.roll();
    },
    roll: function () {
      for (var i = 0, count = 0, len = this.queue.length; i < len; i++) {
        var asset = this.queue[i];
        if (asset.complete) {
          count ++;
          continue;
        }
        if (asset.ready) {
          gloalExec(asset.code, asset.reqUrl);
          if (asset.onLoad) {
            asset.onLoad(asset.reqUrl, asset.fromCache);
          }
          asset.complete = true;
          count ++;
        }
        if (asset.wait) {
          if (i === count) {
            if (Object.prototype.toString.call(asset.wait) === '[object Function]') {
              asset.wait();
            }
            asset.complete = true;
            count ++;
          } else {
            break;
          }
        }
      }
    }
  };

  function Asset (options) {
    this.url = options.url;
    this.onLoad = options.onLoad;
    this.code = null;
    this.reqUrl = null;
    this.ready = false;
    this.complete = false;
    this.fromCache = false;
  }
  
  function assign (target, source) {
    for (var k in source) { target[k] = source[k]; }
    return target;
  }

  function gloalExec (code, url) {
    if (code && /\S/.test(code)) {
      var tagName = 'script';
      if (/\.css$/.test(url)) {
        tagName = 'style';
      }
      var node = document.createElement(tagName);
      var textNode = document.createTextNode(code);
      node.appendChild(textNode);
      document.head.appendChild(node);
    }
  }

  function xhr(url, callback) {
    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.onreadystatechange = function() {
      if (req.readyState === 4) {
        var diffVersionReg = /-\d+\.\d+\.\d+/;
        var isDiffReq = diffVersionReg.test(url);
        if (req.status === 200 || req.status === 304) {
          callback(req.responseText, isDiffReq);
        } else if (req.status === 404) {
          if(isDiffReq) {
            xhr(url.replace(diffVersionReg, ''), callback);
          } else {
            throw new Error('Not Found');
          }
        }
      }
    };
    return req.send(null);
  }

  patchjs.config = function (options) {
    var metaConfig = document.querySelector('meta[name="patchjs"]');
    if (metaConfig && !options.version) {
      var content = metaConfig.getAttribute('content');
      var contentArray = content.split(',');
      for (var i = 0, len = contentArray.length; i < len; i++) {
        var item = contentArray[i];
        if (/version=/.test(item)) {
          options.version = item.split('=')[1];
        }
      }
    }
    this.options = options || {};
    for (var p in defaultOptions) {
      if (defaultOptions.hasOwnProperty(p)) {
        this.options[p] = this.options[p] || defaultOptions[p];
      }
    }
    this.assetsManager = new AssetsManager();
    return this;
  };

  patchjs.load = function (url, callback) {
    if (callback) {
      callback = callback.bind(this);
    }
    this.assetsManager.push(new Asset({
      url: url,
      onLoad: callback,
    }));
    this.req(url);
    return this;
  };

  patchjs.req = function (url) {
    var options = this.options;
    var cacheKey = options.env + options.path + url;
    var self = this;
    this.cache.get(cacheKey, function (result) {
      result = result || {};
      var localVersion = result.version;
      var assetsCode = result.code;
      if (options.cache && localVersion === options.version && assetsCode) {
        var fullUrl = self.combineReqUrl(url, false);
        self.assetsManager.update(url, {
          ready: true,
          code: assetsCode,
          reqUrl: fullUrl,
          fromCache: true
        });
      } else {
        var increment = options.cache && options.increment && assetsCode && self.withinCertainDiffRange(localVersion);
        var diffUrl = self.combineReqUrl(url, increment, localVersion);
        xhr(diffUrl, function(data, isDiffReq) {
          if (isDiffReq) {
            var diffData = JSON.parse(data);
            var code = diffData.c;
            assetsCode = diffData.m ? self.mergeCode(assetsCode, diffData.l, code) : assetsCode;
          } else {
            assetsCode = data;
          }

          self.assetsManager.update(url, {
            ready: true,
            code: assetsCode,
            reqUrl: diffUrl
          });
          if (options.cache) {
            self.cache.set(cacheKey, {code: assetsCode, version: options.version}, function (result){
              if (!result) {
                self.cache.remove(cacheKey);
                var exceedQuotaErr = options.exceedQuotaErr;
                if (exceedQuotaErr) {
                  exceedQuotaErr.call(self, diffUrl);
                }
              }
            });
          }
        });
      }
    });
  };

  patchjs.wait = function (callback) {
    if (callback) {
      callback = callback.bind(this);
    }
    this.assetsManager.push({
      wait: callback || true
    });
    return this;
  };

  patchjs.withinCertainDiffRange = function (localVersion) {
    if (localVersion) {
      var reg = /(\d+)\.(\d+)\.(\d+)/;
      var versionArray = this.options.version.match(reg);
      var localVersionArray = localVersion.match(reg);
      if (versionArray[1] === localVersionArray[1] && versionArray[2] === localVersionArray[2] && 0 < versionArray[3] - localVersionArray[3] && versionArray[3] - localVersionArray[3] < this.options.diffCount) {
        return true;
      }
    }
    return false;
  };

  patchjs.combineReqUrl = function (url, increment, localVersion) {
    if (increment && localVersion) {
      var extName = url.substring(url.lastIndexOf('.'));
      url = url.replace(new RegExp(extName + '$', 'i'), '-' + localVersion + extName);
    }
    var options = this.options;
    return options.path + options.version + '/' + url;
  };

  patchjs.mergeCode = function (source, chunkSize, diffCodeArray) {
    var jsCode = '';
    for (var i = 0, len = diffCodeArray.length; i < len; i++) {
      var code = diffCodeArray[i];
      if (Object.prototype.toString.call(code) === '[object String]') {
        jsCode += code;
      } else {
        var start = code[0] * chunkSize;
        var end = code[1] * chunkSize;
        jsCode += source.substr(start, end);
      }
    }
    return jsCode;
  };
  
  patchjs.Asset = Asset;
  patchjs.AssetsManager = AssetsManager;
})();
