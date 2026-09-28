/* 通用 UI 工具 */
(function () {
  window.UI = {
    esc: function (s) {
      return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    },
    money: function (n) {
      return '¥' + Number(n).toLocaleString('zh-CN');
    },
    timeStr: function (ts) {
      var d = new Date(ts);
      var p = function (x) { return (x < 10 ? '0' : '') + x; };
      return p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
    },
    /* 毫秒 → "47分钟" / "1小时12分" */
    dur: function (ms) {
      if (ms <= 0) return '已超时';
      var min = Math.floor(ms / 60000);
      if (min < 60) return min + '分钟';
      var h = Math.floor(min / 60);
      return h + '小时' + (min % 60) + '分钟';
    },
    left: function (deadline) {
      return deadline - Date.now();
    },
    toast: function (msg) {
      var el = document.getElementById('toast');
      el.textContent = msg;
      el.classList.add('show');
      clearTimeout(UI._t);
      UI._t = setTimeout(function () { el.classList.remove('show'); }, 2200);
    },
    chip: function (status) {
      return '<span class="chip st-' + UI.esc(status) + '">' + UI.esc(status) + '</span>';
    },
    coins: function (n) {
      return n.toLocaleString('zh-CN');
    }
  };
})();
