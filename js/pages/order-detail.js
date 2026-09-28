/* 订单详情：状态推进 + 施工节点 + 照片上传 + 验收 + 时间线 */
window.Pages = window.Pages || {};
Pages.orderDetail = function (S, id) {
  var U = window.UI;
  var o = window.Store.order(id);
  if (!o) return '<div class="back-bar"><span class="bk" data-act="go" data-go="#/orders">‹</span>订单不存在</div>';

  var bannerMap = {
    '待确认': ['sb-orange', '待确认接单', '来源：' + U.esc(o.source || '服务商指派') + '。请剩余 <b>' + U.dur(U.left(o.deadline)) + '</b> 内确认，超时未确认将影响响应时效评分。'],
    '已接单': ['sb-teal', '已接单', '请与客户约定进场时间，进场后点击「开始施工」。'],
    '施工中': ['sb-blue', '施工中', '每个节点完成后请拍照上传，全部节点完成即可发起验收。'],
    '待验收': ['sb-purple', '待验收', '已提交验收，项目管家将在 24 小时内上门验收。'],
    '已完成': ['sb-green', '已完成', '验收通过时间：' + (o.completedAt ? U.timeStr(o.completedAt) : '—')],
    '已取消': ['sb-gray', '已取消', '本订单已取消。']
  };
  var bn = bannerMap[o.status] || bannerMap['已取消'];

  /* 指派确认操作 */
  var confirmBar = '';
  if (o.status === '待确认') {
    confirmBar = '<div class="btn-row" style="margin-bottom:12px">' +
      '<button class="btn btn-danger-ghost" data-act="reject-assign" data-id="' + o.id + '">无法承接，退回</button>' +
      '<button class="btn btn-primary" data-act="confirm-assign" data-id="' + o.id + '">确认接单</button>' +
    '</div>';
  }

  /* 客户与费用信息 */
  var fee = Math.round(o.amount * o.rate);
  var info = '<div class="card"><div class="card-title">订单信息</div>' +
    '<div class="info-row"><span class="k">客户</span><span class="v">' + U.esc(o.customer) + '（' + U.esc(o.phone) + '）</span></div>' +
    '<div class="info-row"><span class="k">施工地址</span><span class="v">' + U.esc(o.address) + '</span></div>' +
    '<div class="info-row"><span class="k">施工内容</span><span class="v">' + U.esc(o.work) + '</span></div>' +
    '<div class="info-row"><span class="k">订单金额</span><span class="v"><b>' + U.money(o.amount) + '</b></span></div>' +
    '<div class="info-row"><span class="k">服务费</span><span class="v">' + U.money(fee) + '（按 ' + Math.round(o.rate * 1000) / 10 + '% 计，结算时扣除）</span></div>' +
  '</div>';

  /* 施工节点 */
  var editable = o.status === '施工中';
  var allDone = o.nodes.every(function (n) { return n.photos.length > 0; });
  var nodeRows = o.nodes.map(function (n, i) {
    var done = n.photos.length > 0;
    var photos = n.photos.map(function () {
      return '<div class="ph">📷</div>';
    }).join('');
    var act = '';
    if (editable && !done) {
      act = '<button class="btn btn-ghost btn-sm" data-act="upload" data-id="' + o.id + '" data-idx="' + i + '">＋ 拍照上传</button>';
    }
    return '<div class="node-row' + (done ? ' done' : '') + '">' +
      '<div class="node-idx">' + (done ? '✓' : (i + 1)) + '</div>' +
      '<div class="node-main">' +
        '<div class="nm"><span>' + U.esc(n.name) + '</span>' + (done ? U.chip('已完成') : act) + '</div>' +
        (photos ? '<div class="node-photos">' + photos + '</div>' : '') +
        (n.remark ? '<div class="node-remark">💬 ' + U.esc(n.remark) + '</div>' : '') +
      '</div>' +
    '</div>';
  }).join('');

  var nodeCard = '<div class="card"><div class="card-title">施工节点<span class="more">' +
    o.nodes.filter(function (n) { return n.photos.length > 0; }).length + ' / ' + o.nodes.length + ' 已上传</span></div>' +
    nodeRows +
    (editable && allDone
      ? '<button class="btn btn-primary btn-block" style="margin-top:12px" data-act="request-accept" data-id="' + o.id + '">全部节点完成，发起验收</button>'
      : '') +
    (editable && !allDone
      ? '<button class="btn btn-gray btn-block" style="margin-top:12px" data-act="apply-delay" data-id="' + o.id + '">申请工期延长（不加价）</button>'
      : '') +
  '</div>';

  /* 验收评分（已完成） */
  var scoreCard = '';
  if (o.status === '已完成' && o.score) {
    var s = o.score;
    var dims = [
      ['施工质量', s.quality], ['现场卫生', s.hygiene],
      ['用户评价', s.rating], ['响应时效', s.speed]
    ];
    scoreCard = '<div class="card"><div class="card-title">验收评分<span class="more">综合 ' + s.overall.toFixed(1) + '</span></div>' +
      dims.map(function (d) {
        return '<div class="score-bar-row"><span class="nm">' + d[0] + '</span>' +
          '<span class="bar"><i style="width:' + (d[1] / 5 * 100) + '%"></i></span>' +
          '<span class="val">' + d[1].toFixed(1) + '</span></div>';
      }).join('') +
      '<div class="node-remark" style="margin-top:8px">💬 客户评价：' + U.esc(s.comment) + '</div>' +
    '</div>';
  }

  /* 时间线 */
  var tl = '<div class="card"><div class="card-title">流程记录</div><div class="timeline">' +
    o.timeline.map(function (t) {
      return '<div class="tl-item"><div class="t1">' + U.esc(t.text) + '</div><div class="t2">' + U.timeStr(t.time) + '</div></div>';
    }).join('') +
  '</div></div>';

  return '' +
    '<div class="back-bar"><span class="bk" data-act="go" data-go="#/orders">‹</span>订单详情</div>' +
    '<div class="page">' +
      '<div class="status-banner ' + bn[0] + '"><div class="ttl">' + bn[1] + '</div><div class="sub">' + bn[2] + '</div></div>' +
      confirmBar + info + nodeCard + scoreCard + tl +
    '</div>';
};
