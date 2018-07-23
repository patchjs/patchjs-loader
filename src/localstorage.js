;(function () {
  var cache = {
    set: function (key, value, callback) {
      if (!this.isSupported) {
        callback(false);
        return;
      }
      try {
        localStorage['patchjs-' + key] = JSON.stringify(value);
        callback(true);
      } catch (e) {
        callback(false, e);
      }
    },
    get: function (key, callback) {
      if (!this.isSupported) {
        callback(null);
        return;
      }
      callback(JSON.parse(localStorage['patchjs-' + key] || null));
    },
    remove: function (key) {
      if (this.isSupported) {
        localStorage.removeItem('patchjs-' + key);
      }
    }
  };

  cache.isSupported = 'localStorage' in window;

  localStorage.clear = function () {
    for (var p in localStorage) {
      if (!/^patchjs-/.test(p)) {
        localStorage.removeItem(p);
      }
    }
  };
  window.patchjs = window.patchjs || {};
  window.patchjs.cache = cache;
})();