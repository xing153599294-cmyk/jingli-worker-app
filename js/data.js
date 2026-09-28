/* 种子数据 —— 晶鲤焕新家 · 工人端（演示数据） */
window.SEED = (function () {
  var now = Date.now();
  var M = 60 * 1000;
  var D = 24 * 60 * M;

  function wn(name) {
    return { name: name, status: '待施工', photos: [], remark: '' };
  }
  var wNodes = ['基层处理', '防水施工', '瓷砖铺贴', '勾缝与清洁'].map(wn);

  return {
    worker: {
      name: '周建国',
      trade: '瓦工',
      level: '高级技工',
      joinedAt: '2024-03-12',
      idVerified: true,
      cert: { name: '瓷砖镶贴职业技能证', no: 'JL-****8821', expires: '2027-06-30' },
      insurance: { status: '在保', name: '雇主责任险', expires: '2026-12-31' },
      regions: { main: ['朝阳区', '海淀区'], sub: ['通州区'] },
      coins: 128,
      retrainDone: false,
      training: {
        admission: [
          { name: '平台规则与安全', done: true },
          { name: '工种实操规范', done: true },
          { name: '服务礼仪', done: true },
          { name: '考核认证', done: true }
        ]
      },
      score: {
        overall: 4.6,
        rank: 3,
        total: 28,
        trend: { last30: 4.7, history: 4.5 },
        dims: [
          { name: '施工质量', weight: 30, val: 4.8 },
          { name: '现场卫生', weight: 20, val: 4.5 },
          { name: '用户评价', weight: 30, val: 4.7 },
          { name: '响应时效', weight: 20, val: 4.4 }
        ]
      }
    },

    orders: [
      {
        id: 'WO-2609-018',
        title: '王先生 · 望京西园三区',
        customer: '王先生',
        phone: '138****6201',
        address: '朝阳区望京西园三区 12 号楼 2 单元 501',
        trade: '瓦工',
        work: '厨卫墙地砖铺贴约 48㎡，含防水',
        amount: 12600,
        rate: 0.125,
        status: '待确认',
        source: '服务商指派（德邦 · 李经理）',
        deadline: now + 47 * M,
        nodes: JSON.parse(JSON.stringify(wNodes)),
        timeline: [
          { time: now - 13 * M, text: '服务商已指派本订单给您，请在 120 分钟内确认' }
        ]
      },
      {
        id: 'WO-2609-021',
        title: '刘女士 · 橡树湾四期',
        customer: '刘女士',
        phone: '159****3348',
        address: '海淀区橡树湾四期 6 号楼 1-302',
        trade: '瓦工',
        work: '厨卫墙地砖铺贴约 60㎡',
        amount: 9800,
        rate: 0.125,
        status: '待抢单',
        hot: true,
        grabDeadline: now + 96 * M,
        boostCost: 50,
        nodes: JSON.parse(JSON.stringify(wNodes)),
        timeline: [{ time: now - 24 * M, text: '订单进入抢单大厅' }]
      },
      {
        id: 'WO-2609-023',
        title: '赵先生 · 富力城 D 区',
        customer: '赵先生',
        phone: '186****7712',
        address: '朝阳区富力城 D 区 15 号楼 2-1102',
        trade: '瓦工',
        work: '客厅地砖 800×800 铺贴约 75㎡',
        amount: 15400,
        rate: 0.125,
        status: '待抢单',
        grabDeadline: now + 61 * M,
        boostCost: 50,
        nodes: JSON.parse(JSON.stringify(wNodes)),
        timeline: [{ time: now - 59 * M, text: '订单进入抢单大厅' }]
      },
      {
        id: 'WO-2609-015',
        title: '陈女士 · 保利珑门',
        customer: '陈女士',
        phone: '137****9055',
        address: '朝阳区保利珑门 3 号楼 1-1801',
        trade: '瓦工',
        work: '卫生间墙地砖铺贴 + 二次防水',
        amount: 8900,
        rate: 0.125,
        status: '施工中',
        nodes: [
          { name: '基层处理', status: '已完成', photos: [1, 1], remark: '' },
          { name: '防水施工', status: '已完成', photos: [1], remark: '闭水试验 48 小时，楼下无渗漏' },
          { name: '瓷砖铺贴', status: '待施工', photos: [], remark: '' },
          { name: '勾缝与清洁', status: '待施工', photos: [], remark: '' }
        ],
        timeline: [
          { time: now - 6 * D, text: '订单接单成功' },
          { time: now - 5 * D, text: '开始施工' },
          { time: now - 3 * D, text: '基层处理完成，已上传照片' },
          { time: now - 1 * D, text: '防水施工完成，闭水试验通过' }
        ]
      },
      {
        id: 'WO-2609-009',
        title: '孙先生 · 华润公元九里',
        customer: '孙先生',
        phone: '150****2266',
        address: '海淀区华润公元九里 8 号楼 2-602',
        trade: '瓦工',
        work: '阳台墙地砖铺贴约 25㎡',
        amount: 7200,
        rate: 0.125,
        status: '已接单',
        nodes: JSON.parse(JSON.stringify(wNodes)),
        timeline: [
          { time: now - 2 * D, text: '订单接单成功，请与客户约定进场时间' }
        ]
      },
      {
        id: 'WO-2609-002',
        title: '林女士 · 龙湖滟澜山',
        customer: '林女士',
        phone: '188****4431',
        address: '朝阳区龙湖滟澜山 22 号楼 3-201',
        trade: '瓦工',
        work: '全屋墙地砖铺贴约 110㎡',
        amount: 13800,
        rate: 0.125,
        status: '待验收',
        nodes: [
          { name: '基层处理', status: '已完成', photos: [1], remark: '' },
          { name: '防水施工', status: '已完成', photos: [1], remark: '闭水试验通过' },
          { name: '瓷砖铺贴', status: '已完成', photos: [1, 1], remark: '' },
          { name: '勾缝与清洁', status: '已完成', photos: [1], remark: '现场已清理' }
        ],
        timeline: [
          { time: now - 20 * D, text: '订单接单成功' },
          { time: now - 12 * D, text: '全部节点完成，已提交验收' },
          { time: now - 12 * D, text: '项目管家将在 24 小时内上门验收' }
        ]
      },
      {
        id: 'WO-2608-030',
        title: '钱先生 · 中海枫涟山庄',
        customer: '钱先生',
        phone: '135****8874',
        address: '海淀区中海枫涟山庄 9 号楼 1-401',
        trade: '瓦工',
        work: '厨卫墙地砖铺贴约 52㎡',
        amount: 11200,
        rate: 0.125,
        status: '已完成',
        completedAt: now - 23 * D,
        score: {
          quality: 5, hygiene: 5, rating: 5, speed: 5, overall: 4.9,
          comment: '贴砖非常平整，缝隙均匀，现场每天收得干干净净，很省心。'
        },
        nodes: JSON.parse(JSON.stringify(wNodes)).map(function (n) {
          n.status = '已完成'; n.photos = [1]; return n;
        }),
        timeline: [
          { time: now - 30 * D, text: '订单接单成功' },
          { time: now - 23 * D, text: '验收通过，客户评分 4.9' }
        ]
      },
      {
        id: 'WO-2608-011',
        title: '吴先生 · 住总万科橙',
        customer: '吴先生',
        phone: '133****5109',
        address: '通州区住总万科橙 5 号楼 2-903',
        trade: '瓦工',
        work: '阳台墙地砖铺贴约 20㎡',
        amount: 6800,
        rate: 0.125,
        status: '已完成',
        completedAt: now - 37 * D,
        score: {
          quality: 4, hygiene: 4, rating: 5, speed: 4, overall: 4.2,
          comment: '整体不错，有一处砖面有空鼓，复验后已整改。'
        },
        nodes: JSON.parse(JSON.stringify(wNodes)).map(function (n) {
          n.status = '已完成'; n.photos = [1]; return n;
        }),
        timeline: [
          { time: now - 44 * D, text: '订单接单成功' },
          { time: now - 37 * D, text: '验收通过，客户评分 4.2' }
        ]
      }
    ],

    coinRecords: [
      { time: now - 3 * D, label: '完成订单 WO-2608-030', delta: 10 },
      { time: now - 3 * D, label: '获得客户好评奖励', delta: 5 },
      { time: now - 5 * D, label: '鲁班币强抢 WO-2609-014', delta: -50 },
      { time: now - 9 * D, label: '完成订单 WO-2608-021', delta: 10 },
      { time: now - 12 * D, label: '排名置顶（7 天）', delta: -30 }
    ],

    settlements: [
      { order: 'WO-2609-002', title: '林女士 · 龙湖滟澜山', amount: 13800, rate: 0.125, status: '待结算', note: '验收通过后 3 个工作日内到账' },
      { order: 'WO-2608-030', title: '钱先生 · 中海枫涟山庄', amount: 11200, rate: 0.125, status: '已结算', date: '2026-09-05' },
      { order: 'WO-2608-011', title: '吴先生 · 住总万科橙', amount: 6800, rate: 0.125, status: '已结算', date: '2026-08-22' }
    ]
  };
})();
