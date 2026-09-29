/* 通用 UI 工具：转义 / 金额 / 图标 / 页头 / 弹窗 */
(function () {
  var S = function (d, w) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (w || 1.8) +
      '" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>';
  };
  var F = function (d) {
    return '<svg viewBox="0 0 24 24" fill="currentColor">' + d + '</svg>';
  };

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

    /* ---------- 图标（统一线性风格） ---------- */
    ic: {
      back: S('<path d="M15 4 7 12l8 8"/>', 2),
      right: S('<path d="m9 5 7 7-7 7"/>', 2),
      left: S('<path d="m15 5-7 7 7 7"/>', 2),
      down: S('<path d="m5 9 7 7 7-7"/>', 2),
      pin: S('<path d="M12 21s-6.8-5.5-6.8-10.8a6.8 6.8 0 0 1 13.6 0C18.8 15.5 12 21 12 21z"/><circle cx="12" cy="10.2" r="2.4"/>'),
      clock: S('<circle cx="12" cy="12" r="8.6"/><path d="M12 7.4V12l3 2"/>'),
      tool: S('<path d="M14.6 6.6a4.4 4.4 0 0 1 5.9-4.1l-3.2 3.2 1.2 1.2 3.3-3.3a4.4 4.4 0 0 1-4.1 5.9L7 18.4a2 2 0 1 1-2.8-2.8z"/>'),
      mic: F('<rect x="9" y="2.5" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0h-1.8a4.7 4.7 0 0 1-9.4 0z"/><path d="M11 19.4h2V22h-2z"/>'),
      cal: S('<rect x="3.8" y="5" width="16.4" height="16" rx="2.4"/><path d="M3.8 10h16.4M9 3v4M15 3v4"/>'),
      play: F('<path d="M8 5.2v13.6L19 12z"/>'),
      pause: F('<rect x="7" y="5" width="3.6" height="14" rx="1"/><rect x="13.4" y="5" width="3.6" height="14" rx="1"/>'),
      search: S('<circle cx="11" cy="11" r="6.6"/><path d="m16 16 4.5 4.5"/>'),
      phone: S('<path d="M6.2 3.6h3.1l1.4 3.6-2 1.4a12.4 12.4 0 0 0 6.7 6.7l1.4-2 3.6 1.4v3.1a2 2 0 0 1-2.2 2A17.6 17.6 0 0 1 4.2 5.8a2 2 0 0 1 2-2.2z"/>'),
      camera: S('<path d="M3.5 8.5h3l1.6-2.4h7.8l1.6 2.4h3a1 1 0 0 1 1 1v8.5a1 1 0 0 1-1 1h-17a1 1 0 0 1-1-1v-8.5a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.4" r="3.4"/>'),
      bell: S('<path d="M18 8.6a6 6 0 1 0-12 0c0 5-2 6.4-2 6.4h16s-2-1.4-2-6.4z"/><path d="M13.7 19a2 2 0 0 1-3.4 0"/>'),
      note: S('<path d="M6 3.5h9.5L20 8v12.5H6z"/><path d="M15 3.5V8h5"/><path d="M9.5 12.5h7M9.5 16h5"/>'),
      star: S('<path d="m12 3.6 2.5 5.2 5.7.8-4.1 4 1 5.7-5.1-2.7-5.1 2.7 1-5.7-4.1-4 5.7-.8z"/>'),
      coin: S('<circle cx="12" cy="12" r="8.6"/><path d="M12 7.4v9.2M14.4 9.4c-.5-.7-1.4-1.1-2.4-1.1-1.4 0-2.4.7-2.4 1.8 0 2.4 4.8 1.3 4.8 3.7 0 1.1-1 1.9-2.4 1.9-1 0-1.9-.4-2.4-1.1"/>'),
      chat: S('<path d="M20.5 12.2c0 3.9-3.8 7-8.5 7-1 0-2-.1-2.9-.4L4.5 20.5l1.3-3.6a6.7 6.7 0 0 1-1.3-4c0-3.9 3.8-7 8.5-7s7.5 3.1 7.5 7z"/>'),
      cart: S('<circle cx="9.5" cy="19.5" r="1.4"/><circle cx="17" cy="19.5" r="1.4"/><path d="M3 4h2.4l2.6 11.2h10.4l2-8H6.4"/>'),
      cap: S('<path d="m3 9.4 9-4.6 9 4.6-9 4.6z"/><path d="M7 11.6v4.6c0 1.5 2.2 2.7 5 2.7s5-1.2 5-2.7v-4.6"/>'),
      book: S('<path d="M4.5 4.5h6a2.5 2.5 0 0 1 2.5 2.5v12a2 2 0 0 0-2-2h-6.5z"/><path d="M19.5 4.5h-6a2.5 2.5 0 0 0-2.5 2.5v12a2 2 0 0 1 2-2h6.5z"/>'),
      trophy: S('<path d="M8 4h8v4.5a4 4 0 1 1-8 0z"/><path d="M8 5.5H5.5A2.5 2.5 0 0 0 8 10"/><path d="M16 5.5h2.5A2.5 2.5 0 0 1 16 10"/><path d="M12 12.5V16M9 20h6M10.5 20a1.5 1.5 0 0 1 3 0"/>'),
      medal: S('<circle cx="12" cy="14.6" r="5.4"/><path d="m9 9.6-2.6-6h11.2L15 9.6"/><path d="m12 12.2.9 1.9 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2-1.5-1.4 2-.3z"/>'),
      shield: S('<path d="M12 3.2l7 2.6v5.8c0 4.4-3 8-7 9.2-4-1.2-7-4.8-7-9.2V5.8z"/><path d="m9.2 12 2 2 3.6-3.8"/>'),
      edit: S('<path d="M16.5 3.9a2.2 2.2 0 0 1 3.1 3.1L8.4 18.2l-4.1 1 1-4.1z"/>'),
      ruler: S('<rect x="2.6" y="8.4" width="18.8" height="7.2" rx="1.6" transform="rotate(-12 12 12)"/><path d="m8 9.6.9 1.9M11.4 8.7l.9 1.9M14.8 7.8l.9 1.9"/>'),
      gift: S('<rect x="3.5" y="9" width="17" height="11.5" rx="1.6"/><path d="M3.5 13.5h17M12 9v11.5"/><path d="M12 9C10.5 9 8 8.6 8 6.6A2.1 2.1 0 0 1 12 5.5 2.1 2.1 0 0 1 16 6.6c0 2-2.5 2.4-4 2.4z"/>'),
      volume: S('<path d="M4 9.5h3l4.5-3.5v12L7 14.5H4z"/><path d="M16 9a4.4 4.4 0 0 1 0 6"/><path d="M18.6 6.4a8 8 0 0 1 0 11.2"/>'),
      expand: S('<path d="M9 4H4v5M15 4h5v5M15 20h5v-5M9 20H4v-5"/>'),
      pen: S('<path d="m4 20 1-4.2L16.2 4.6a2.2 2.2 0 0 1 3.2 3.2L8.2 19 4 20z"/><path d="m14.8 6 3.2 3.2"/>'),
      check: S('<path d="m4.5 12.5 5 5 10-11"/>', 2.2),
      user: S('<circle cx="12" cy="8" r="3.8"/><path d="M4.8 20.2c1.4-3.9 4.1-5.6 7.2-5.6s5.8 1.7 7.2 5.6"/>'),
      folder: S('<path d="M3.8 6.4a1.6 1.6 0 0 1 1.6-1.6h3.8l2 2.6h8a1.6 1.6 0 0 1 1.6 1.6v8.6a1.6 1.6 0 0 1-1.6 1.6H5.4a1.6 1.6 0 0 1-1.6-1.6z"/>'),
      wrench: S('<path d="M15.6 3.4a5.2 5.2 0 0 0-6.8 6.8L3.6 15.4a2.4 2.4 0 1 0 3.4 3.4l5.2-5.2a5.2 5.2 0 0 0 6.8-6.8l-3.4 3.4-2-2z"/>')
    },
    tabIcons: {
      home: S('<path d="M3.4 11 12 4.2 20.6 11"/><path d="M5.6 9.6V19.8h12.8V9.6"/>', 1.8),
      grab: S('<rect x="4.2" y="3.6" width="15.6" height="16.8" rx="2.4"/><path d="M8.2 8.4h7.6M8.2 12.4h7.6M8.2 16.4h4.6"/>', 1.8),
      build: S('<path d="m14 6 4 4-9.4 9.4H4.6v-4z"/><path d="m12.4 7.6 4 4"/><path d="m16.4 3.6 4 4"/>', 1.8),
      me: S('<circle cx="12" cy="8" r="3.8"/><path d="M4.8 20.2c1.4-3.9 4.1-5.6 7.2-5.6s5.8 1.7 7.2 5.6"/>', 1.8)
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
