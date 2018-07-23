;(function () {
  var db, dbErrorEvent;
  var cache = {
    init: function () {
      try {
        db = this.isSupported ?  window.openDatabase('patchjsdb', '1.0', 'patchjs database', 4 * 1024 * 1024) : null;
      } catch (e) {
        dbErrorEvent = e;
        db = null;
      }
    },
    set: function (key, value, callback) {
      callback = callback || function () {};
      if (!db) {
        callback(false, dbErrorEvent);
        return;
      }
      db.transaction(function (tx) {
        tx.executeSql('create table if not exists assets (url text unique, code text, version text)');
        tx.executeSql('select version from assets where url = ?', [key], function (ctx, result) {
          if (result.rows.length > 0) {
            ctx.executeSql('update assets set code = ?, version = ? where url = ?', [value.code, value.version, key], function () {
              callback(true);
            }, function (ctx, e) {
              callback(false, e);
            });
          } else {
            ctx.executeSql('insert into assets (url, code, version) values (?, ?, ?)', [key, value.code, value.version], function () {
              callback(true);
            }, function (ctx, e) {
              callback(false, e);
            });
          }
        }, function (ctx, e) {
          callback(false, e);
        });
      }, function (tx, e) {
        callback(false, e);
      });
    },
    get: function (key, callback) {
      if (!db) {
        callback(null);
        return;
      }
      db.transaction(function (tx) {
        tx.executeSql('select code, version from assets where url = ?', [key], function (tx, result) {
          if (result.rows.length > 0) {
            callback({code: result.rows.item(0).code, version: result.rows.item(0).version});
          } else {
            callback(null);
          }
        }, function (error) {
          callback(null);
        });
      });
    },
    remove: function (key) {
      if (!db) {
        return;
      }
      db.transaction(function (tx) {
        tx.executeSql('delete from assets where url = ?', [key]);
      });
    }
  };

  cache.isSupported = 'openDatabase' in window;
  cache.init();
  window.patchjs = window.patchjs || {};
  window.patchjs.cache = cache;
})();