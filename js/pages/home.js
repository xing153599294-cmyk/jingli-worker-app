/* 首页 / 公告 / 消息 */
window.Pages = window.Pages || {};
(function () {
  var U = window.UI;

  /* ---------- 首页 ---------- */
  Pages.home = function (S) {
    var unreadMsg = S.messages.some(function (m) { return m.unread; });
    var html =
      '<div class="banner">' +
        '<div class="code">让每一个家都更好 · <b>超放心</b></div>' +
        '<div class="brand">晶鲤焕新家</div>' +
        '<div class="slogan"><span class="pill">超放心</span><span class="rest">家装</span></div>' +
      '</div>' +
      '<div class="notice-card">' +
        '<div class="hd"><span class="t">公告</span><span class="more" data-act="go" data-go="#/notices">更多</span></div>' +
        S.notices.slice(0, 4).map(function (n) {
          return '<div class="notice-item" data-act="open-notice" data-id="' + n.id + '">' +
            '<div class="txt"><div class="tt">' + U.esc(n.title) + '</div>' +
            '<div class="tm">' + U.esc(n.time) + '</div></div>' +
            '<span class="arrow">' + U.ic.right + '</span></div>';
        }).join('') +
      '</div>' +
      '<div class="entry-grid">' +
        entry('整改', 'c1', '#/rectify', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h10M4 18h7"/><path d="m16 15 2 2 4-4"/></svg>') +
        entry('课堂', 'c2', '#/study', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-5 9 5-9 5z"/><path d="M7 11.5V16c0 1.4 2.2 2.6 5 2.6s5-1.2 5-2.6v-4.5"/></svg>') +
        entry('评级', 'c3', '#/rating', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="m12 3 2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.4l-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z"/></svg>') +
        entry('买工具', 'c4', '#/mall', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h16l-1.3 11.2a2 2 0 0 1-2 1.8H7.3a2 2 0 0 1-2-1.8z"/><path d="M9 11V6a3 3 0 0 1 6 0v5"/></svg>') +
      '</div>' +
      '<div class="notify-bar" data-act="go" data-go="#/messages">' +
        '<span class="bell">🔔</span><span class="txt">' + (unreadMsg ? '接到一个新项目' : '暂无新消息') + '</span>' +
        '<span class="arrow">' + U.ic.right + '</span>' +
      '</div>';
    return html;

    function entry(name, cls, go, svg) {
      return '<div class="entry" data-act="go" data-go="' + go + '"><span class="ico ' + cls + '">' + svg + '</span><span>' + name + '</span></div>';
    }
  };

  /* ---------- 公告列表 ---------- */
  Pages.notices = function (S) {
    var groups = {};
    S.notices.forEach(function (n) { (groups[n.time] = groups[n.time] || []).push(n); });
    return U.nav('公告') + Object.keys(groups).map(function (t) {
      return '<div class="time-group">' + U.esc(t) + '</div>' + groups[t].map(function (n) {
        return '<div class="msg-card" data-act="open-notice" data-id="' + n.id + '">' +
          '<div class="hd">' + (n.unread ? '<span class="dot"></span>' : '') +
          '<span class="tt">' + U.esc(n.title) + '</span></div>' +
          '<div class="body">' + U.esc(n.body.length > 42 ? n.body.slice(0, 42) + '…' : n.body) + '</div>' +
          '<div style="text-align:right;margin-top:10px;" class="link-green">查看详情 ›</div></div>';
      }).join('');
    }).join('');
  };

  /* ---------- 公告详情 ---------- */
  Pages.noticeDetail = function (S, id) {
    var n = S.notices.find(function (x) { return x.id === id; }) || S.notices[0];
    n.unread = false;
    return U.nav('公告详情') +
      '<div class="card">' +
        '<div class="h1">' + U.esc(n.title) + '</div>' +
        '<div class="sub" style="margin-top:8px;">发布时间：' + U.esc(n.time) + '&nbsp;&nbsp;发布者：平台运营中心</div>' +
        '<div class="divider" style="margin:12px 0;"></div>' +
        '<div style="font-size:14px;line-height:1.9;color:#333;white-space:pre-wrap;">' + U.esc(n.body) + '</div>' +
      '</div>';
  };

  /* ---------- 消息 ---------- */
  Pages.messages = function (S) {
    var groups = {};
    S.messages.forEach(function (m) { (groups[m.time] = groups[m.time] || []).push(m); });
    return U.nav('消息', '全部已读', 'read-all') + Object.keys(groups).map(function (t) {
      return '<div class="time-group">' + U.esc(t) + '</div>' + groups[t].map(function (m) {
        return '<div class="msg-card">' +
          '<div class="hd">' + (m.unread ? '<span class="dot"></span>' : '') +
          '<span class="tt">' + U.esc(m.title) + '</span><span class="go">›</span></div>' +
          '<div class="body">' + U.esc(m.body) + '</div></div>';
      }).join('');
    }).join('');
  };
})();
