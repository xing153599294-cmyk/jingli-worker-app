/* 工作台首页 */
window.Pages = window.Pages || {};
Pages.home = function (S) {
  var U = window.UI;
  var w = S.worker;
  var mine = S.orders.filter(function (o) { return o.status !== '待抢单'; });
  var doing = mine.filter(function (o) { return ['已接单', '施工中', '待验收'].indexOf(o.status) >= 0; }).length;
  var pending = mine.filter(function (o) { return o.status === '待确认'; });
  var done = mine.filter(function (o) { return o.status === '已完成'; }).length;

  var todo = '';
  if (pending.length) {
    var o = pending[0];
    todo += '<div class="todo-card" data-act="go" data-go="#/order/' + o.id + '">' +
      '<div class="dot"></div><div class="txt"><b>您有 1 条指派订单待确认</b>' +
      '<span class="muted">' + U.esc(o.title) + ' · 剩余 ' + U.dur(U.left(o.deadline)) + '，超时未确认将影响响应时效评分</span></div>' +
      '<button class="btn btn-primary btn-sm">去确认</button></div>';
  }
  if (!w.retrainDone) {
    todo += '<div class="todo-card" data-act="go" data-go="#/profile">' +
      '<div class="dot"></div><div class="txt"><b>本周在岗复训未签到</b>' +
      '<span class="muted">活跃工人培训参与率需 ≥ 80%，请在本周内完成</span></div>' +
      '<button class="btn btn-primary btn-sm">去签到</button></div>';
  }

  return '' +
    '<div class="hero">' +
      '<div class="row">' +
        '<div class="avatar">' + U.esc(w.name.charAt(0)) + '</div>' +
        '<div class="hello"><b>' + greeting() + '，' + U.esc(w.name.charAt(0)) + '师傅</b>' +
        '<span>' + U.esc(w.trade) + ' · ' + U.esc(w.level) + '</span></div>' +
        '<div class="coin-chip">🪙 <b>' + U.coins(w.coins) + '</b> 鲁班币</div>' +
      '</div>' +
      '<div class="brand">晶鲤焕新家 · 工人端</div>' +
    '</div>' +
    '<div class="page">' +
      '<div class="stat-grid" style="margin-bottom:12px">' +
        '<div class="stat"><b>' + doing + '</b><span>进行中订单</span></div>' +
        '<div class="stat"><b>' + pending.length + '</b><span>待确认</span></div>' +
        '<div class="stat"><b>' + done + '</b><span>累计完成</span></div>' +
      '</div>' +
      todo +
      '<div class="quick-grid" style="margin-bottom:12px">' +
        '<div class="quick" data-act="go" data-go="#/grab"><div class="ico">⚡</div><div>抢单大厅</div></div>' +
        '<div class="quick" data-act="go" data-go="#/orders"><div class="ico">📋</div><div>我的订单</div></div>' +
        '<div class="quick" data-act="go" data-go="#/wallet"><div class="ico">🪙</div><div>鲁班币</div></div>' +
        '<div class="quick" data-act="go" data-go="#/profile"><div class="ico">🎓</div><div>培训签到</div></div>' +
      '</div>' +
      '<div class="card"><div class="card-title">平台公告</div>' +
        '<p class="notice">· 三级派单机制：客户指派 → 工人抢单（120 分钟窗口）→ 服务商指派兜底<br>' +
        '· 指派订单请在 120 分钟内确认，超时未确认将拉低响应时效评分<br>' +
        '· 完成订单 +10 鲁班币，客户好评再 +5；鲁班币可用于强抢订单与排名置顶</p>' +
      '</div>' +
    '</div>';

  function greeting() {
    var h = new Date().getHours();
    if (h < 6) return '夜深了';
    if (h < 11) return '早上好';
    if (h < 14) return '中午好';
    if (h < 18) return '下午好';
    return '晚上好';
  }
};
