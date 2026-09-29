/* 接单：可接单 / 已接单 列表 + 接单详情 */
window.Pages = window.Pages || {};
(function () {
  var U = window.UI;

  function card(p) {
    var stTag = '';
    if (p.status === '已接单') stTag = '<span class="tag solid">已接单</span>';
    else if (p.status === '接单失败') stTag = '<span class="tag red">接单失败</span>';
    return '<div class="order-card" data-act="open-grab" data-id="' + p.id + '">' +
      '<div class="hd">' + U.tag(p.tag) + '<span class="name">' + U.esc(p.name) + '</span>' + stTag + '</div>' +
      '<div class="addr">' + U.ic.pin + '<span>' + U.esc(p.addr) + '</span></div>' +
      '<div class="mid"><span>施工内容</span>' +
      '<span class="date">' + U.ic.clock + '<span>' + U.esc(p.range) + '</span></span></div>' +
      '<div class="desc">' + U.esc(p.desc) + '</div></div>';
  }

  /* ---------- 接单列表 ---------- */
  Pages.grab = function (S) {
    var tab = window._grabTab || '可接单';
    var list = S.grabs.filter(function (p) { return p.status === tab || (tab === '已接单' && p.accepted); });
    return U.nav('接单') +
      '<div class="seg"><div class="item' + (tab === '可接单' ? ' on' : '') + '" data-act="grab-tab" data-tab="可接单">可接单</div>' +
      '<div class="item' + (tab === '已接单' ? ' on' : '') + '" data-act="grab-tab" data-tab="已接单">已接单</div></div>' +
      (list.length ? list.map(card).join('') : '<div class="empty-tip">没有更多了</div>');
  };

  /* ---------- 接单详情 ---------- */
  Pages.grabDetail = function (S, id) {
    var p = Store.grab(id);
    if (!p) return U.nav('接单详情') + '<div class="empty-tip">项目不存在</div>';
    var accepted = p.accepted;
    return U.nav('接单') +
      '<div class="proj-head">' +
        '<div class="rowline"><span class="k">项目名称</span><span class="v"><b>' + U.esc(p.name) + '</b>&nbsp;' + U.tag(p.tag) +
        (accepted ? '&nbsp;<span class="tag solid">已报单</span>' : '') + '</span></div>' +
        '<div class="rowline"><span class="k">施工地址</span><span class="v">' + U.esc(p.addr) + ' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-6.8-5.5-6.8-10.8a6.8 6.8 0 0 1 13.6 0C18.8 15.5 12 21 12 21z"/><circle cx="12" cy="10.2" r="2.4"/></svg></span></div>' +
        '<div class="rowline"><span class="k">项目周期</span><span class="v">' + U.esc(p.cycle) + '</span></div>' +
        '<div class="rowline"><span class="k">项目主管</span><span class="v">' + U.esc(p.manager) + '&nbsp;<b class="link-green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6.2 3.6h3.1l1.4 3.6-2 1.4a12.4 12.4 0 0 0 6.7 6.7l1.4-2 3.6 1.4v3.1a2 2 0 0 1-2.2 2A17.6 17.6 0 0 1 4.2 5.8a2 2 0 0 1 2-2.2z"/></svg></b></span></div>' +
      '</div>' +
      '<div class="work-line">' + p.works.map(function (w) {
        return '<div class="wl"><span class="ic">' + U.ic.tool + '</span><span class="nm">' + U.esc(w.name) + '</span>' +
          '<span class="meta"><div class="qm">X ' + U.esc(w.qty) + '</div><div class="qm">' + U.esc(w.range) + '</div>' +
          '<div class="amt">' + U.money(w.price) + '</div></span></div>';
      }).join('') + '</div>' +
      '<div class="bottom-bar">' +
        (accepted
          ? '<div class="btn primary" data-act="go" data-go="#/schedule">施工安排</div>'
          : '<div class="btn outline" data-act="go" data-go="#/schedule">施工安排</div>' +
            '<div class="btn primary" data-act="accept-grab" data-id="' + p.id + '">接单</div>') +
      '</div>';
  };
})();
