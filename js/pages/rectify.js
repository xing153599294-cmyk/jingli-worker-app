/* 整改单：待处理 / 已处理 列表 + 整改单详情（提报） */
window.Pages = window.Pages || {};
(function () {
  var U = window.UI;

  Pages.rectify = function (S) {
    var tab = window._rectTab || '待处理';
    var list = S.rectifies.filter(function (r) {
      return tab === '待处理' ? (r.status === '待整改' || r.status === '已退回') : r.status === '已完成';
    });
    return U.nav('整改单', '', '', false).replace('<span class="nav-act"></span>', '') +
      '<div class="seg"><div class="item' + (tab === '待处理' ? ' on' : '') + '" data-act="rect-tab" data-tab="待处理">待处理</div>' +
      '<div class="item' + (tab === '已处理' ? ' on' : '') + '" data-act="rect-tab" data-tab="已处理">已处理</div></div>' +
      (list.length ? list.map(function (r) {
        var line = tab === '待处理'
          ? '<div class="mid"><span>' + U.esc(r.title) + ' <span class="money" style="font-size:12px;font-weight:400;">（' + U.esc(r.status) + '）</span></span>' +
            '<span class="date">' + U.ic.clock + '<span>预计完成时间：' + U.esc(r.deadline) + '</span></span></div>'
          : '<div class="mid"><span>' + U.esc(r.title) + ' <span class="muted" style="font-size:12px;font-weight:400;">（已完成）</span></span>' +
            '<span class="date">' + U.ic.clock + '<span>完成时间：' + U.esc(r.deadline) + '</span></span></div>';
        return '<div class="order-card" data-act="open-rect" data-id="' + r.id + '">' +
          '<div class="hd">' + U.tag(r.tag) + '<span class="name">' + U.esc(r.name) + '</span></div>' +
          '<div class="addr">' + U.ic.pin + '<span>' + U.esc(r.addr) + '</span></div>' + line + '</div>';
      }).join('') : '<div class="empty-tip">没有更多了</div>');
  };

  Pages.rectifyDetail = function (S, id) {
    var r = Store.rectify(id);
    if (!r) return U.nav('整改单') + '<div class="empty-tip">整改单不存在</div>';
    var stTag = r.status === '已完成' ? '<span class="tag solid">已完成</span>'
      : (r.status === '已退回' ? '<span class="tag red">已退回</span>' : '<span class="tag solid">待整改</span>');
    var done = r.status === '已完成';
    return U.nav('整改单') +
      '<div class="rect-info" style="margin-top:6px;">' +
        '<div><span class="k">安全检查</span>&nbsp;&nbsp;' + stTag + '</div>' +
        '<div><span class="k">项目名称：</span>' + U.esc(r.name) + '&nbsp;' + U.tag(r.tag) + '</div>' +
        '<div><span class="k">最后期限：</span>' + U.esc(r.deadline) + '</div>' +
        '<div><span class="k">整改人：</span>&nbsp;&nbsp;' + U.esc(r.person) + '</div>' +
      '</div>' +
      '<div class="rect-sec">需整改内容</div>' +
      '<div class="photo-grid">' + r.content.map(function () { return '<div class="ph-box"></div>'; }).join('') + '</div>' +
      '<div class="rect-sec">整改要求</div>' +
      '<div class="shot-req">' + U.esc(r.demand) + '</div>' +
      '<div class="divider" style="margin:14px 0;"></div>' +
      '<div class="rect-sec">整改后提报内容</div>' +
      '<div class="rect-info"><span class="k">拍摄图片（直接拍摄，可以编辑图片）</span></div>' +
      '<div class="photo-grid">' +
        (done ? '<div class="ph-box"></div>'
          : ((r.photos || []).length ? '<div class="ph-box"><span class="x" data-act="rect-delphoto" data-id="' + r.id + '">✕</span></div>' : '') +
            '<div class="add-box" data-act="rect-upload" data-id="' + r.id + '">+</div>') +
      '</div>' +
      '<div class="rect-sec">备注说明</div>' +
      (done
        ? '<div class="shot-req">' + U.esc(r.reply || '') + '</div>'
        : '<div class="textarea-wrap"><textarea class="textarea" id="rect-note" maxlength="50" placeholder="请输入内容"></textarea><span class="count">0/50</span></div>' +
          '<div style="height:80px;"></div>' +
          '<div class="bottom-bar"><div class="btn primary" data-act="rect-submit" data-id="' + r.id + '">提交</div></div>');
  };
})();
