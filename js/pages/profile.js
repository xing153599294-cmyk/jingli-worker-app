/* 我的：档案五要素 + 培训复训 + 评分排名 */
window.Pages = window.Pages || {};
Pages.profile = function (S) {
  var U = window.UI;
  var w = S.worker;
  var sc = w.score;

  var admission = w.training.admission.map(function (t) {
    return '<div class="train-step' + (t.done ? ' done' : '') + '"><div class="box"></div><span>' + U.esc(t.name) + '</span></div>';
  }).join('');

  var retrain = w.retrainDone
    ? '<div class="file-row"><span>本周在岗复训</span><span class="ok">✓ 已完成签到</span></div>'
    : '<div class="file-row"><span>本周在岗复训</span>' +
        '<button class="btn btn-primary btn-sm" data-act="checkin">立即签到</button></div>';

  var dims = sc.dims.map(function (d) {
    return '<div class="score-bar-row"><span class="nm">' + U.esc(d.name) + ' ' + d.weight + '%</span>' +
      '<span class="bar"><i style="width:' + (d.val / 5 * 100) + '%"></i></span>' +
      '<span class="val">' + d.val.toFixed(1) + '</span></div>';
  }).join('');

  return '' +
    '<div class="profile-top">' +
      '<div class="big-avatar">' + U.esc(w.name.charAt(0)) + '</div>' +
      '<div class="nm">' + U.esc(w.name) + ' <span style="font-size:12px;font-weight:400;opacity:.85">师傅</span></div>' +
      '<div class="sub">' + U.esc(w.trade) + ' · ' + U.esc(w.level) + ' · ' + U.esc(w.joinedAt) + ' 加入</div>' +
    '</div>' +
    '<div class="page">' +
      '<div class="card"><div class="card-title">档案五要素</div>' +
        '<div class="file-row"><span>实名认证</span><span class="ok">✓ 已完成</span></div>' +
        '<div class="file-row"><span>技能证书</span><span class="ok">' + U.esc(w.cert.name) + ' · 有效期至 ' + w.cert.expires + '</span></div>' +
        '<div class="file-row"><span>保险保障</span><span class="ok">' + U.esc(w.insurance.name) + ' · 在保至 ' + w.insurance.expires + '</span></div>' +
        '<div class="file-row"><span>主区域</span><span>' + w.regions.main.join('、') + '</span></div>' +
        '<div class="file-row"><span>副区域</span><span>' + w.regions.sub.join('、') + '</span></div>' +
      '</div>' +
      '<div class="card"><div class="card-title">培训与复训</div>' +
        '<div class="muted" style="margin-bottom:6px">准入培训（四阶段）</div>' +
        '<div class="train-steps">' + admission + '</div>' +
        '<div style="margin-top:14px">' + retrain + '</div>' +
      '</div>' +
      '<div class="card"><div class="card-title">我的评分</div>' +
        '<div class="score-hero" style="margin-bottom:10px">' +
          '<div class="big">' + sc.overall.toFixed(1) + '</div>' +
          '<div class="rank">' + U.esc(w.trade) + '组排名第 <b>' + sc.rank + '</b> / ' + sc.total + '<br>' +
          '近 30 天 ' + sc.trend.last30.toFixed(1) + ' · 历史累计 ' + sc.trend.history.toFixed(1) + '</div>' +
        '</div>' + dims +
        '<p class="muted" style="margin-top:10px">综合评分 = （近30天×0.6 + 历史累计×0.4）×0.8 + 意愿度×0.2，影响派单优先级与排名</p>' +
      '</div>' +
      '<div class="card" data-act="reset" style="cursor:pointer"><div class="file-row" style="border:none;padding:2px 0"><span style="color:#dc2626">重置演示数据</span><span class="muted">›</span></div></div>' +
    '</div>';
};
