/* 我的：主页 / 收入 / 待结算 / 鲁班币 / 意见反馈 */
window.Pages = window.Pages || {};
(function () {
  var U = window.UI;

  /* ---------- 我的（tab） ---------- */
  Pages.me = function (S) {
    var w = S.worker;
    return '' +
      '<div class="gold-bg" style="padding-bottom:2px;">' +
        '<div class="nav" style="background:transparent;"><span class="title" style="text-align:left;margin-left:6px;font-size:18px;">我的</span><span class="nav-act" data-act="toast" data-msg="编辑资料（演示）">✏️</span></div>' +
        '<div class="me-top">' +
          '<span class="ava">' + w.avatar + '</span>' +
          '<div class="info"><div class="nm">' + U.esc(w.name) + '<span class="tel">' + U.esc(w.phone) + '</span></div>' +
          '<div class="exp">🪙 匠心值：' + w.craft + ' ›</div>' +
          '<div class="doing">当前 ' + w.sitesActive + ' 个工地进行中</div></div>' +
          '<div class="medal"><div class="pic">🛡️</div><div class="lv">' + U.esc(w.level) + '</div></div>' +
        '</div>' +
      '</div>' +
      '<div class="income-card">' +
        '<div class="top" data-act="go" data-go="#/income">总收入 ›<div class="v">' + U.money(w.income.total) + '</div></div>' +
        '<div class="split">' +
          '<div class="half" data-act="go" data-go="#/pending"><div class="k">待结算 ›</div><div class="v">' + U.money(w.income.pending) + '</div><div class="tip">查看结算进度</div></div>' +
          '<div class="half" data-act="toast" data-msg="本年收入（演示）"><div class="k">本年收入 ›</div><div class="v">' + U.money(w.income.year) + '</div><div class="tip"><b>本月新增 ' + U.money(w.income.monthNew) + '</b></div></div>' +
        '</div>' +
      '</div>' +
      '<div class="menu">' +
        '<div class="mi" data-act="go" data-go="#/records"><span class="ic" style="background:#E8F3EC;">📝</span><span class="tt">我接过的所有单</span><span class="go">›</span></div>' +
        '<div class="mi" data-act="toast" data-msg="我的收藏（演示）"><span class="ic" style="background:#EEEBFB;">⭐</span><span class="tt">我的收藏</span><span class="go">›</span></div>' +
        '<div class="mi" data-act="go" data-go="#/honors"><span class="ic" style="background:#FFF7E0;">🏅</span><span class="tt">我的荣誉</span><span class="go">›</span></div>' +
        '<div class="mi" data-act="go" data-go="#/coins"><span class="ic" style="background:#E6F4F0;">🪙</span><span class="tt">我的鲁班币</span><span class="go">›</span></div>' +
        '<div class="mi" data-act="go" data-go="#/feedback"><span class="ic" style="background:#F2F3F5;">💬</span><span class="tt">意见反馈</span><span class="go">›</span></div>' +
      '</div>' +
      '<div style="text-align:center;margin:4px 0 24px;"><span class="sub" style="cursor:pointer;" data-act="reset">重置演示数据</span></div>';
  };

  /* ---------- 总收入 ---------- */
  Pages.income = function (S) {
    var list = S.projects;
    return U.nav('总收入') +
      '<div style="text-align:right;padding:14px 16px;font-size:14px;color:#666;">合计&nbsp;&nbsp;<span class="money" style="font-size:18px;">¥ 22389.99</span></div>' +
      list.concat(list).map(function (p, i) {
        return '<div class="order-card"><div class="hd">' + U.tag(p.tag) + '<span class="name">' + U.esc(p.name) + '</span>' +
          '<span class="amt money">' + (i === 0 ? '暂无金额' : '¥ 2389.99') + '</span></div>' +
          '<div class="addr">' + U.ic.pin + '<span>' + U.esc(p.addr) + '</span></div>' +
          '<div class="mid"><span>施工内容</span><span class="date">' + U.ic.clock + '<span>1月5日-1月25日</span></span></div>' +
          '<div class="desc">' + U.esc(p.nodes[0].name) + '、' + U.esc((p.nodes[1] || p.nodes[0]).name) + '…</div></div>';
      }).join('');
  };

  /* ---------- 待结算 ---------- */
  Pages.pending = function (S) {
    return U.nav('待结算') +
      '<div style="text-align:right;padding:14px 16px;font-size:14px;color:#666;">合计&nbsp;&nbsp;<span class="money" style="font-size:18px;">¥ 22389.99</span></div>' +
      S.projects.concat(S.projects).map(function (p, i) {
        return '<div class="order-card"><div class="hd">' + U.tag(p.tag) + '<span class="name">' + U.esc(p.name) + '</span>' +
          '<span class="amt money">' + (i === 0 ? '暂无金额' : '¥ 2389.99') + '</span></div>' +
          '<div class="addr">' + U.ic.pin + '<span>' + U.esc(p.addr) + '</span></div>' +
          '<div class="mid"><span>施工内容</span><span class="date">' + U.ic.clock + '<span>1月5日-1月25日</span></span></div>' +
          '<div class="desc">' + U.esc(p.nodes[0].name) + '、' + U.esc((p.nodes[1] || p.nodes[0]).name) + '…</div></div>';
      }).join('');
  };

  /* ---------- 鲁班币 ---------- */
  Pages.coins = function (S) {
    var w = S.worker;
    return U.nav('我的鲁班币', '鲁班币说明', 'toast-coin', true) +
      '<div class="coin-head"><div class="num">' + w.coins + '<small>鲁班币</small></div>' +
      '<span class="coin-deco">🪙</span></div>' +
      '<div class="coin-card"><div class="hd">鲁班币明细</div>' +
      S.coinRecords.map(function (c) {
        return '<div class="coin-line"><div><div class="tt">' + U.esc(c.label) + '</div><div class="tm">' + U.esc(c.time) + '</div></div>' +
          '<span class="delta">+' + c.delta + '</span></div>';
      }).join('') +
      '<div class="empty-tip">没有更多了</div></div>';
  };

  /* ---------- 意见反馈 ---------- */
  Pages.feedback = function (S) {
    return U.nav('意见反馈') +
      '<div class="feedback-area"><textarea class="textarea" id="fb-text" maxlength="500" style="min-height:220px;" placeholder="请输入描述意见"></textarea>' +
      '<div style="text-align:right;font-size:11px;color:#C2C2C2;margin-top:6px;"><span id="fb-count">0</span>/500</div></div>' +
      '<div class="bottom-bar"><div class="btn primary" data-act="fb-submit">提交</div></div>';
  };
})();
