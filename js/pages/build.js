/* 施工中：周排期 / 项目详情 / 施工节点 / 施工安排日历 / 调整安排 */
window.Pages = window.Pages || {};
(function () {
  var U = window.UI;
  var WD = ['一', '二', '三', '四', '五', '六', '日'];

  function ymd(d) {
    var p = function (x) { return (x < 10 ? '0' : '') + x; };
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  }
  function monday(d) {
    var m = new Date(d); var w = (m.getDay() + 6) % 7;
    m.setDate(m.getDate() - w); m.setHours(0, 0, 0, 0); return m;
  }

  /* ---------- 施工中（tab） ---------- */
  Pages.build = function (S) {
    var base = window._buildWeek || monday(new Date());
    var sel = window._buildSel != null ? window._buildSel : new Date().getDate();
    var monthLabel = (base.getMonth() + 1) + '月';
    var strip = '';
    for (var i = 0; i < 7; i++) {
      var d = new Date(base); d.setDate(base.getDate() + i);
      var isToday = ymd(d) === ymd(new Date());
      var has = S.schedule.some(function (s) { return s.day === d.getDate() && d.getMonth() === new Date().getMonth(); });
      strip += '<div class="wd' + (isToday ? ' today' : '') + (d.getDate() === sel ? ' sel' : '') +
        '" data-act="build-day" data-day="' + d.getDate() + '"><div class="n">' + d.getDate() + '</div>' +
        (has && !isToday ? '<div class="dot"></div>' : '') + '</div>';
    }
    var cards = S.projects.map(function (p) {
      return '<div class="plan-card" data-act="open-proj" data-id="' + p.id + '">' +
        '<div class="hd">' + U.tag(p.tag) + '<span class="name">' + U.esc(p.name) + '</span></div>' +
        '<div class="addr">' + U.ic.pin + '<span>' + U.esc(p.addr) + '</span></div>' +
        p.nodes.map(function (n) {
          return '<div class="node-line"><span class="nm">' + U.esc(n.name) +
            (n.over > 0 ? '<span class="over">（逾期' + n.over + '天）</span>' : '') + '</span>' +
            '<span class="est">' + U.ic.clock + '<span>' + U.esc(n.est) + '</span></span></div>';
        }).join('') + '</div>';
    }).join('');
    return /* 无页头：tab 页 */ '' +
      '<div class="month-head"><span class="m">' + U.esc(monthLabel) + '</span><span class="muted" style="font-size:18px;">🔍</span></div>' +
      '<div class="week-strip">' + strip + '</div>' + cards +
      '<div class="fab" data-act="go" data-go="#/schedule">' + U.ic.cal + '<span>施工安排</span></div>' +
      '<div style="height:70px;"></div>';
  };

  /* ---------- 全部接单记录 ---------- */
  Pages.records = function (S) {
    var tab = window._recTab || '待施工';
    var tabs = ['待施工', '施工中', '结算中', '已结算'];
    var list = S.records.filter(function (r) { return r.status === tab; });
    return U.nav('全部接单记录') +
      '<div class="seg">' + tabs.map(function (t) {
        return '<div class="item' + (t === tab ? ' on' : '') + '" data-act="rec-tab" data-tab="' + t + '">' + t + '</div>';
      }).join('') + '</div>' +
      (list.length ? list.map(function (r) {
        return '<div class="order-card">' +
          '<div class="hd">' + U.tag(r.tag) + '<span class="name">' + U.esc(r.name) + '</span><span class="tag solid">' + U.esc(r.status) + '</span></div>' +
          '<div class="addr">' + U.ic.pin + '<span>' + U.esc(r.addr) + '</span></div>' +
          '<div class="mid"><span>施工内容</span><span class="date">' + U.ic.clock + '<span>' + U.esc(r.range) + '</span></span></div>' +
          '<div class="desc">' + U.esc(r.desc) + '</div></div>';
      }).join('') : '<div class="empty-tip">没有更多了</div>');
  };

  /* ---------- 项目详情（施工节点 / 图纸 / 物料配送 / 结算记录） ---------- */
  Pages.project = function (S, id) {
    var p = Store.proj(id);
    if (!p) return U.nav('项目详情') + '<div class="empty-tip">项目不存在</div>';
    var tab = window._projTab || '施工节点';
    var body = '';
    if (tab === '施工节点') {
      body = '<div class="std-title">我的施工节点</div>' +
        '<div class="work-line" style="margin:0 12px;border-radius:8px;">' + p.nodes.map(function (n, i) {
          return '<div class="wl" data-act="open-node" data-id="' + p.id + '" data-idx="' + i + '">' +
            '<span class="ic">' + U.ic.tool + '</span><span class="nm">' + U.esc(n.name) + '</span>' +
            '<span class="meta"><div class="qm">X ' + U.esc(n.qty) + '</div><div class="qm">' + U.esc(n.planStart) + '</div></span>' +
            '<span class="arrow">›</span></div>';
        }).join('') + '</div>' +
        '<div style="text-align:center;margin:14px 0;" class="link-green" data-act="toast" data-msg="演示数据仅含当前工序">查看下一道工序</div>';
    } else if (tab === '图纸') {
      body = '<div class="std-title">效果图</div>' +
        '<div class="photo-grid" style="margin-left:12px;"><div class="ph-box" style="width:200px;height:130px;display:flex;align-items:flex-end;justify-content:center;color:#8A7A5E;font-size:12px;padding-bottom:8px;">' + U.esc(p.drawings.effect) + '</div></div>' +
        '<div class="std-title">施工图</div>' +
        '<div class="photo-grid" style="margin-left:12px;"><div class="ph-box" style="width:200px;height:130px;display:flex;align-items:flex-end;justify-content:center;color:#8A7A5E;font-size:12px;padding-bottom:8px;background:repeating-linear-gradient(45deg,#F2EEE6,#F2EEE6 6px,#EAE4D6 6px,#EAE4D6 12px);">' + U.esc(p.drawings.plan) + '</div></div>';
    } else if (tab === '物料配送') {
      body = p.materials.map(function (m) {
        return '<div class="card">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;">' +
          '<b style="font-size:15px;">' + U.esc(m.code) + '</b>' +
          '<span class="tag ' + (m.status === '待出库' ? 'line' : 'gray') + '">' + U.esc(m.status) + '</span>' +
          '<span class="sub">计划 ' + U.esc(m.plan) + '</span></div>' +
          m.items.map(function (it) {
            return '<div style="display:flex;justify-content:space-between;font-size:13px;color:#666;padding:8px 0 0;"><span>' + U.esc(it.split(' ×')[0]) + '</span><span>X' + U.esc(it.split(' ×')[1] || '') + '</span></div>';
          }).join('') + '</div>';
      }).join('');
    } else {
      body = p.settlements.map(function (st) {
        return '<div class="card" style="cursor:pointer;" data-act="toast" data-msg="结算详情（演示）">' +
          '<div class="sub">' + U.esc(st.name) + '：' + U.esc(st.amount) + '</div>' +
          '<div class="sub" style="margin-top:6px;">结算状态：' + U.esc(st.status) + '</div>' +
          '<div class="sub" style="margin-top:6px;">结算时间：' + U.esc(st.time) + '</div>' +
          '<div style="text-align:right;" class="arrow">›</div></div>';
      }).join('');
    }
    return U.nav(p.name) +
      '<div class="proj-head">' +
        '<div class="rowline"><span class="k">项目名称</span><span class="v"><b>' + U.esc(p.name) + '</b>&nbsp;' + U.tag(p.tag) + '&nbsp;<span class="tag solid">' + U.esc(p.phase) + '</span></span></div>' +
        '<div class="rowline"><span class="k">施工地址</span><span class="v">' + U.esc(p.addr) + '</span></div>' +
        '<div class="rowline"><span class="k">项目周期</span><span class="v">' + U.esc(p.cycle) + '</span></div>' +
        '<div class="rowline"><span class="k">项目主管</span><span class="v">' + U.esc(p.manager) + '&nbsp;<b class="link-green">📞</b></span></div>' +
      '</div>' +
      '<div class="proj-tabs">' + ['施工节点', '图纸', '物料配送', '结算记录'].map(function (t) {
        return '<div class="pt' + (t === tab ? ' on' : '') + '" data-act="proj-tab" data-tab="' + t + '">' + t + '</div>';
      }).join('') + '</div>' + body;
  };

  /* ---------- 施工节点详情 ---------- */
  Pages.node = function (S, id, idx) {
    var p = Store.proj(id); var n = p && p.nodes[Number(idx)];
    if (!n) return U.nav('施工节点详情') + '<div class="empty-tip">节点不存在</div>';
    var stTag = n.status === '已完成' ? '<span class="tag solid">已提交</span>' : '<span class="tag line">待提交</span>';
    return U.nav('施工节点详情') +
      '<div class="card">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;">' +
          '<b style="font-size:16px;">' + U.esc(n.name) + '</b>' +
          '<span>' + (n.over > 0 ? '<span class="money" style="font-size:12px;font-weight:400;">（逾期' + n.over + '天）</span> ' : '') + stTag + '</span>' +
        '</div>' +
        '<div class="sub" style="margin-top:10px;">🔧 工程量：' + U.esc(n.qty) + '</div>' +
        '<div class="sub" style="margin-top:6px;">🕐 计划开始时间：' + U.esc(n.planStart) + '</div>' +
        '<div class="sub" style="margin-top:6px;">🕐 实际完成时间：' + U.esc(n.planEnd) + '</div>' +
      '</div>' +
      '<div class="std-title">验收标准<span class="look" data-act="toast" data-msg="验收标准：' + U.esc(n.name) + '">点击查看</span></div>' +
      '<div class="std-title" style="margin-top:0;">' + U.esc(n.name) + '情况</div>' +
      '<div class="tip-green">' + U.esc(n.require || '按验收标准完成施工并留存影像') + '</div>' +
      '<div class="std-title" style="margin-top:0;">照片样例（1张）</div>' +
      '<div class="photo-grid"><div class="ph-box"></div></div>' +
      '<div class="shot-req">' + U.esc(n.shotReq || '拍摄要求（不少于1张）') + '</div>' +
      '<div class="photo-grid">' +
        (n.photos || []).map(function () { return '<div class="ph-box"><span class="x" data-act="node-delphoto" data-id="' + id + '" data-idx="' + idx + '">✕</span></div>'; }).join('') +
        (n.status !== '已完成' ? '<div class="add-box" data-act="node-upload" data-id="' + id + '" data-idx="' + idx + '">+</div>' : '') +
      '</div>' +
      '<div class="std-title">说明</div>' +
      '<div class="textarea-wrap"><textarea class="textarea" id="node-remark" maxlength="50" placeholder="请输入您的内容…"></textarea><span class="count" id="node-count">0/50</span></div>' +
      '<div class="voice-btn" data-act="toast" data-msg="按住说话（演示）">' + U.ic.mic + '</div>' +
      '<div class="voice-label">按住说话</div>' +
      '<div class="std-title">施工标准</div>' +
      '<div class="std-list">' + (n.std || []).map(function (s, i) { return (i + 1) + '. ' + U.esc(s); }).join('<br>') + '</div>' +
      '<div class="bottom-bar"><div class="btn primary" data-act="node-publish" data-id="' + id + '" data-idx="' + idx + '">发布日报</div></div>';
  };

  /* ---------- 施工安排（日历） ---------- */
  Pages.schedule = function (S) {
    var ref = window._calMonth || new Date();
    var y = ref.getFullYear(), m = ref.getMonth();
    var first = new Date(y, m, 1);
    var lead = (first.getDay() + 6) % 7;         /* 周一开头 */
    var days = new Date(y, m + 1, 0).getDate();
    var today = new Date();
    var cells = '';
    var i;
    for (i = 0; i < lead; i++) cells += '<div class="cal-cell empty"></div>';
    for (i = 1; i <= days; i++) {
      var ent = S.schedule.filter(function (s) { return s.day === i; });
      var cls = '', tag = '';
      if (ent.length) {
        var done = ent.every(function (e) { return e.done; });
        if (done) cls = 'done';
        else if (ent.length > 1) cls = 'full';
        else cls = ent[0].seg === '全天' ? 'full' : 'half';
        tag = '<span class="seg-tag">' + (ent.length > 1 ? '全天' : ent[0].seg) + '</span>';
      }
      var dot = (y === today.getFullYear() && m === today.getMonth() && i === today.getDate())
        ? '<span class="today-dot">' + i + '</span>' : '';
      cells += '<div class="cal-cell ' + cls + '" data-act="cal-day" data-day="' + i + '">' + i + tag + dot + '</div>';
    }
    return U.nav('施工安排', '调整记录', 'go-resched') +
      '<div class="cal-head"><span class="m"><span class="arr">‹</span> ' + y + '年' + (m + 1) + '月 <span class="arr">›</span></span>' +
      '<span class="cal-owner"><span class="ava">欧</span>欧阳震华</span></div>' +
      '<div class="cal-grid"><div class="cal-weekrow">' + WD.map(function (w) { return '<div>' + w + '</div>'; }).join('') + '</div>' +
      '<div class="cal-cells">' + cells + '</div></div>' +
      '<div class="cal-legend">' +
        '<span><i style="background:var(--green-mid);"></i>已安排</span>' +
        '<span><i style="background:#fff;border:1px solid #E5E5E5;"></i>未安排</span>' +
        '<span><i style="background:var(--blue-light);"></i>已完成</span></div>';
  };

  /* ---------- 添加安排 ---------- */
  Pages.scheduleAdd = function (S) {
    var t = window._addDay || new Date();
    var label = (t.getMonth() + 1) + '月' + t.getDate() + '日';
    return U.nav('添加安排') +
      '<div class="rows" style="margin-top:0;">' +
        '<div class="form-cell"><span class="label">施工日期</span><span class="val">' + U.esc(label) + '</span></div>' +
        '<div class="form-cell"><span class="label">施工时长</span><span class="val" id="add-len" data-act="cycle-len">' + U.esc(window._addLen || '全天') + ' ›</span></div>' +
        '<div class="form-cell"><span class="label">连续天数</span><span class="val">' + U.esc(window._addDays || '1天') + '</span></div>' +
      '</div>' +
      '<div class="form-label">备注</div>' +
      '<div class="textarea-wrap"><textarea class="textarea" id="add-note" maxlength="50" placeholder="请输入内容"></textarea><span class="count">0/50</span></div>' +
      '<div style="height:120px;"></div>' +
      '<div class="bottom-bar"><div class="btn primary" data-act="add-schedule">确定</div></div>';
  };

  /* ---------- 调整施工安排 ---------- */
  Pages.reschedule = function (S) {
    var days = (window._reschedDays || []).map(function (d) {
      return (d.getMonth() + 1) + '月' + d.getDate() + '日';
    });
    return U.nav('调整施工安排') +
      '<div class="card"><div class="sub" style="font-weight:600;color:#1A1A1A;">原施工日期</div>' +
      '<div class="sub" style="margin-top:6px;">' + U.esc(days.join('、') || '03月22日、03月23日、03月24日') + '</div></div>' +
      '<div class="form-label">调整为</div>' +
      '<div class="rows" style="margin-top:0;">' +
        '<div class="form-cell"><span class="label">开始日期</span><span class="val ph">请选择 ›</span></div>' +
        '<div class="form-cell"><span class="label">结束日期</span><span class="val ph">请选择 ›</span></div>' +
      '</div>' +
      '<div class="form-label">调整结果预览</div>' +
      '<div class="card" style="text-align:center;"><div style="font-weight:600;">' + (new Date().getFullYear()) + '年' + (new Date().getMonth() + 1) + '月</div>' +
      '<div class="cal-weekrow" style="padding:12px 0 4px;">' + WD.map(function (w) { return '<div>' + w + '</div>'; }).join('') + '</div>' +
      '<div class="sub" style="padding:16px 0;">请选择开始日期与结束日期</div></div>' +
      '<div class="bottom-bar"><div class="btn primary" data-act="submit-resched">提交</div></div>';
  };

  /* ---------- 调整记录详情 ---------- */
  Pages.reschedDetail = function (S, id) {
    var r = S.reschedules.find(function (x) { return x.id === id; }) || S.reschedules[0];
    return U.nav('调整记录详情') +
      '<div class="rows" style="margin-top:0;">' +
        '<div class="cell"><span class="k">项目名称</span><span class="v" style="font-weight:600;">' + U.esc(r.proj) + '</span></div>' +
        '<div class="cell"><span class="k">施工地址</span><span class="v">' + U.esc(r.addr) + '</span></div>' +
        '<div class="cell"><span class="k">项目主管</span><span class="v">' + U.esc(r.manager) + ' 📞</span></div>' +
      '</div>' +
      '<div class="form-label">调整内容</div>' +
      '<div class="rows" style="margin-top:0;">' +
        '<div class="cell"><span class="k">施工节点：</span><span class="v" style="font-weight:600;">' + U.esc(r.node) + '</span></div>' +
        '<div class="cell"><span class="k">原计划：</span><span class="v">' + U.esc(r.plan) + '</span></div>' +
        '<div class="cell"><span class="k">调整为：</span><span class="v">' + U.esc(r.adjust) + '</span></div>' +
        '<div class="cell"><span class="k">备注：</span><span class="v">' + U.esc(r.note) + '</span></div>' +
        '<div class="cell"><span class="voice-bubble">🎙 <span class="bars">| | | |</span> ' + U.esc(r.voice) + '</span></div>' +
      '</div>' +
      '<div class="form-label" style="display:flex;justify-content:space-between;">调整状态<span class="money" style="font-weight:400;">' + U.esc(r.status) + '</span></div>' +
      '<div class="bottom-bar">' +
        '<div class="btn outline" data-act="toast" data-msg="已取消调整">取消调整</div>' +
        '<div class="btn primary" data-act="go" data-go="#/reschedule">重新调整</div></div>';
  };
})();
