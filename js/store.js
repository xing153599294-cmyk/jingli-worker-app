/* 本地存储层：首次进入载入种子数据，之后所有操作写入 localStorage */
(function () {
  var KEY = 'jingli_worker_v1';

  function fresh() {
    return JSON.parse(JSON.stringify(window.SEED));
  }
  function save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* 忽略隐私模式 */ }
  }
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* 落到重新播种 */ }
    var s = fresh();
    save(s);
    return s;
  }
  function reset() {
    try { localStorage.removeItem(KEY); } catch (e) { /* 忽略 */ }
    return load();
  }

  window.Store = {
    load: load,
    save: save,
    reset: reset,
    order: function (id) {
      return window._S.orders.find(function (o) { return o.id === id; });
    }
  };
})();
