/* 买工具（鲁班币商城）：列表 / 商品详情 / 我的订单 / 订单详情 */
window.Pages = window.Pages || {};
(function () {
  var U = window.UI;

  /* ---------- 买工具 ---------- */
  Pages.mall = function (S) {
    var cat = window._mallCat || S.mallCats[0];
    return U.nav('买工具') +
      '<div class="search-box"><span style="display:flex;">' + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>' + '</span>电钻｜手套｜水平尺</div>' +
      '<div class="cat-tabs">' + S.mallCats.map(function (c) {
        return '<div class="ct' + (c === cat ? ' on' : '') + '" data-act="mall-cat" data-cat="' + U.esc(c) + '">' + U.esc(c) + '</div>';
      }).join('') + '</div>' +
      '<div class="icon-cats">' + S.iconCats.map(function (c) {
        return '<div class="ic" data-act="toast" data-msg="' + U.esc(c.name) + '（演示）"><span class="cir">' + c.icon + '</span><span>' + U.esc(c.name) + '</span></div>';
      }).join('') + '</div>' +
      '<div class="sec">精品优选<span class="more" data-act="toast" data-msg="更多商品（演示）">更多</span></div>' +
      '<div class="goods-grid">' + S.goods.map(function (g) {
        return '<div class="goods-card" data-act="open-goods" data-id="' + g.id + '">' +
          '<div class="img">' + g.icon + '<span class="brand">' + U.esc(g.brand) + '</span></div>' +
          '<div class="tt">' + U.esc(g.name) + '</div>' +
          '<div class="price"><span class="lb">鲁班币</span><span class="v">' + g.price + '</span><span>' + g.buyers + '人购买</span></div></div>';
      }).join('') + '</div>' +
      '<div style="height:80px;"></div>' +
      '<div class="cart-fab" data-act="go" data-go="#/morders">🛒<span class="n">' + S.mallOrders.filter(function (o) { return o.status === '待领取'; }).length + '</span></div>';
  };

  /* ---------- 商品详情 ---------- */
  Pages.goods = function (S, id) {
    var g = Store.goods(id) || S.goods[0];
    return U.nav('宝贝详情') +
      '<div class="photo-grid" style="margin:10px 12px;"><div class="ph-box" style="width:100%;height:210px;display:flex;align-items:center;justify-content:center;font-size:60px;background:linear-gradient(150deg,#F8D75A,#E89B16);">' + g.icon + '</div></div>' +
      '<div class="card">' +
        '<div class="price" style="display:flex;align-items:baseline;gap:6px;"><span class="tag red" style="vertical-align:0;">鲁班币</span><span class="money" style="font-size:26px;">' + g.price + '</span></div>' +
        '<div style="font-size:15px;line-height:1.6;margin-top:8px;">' + U.esc(g.name) + '</div>' +
        '<div class="sub" style="margin-top:8px;">已兑 ' + g.sold + ' 件</div>' +
      '</div>' +
      '<div class="detail-banner"><div class="tt">轮式测距仪</div>' +
        '<div class="ss">为测距、量化精度、数据处理、清除数据 而设计</div>' +
        '<div class="feat"><span>✔ 便携手持</span><span>✔ 高精度</span><span>✔ 全场景发生</span></div></div>' +
      '<div class="detail-banner" style="text-align:left;"><div class="tt" style="font-size:16px;">测量精准 操作自如</div>' +
        '<div class="ss" style="line-height:1.9;">误差在±0.5%之内 · 0~9999.9m · 318mm 路轮直径</div></div>' +
      '<div class="std-title">规格参数</div>' +
      '<div class="spec-table">' + Object.keys(g.specs).map(function (k) {
        return '<div class="sr"><div class="k">' + U.esc(k) + '</div><div class="v">' + U.esc(g.specs[k]) + '</div></div>';
      }).join('') + '</div>' +
      '<div class="bottom-bar">' +
        '<div style="display:flex;align-items:center;gap:8px;background:#fff;border:1px solid var(--line);border-radius:4px;padding:0 10px;">' +
          '<span class="arrow" data-act="toast" data-msg="数量减少">−</span><b>1</b><span class="arrow" data-act="toast" data-msg="数量增加">＋</span></div>' +
        '<div class="btn primary" data-act="buy-goods" data-id="' + g.id + '">立即兑换</div></div>';
  };

  /* ---------- 我的订单 ---------- */
  Pages.mallOrders = function (S) {
    var tab = window._moTab || '全部';
    var tabs = ['全部', '待领取', '已领取'];
    var list = S.mallOrders.filter(function (o) { return tab === '全部' || o.status === tab; });
    return U.nav('我的订单') +
      '<div class="search-box">搜索我的订单</div>' +
      '<div class="seg nostick" style="border-bottom:none;background:transparent;">' + tabs.map(function (t) {
        return '<div class="item' + (t === tab ? ' on' : '') + '" style="flex:none;padding:10px 14px;" data-act="mo-tab" data-tab="' + t + '">' + t + '</div>';
      }).join('') + '</div>' +
      (list.length ? list.map(function (o) {
        var g = Store.goods(o.goods) || S.goods[0];
        return '<div class="card" data-act="open-morder" data-id="' + o.id + '">' +
          '<div style="display:flex;justify-content:space-between;font-size:12px;color:#9C9C9C;">' +
          '<span>' + U.esc(o.time) + '</span>' +
          '<span style="color:' + (o.status === '待领取' ? '#F59A23' : '#9C9C9C') + ';">' + U.esc(o.status) + '</span></div>' +
          '<div style="display:flex;gap:10px;margin-top:12px;">' +
          '<div class="ph-box" style="width:74px;height:74px;display:flex;align-items:center;justify-content:center;font-size:26px;background:linear-gradient(135deg,#F5C63C,#E89B16);border-radius:6px;flex:none;">' + g.icon + '</div>' +
          '<div style="flex:1;"><div style="font-size:14px;line-height:1.5;">' + U.esc(g.name) + '</div>' +
          '<div style="display:flex;justify-content:space-between;margin-top:10px;font-size:12px;">' +
          '<span class="sub">鲁班币 <span class="money" style="font-size:15px;">' + g.price + '</span></span>' +
          '<span class="sub">数量&nbsp; x' + o.qty + '</span></div></div></div></div>';
      }).join('') : '<div class="empty-tip">没有更多了</div>');
  };

  /* ---------- 订单详情 ---------- */
  Pages.mallOrder = function (S, id) {
    var o = Store.mallOrder(id) || S.mallOrders[0];
    var g = Store.goods(o.goods) || S.goods[0];
    return U.nav('订单详情') +
      '<div class="card"><div style="display:flex;gap:10px;">' +
        '<div style="width:74px;height:74px;display:flex;align-items:center;justify-content:center;font-size:26px;background:linear-gradient(135deg,#F5C63C,#E89B16);border-radius:6px;flex:none;">' + g.icon + '</div>' +
        '<div style="flex:1;"><div style="font-size:14px;line-height:1.5;">' + U.esc(g.name) + '</div>' +
        '<div class="sub" style="margin-top:4px;">数量-大轮&nbsp;&nbsp;·&nbsp;&nbsp;1.838kg</div>' +
        '<div style="display:flex;justify-content:space-between;margin-top:8px;font-size:12px;">' +
        '<span class="sub">鲁班币 <span class="money" style="font-size:15px;">' + g.price + '</span></span>' +
        '<span class="sub">数量&nbsp; x' + o.qty + '</span></div></div></div></div>' +
      '<div class="rows">' +
        '<div class="row"><span class="k">领取码</span><span class="v">' + U.esc(o.code) + '&nbsp;&nbsp;<span class="tag line" data-act="copy-code" data-code="' + U.esc(o.code) + '">复制</span></span></div>' +
      '</div>' +
      '<div class="rows">' +
        '<div class="row"><span class="k">订单编号</span><span class="v">' + U.esc(o.orderNo) + '</span></div>' +
        '<div class="row"><span class="k">下单时间</span><span class="v">' + U.esc(o.orderedAt) + '</span></div>' +
      '</div>';
  };
})();
