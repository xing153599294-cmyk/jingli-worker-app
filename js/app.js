/* 应用入口：路由 + 底部导航 + 全部交互动作 */
(function () {
  var U = window.UI;
  window._S = window.Store.load();

  var TABS = [
    { hash: '#/home', label: '首页', icon: 'home' },
    { hash: '#/grab', label: '接单', icon: 'grab' },
    { hash: '#/build', label: '施工中', icon: 'build' },
    { hash: '#/me', label: '我的', icon: 'me' }
  ];

  function renderTabbar(active) {
    document.getElementById('tabbar').innerHTML = TABS.map(function (t) {
      return '<div class="tab' + (active === t.hash ? ' on' : '') +
        '" data-act="go" data-go="' + t.hash + '">' + U.tabIcons[t.icon] + '<span>' + t.label + '</span></div>';
    }).join('');
  }

  function render() {
    var hash = location.hash || '#/home';
    var seg = hash.slice(2).split('/');          /* 去掉 '#/' */
    var base = seg[0] || 'home';
    var P = window.Pages, html;

    if (base === 'home') html = P.home(window._S);
    else if (base === 'notices') html = P.notices(window._S);
    else if (base === 'notice') html = P.noticeDetail(window._S, seg[1]);
    else if (base === 'messages') html = P.messages(window._S);
    else if (base === 'grab') html = P.grab(window._S);
    else if (base === 'grab-detail') html = P.grabDetail(window._S, seg[1]);
    else if (base === 'build') html = P.build(window._S);
    else if (base === 'records') html = P.records(window._S);
    else if (base === 'project') html = P.project(window._S, seg[1]);
    else if (base === 'node') html = P.node(window._S, seg[1], seg[2]);
    else if (base === 'schedule') html = P.schedule(window._S);
    else if (base === 'schedule-add') html = P.scheduleAdd(window._S);
    else if (base === 'reschedule') html = P.reschedule(window._S);
    else if (base === 'resched') html = P.reschedDetail(window._S, seg[1]);
    else if (base === 'rectify') html = P.rectify(window._S);
    else if (base === 'rectify-detail') html = P.rectifyDetail(window._S, seg[1]);
    else if (base === 'study') html = P.study(window._S);
    else if (base === 'tasks') html = P.tasks(window._S);
    else if (base === 'lesson') html = P.lesson(window._S, seg[1]);
    else if (base === 'publish') html = P.publishVideo(window._S);
    else if (base === 'rating') html = P.rating(window._S);
    else if (base === 'rating-guide') html = P.ratingGuide(window._S);
    else if (base === 'exams') html = P.exams(window._S);
    else if (base === 'growth') html = P.growth(window._S);
    else if (base === 'honors') html = P.honors(window._S);
    else if (base === 'mall') html = P.mall(window._S);
    else if (base === 'goods') html = P.goods(window._S, seg[1]);
    else if (base === 'morders') html = P.mallOrders(window._S);
    else if (base === 'morder') html = P.mallOrder(window._S, seg[1]);
    else if (base === 'me') html = P.me(window._S);
    else if (base === 'income') html = P.income(window._S);
    else if (base === 'pending') html = P.pending(window._S);
    else if (base === 'coins') html = P.coins(window._S);
    else if (base === 'feedback') html = P.feedback(window._S);
    else html = P.home(window._S);

    var app = document.getElementById('app');
    app.innerHTML = html;
    app.scrollTop = 0;

    var isTab = TABS.some(function (t) { return t.hash === '#/' + base; });
    document.getElementById('tabbar').style.display = isTab ? 'flex' : 'none';
    renderTabbar(isTab ? '#/' + base : '');
  }

  /* ---------- 动作 ---------- */
  var ACT = {
    'go': function (el) { location.hash = el.dataset.go; },
    'back': function () { history.back(); },
    'modal-close': function () { U.closeModal(); },
    'toast': function (el) { U.toast(el.dataset.msg || '演示操作'); },
    'toast-hist': function () { U.toast('历史考试（演示）'); },
    'toast-coin': function () { U.toast('鲁班币可通过发布施工工艺视频等获得'); },

    /* 公告 / 消息 */
    'open-notice': function (el) { location.hash = '#/notice/' + el.dataset.id; },
    'read-all': function () {
      window._S.messages.forEach(function (m) { m.unread = false; });
      window._S.notices.forEach(function (n) { n.unread = false; });
      Store.save(window._S);
      U.toast('已全部标记为已读');
      render();
    },

    /* 接单 */
    'grab-tab': function (el) { window._grabTab = el.dataset.tab; render(); },
    'open-grab': function (el) { location.hash = '#/grab-detail/' + el.dataset.id; },
    'accept-grab': function (el) {
      var p = Store.grab(el.dataset.id);
      if (!p) return;
      U.closeModal();
      p.accepted = true; p.status = '已接单';
      Store.save(window._S);
      U.toast('接单成功，请安排施工');
      render();
    },

    /* 施工中 */
    'build-day': function (el) { window._buildSel = Number(el.dataset.day); render(); },
    'open-proj': function (el) { window._projTab = '施工节点'; location.hash = '#/project/' + el.dataset.id; },
    'proj-tab': function (el) { window._projTab = el.dataset.tab; render(); },
    'open-node': function (el) { location.hash = '#/node/' + el.dataset.id + '/' + el.dataset.idx; },

    'node-upload': function (el) {
      var p = Store.proj(el.dataset.id); var n = p && p.nodes[Number(el.dataset.idx)];
      if (!n) return;
      n.photos = n.photos || [];
      n.photos.push(1);
      Store.save(window._S);
      U.toast('照片已上传');
      render();
    },
    'node-delphoto': function (el) {
      var p = Store.proj(el.dataset.id); var n = p && p.nodes[Number(el.dataset.idx)];
      if (n && n.photos) { n.photos.pop(); Store.save(window._S); render(); }
    },
    'node-publish': function (el) {
      var p = Store.proj(el.dataset.id); var n = p && p.nodes[Number(el.dataset.idx)];
      if (!n) return;
      if (!(n.photos || []).length) { U.toast('请先上传施工照片'); return; }
      U.confirm('发布成功', '确认是否完成该施工工序？', '确认', 'node-confirm',
        'data-id="' + p.id + '" data-idx="' + el.dataset.idx + '"');
    },
    'node-confirm': function (el) {
      var p = Store.proj(el.dataset.id); var n = p && p.nodes[Number(el.dataset.idx)];
      if (!n) return;
      U.closeModal();
      n.status = '已完成';
      n.remark = (document.getElementById('node-remark') || {}).value || '';
      Store.save(window._S);
      U.toast('日报已发布，该工序已完成');
      history.back();
    },
    'add-comment': function (el) {
      var t = window.prompt('写下你的评论：', '');
      if (!t) return;
      window._S.comments.unshift({ name: window._S.worker.name, time: '刚刚', text: t, color: '#0B5B45' });
      Store.save(window._S);
      U.toast('评论已发布');
      render();
    },

    /* 施工安排日历 */
    'cal-day': function (el) {
      var day = Number(el.dataset.day);
      var ent = window._S.schedule.filter(function (s) { return s.day === day; });
      window._addDay = new Date(new Date().getFullYear(), new Date().getMonth(), day);
      if (!ent.length) {
        location.hash = '#/schedule-add';
        return;
      }
      var e = ent[0];
      var body = e.personal
        ? '<div style="text-align:left;font-size:14px;line-height:2.2;">' +
          '<div class="sub">日程</div><div>个人安排</div>' +
          '<div class="sub" style="margin-top:6px;">状态</div><div>' + (e.done ? '已完成' : '未开始') + '</div></div>'
        : '<div style="text-align:left;font-size:14px;line-height:2.2;">' +
          '<div class="sub">项目主管</div><div>' + U.esc(e.proj ? '王东东 / 13888898998 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6.2 3.6h3.1l1.4 3.6-2 1.4a12.4 12.4 0 0 0 6.7 6.7l1.4-2 3.6 1.4v3.1a2 2 0 0 1-2.2 2A17.6 17.6 0 0 1 4.2 5.8a2 2 0 0 1 2-2.2z"/></svg>' : '') + '</div>' +
          '<div class="sub" style="margin-top:6px;">项目名称</div><div>' + U.esc(e.proj) + '</div>' +
          '<div class="sub" style="margin-top:6px;">施工地址</div><div>北京市海淀区志新北里10号楼1门202</div>' +
          '<div class="sub" style="margin-top:6px;">施工节点</div><div>卫生间墙面防水施工</div>' +
          '<div class="sub" style="margin-top:6px;">状态</div><div>' + (e.done ? '已完成' : '未开始') + '</div></div>';
      U.modal('<div class="tt" style="text-align:left;font-size:15px;">' + (e.personal ? '日程详情' : '施工安排') + '</div>' +
        '<div class="bd" style="margin-top:14px;">' + body + '</div>' +
        '<div class="btns">' +
        '<div class="btn plain" data-act="' + (e.personal ? 'cancel-personal' : 'modal-close') + '" data-day="' + day + '">' + (e.personal ? '取消安排' : '关闭') + '</div>' +
        '<div class="btn primary" data-act="go-resched">调整安排</div></div>');
    },
    'cancel-personal': function (el) {
      var day = Number(el.dataset.day);
      window._S.schedule = window._S.schedule.filter(function (s) { return !(s.day === day && s.personal); });
      Store.save(window._S);
      U.closeModal();
      U.toast('已取消该个人安排');
      render();
    },
    'go-resched': function () { U.closeModal(); location.hash = '#/reschedule'; },
    'cycle-len': function () {
      window._addLen = window._addLen === '全天' ? '上午' : (window._addLen === '上午' ? '下午' : '全天');
      render();
    },
    'add-schedule': function () {
      var d = window._addDay || new Date();
      window._S.schedule.push({ day: d.getDate(), seg: window._addLen || '全天', proj: '个人安排', personal: true, done: false });
      Store.save(window._S);
      U.toast('已添加施工安排');
      location.hash = '#/schedule';
    },
    'submit-resched': function () {
      window._S.reschedules.unshift({
        id: 'R' + (window._S.reschedules.length + 1) + Date.now(),
        proj: '马泺讯融侨建筑', addr: '北京市北京市海淀区志新北里10号楼1门202',
        manager: '王东东 / 13000001111', node: '墙面水泥砂浆找平找方',
        plan: '03-22/全天、03-23/全天、03-24/全天',
        adjust: '03-25/全天、03-26/全天',
        note: '个人原因需调整日程', voice: '45″', status: '待审核'
      });
      Store.save(window._S);
      U.toast('调整申请已提交，等待项目主管审核');
      location.hash = '#/schedule';
    },

    /* 整改单 */
    'rect-tab': function (el) { window._rectTab = el.dataset.tab; render(); },
    'open-rect': function (el) { location.hash = '#/rectify-detail/' + el.dataset.id; },
    'rect-upload': function (el) {
      var r = Store.rectify(el.dataset.id);
      if (!r) return;
      r.photos = (r.photos || 0) + 1;
      Store.save(window._S);
      U.toast('照片已上传');
      render();
    },
    'rect-delphoto': function (el) {
      var r = Store.rectify(el.dataset.id);
      if (r && r.photos) { r.photos--; Store.save(window._S); render(); }
    },
    'rect-submit': function (el) {
      var r = Store.rectify(el.dataset.id);
      if (!r) return;
      if (!r.photos) { U.toast('请先上传整改后照片'); return; }
      r.status = '已完成';
      r.done = true;
      r.reply = (document.getElementById('rect-note') || {}).value || '整改已完成，已重新上传';
      Store.save(window._S);
      U.toast('整改单已提交');
      history.back();
    },

    /* 课堂 / 评级 / 考试 */
    'task-tab': function (el) { window._taskTab = el.dataset.tab; render(); },
    'open-lesson': function (el) { location.hash = '#/lesson/' + el.dataset.id; },
    'publish-video': function () { location.hash = '#/publish'; },
    'do-publish': function () {
      U.confirm('发布成功', '审核通过之后，可获得2积分，<br>积分可用于兑换现金', '确定', 'modal-close');
    },
    'go-growth': function () { location.hash = '#/growth'; },
    'exam-tab': function (el) { window._examTab = el.dataset.tab; render(); },

    /* 买工具 */
    'mall-cat': function (el) { window._mallCat = el.dataset.cat; render(); },
    'open-goods': function (el) { location.hash = '#/goods/' + el.dataset.id; },
    'buy-goods': function (el) {
      var g = Store.goods(el.dataset.id);
      if (!g) return;
      var cost = Math.round(g.price * 0.05) || 12;
      U.confirm('本次需要', '消耗 <b>' + cost + '</b> 鲁班币，请确认支付！', '确认', 'confirm-buy',
        'data-id="' + g.id + '" data-cost="' + cost + '"');
    },
    'confirm-buy': function (el) {
      var g = Store.goods(el.dataset.id);
      var cost = Number(el.dataset.cost);
      if (!g) return;
      U.closeModal();
      if (window._S.worker.coins < cost) { U.toast('鲁班币不足'); return; }
      window._S.worker.coins -= cost;
      window._S.mallOrders.unshift({
        id: 'MO' + Date.now(), time: '刚刚', goods: g.id, qty: 1, status: '待领取',
        code: String(Date.now()).slice(-12), orderNo: String(Date.now()), orderedAt: '刚刚'
      });
      Store.save(window._S);
      U.toast('兑换成功，凭领取码到库房领取');
      render();
    },
    'mo-tab': function (el) { window._moTab = el.dataset.tab; render(); },
    'open-morder': function (el) { location.hash = '#/morder/' + el.dataset.id; },
    'copy-code': function (el) {
      var code = el.dataset.code;
      if (navigator.clipboard) navigator.clipboard.writeText(code);
      U.toast('领取码已复制：' + code);
    },

    /* 我的 */
    'fb-submit': function () {
      var v = (document.getElementById('fb-text') || {}).value || '';
      if (!v.trim()) { U.toast('请填写反馈内容'); return; }
      U.toast('已收到您的反馈，感谢！');
      history.back();
    },
    'reset': function () {
      U.confirm('重置演示数据', '将清空本地操作记录并恢复演示数据，确认吗？', '确认', 'do-reset');
    },
    'do-reset': function () {
      U.closeModal();
      window._S = Store.reset();
      U.toast('已恢复演示数据');
      location.hash = '#/home';
      render();
    }
  };

  /* ---------- 事件委托 ---------- */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act]');
    if (!el) return;
    var fn = ACT[el.dataset.act];
    if (fn) { e.preventDefault(); fn(el); }
  });
  /* 点遮罩关闭弹窗 */
  document.getElementById('modal').addEventListener('click', function (e) {
    if (e.target.id === 'modal') U.closeModal();
  });
  /* 字数统计 */
  document.addEventListener('input', function (e) {
    if (e.target.id === 'node-remark') {
      var c = document.getElementById('node-count');
      if (c) c.textContent = e.target.value.length + '/50';
    }
    if (e.target.id === 'fb-text') {
      var c2 = document.getElementById('fb-count');
      if (c2) c2.textContent = e.target.value.length;
    }
  });

  window.addEventListener('hashchange', render);
  render();
})();
