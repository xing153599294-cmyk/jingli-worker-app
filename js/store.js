/* 本地存储层：首次进入载入种子数据，之后所有操作写入 localStorage */
(function () {
  var KEY = 'jingli_worker_v2';

  function fresh() {
    var s = JSON.parse(JSON.stringify(window.SEED));
    /* 由排期种子生成本月排期（就近分配到两个在施项目） */
    var names = ['柴耀强香榭水岸', '马泺讯融侨建筑'];
    s.schedule = (s.scheduleSeed || []).map(function (x, i) {
      return {
        day: x.day, seg: x.seg, done: !!x.done,
        proj: names[i % names.length],
        personal: i % 3 === 2   /* 摻入个人安排，用于演示两种弹窗 */
      };
    });
    return s;
  }
  function save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* 忽略隐私模式 */ }
  }
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var s = JSON.parse(raw);
        if (s && s.worker && s.worker.coins != null) return s;
      }
    } catch (e) { /* 落到重新播种 */ }
    var f = fresh();
    save(f);
    return f;
  }
  function reset() {
    try { localStorage.removeItem(KEY); } catch (e) { /* 忽略 */ }
    return load();
  }
  function find(list, id) {
    return (list || []).find(function (x) { return x.id === id; });
  }

  window.Store = {
    load: load, save: save, reset: reset,
    grab: function (id) { return find(window._S.grabs, id); },
    proj: function (id) { return find(window._S.projects, id); },
    rectify: function (id) { return find(window._S.rectifies, id); },
    lesson: function (id) { return find(window._S.lessons, id); },
    exam: function (id) { return find(window._S.exams, id); },
    goods: function (id) { return find(window._S.goods, id); },
    mallOrder: function (id) { return find(window._S.mallOrders, id); }
  };
})();
