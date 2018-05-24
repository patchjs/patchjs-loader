;(function () {
  var db, status = 'PENDING', queue = [];

  function set (key, value, callback) {
    callback = callback || function () {};
    if (!db) {
      callback(false);
      return;
    }
    var transaction = db.transaction(['assets'], 'readwrite');
    var objectStore = transaction.objectStore('assets');
    value.url = key;
    var putReq = objectStore.put(value);
    putReq.onsuccess = function () {
      callback(true);
    };
    putReq.onerror = function () {
      callback(false);
    };
  }

  function get(key, callback) {
    if (!db) {
      callback(null);
      return;
    }
    var transaction = db.transaction(['assets'], 'readonly');
    var objectStore = transaction.objectStore('assets');
    var queryReq = objectStore.get(key);
    queryReq.onsuccess = function (e) {
      callback(e.target.result || null);
    };
    queryReq.onerror = function () {
      callback(null);
    };
  }

  function remove(key) {
    if (!db) {
      return;
    }
    var transaction = db.transaction(['assets'], 'readwrite');
    var objectStore = transaction.objectStore('assets');
    objectStore.delete(key);
  }

  function triggerQueue() {
    queue.forEach(function(callback) {
      callback();
    });
    queue.length = 0;
  }

  var cache = {
    init: function () {
      var openReq = window.indexedDB.open("patchjsdb");
      openReq.onupgradeneeded = function(e) {
        db = e.target.result;
        var objectStore = db.createObjectStore('assets', { keyPath: 'url' });
      };
      openReq.onsuccess = function(e) {
        status = 'COMPLETE';
        db = e.target.result;
        triggerQueue();
      };
      openReq.onerror = function() {
        status = 'COMPLETE';
        db = null;
        triggerQueue();
      };
    },
    set: function (key, value, callback) {
      if (status === 'PENDING') {
        queue.push(function () {
          set(key, value, callback);
        });
      } else {
        set(key, value, callback);
      }
    },
    get: function (key, callback) {
      if (status === 'PENDING') {
        queue.push(function () {
          get(key, callback);
        });
      } else {
        get(key, callback);
      }
    },
    remove: function (key) {
      if (status === 'PENDING') {
        queue.push(function () {
          remove(key);
        });
      } else {
        remove(key);
      }
    }
  };

  cache.init();
  window.patchjs = window.patchjs || {};
  window.patchjs.cache = cache;
})();