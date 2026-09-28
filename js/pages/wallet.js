/* 钱包：鲁班币 + 服务费结算 */
window.Pages = window.Pages || {};
Pages.wallet = function (S) {
  var U = window.UI;
  var w = S.worker;

  var recs = S.coinRecords.map(function (r) {
    return '<div class="rec-row">' +
      '<div class="l"><b>' + U.esc(r.label) + '</b><span>' + U.timeStr(r.time) + '</span></div>' +
      '<span class="delta ' + (r.delta > 0 ? 'plus' : 'minus') + '">' + (r.delta > 0 ? '+' : '') + r.delta + '</span>' +
    '</div>';
  }).join('');

  var settles = S.settlements.map(function (t) {
    var fee = Math.round(t.amount * t.rate);
    var actual = t.amount - fee;
    return '<div class="settle-row">' +
      '<div class="r1"><b>' + U.esc(t.title) + '</b>' +
        (t.status === '已结算'
          ? '<span class="chip st-已完成">已结算</span>'
          : '<span class="chip st-待验收">待结算</span>') +
      '</div>' +
      '<div class="r2"><span>订单 ' + U.money(t.amount) + ' − 服务费 ' + U.money(fee) + '</span>' +
        '<span>实发 <b style="color:var(--text)">' + U.money(actual) + '</b></span></div>' +
      (t.note ? '<div class="r2"><span>' + U.esc(t.note) + '</span></div>' : '') +
    '</div>';
  }).join('');

  return '' +
    '<div class="back-bar">钱包</div>' +
    '<div class="page">' +
      '<div class="coin-hero">' +
        '<div class="lbl">鲁班币余额</div>' +
        '<div class="num">' + U.coins(w.coins) + ' <small>枚</small></div>' +
        '<div class="tip">完成订单 +10 · 客户好评 +5 · 可用于强抢订单与排名置顶<br>鲁班币为平台内部虚拟币，不可提现、不可透支</div>' +
      '</div>' +
      '<div class="card"><div class="card-title">收支明细</div>' + recs + '</div>' +
      '<div class="card"><div class="card-title">服务费结算<span class="more">按订单金额 × 工种费率计</span></div>' + settles + '</div>' +
    '</div>';
};
