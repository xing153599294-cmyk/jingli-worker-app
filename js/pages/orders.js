/* 我的订单列表 */
window.Pages = window.Pages || {};
Pages.orders = function (S) {
  var U = window.UI;
  var tab = window._orderTab || '全部';
  var tabs = ['全部', '待确认', '进行中', '待验收', '已完成'];

  var mine = S.orders.filter(function (o) { return o.status !== '待抢单'; });
  var filtered = mine.filter(function (o) {
    if (tab === '全部') return true;
    if (tab === '进行中') return ['已接单', '施工中'].indexOf(o.status) >= 0;
    return o.status === tab;
  });

  var tabbar = tabs.map(function (t) {
    return '<span class="ftab' + (t === tab ? ' on' : '') + '" data-act="order-tab" data-tab="' + t + '">' + t + '</span>';
  }).join('');

  var list = filtered.map(function (o) {
    var extra = '';
    if (o.status === '待确认') extra = '<span class="countdown">⏱ 剩 ' + U.dur(U.left(o.deadline)) + '</span>';
    if (o.status === '施工中') {
      var doneN = o.nodes.filter(function (n) { return n.photos.length > 0; }).length;
      extra = '<span class="muted">节点 ' + doneN + '/' + o.nodes.length + '</span>';
    }
    return '<div class="card order-card" data-act="go" data-go="#/order/' + o.id + '">' +
      '<div class="top"><b>' + U.esc(o.title) + '</b>' + U.chip(o.status) + '</div>' +
      '<div class="meta"><span>🔧 ' + U.esc(o.trade) + '</span><span>' + U.money(o.amount) + '</span>' + extra + '</div>' +
    '</div>';
  }).join('');

  return '' +
    '<div class="back-bar">我的订单</div>' +
    '<div class="page">' +
      '<div class="filter-tabs">' + tabbar + '</div>' +
      (list || '<div class="empty"><div class="eico">📋</div>该状态下暂无订单</div>') +
    '</div>';
};
