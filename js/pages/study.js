/* 课堂 / 学习任务 / 课程详情 / 评级 / 考试 / 成长 / 荣誉 */
window.Pages = window.Pages || {};
(function () {
  var U = window.UI;

  function courseCard(c, act, actAct) {
    return '<div class="course-card" data-act="open-lesson" data-id="' + c.id + '">' +
      '<div class="course-thumb"><span class="badge ' + (c.done ? 'done' : 'todo') + '">' + (c.done ? '已学习' : '未学习') + '</span></div>' +
      '<div class="course-info"><div class="tt">' + U.esc(c.title) + '</div>' +
      '<div class="meta">' + U.esc(c.hours) + '</div>' +
      (c.learners ? '<div class="meta">' + U.esc(c.learners) + '</div>' : '') +
      (c.seen ? '<div class="meta">' + U.esc(c.seen) + '</div>' : '') +
      '<div class="act"><span class="btn small ' + (act === '继续学习' || act === '再次学习' ? 'line' : 'line') + '" data-act="open-lesson" data-id="' + c.id + '">' + act + '</span></div>' +
      '</div></div>';
  }

  /* ---------- 课堂 ---------- */
  Pages.study = function (S) {
    return U.nav('课堂', '发布课程', 'publish-video', true) +
      '<div class="sec" style="margin-top:12px;">学习任务<span class="more" data-act="go" data-go="#/tasks">更多</span></div>' +
      S.tasks.map(function (t) {
        return '<div class="task-banner" data-act="go" data-go="#/tasks">' +
          '<div class="tt">' + U.esc(t.title) + '</div><div class="ss">' + U.esc(t.sub) + '</div>' +
          '<span class="corner">' + U.esc(t.kind) + '</span></div>' +
          '<div class="card" style="margin-top:-4px;"><b style="font-size:15px;">' + U.esc(t.course) + '</b>' +
          '<div class="sub" style="margin-top:6px;">' + U.esc(t.desc) + '</div>' +
          '<div class="sub" style="margin-top:6px;">' + U.esc(t.left) + '&nbsp;&nbsp;|&nbsp;&nbsp;' + U.esc(t.hours) + '</div></div>';
      }).join('') +
      '<div class="sec">学习记录<span class="more" data-act="go" data-go="#/tasks">更多</span></div>' +
      courseCard({ id: S.history.id, title: S.history.title, hours: S.history.hours, seen: S.history.seen, done: true }, '继续学习') +
      '<div class="sec">推荐课程<span class="more" data-act="go" data-go="#/tasks">查看全部课程</span></div>' +
      S.recommends.map(function (c) { return courseCard(c, c.done ? '播放' : '播放'); }).join('') +
      '<div class="btn-row" style="margin-bottom:20px;">' +
        '<div class="btn outline" data-act="go" data-go="#/tasks">全部课程</div>' +
        '<div class="btn primary" data-act="go" data-go="#/exams">去考试</div></div>';
  };

  /* ---------- 学习任务 ---------- */
  Pages.tasks = function (S) {
    var tab = window._taskTab || '未完成';
    return U.nav('学习任务') +
      '<div class="seg"><div class="item' + (tab === '未完成' ? ' on' : '') + '" data-act="task-tab" data-tab="未完成">未完成</div>' +
      '<div class="item' + (tab === '已完成' ? ' on' : '') + '" data-act="task-tab" data-tab="已完成">已完成</div></div>' +
      S.groups.map(function (g) {
        var match = tab === '已完成' ? g.done : !g.done;
        if (!match) {
          return '<div class="group-head"><span>🎓</span><span>' + U.esc(g.name) + '</span><span class="cnt">' + U.esc(g.count) + '</span></div>' +
            '<div class="group-desc">' + U.esc(g.desc) + '</div>';
        }
        return '<div class="group-head"><span>🎓</span><span>' + U.esc(g.name) + '</span><span class="cnt">' + U.esc(g.count) + '</span><span class="fold">▴</span></div>' +
          '<div class="group-desc">' + U.esc(g.desc) + '</div>' +
          S.lessons.map(function (l) {
            return courseCard({ id: l.id, title: l.title, hours: '课时: ' + l.hours, learners: '已上课人数: ' + l.learners + '人', done: l.done },
              l.done ? '再次学习' : '继续学习');
          }).join('');
      }).join('');
  };

  /* ---------- 课程视频详情 ---------- */
  Pages.lesson = function (S, id) {
    var l = Store.lesson(id) || S.lessons[0];
    return /* 沉浸式头部 */ '' +
      '<div class="video-box"><span class="play" data-act="toast" data-msg="开始播放（演示）">▶</span>' +
        '<div class="video-bar"><span>▶</span><span class="track"><i></i></span><span>' + U.esc(l.learned) + '/' + U.esc(l.hours) + '</span><span>🔊</span><span>⤢</span></div></div>' +
      '<div style="position:sticky;top:0;z-index:20;"><div class="nav" style="box-shadow:0 1px 4px rgba(0,0,0,.06);">' +
        '<span class="back" data-act="back">' + U.ic.back + '</span><span class="title" style="text-align:left;margin-left:2px;font-size:16px;">' + U.esc(l.title) + '（' + U.esc(l.cat) + '）</span>' +
        '<span class="tag gray" style="margin-right:32px;">' + (l.done ? '已学习' : '未学习') + '</span></div></div>' +
      '<div class="card" style="margin-top:10px;">' +
        '<div class="sub">上传者：' + U.esc(l.uploader) + '&nbsp;&nbsp;·&nbsp;&nbsp;课时：' + U.esc(l.hours) + '&nbsp;&nbsp;·&nbsp;&nbsp;已学时长：' + U.esc(l.learned) + '</div>' +
        '<div class="sub" style="margin-top:6px;">已学习人数：' + l.learners + '人</div>' +
        '<div class="sub" style="margin-top:10px;font-size:14px;color:#1A1A1A;">♥ <b>' + l.likes + '</b> 人赞过</div>' +
      '</div>' +
      '<div class="sec">评论（' + (S.comments.length + 1) + '）</div>' +
      S.comments.map(function (c) {
        return '<div class="comment"><span class="ava" style="background:' + c.color + ';">' + U.esc(c.name[0]) + '</span>' +
          '<div class="bd"><div style="display:flex;justify-content:space-between;"><span class="nm">' + U.esc(c.name) + '</span><span class="tm">' + U.esc(c.time) + '</span></div>' +
          '<div class="txt">' + U.esc(c.text) + '</div>' +
          (c.reply ? '<div class="reply"><b style="color:' + (c.reply.color || '#0B5B45') + ';">' + U.esc(c.reply.name) + '</b>：' + U.esc(c.reply.text) + '</div>' : '') +
          '</div></div>';
      }).join('') +
      '<div class="bottom-bar">' +
        '<div class="btn outline" data-act="toast" data-msg="全部评论（演示）">查看全部评论</div>' +
        '<div class="btn primary" data-act="add-comment" data-id="' + l.id + '">我要评论</div></div>';
  };

  /* ---------- 发布视频 ---------- */
  Pages.publishVideo = function (S) {
    return U.nav('发布视频', '发布', 'do-publish', true) +
      '<div class="card"><div class="muted" style="font-size:14px;">请输入视频标题…</div>' +
      '<div class="photo-grid" style="margin:16px 0 0;"><div class="ph-box" style="width:140px;height:100px;display:flex;align-items:center;justify-content:center;font-size:26px;color:#fff;">▶</div></div></div>';
  };

  /* ---------- 评级 ---------- */
  Pages.rating = function (S) {
    var w = S.worker, r = w.rating;
    return U.nav('评级', '成长记录', 'go-growth') +
      '<div class="gold-head">' +
        '<div class="who"><span class="ava">' + w.avatar + '</span><span class="nm">' + U.esc(w.name) + '</span><span class="tag gold">' + U.esc(w.level) + '</span></div>' +
        '<div class="stat"><span>◉ 已完成课程：<b>' + w.doneLessons + '</b> 节</span><span>📖 剩余课程：<b>' + w.leftLessons + '</b>节</span></div>' +
        '<span class="btn small gold gold-btn" data-act="go" data-go="#/rating-guide">查看评级说明</span>' +
        '<div style="position:absolute;right:18px;top:10px;font-size:40px;">👑</div>' +
      '</div>' +
      '<div class="card"><b style="font-size:15px;">进行中的评级</b>' +
        '<div class="sub" style="margin-top:10px;">📺 ' + r.nowProgress + ' / ' + r.nowTotal + ' 课节</div>' +
        '<div class="sub" style="margin-top:6px;">🕐 ' + U.esc(r.period) + '</div>' +
        '<div class="sub" style="margin-top:6px;">未参加晋级课程，暂不支持派单、预约、晋级、考试</div>' +
        '<div style="display:flex;margin-top:14px;border-top:1px solid var(--line);padding-top:14px;">' +
          '<div style="flex:1;text-align:center;" class="link-green" data-act="go" data-go="#/study">去学习</div>' +
          '<div style="flex:1;text-align:center;color:#C2C2C2;">去考试</div></div>' +
      '</div>' +
      '<div class="card"><b style="font-size:15px;">晋升下一等级</b>' +
        '<div style="display:flex;align-items:center;gap:10px;margin-top:12px;">' +
          '<span style="font-size:26px;">🎖️</span><b>' + U.esc(r.next) + '</b>' +
          '<span class="sub" style="margin-left:8px;">📺 ' + r.nextProgress + ' / ' + r.nextTotal + ' 课节</span>' +
          '<span class="sub">🎓 ' + r.nextScore + '分</span></div>' +
      '</div>' +
      '<div class="card"><b style="font-size:15px;">' + U.esc(r.next) + '级别权益</b>' +
        '<div class="sub" style="margin-top:10px;line-height:2;">1.可预约技师级别的项目<br>2.可学习技师级别的提升课程<br>3.可获得更多的派单金额</div></div>';
  };

  /* ---------- 评级说明 ---------- */
  Pages.ratingGuide = function (S) {
    var w = S.worker;
    return U.nav('评级说明') +
      '<div class="std-title" style="font-size:17px;">我的等级</div>' +
      '<div class="sub" style="margin:0 14px;">距离您下次晋级还需&nbsp;&nbsp;📺 ' + w.rating.nextProgress + ' / ' + w.rating.nextTotal + ' 课节&nbsp;&nbsp;|&nbsp;&nbsp;🎓 ' + w.rating.nextScore + '分</div>' +
      ['初级', '中级', '高级', '技师', '高级技师'].map(function (lv) {
        return '<div class="guide-block"><div class="tt">' + lv + '</div><div class="bd">' + U.esc(S.ratingGuide) + '</div></div>';
      }).join('') +
      '<div class="rate-table">' +
        '<div class="tr th"><div>级别</div><div>学习课时</div><div>考试</div><div>考试成绩</div></div>' +
        S.ratingLevels.map(function (r) {
          return '<div class="tr"><div class="td">' + U.esc(r.lv) + '</div><div class="td">' + U.esc(r.lessons) + '</div><div class="td">' + U.esc(r.exam) + '</div><div class="td">' + U.esc(r.score) + '</div></div>';
        }).join('') +
      '</div>';
  };

  /* ---------- 考试 ---------- */
  Pages.exams = function (S) {
    var tab = window._examTab || '进行中';
    var tabs = ['进行中', '未开始', '未出成绩', '已出成绩'];
    var list = S.exams.filter(function (e) { return e.state === tab; });
    return U.nav('考试', '历史考试', 'toast-hist') +
      '<div class="seg">' + tabs.map(function (t) {
        return '<div class="item' + (t === tab ? ' on' : '') + '" data-act="exam-tab" data-tab="' + t + '">' + t + '</div>';
      }).join('') + '</div>' +
      (list.length ? list.map(function (e) {
        return '<div class="exam-card" data-act="toast" data-msg="进入考试（演示）">' +
          '<div class="cover"><span class="pen">✒️</span></div>' +
          '<div class="bd"><div class="tt">' + U.esc(e.title) + '</div>' +
          '<div class="meta">时间：' + U.esc(e.time) + '</div>' +
          '<div class="meta">考试形式：<span class="hl">' + U.esc(e.form) + '</span>&nbsp;&nbsp;&nbsp;&nbsp;已参与：' + e.joined + '人</div>' +
          (e.state === '已出成绩' ? '<div class="meta">考试成绩：理论 <span class="hl">' + e.theory + ' 分</span> / 实操 <span class="hl">' + e.ops + ' 分</span></div>' : '') +
          '</div></div>';
      }).join('') : '<div class="empty-tip">没有更多了</div>');
  };

  /* ---------- 成长记录 ---------- */
  Pages.growth = function (S) {
    return U.nav('成长记录') + S.growth.map(function (g) {
      return '<div class="growth-card"><div class="tt">' + U.esc(g.title) + '</div>' +
        '<div class="bd"><span class="medal" style="background:' + g.color + ';">' + g.medal + '</span>' +
        '<div><div class="up">' + U.esc(g.up) + '</div><div class="when">' + U.esc(g.time) + '</div></div></div></div>';
    }).join('');
  };

  /* ---------- 我的荣誉 ---------- */
  Pages.honors = function (S) {
    return U.nav('我的荣誉') + S.honors.map(function (h) {
      return '<div class="honor-card"><div class="cover">🏆 ' + U.esc(h.cover) + ' 🏆</div>' +
        '<div class="bd"><div class="tt" style="font-size:15px;font-weight:600;">' + U.esc(h.title) + '</div>' +
        '<div class="sub" style="margin-top:8px;">奖金金额：<span class="money">' + U.esc(h.amount) + '</span></div>' +
        '<div class="sub" style="margin-top:5px;">获奖时间：' + U.esc(h.time) + '</div></div></div>';
    }).join('');
  };
})();
