/* 报工：到场打卡 → 开工存照 → 每日报进度 → 按交活标准逐项拍照完成报工 */
window.Pages = window.Pages || {};
(function () {
  var U = window.UI;

  function todayStr() {
    var d = new Date(), p = function (x) { return (x < 10 ? '0' : '') + x; };
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  }
  function nowTime() {
    var d = new Date(), p = function (x) { return (x < 10 ? '0' : '') + x; };
    return p(d.getHours()) + ':' + p(d.getMinutes());
  }

  var STAGES = ['到场打卡', '开工存照', '每日报工', '交活报工'];
  /* 阶段 → 步骤序号（0 起）：已结束视为全部走完 */
  function stepOf(stage) {
    return { '待打卡': 0, '待存照': 1, '施工中': 2, '交活中': 3, '已结束': 4 }[stage] || 0;
  }

  /* 步骤条 */
  function steps(stage) {
    var cur = stepOf(stage);
    return '<div class="rep-steps">' + STAGES.map(function (s, i) {
      var cls = i < cur ? 'done' : (i === cur ? 'on' : '');
      var dot = i < cur
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m4.5 12.5 5 5 10-11"/></svg>'
        : String(i + 1);
      return '<div class="rs ' + cls + '"><span class="dot">' + dot + '</span><span>' + s + '</span></div>';
    }).join('<span class="rs-bar' + (cur > 0 ? ' passed' : '') + '"></span>') + '</div>';
  }

  /* 照片墙（上限 9 张） */
  function photoWall(list, id, addAct, delAct, max) {
    var html = (list || []).map(function () {
      return '<div class="ph-box"><span class="x" data-act="' + delAct + '" data-id="' + id + '">✕</span></div>';
    }).join('');
    if ((list || []).length < (max || 9)) {
      html += '<div class="add-box" data-act="' + addAct + '" data-id="' + id + '">+</div>';
    }
    return '<div class="photo-grid">' + html + '</div>';
  }

  /* 阶段一：到场打卡 */
  function stageCheckin(p) {
    return '<div class="card" style="text-align:center;padding:26px 16px 30px;">' +
      '<div style="font-size:16px;font-weight:600;">到达工地先打卡</div>' +
      '<div class="sub" style="margin-top:8px;line-height:1.8;">拍照记录到场时间与定位，<br>打卡后才能开始报工</div>' +
      '<div class="punch-btn" data-act="rep-checkin" data-id="' + p.id + '">' +
        U.ic.camera + '<span>拍照打卡</span></div>' +
      '<div class="sub">今日 ' + todayStr() + ' · 定位：' + U.esc(p.addr) + '</div>' +
    '</div>';
  }

  /* 阶段二：开工存照 */
  function stageScene(p, r) {
    return '<div class="std-title">现场情况（开工前）</div>' +
      '<div class="tip-green">拍下开工前的现场情况留底，出现争议可追溯；至少 1 张</div>' +
      photoWall(r.scene, p.id, 'rep-scene-add', 'rep-scene-del') +
      '<div style="height:96px;"></div>' +
      '<div class="bottom-bar">' +
        (r.scene.length
          ? '<div class="btn primary" data-act="rep-start" data-id="' + p.id + '">开始干活</div>'
          : '<div class="btn primary disabled">开始干活</div>') +
      '</div>';
  }

  /* 阶段三：每日报进度 */
  function stageDaily(p, r) {
    var dailies = (r.dailies || []).slice().reverse();
    var hist = dailies.length ? dailies.map(function (d) {
      return '<div class="daily-item">' +
        '<div class="d-head"><span class="date">' + U.esc(d.d) + '</span><span class="cnt">' + d.photos + ' 张照片</span></div>' +
        (d.note ? '<div class="note">' + U.esc(d.note) + '</div>' : '') +
      '</div>';
    }).join('') : '<div class="empty-tip">还没有报过进度</div>';

    return '<div class="std-title">今日进度（' + todayStr() + '）</div>' +
      '<div class="tip-green">每天收工后拍照报当日进度，说明写到哪一步了</div>' +
      photoWall(r.today && r.today.photos ? [1] : [], p.id, 'rep-today-add', 'rep-today-del') +
      '<div class="textarea-wrap"><textarea class="textarea" id="rep-note" maxlength="50" placeholder="今日干了什么、明天接着干什么…"></textarea><span class="count" id="rep-count">0/50</span></div>' +
      '<div class="voice-btn" data-act="toast" data-msg="按住说话（演示）">' + U.ic.mic + '</div>' +
      '<div class="voice-label">按住说话</div>' +
      '<div style="margin:14px 16px 0;"><div class="btn primary" data-act="rep-daily-submit" data-id="' + p.id + '">提交今日进度</div></div>' +
      '<div class="std-title">已报进度</div>' +
      '<div class="daily-list">' + hist + '</div>' +
      '<div style="height:96px;"></div>' +
      '<div class="bottom-bar"><div class="btn outline" data-act="rep-finish-req" data-id="' + p.id + '">活已干完，交活报工</div></div>';
  }

  /* 阶段四：交活报工（按标准逐项拍照） */
  function stageHandover(p, r) {
    var done = (r.standards || []).filter(function (s) { return s.photos > 0; }).length;
    var total = (r.standards || []).length;
    var rows = (r.standards || []).map(function (s, i) {
      return '<div class="std-row' + (s.photos ? ' done' : '') + '" data-act="rep-std-photo" data-id="' + p.id + '" data-idx="' + i + '">' +
        '<span class="no">' + (i + 1) + '</span>' +
        '<span class="nm">' + U.esc(s.name) + '</span>' +
        (s.photos
          ? '<span class="tag solid">已拍 ' + s.photos + ' 张</span>'
          : '<span class="tag line">点击拍照</span>') +
        '<span class="arrow">›</span></div>';
    }).join('');
    return '<div class="std-title">交活标准 · 逐项拍照<span class="look">' + done + '/' + total + ' 项</span></div>' +
      '<div class="tip-green">每一项交活标准都要拍照，全部拍完才能完成报工</div>' +
      '<div class="work-line" style="margin:0 12px;border-radius:8px;">' + rows + '</div>' +
      '<div style="height:96px;"></div>' +
      '<div class="bottom-bar">' +
        (done >= total
          ? '<div class="btn primary" data-act="rep-finish" data-id="' + p.id + '">完成报工，本单结束</div>'
          : '<div class="btn primary disabled">完成报工（还有 ' + (total - done) + ' 项未拍照）</div>') +
      '</div>';
  }

  /* 阶段五：已结束 */
  function stageDone(p, r) {
    var shots = (r.standards || []).reduce(function (a, s) { return a + s.photos; }, 0);
    var dailies = (r.dailies || []).slice().reverse();
    return '<div class="card" style="text-align:center;padding:24px 16px;">' +
      '<div style="width:56px;height:56px;border-radius:50%;background:var(--brand-soft);color:var(--brand);display:flex;align-items:center;justify-content:center;margin:0 auto;">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" style="width:30px;height:30px;"><path d="m4.5 12.5 5 5 10-11"/></svg></div>' +
      '<div style="font-size:16px;font-weight:600;margin-top:12px;">本单报工完成</div>' +
      '<div class="sub" style="margin-top:6px;">等待项目主管验收，验收通过后进入结算</div>' +
    '</div>' +
    '<div class="std-title">报工小结</div>' +
    '<div class="rows" style="margin-top:0;">' +
      '<div class="cell"><span class="k">到场打卡</span><span class="v">' + (r.checkin ? U.esc(r.checkin.date) + ' ' + U.esc(r.checkin.time) : '—') + '</span></div>' +
      '<div class="cell"><span class="k">开工存照</span><span class="v">' + (r.scene || []).length + ' 张</span></div>' +
      '<div class="cell"><span class="k">报进度天数</span><span class="v">' + (r.dailies || []).length + ' 天</span></div>' +
      '<div class="cell"><span class="k">交活照片</span><span class="v">' + shots + ' 张</span></div>' +
    '</div>' +
    '<div class="std-title">已报进度</div>' +
    '<div class="daily-list">' + (dailies.map(function (d) {
      return '<div class="daily-item"><div class="d-head"><span class="date">' + U.esc(d.d) + '</span><span class="cnt">' + d.photos + ' 张照片</span></div>' +
        (d.note ? '<div class="note">' + U.esc(d.note) + '</div>' : '') + '</div>';
    }).join('') || '<div class="empty-tip">无</div>') + '</div>';
  }

  /* ---------- 报工主页 ---------- */
  Pages.report = function (S, id) {
    var p = Store.proj(id);
    if (!p) return U.nav('报工') + '<div class="empty-tip">项目不存在</div>';
    var r = p.report || { stage: '待打卡', checkin: null, scene: [], dailies: [], today: { photos: 0, note: '' }, standards: [] };

    var body;
    if (r.stage === '待打卡') body = stageCheckin(p);
    else if (r.stage === '待存照') body = stageScene(p, r);
    else if (r.stage === '施工中') body = stageDaily(p, r);
    else if (r.stage === '交活中') body = stageHandover(p, r);
    else body = stageDone(p, r);

    return U.nav('报工') +
      '<div class="proj-head" style="padding-bottom:10px;">' +
        '<div class="rowline"><span class="k">项目名称</span><span class="v"><b>' + U.esc(p.name) + '</b>&nbsp;' + U.tag(p.tag) + '&nbsp;<span class="tag solid">' + U.esc(p.phase) + '</span></span></div>' +
        '<div class="rowline"><span class="k">施工地址</span><span class="v">' + U.esc(p.addr) + '</span></div>' +
        '<div class="rowline"><span class="k">项目主管</span><span class="v">' + U.esc(p.manager) + '</span></div>' +
      '</div>' +
      steps(r.stage) +
      body;
  };
})();
