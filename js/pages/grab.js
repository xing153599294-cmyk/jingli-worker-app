/* 抢单大厅 */
window.Pages = window.Pages || {};
Pages.grab = function (S) {
  var U = window.UI;
  var pool = S.orders.filter(function (o) { return o.status === '待抢单'; });

  var list = pool.map(function (o) {
    var left = U.left(o.grabDeadline);
    var fee = Math.round(o.amount * o.rate);
    var over = left <= 0;
    var canBoost = S.worker.coins >= o.boostCost;
    return '<div class="card pool-card">' +
      (o.hot ? '<span class="tag-hot">热门</span>' : '') +
      '<div style="display:flex;justify-content:space-between;align-items:baseline' + (o.hot ? ';padding-right:48px' : '') + '">' +
        '<b style="font-size:15px">' + U.esc(o.title) + '</b>' +
        '<span class="price">' + U.money(o.amount) + ' <small>服务费约 ' + U.money(fee) + '</small></span>' +
      '</div>' +
      '<div class="meta" style="font-size:12px;color:var(--sub);margin-top:6px;line-height:1.7">' +
        '🔧 ' + U.esc(o.trade) + ' · ' + U.esc(o.work) + '<br>📍 ' + U.esc(o.address) +
      '</div>' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px">' +
        '<span class="countdown' + (over ? ' over' : '') + '">⏱ 抢单窗口剩 ' + U.dur(left) + '</span>' +
        '<span class="muted">窗口关闭后需消耗鲁班币强抢</span>' +
      '</div>' +
      '<div class="btn-row">' +
        '<button class="btn btn-primary" data-act="grab" data-id="' + o.id + '"' + (over ? ' disabled' : '') + '>抢单</button>' +
        '<button class="btn btn-ghost" data-act="grab-boost" data-id="' + o.id + '"' + (canBoost ? '' : ' disabled') + '>🪙 鲁班币强抢（−' + o.boostCost + '）</button>' +
      '</div>' +
    '</div>';
  }).join('');

  return '' +
    '<div class="back-bar">抢单大厅</div>' +
    '<div class="page">' +
      '<p class="muted" style="margin:-4px 2px 12px">按您的主 / 副区域匹配（' +
        S.worker.regions.main.concat(S.worker.regions.sub).join('、') + '），订单按发布时间倒序排列</p>' +
      (list || '<div class="empty"><div class="eico">🈳</div>暂无可抢订单，有新订单会第一时间推给您</div>') +
    '</div>';
};
