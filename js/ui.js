/* 通用 UI 工具：转义 / 金额 / 图标 / 页头 / 弹窗 */
(function () {
  window.UI = {
    esc: function (s) {
      return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    },
    money: function (n) {
      var v = Number(n);
      return '¥' + (v % 1 === 0 ? v.toLocaleString('zh-CN') : v.toLocaleString('zh-CN', { minimumFractionDigits: 2 }));
    },
    toast: function (msg) {
      var el = document.getElementById('toast');
      el.textContent = msg;
      el.classList.add('show');
      clearTimeout(UI._t);
      UI._t = setTimeout(function () { el.classList.remove('show'); }, 2200);
    },

    /* ---------- 图标 ---------- */
    ic: {
      back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4 7 12l8 8"/></svg>',
      right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 5 7 7-7 7"/></svg>',
      pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-5.6-7-11a7 7 0 0 1 14 0c0 5.4-7 11-7 11z"/><circle cx="12" cy="10" r="2.6"/></svg>',
      clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
      tool: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 6.5a4.5 4.5 0 0 1 6-4.2l-3.3 3.3 1.2 1.2L21.7 3.5a4.5 4.5 0 0 1-6 6L7 18.2a2 2 0 1 1-2.8-2.8z"/></svg>',
      mic: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0h-1.8a4.7 4.7 0 0 1-9.4 0z"/><path d="M11 19h2v2.5h-2z"/></svg>',
      cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="4" y="5" width="16" height="16" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/></svg>',
      play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>'
    },
    tabIcons: {
      home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11 12 4l9 7"/><path d="M5.5 9.5V20h13V9.5"/></svg>',
      grab: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="4" y="3.5" width="16" height="17" rx="2.5"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>',
      build: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m14 6 4 4-9.5 9.5H4.5V15.5z"/><path d="m12.5 7.5 4 4"/><path d="m16.5 3.5 4 4"/></svg>',
      me: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="7.6" r="3.8"/><path d="M4.5 20.5c1.4-3.9 4.2-5.6 7.5-5.6s6.1 1.7 7.5 5.6z"/></svg>'
    },

    /* ---------- 页头 ---------- */
    nav: function (title, right, rightAct, rightGreen) {
      return '<div class="nav">' +
        '<span class="back" data-act="back">' + UI.ic.back + '</span>' +
        '<span class="title">' + UI.esc(title) + '</span>' +
        (right ? '<span class="nav-act' + (rightGreen ? ' green' : '') + '" data-act="' + rightAct + '">' + UI.esc(right) + '</span>' : '') +
        '</div>';
    },
    tag: function (t) { return '<span class="tag ' + (t === '局装' ? 'jz' : 'zz') + '">' + UI.esc(t) + '</span>'; },

    /* ---------- 弹窗 ---------- */
    modal: function (html) {
      var m = document.getElementById('modal');
      document.getElementById('modal-box').innerHTML = html;
      m.hidden = false;
    },
    closeModal: function () {
      document.getElementById('modal').hidden = true;
    },
    confirm: function (title, body, okText, act, data) {
      UI.modal(
        '<div class="tt">' + UI.esc(title) + '</div>' +
        '<div class="bd">' + body + '</div>' +
        '<div class="btns">' +
        '<div class="btn plain" data-act="modal-close">取消</div>' +
        '<div class="btn primary" data-act="' + act + '"' + (data ? ' ' + data : '') + '>' + UI.esc(okText) + '</div>' +
        '</div>');
    }
  };
})();
