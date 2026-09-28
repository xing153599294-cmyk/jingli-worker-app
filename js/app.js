/* 应用入口：路由 + 底部导航 + 全部交互动作 */
(function () {
  var U = window.UI;
  window._S = window.Store.load();
  window._orderTab = '全部';

  /* ---------- 图标 ---------- */
  var ICONS = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></svg>',
    grab: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4.5 13.5H11L9.5 22 19.5 9.5H13L13 2z"/></svg>',
    orders: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>',
    wallet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="6" width="18" height="14" rx="3"/><path d="M3 10h18"/><circle cx="17" cy="15" r="1.4" fill="currentColor"/></svg>',
    me: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5"/></svg>'
  };

  var TABS = [
    { hash: '#/home', label: '工作台', icon: 'home' },
    { hash: '#/grab', label: '抢单', icon: 'grab', grab: true },
    { hash: '#/orders', label: '订单', icon: 'orders' },
    { hash: '#/wallet', label: '钱包', icon: 'wallet' },
    { hash: '#/profile', label: '我的', icon: 'me' }
  ];

  /* ---------- 渲染 ---------- */
  function renderTabbar(active) {
    document.getElementById('tabbar').innerHTML = TABS.map(function (t) {
      var inner = t.grab
        ? '<span class="bubble">' + ICONS[t.icon] + '</span>'
        : ICONS[t.icon];
      return '<div class="tab' + (t.grab ? ' grab-tab' : '') + (active === t.hash ? ' on' : '') +
        '" data-act="go" data-go="' + t.hash + '">' + inner + '<span>' + t.label + '</span></div>';
    }).join('');
  }

  function render() {
    var hash = location.hash || '#/home';
    var base = '#/' + (hash.split('/')[1] || 'home');
    var html;
    if (hash.indexOf('#/order/') === 0) {
      html = window.Pages.orderDetail(window._S, hash.slice('#/order/'.length));
    } else if (base === '#/home') html = window.Pages.home(window._S);
    else if (base === '#/grab') html = window.Pages.grab(window._S);
    else if (base === '#/orders') html = window.Pages.orders(window._S);
    else if (base === '#/wallet') html = window.Pages.wallet(window._S);
    else if (base === '#/profile') html = window.Pages.profile(window._S);
    else html = window.Pages.home(window._S);
    document.getElementById('app').innerHTML = html;
    document.getElementById('app').scrollTop = 0;
    renderTabbar(base);
  }

  /* ---------- 留痕 ---------- */
  function log(o, text) {
    o.timeline.push({ time: Date.now(), text: text });
  }

  /* ---------- 动作 ---------- */
  var ACT = {
    'go': function (el) { location.hash = el.dataset.go; },

    'order-tab': function (el) {
      window._orderTab = el.dataset.tab;
      render();
    },

    /* 服务商指派：确认接单 */
    'confirm-assign': function (el) {
      var o = window.Store.order(el.dataset.id);
      if (!o) return;
      o.status = '已接单';
      o.source = '';
      log(o, '已确认接单');
      window.Store.save(window._S);
      U.toast('接单成功，请尽快与客户约进场时间');
      render();
    },

    /* 指派：拒绝 → 订单回到抢单大厅 */
    'reject-assign': function (el) {
      var o = window.Store.order(el.dataset.id);
      if (!o) return;
      if (!window.confirm('确认无法承接该订单吗？订单将回到抢单大厅。')) return;
      o.status = '待抢单';
      o.source = '指派被拒后进入抢单大厅';
      o.grabDeadline = Date.now() + 120 * 60 * 1000;
      o.boostCost = 50;
      log(o, '工人拒绝指派，订单回到抢单大厅');
      window.Store.save(window._S);
      U.toast('已退回，订单进入抢单大厅');
      location.hash = '#/grab';
    },

    /* 开始施工 */
    'start-work': function (el) {
      var o = window.Store.order(el.dataset.id);
      if (!o) return;
      o.status = '施工中';
      log(o, '开始施工');
      window.Store.save(window._S);
      U.toast('已开始施工');
      render();
    },

    /* 节点拍照上传（原型内模拟拍照） */
    'upload': function (el) {
      var o = window.Store.order(el.dataset.id);
      var n = o && o.nodes[Number(el.dataset.idx)];
      if (!n) return;
      var remark = window.prompt('填写施工说明（选填）：', '');
      if (remark === null) return; /* 取消 */
      n.photos.push(1);
      n.status = '已完成';
      if (remark) n.remark = remark;
      log(o, '「' + n.name + '」完成，已上传施工照片');
      window.Store.save(window._S);
      U.toast('照片已上传，节点完成');
      render();
    },

    /* 发起验收 */
    'request-accept': function (el) {
      var o = window.Store.order(el.dataset.id);
      if (!o) return;
      if (!o.nodes.every(function (n) { return n.photos.length > 0; })) {
        U.toast('还有节点未上传照片，无法发起验收');
        return;
      }
      if (!window.confirm('发起验收后，项目管家将在 24 小时内上门验收。确认提交？')) return;
      o.status = '待验收';
      log(o, '全部节点完成，已提交验收');
      window.Store.save(window._S);
      U.toast('已提交验收，等待项目管家上门');
      render();
    },

    /* 工期延长申请（不加价） */
    'apply-delay': function (el) {
      var o = window.Store.order(el.dataset.id);
      if (!o) return;
      var days = window.prompt('申请延长几天？', '2');
      if (!days) return;
      var reason = window.prompt('延期原因：', '瓷砖到货延迟');
      if (!reason) return;
      log(o, '申请工期延长 ' + days + ' 天：' + reason + '（按平台规则，工期延长不加价）');
      window.Store.save(window._S);
      U.toast('延期申请已提交，等待项目管家审批');
      render();
    },

    /* 抢单 */
    'grab': function (el) {
      var o = window.Store.order(el.dataset.id);
      if (!o || o.status !== '待抢单') return;
      o.status = '已接单';
      log(o, '抢单成功');
      window.Store.save(window._S);
      U.toast('抢单成功！请尽快联系客户');
      render();
    },

    /* 鲁班币强抢：消耗 50 枚直接锁定 */
    'grab-boost': function (el) {
      var o = window.Store.order(el.dataset.id);
      if (!o || o.status !== '待抢单') return;
      var cost = o.boostCost || 50;
      if (window._S.worker.coins < cost) {
        U.toast('鲁班币不足（还差 ' + (cost - window._S.worker.coins) + ' 枚）');
        return;
      }
      if (!window.confirm('将消耗 ' + cost + ' 枚鲁班币强抢该订单，确认吗？')) return;
      window._S.worker.coins -= cost;
      o.status = '已接单';
      log(o, '鲁班币强抢成功（−' + cost + ' 枚）');
      window.Store.save(window._S);
      U.toast('强抢成功！已消耗 ' + cost + ' 枚鲁班币');
      render();
    },

    /* 本周复训签到 */
    'checkin': function () {
      window._S.worker.retrainDone = true;
      window.Store.save(window._S);
      U.toast('签到成功，本周复训已完成');
      render();
    },

    /* 重置演示数据 */
    'reset': function () {
      if (!window.confirm('将清空本地操作记录并恢复演示数据，确认吗？')) return;
      window._S = window.Store.reset();
      window._orderTab = '全部';
      U.toast('已恢复演示数据');
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

  window.addEventListener('hashchange', render);

  /* 倒计时页面每 30 秒刷新一次 */
  setInterval(function () {
    var h = location.hash || '#/home';
    if (['#/home', '#/grab'].indexOf(h.split('/').slice(0, 2).join('/')) >= 0) render();
  }, 30000);

  render();
})();
