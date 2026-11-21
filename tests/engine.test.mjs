import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

import { castChart, lookupTutorial, formatChartForModel, DEMO_PRESETS } from '../lib/engine/index.js';
import { HEXAGRAMS_BY_KEY, HEXAGRAMS_BY_NUMBER } from '../lib/data/hexagrams.js';
import {
  batchMentionsZhimingTopic,
  guidanceForSession,
  mentionsZhimingTopic,
} from '../lib/guidance.js';
import { apply as applyHost, inject as hostInject, zhimingProjectionDefinition } from '../index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

test('64 hexagrams table is complete and unique', () => {
  assert.equal(Object.keys(HEXAGRAMS_BY_KEY).length, 64);
  assert.equal(Object.keys(HEXAGRAMS_BY_NUMBER).length, 64);
  for (let u = 1; u <= 8; u++) {
    for (let l = 1; l <= 8; l++) {
      const h = HEXAGRAMS_BY_KEY[`${u}-${l}`];
      assert.ok(h, `Missing hexagram for ${u}-${l}`);
      assert.equal(h.upper, u);
      assert.equal(h.lower, l);
      assert.ok(h.symbol && h.fullName && h.judgment && h.image);
    }
  }
  // 《周易》讼、蒙与剥卦，检查完整经文与误断句修订。
  assert.match(HEXAGRAMS_BY_NUMBER[6].judgment, /利見大人，不利涉大川。$/);
  assert.match(HEXAGRAMS_BY_NUMBER[4].judgment, /利貞。$/);
  assert.equal(HEXAGRAMS_BY_NUMBER[23].judgment, '不利有攸往。');
  assert.equal(HEXAGRAMS_BY_NUMBER[1].image, '天行健，君子以自強不息。');
});

test('Bazi engine calculates solar, lunar, and true solar time accurately', () => {
  const bazi = castChart({
    system: 'bazi',
    date: '1995-05-18',
    time: '08:30',
    gender: 'male',
    calendar: 'solar',
    name: '测试男命',
  });
  assert.equal(bazi.pillars.map(p => p.ganZhi).join(' '), '乙亥 辛巳 己酉 戊辰');
  assert.equal(bazi.dayMaster.gan, '己');
  assert.equal(bazi.dayMaster.element, '土');
  const pctSum = Object.values(bazi.wuxing.percentages).reduce((a, b) => a + b, 0);
  assert.equal(pctSum, 100);
  assert.equal(bazi.daYun.length, 8);
  assert.equal(bazi.daYun[0].liuNian.length, 10);
  // Round 2 Bazi additions: BaZhai MingGua, ZiPing Pattern, Pillar Interactions, Current Year
  assert.equal(bazi.mingGua.name, '坤卦');
  assert.equal(bazi.mingGua.group, '西四命');
  assert.equal(bazi.mingGua.directions.length, 8);
  assert.equal(bazi.mingGua.bestWealthDir, '东北');
  assert.ok(bazi.pattern?.name && bazi.pattern?.desc);
  assert.ok(Array.isArray(bazi.interactions) && bazi.interactions.length >= 2);
  assert.ok(bazi.currentYear?.year && bazi.currentYear?.ganZhi && bazi.currentYear?.note);
  assert.ok(formatChartForModel(bazi).includes('坤卦'));

  // Lunar calendar roundtrip for 1995-04-19 (same day as 1995-05-18 solar)
  const baziLunar = castChart({
    system: 'bazi',
    date: '1995-04-19',
    time: '08:30',
    gender: 'male',
    calendar: 'lunar',
  });
  assert.equal(baziLunar.pillars.map(p => p.ganZhi).join(' '), '乙亥 辛巳 己酉 戊辰');

  // NOAA's Meeus calculation adds roughly four minutes of equation of time
  // to the city’s longitude correction, without changing May 18 to a weekday index.
  const baziTst = castChart({
    system: 'bazi', date: '1995-05-18', time: '08:30', gender: 'male', longitude: 87.6,
  });
  assert.equal(baziTst.meta.trueSolarApplied, true);
  assert.equal(baziTst.meta.civilDate, '1995-05-18 08:30:00');
  assert.equal(baziTst.meta.apparentSolarDate, '1995-05-18 06:24:02');
  assert.deepEqual(baziTst.pillars.map(p => p.ganZhi), ['乙亥', '辛巳', '己酉', '丁卯']);
  const atStandardMeridian = castChart({
    system: 'bazi', date: '1995-05-18', time: '08:30', gender: 'male', longitude: 120,
  });
  assert.equal(atStandardMeridian.meta.apparentSolarDate, '1995-05-18 08:33:38');

  // HKO lists the 2026 Start of Spring at 04:02 UTC+8. Test on each side
  // of the engine's 04:02:08 boundary with the apparent clock still below 04:02.
  const nearTerm = { system: 'bazi', date: '2026-02-04', gender: 'male', longitude: 116.4 };
  const before = castChart({ ...nearTerm, time: '04:02:07' });
  const after = castChart({ ...nearTerm, time: '04:02:08' });
  assert.deepEqual(before.pillars.slice(0, 2).map(p => p.ganZhi), ['乙巳', '己丑']);
  assert.deepEqual(after.pillars.slice(0, 2).map(p => p.ganZhi), ['丙午', '庚寅']);
  assert.equal(after.meta.apparentSolarDate, '2026-02-04 03:33:53');
  assert.equal(after.meta.mingGuaYear, 2026);
  assert.equal(castChart({ ...nearTerm, time: '00:10' }).meta.apparentSolarDate, '2026-02-03 23:41:46');
  assert.equal(after.pattern.name, '月令本气·正官');

  assert.throws(() => castChart({ ...nearTerm, date: '2026-02-30', time: '12:00' }), /公历日期不存在/);
  assert.throws(() => castChart({ ...nearTerm, date: 'not a date', time: '12:00' }), /日期格式无效/);
  assert.throws(() => castChart({ ...nearTerm, time: '24:00' }), /时间超出/);
  assert.throws(() => castChart({ ...nearTerm, time: '12:00', longitude: 181 }), /经度须在/);
  assert.throws(() => castChart({ ...nearTerm }), /出生时间/);
  assert.throws(() => castChart({ ...nearTerm, time: '12:00', gender: undefined }), /请提供传统排盘使用的性别/);
  const yinDayWithRobWealth = castChart({ system: 'bazi', date: '2026-11-01', time: '08:30', gender: 'male' });
  assert.equal(yinDayWithRobWealth.pattern.name, '月令本气·劫财');
  assert.equal(Object.values(bazi.wuxing.counts).reduce((a, b) => a + b), 8);
  // Verify missing birth date errors cleanly unless useDemo: true
  assert.throws(() => castChart({ system: 'bazi' }), /Missing birth date/);
  assert.throws(() => castChart({ system: 'ziwei' }), /Missing birth date/);
  assert.throws(() => castChart({ system: 'hepan' }), /Missing personA\/personB/);
});

test('Bazi identifies three-branch meetings and gives conditional Fuyi references', () => {
  const baziAt = (date, time) => castChart({ system: 'bazi', date, time, gender: 'male' });
  for (const [date, time, branches, name, pillarIndices] of [
    ['2022-03-14', '08:00', '寅卯寅辰', '寅卯辰三会木局', [0, 1, 2, 3]],
    ['2025-06-12', '14:00', '巳午子未', '巳午未三会火局', [0, 1, 3]],
    ['2028-09-12', '20:00', '申酉子戌', '申酉戌三会金局', [0, 1, 3]],
    ['2019-12-12', '02:00', '亥子未丑', '亥子丑三会水局', [0, 1, 3]],
  ]) {
    const chart = baziAt(date, time);
    assert.equal(chart.pillars.map(p => p.zhi).join(''), branches);
    assert.deepEqual(chart.branchMeetings, [{ name, pillarIndices }]);
    assert.match(formatChartForModel(chart), new RegExp(name));
  }
  const incomplete = baziAt('2022-03-09', '04:00');
  assert.equal(incomplete.pillars.map(p => p.zhi).join(''), '寅卯酉寅');
  assert.deepEqual(incomplete.branchMeetings, []);

  const chart = baziAt('2022-03-09', '08:00');
  assert.deepEqual(chart.fuyi, {
    monthCommand: '卯月 · 本气乙木（偏财）',
    rootClues: ['日柱酉藏辛（比肩）'],
    otherStems: ['年柱壬（伤官）', '月柱癸（食神）', '时柱壬（伤官）'],
    ifWeak: '印星土生身、比劫金帮身',
    ifStrong: '食伤水泄身、官杀火制身',
  });
  assert.match(formatChartForModel(chart), /尚未判定日主强弱或用神/);
  const { branchMeetings, fuyi, ...savedChart } = chart;
  const savedState = { ...zhimingProjectionDefinition.init(), charts: [savedChart] };
  assert.deepEqual(zhimingProjectionDefinition.wire.view(savedState).charts[0], chart);
  assert.equal(formatChartForModel(savedChart), formatChartForModel(chart));
  const terms = lookupTutorial('六合六冲六害 三会局 扶抑用神').matches;
  assert.deepEqual(terms.filter(m => m.category === '基础术语').map(m => m.term), ['六合', '六冲', '六害', '三会局', '扶抑用神']);
});

test('Qimen Dunjia respects exact astronomical solar term boundary and ChaiBu ZhuanPan invariants', () => {
  // 1995-05-06 07:30:03 is exact LiXia crossing
  const before = castChart({ system: 'qimen', date: '1995-05-06', time: '07:20' });
  const after = castChart({ system: 'qimen', date: '1995-05-06', time: '07:40' });
  assert.equal(before.meta.solarTerm, '谷雨');
  assert.equal(after.meta.solarTerm, '立夏');
  assert.equal(before.meta.dun, '阳遁');
  assert.equal(after.meta.dun, '阳遁');

  // Test Yin Dun & full 9-palace bijectivity
  const qm = castChart({ system: 'qimen', date: '2026-11-20', time: '12:00', question: '测试合作' });
  assert.equal(qm.palaces.length, 9);
  assert.equal(qm.meta.dun, '阴遁');
  const outer = qm.palaces.filter(p => !p.isCenter);
  assert.equal(outer.length, 8);
  assert.equal(new Set(outer.map(p => p.gate)).size, 8);
  assert.equal(new Set(outer.map(p => p.star)).size, 8);
  assert.equal(new Set(outer.map(p => p.deity)).size, 8);
  assert.equal(new Set(outer.map(p => p.heavenStem)).size, 8);
  assert.equal(new Set(outer.map(p => p.earthStem)).size, 8);
  assert.equal(outer.filter(p => p.isZhiFu).length, 1);
  assert.equal(outer.filter(p => p.isZhiShi).length, 1);
  assert.equal(qm.goodDirections.length, 3);
  // 《遁甲演义》冬至上元阳遁一局，甲己日丙寅时的值符例。
  const classical = castChart({ system: 'qimen', date: '2026-12-31', time: '04:00' });
  assert.deepEqual([classical.meta.juNum, classical.meta.zhiFuStar, classical.meta.zhiFuPalace], [1, '天蓬', '艮八宫']);

  const formerFalseMatch = castChart({ system: 'qimen', date: '2026-11-01', time: '02:00' });
  const xun = formerFalseMatch.palaces.find(p => p.num === 4);
  assert.deepEqual([xun.heavenStem, xun.earthStem], ['丁', '己']);
  assert.ok(!xun.formations.some(f => f.name === '三奇得使'));
  assert.equal(formerFalseMatch.palaces.filter(p => p.isZhiFu).length, 1);
  assert.equal(formerFalseMatch.meta.zhiFuStar, '天禽');
  assert.equal(formerFalseMatch.palaces.find(p => p.isZhiFu).carriedStar, '天禽');
  const positiveMatch = classical.formations.find(f => f.name === '三奇得使');
  assert.ok(positiveMatch);
  // Round 2 Qimen additions: YongShen Radar & Formations
  assert.deepEqual(Object.keys(qm.yongshenGuides), ['all', 'career', 'wealth', 'love', 'health', 'travel']);
  for (const g of Object.values(qm.yongshenGuides)) {
    assert.ok(g.label && g.tip);
    assert.equal(new Set(g.palaceNums).size, g.palaceNums.length, 'YongShen radar palaceNums must be deduplicated');
  }
  assert.ok(Array.isArray(qm.formations));
  // Verify classical formation recognition hits across a day of 12 two-hour charts
  let detectedFormationCount = 0;
  for (let hr = 0; hr < 24; hr += 2) {
    const sample = castChart({ system: 'qimen', date: '2026-06-15', time: `${String(hr).padStart(2, '0')}:30` });
    detectedFormationCount += sample.formations.length;
  }
  assert.ok(detectedFormationCount >= 1, 'Expected classical Qimen formations across 24h sample');
});

test('Meihua Yishu handles all casting modes and computes all 5 hexagrams accurately', () => {
  for (const params of [
    { system: 'meihua', method: 'time', date: '2026-11-20', time: '12:00' },
    { system: 'meihua', method: 'numbers', num1: 3, num2: 7, date: '2026-11-20', time: '12:00' },
    { system: 'meihua', method: 'numbers', num1: 8, num2: 16, num3: 6 },
    { system: 'meihua', method: 'text', text: '春风得意' },
    { system: 'meihua', method: 'random' },
  ]) {
    const mh = castChart(params);
    assert.equal(mh.hexagrams.main.lines.length, 6);
    assert.equal(mh.hexagrams.mutual.lines.length, 6);
    assert.equal(mh.hexagrams.changed.lines.length, 6);
    assert.equal(mh.hexagrams.opposite.lines.length, 6);
    assert.equal(mh.hexagrams.inverted.lines.length, 6);
    // Verify opposite flips all 6 lines
    for (let i = 0; i < 6; i++) {
      assert.equal(mh.hexagrams.main.lines[i] + mh.hexagrams.opposite.lines[i], 1);
      assert.equal(mh.hexagrams.main.lines[i], mh.hexagrams.inverted.lines[5 - i]);
    }
    // Verify changed differs in exactly movingLine
    const diffs = [];
    for (let i = 0; i < 6; i++) {
      if (mh.hexagrams.main.lines[i] !== mh.hexagrams.changed.lines[i]) diffs.push(i + 1);
    }
    assert.deepEqual(diffs, [mh.meta.movingLine]);
    assert.ok(mh.imagery?.ti?.direction && mh.imagery?.yong?.direction);
  }

  const newYearEve = castChart({ system: 'meihua', date: '2024-02-09', time: '16:00' });
  assert.equal(newYearEve.hexagrams.main.fullName, '水山蹇');
  assert.equal(newYearEve.meta.movingLine, 1);
  const plum = castChart({ system: 'meihua', date: '2025-01-16', time: '16:00' }); // 辰年腊月十七申时
  assert.deepEqual([plum.hexagrams.main.fullName, plum.hexagrams.changed.fullName, plum.meta.movingLine], ['泽火革', '泽山咸', 1]);
  const pure = castChart({ system: 'meihua', method: 'numbers', num1: 1, num2: 1, num3: 3 });
  assert.equal(pure.meta.mutualFromChanged, true);
  assert.equal(pure.hexagrams.mutual.fullName, '风火家人');
  const phrase = castChart({ system: 'meihua', method: 'text', text: '春风，得意' });
  assert.equal(phrase.hexagrams.main.fullName, '兑为泽');
  assert.equal(phrase.meta.movingLine, 4);
  assert.throws(() => castChart({ system: 'meihua', method: 'text', text: '春' }), /至少需要两个字/);
  assert.throws(() => castChart({ system: 'meihua', method: 'numbers', num1: 0, num2: 7 }), /须为正整数/);
});

test('Ziwei Doushu builds valid 12-palace 4x4 grid, Tri-Aspect links, and 4 mutagens', () => {
  const zw = castChart({ system: 'ziwei', date: '1998-03-12', time: '21:30', gender: 'female' });
  assert.equal(zw.palaces.length, 12);
  assert.equal(zw.mutagens.length, 4);
  assert.deepEqual(zw.mutagens.map(m => m.mutagen), ['禄', '权', '科', '忌']);

  const positions = new Set();
  for (const p of zw.palaces) {
    const posKey = `${p.gridRow}-${p.gridCol}`;
    assert.ok(!positions.has(posKey), `Duplicate grid position ${posKey}`);
    positions.add(posKey);
    // Must not overlap 2x2 center courtyard
    assert.ok(!((p.gridRow === 1 || p.gridRow === 2) && (p.gridCol === 1 || p.gridCol === 2)));
    assert.equal(p.oppositeIndex, (p.index + 6) % 12);
    assert.deepEqual(p.trineIndices, [(p.index + 4) % 12, (p.index + 8) % 12]);
  }

  // Verify early & late Zi hour
  const earlyZi = castChart({ system: 'ziwei', date: '1998-03-12', time: '00:30', gender: 'male' });
  const lateZi = castChart({ system: 'ziwei', date: '1998-03-12', time: '23:30', gender: 'male' });
  assert.equal(earlyZi.meta.time, '早子时');
  assert.equal(lateZi.meta.time, '晚子时');
  // Round 2 Ziwei additions: Classic Patterns & 3-year Horoscopes with 4 flying mutagens
  assert.ok(Array.isArray(zw.patterns));
  const ziweiOn = time => castChart({ system: 'ziwei', date: '2026-11-01', time, gender: 'male' });
  assert.ok(ziweiOn('02:00').patterns.some(p => p.name === '阳梁昌禄格'));
  assert.ok(!ziweiOn('06:00').patterns.some(p => p.name === '阳梁昌禄格'));
  assert.ok(!ziweiOn('14:00').patterns.some(p => p.name === '机巨同临格'));
  const eve = castChart({ system: 'ziwei', date: '2026-02-16', time: '23:00', gender: 'male' });
  assert.match(eve.meta.lunarDate, /二〇二六年正月初一/);
  const leap = castChart({ system: 'ziwei', date: '2025-06-16', calendar: 'lunar', isLeapMonth: true, time: '12:00', gender: 'male' });
  assert.equal(leap.meta.solarDate, '2025-08-09 12:00');
  assert.match(leap.meta.lunarDate, /闰六月十六/);
  assert.equal(zw.yearlyHoroscopes.length, 3);
  for (const yh of zw.yearlyHoroscopes) {
    assert.ok(yh.year && yh.stemBranch && yh.palaceName);
    assert.equal(yh.mutagens.length, 4);
  }
  assert.ok(formatChartForModel(zw).includes('流年'));
});

test('Hepan computes 6 dimensions for love, business, and family modes', () => {
  for (const relation of ['love', 'business', 'family']) {
    const hp = castChart({ ...DEMO_PRESETS.hepan, relation });
    assert.equal(hp.relation, relation);
    assert.equal(hp.dimensions.length, 6);
    assert.ok(hp.dimensions.every(d => d.summary));
    assert.equal(hp.overallScore, undefined);
    assert.deepEqual(hp.branchInteractions.六合, ['甲方（示例）年柱亥 · 乙方（示例）年柱寅']);
    assert.ok(hp.branchInteractions.六冲.includes('甲方（示例）日柱酉 · 乙方（示例）月柱卯'));
    const shared = '甲方（示例）月柱巳 · 乙方（示例）年柱寅';
    assert.ok(hp.branchInteractions.六害.includes(shared) && hp.branchInteractions.相刑.includes(shared));
    assert.ok(formatChartForModel(hp).includes(hp.relationLabel));
    assert.ok(formatChartForModel(hp).includes(`跨盘六害配对: ${shared}`));
    // Round 2 Hepan additions: 30y sync timeline, element synergy matrix, MingGua
    assert.ok(hp.timeline30y.personA.every(p => p.endExclusive > hp.timeline30y.from && p.startDate < hp.timeline30y.toExclusive));
    assert.equal(hp.elementSynergy.length, 5);
    assert.ok(hp.personA.mingGua && hp.personB.mingGua);
  }
});

test('old results are marked and comparison starts at actual Yun dates', t => {
  t.mock.method(Date, 'now', () => Date.parse('2026-11-20T04:00:00Z'));
  const h = castChart({
    ...DEMO_PRESETS.hepan,
    personA: { date: '2026-11-01', time: '12:00', gender: 'male' },
  });
  assert.equal(h.timeline30y.from, '2026-01-01');
  assert.ok(h.timeline30y.personA[0].startDate > '2026-12-31');
  assert.ok(formatChartForModel(h).includes(h.timeline30y.personA[0].startDate));
  assert.match(formatChartForModel({ ...h, rulesVersion: undefined }), /原始输入重排/);
});

test('Prompt guidance stays out of unrelated conversations', () => {
  const human = text => ({ source: { kind: 'user' }, content: [{ type: 'text', text }] });

  // Unrelated topics must not trip the metaphysics context.
  for (const text of [
    '帮我写一段 Canvas 绘画动画的代码，再顺手看下 git 状态',
    '把这份 Excel 里的销售数据做个透视表',
    '解释一下 React 的 useEffect 依赖数组',
    '帮我写一篇关于城市夜色的散文',
  ]) {
    assert.equal(mentionsZhimingTopic(human(text)), false, `unexpected match: ${text}`);
  }

  // Real requests, in Chinese and English, must trip it.
  for (const text of [
    '帮我排一下 1995-05-18 08:30 男命的四柱八字',
    '用奇门遁甲起个时家拆补局',
    '我报数 3 和 7，帮我梅花起卦',
    '看看我的紫微斗数命盘',
    '帮我们做个恋爱合盘',
    'cast a bazi chart for me',
  ]) {
    assert.equal(mentionsZhimingTopic(human(text)), true, `missed match: ${text}`);
  }

  // Synthetic contexts never count as the user's own intent.
  assert.equal(mentionsZhimingTopic({ source: { kind: 'runtime-context' }, content: [{ type: 'text', text: '八字资料' }] }), false);
  assert.equal(batchMentionsZhimingTopic([]), false);
  assert.equal(batchMentionsZhimingTopic(undefined), false);
  assert.equal(batchMentionsZhimingTopic([human('写个测试'), human('帮我排紫微斗数')]), true);

  // The contribution is empty unless the session is already in a metaphysics context.
  assert.equal(guidanceForSession({ hasChart: false, armed: false }), '');
  assert.ok(guidanceForSession({ hasChart: true, armed: false }).includes('zhiming_chart'));
  assert.ok(guidanceForSession({ hasChart: false, armed: true }).includes('zhiming_chart'));
});

test('Host plugin registers DSH-compliant tools, command, prompt section, and bidirectional projection', async () => {
  assert.deepEqual(hostInject, ['tools']);

  const registeredTools = new Map();
  const registeredCommands = new Map();
  const registeredSections = [];
  const registeredProjections = new Map();
  const disposers = [];

  const session = { id: 'session-test-1', events: [] };
  const projectionStateBySession = new Map();
  const listeners = new Map();
  const agents = [];

  const emit = (name, payload) => {
    const handler = listeners.get(name);
    assert.ok(handler, `plugin did not listen for ${name}`);
    return handler(payload, () => Promise.resolve({ kind: 'enter' }));
  };

  // Agent-shaped stub: `agent.ctx.inject(['systemPrompt'], cb)` mirrors the real fiber semantics
  // so a disposed fiber removes its section again.
  const makeAgent = sessionStub => {
    const agent = { session: sessionStub };
    agent.ctx = {
      inject(_deps, cb) {
        let dispose = () => {};
        cb({
          systemPrompt: {
            section(sec) {
              dispose = mockCtx.systemPrompt.section(sec);
              return dispose;
            },
          },
        });
        return { async dispose() { dispose(); } };
      },
    };
    return agent;
  };

  const mockCtx = {
    logger: { warn() {}, error() {} },
    effect(fn) {
      const d = fn();
      if (typeof d === 'function') disposers.push(d);
      return () => { if (typeof d === 'function') d(); };
    },
    on(name, handler) {
      listeners.set(name, handler);
      return () => listeners.delete(name);
    },
    agents: {
      list() { return agents; },
    },
    inject(_deps, cb) {
      cb(mockCtx);
    },
    tools: {
      register(def) {
        registeredTools.set(def.name, def);
        return () => registeredTools.delete(def.name);
      },
    },
    commands: {
      register(def) {
        registeredCommands.set(def.name, def);
        return () => registeredCommands.delete(def.name);
      },
    },
    systemPrompt: {
      section(sec) {
        registeredSections.push(sec);
        return () => {
          const i = registeredSections.indexOf(sec);
          if (i >= 0) registeredSections.splice(i, 1);
        };
      },
    },
    sessionProjections: {
      async register(def) {
        registeredProjections.set(def.key, def);
        projectionStateBySession.set(session, def.init({}, 0));
        return {
          stateOf(s) {
            return projectionStateBySession.get(s) || def.init({}, 0);
          },
          async dispose() {
            registeredProjections.delete(def.key);
          },
        };
      },
    },
  };

  applyHost(mockCtx);
  await Promise.resolve(); // settle async projection register

  assert.equal(registeredTools.size, 3);
  assert.ok(registeredTools.has('zhiming_chart'));
  assert.ok(registeredTools.has('zhiming_read'));
  assert.ok(registeredTools.has('zhiming_tutorial'));
  assert.ok(registeredCommands.has('zhiming'));
  assert.ok(registeredProjections.has('zhiming'));
  // No global prompt section: a brand-new, unrelated conversation must see nothing about this plugin.
  assert.equal(registeredSections.length, 0);

  // A new agent gets a scoped section whose text is empty until the session actually needs it.
  const agent = makeAgent(session);
  await emit('agent/created', { agent });
  assert.equal(registeredSections.length, 1);
  const section = registeredSections[0];
  assert.equal(section.name, 'dsh-zhiming');
  assert.equal(section.order, 3010);
  assert.equal(section.interpolate, false);
  assert.equal(section.text(), '');

  // An unrelated conversation stays out of the metaphysics context, including synthetic contexts.
  const unrelatedAgent = makeAgent({ id: 'session-test-unrelated', events: [] });
  await emit('agent/created', { agent: unrelatedAgent });
  assert.equal(registeredSections.length, 2);
  const unrelatedSection = registeredSections[1];
  await emit('agent/pre-step', {
    agent: unrelatedAgent,
    messages: [{ id: 'u1', source: { kind: 'user' }, content: [{ type: 'text', text: '帮我写一段 Canvas 绘画动画的代码，再顺手看下 git 状态' }] }],
  });
  assert.equal(unrelatedSection.text(), '');
  await emit('agent/pre-step', {
    agent: unrelatedAgent,
    messages: [{ id: 'u2', source: { kind: 'runtime-context' }, content: [{ type: 'text', text: '（背景资料：某份八字排盘说明）' }] }],
  });
  assert.equal(unrelatedSection.text(), '');
  await emit('agent/disposed', { agent: unrelatedAgent });
  await Promise.resolve();
  assert.equal(registeredSections.length, 1);
  assert.ok(Object.is(registeredSections[0], section));

  // A real chart request arms the session, and from then on the guidance is present and guarded.
  await emit('agent/pre-step', {
    agent,
    messages: [{ id: 'u3', source: { kind: 'user' }, content: [{ type: 'text', text: '帮我排一下 1995-05-18 08:30 男命的四柱八字' }] }],
  });
  const armedText = section.text();
  assert.ok(armedText.includes('仅在命理语境下使用'));
  assert.ok(armedText.includes('`zhiming_chart`'));
  assert.ok(armedText.includes('`zhiming_read`'));
  assert.ok(!armedText.includes('你已接入'));
  assert.ok(!armedText.includes('风水玄学罗盘插件'));

  // Validate tool schemas strictly follow DSH's enforced JSON Schema keyword subset
  const allowedKeywords = new Set([
    'type', 'oneOf', 'properties', 'required', 'additionalProperties',
    'items', 'enum', 'const', 'description', 'title', 'default', 'examples',
  ]);
  const checkSchema = (node, path) => {
    for (const key of Object.keys(node)) {
      assert.ok(allowedKeywords.has(key), `Forbidden JSON Schema keyword "${key}" at ${path}`);
    }
    if (node.properties) {
      for (const [k, v] of Object.entries(node.properties)) {
        checkSchema(v, `${path}.properties.${k}`);
      }
    }
    if (node.items) checkSchema(node.items, `${path}.items`);
  };
  for (const [name, def] of registeredTools) {
    checkSchema(def.parameters, `${name}.parameters`);
    checkSchema(def.output.schema, `${name}.output.schema`);
    assert.equal(typeof def.output.render, 'function');
  }

  // Verify projection reference identity on ignored event
  const projDef = zhimingProjectionDefinition;
  let state = projectionStateBySession.get(session);
  const unchanged = projDef.apply(state, { type: 'turn/start', data: { turn: 1 } });
  assert.ok(Object.is(unchanged, state), 'Projection must return exact same reference for ignored events');

  // Flow A: DeepSeek calls zhiming_chart -> presentationMeta -> projection updates
  const chartTool = registeredTools.get('zhiming_chart');
  const chartArgs = { system: 'bazi', useDemo: true };
  const chartVal = await chartTool.execute(chartArgs, { agent: { session } });
  const meta = chartTool.output.presentationMeta(chartArgs, chartVal);
  const rendered = chartTool.output.render(chartArgs, chartVal);
  assert.ok(rendered[0].text.includes('乙亥'));
  state = projDef.apply(state, { type: 'tool/result', data: { meta } });
  projectionStateBySession.set(session, state);
  assert.equal(state.activeChartId, chartVal.chart.id);
  assert.equal(state.charts.length, 1);

  // A cast chart is a durable activation signal: the session keeps its guidance from the log alone.
  assert.ok(section.text().includes('zhiming_chart'));

  // Verify wire viewSchema validates cleanly
  const wireVal = projDef.wire.viewSchema.parse(projDef.wire.view(state));
  assert.equal(wireVal.activeChartId, chartVal.chart.id);
  assert.equal(projDef.wire.summary, false);

  // Flow B: User casts Qimen from UI via `/zhiming` command -> DeepSeek calls `zhiming_read`
  const cmd = registeredCommands.get('zhiming');
  const cmdRes = await cmd.handler({
    agent: { session },
    rawInput: JSON.stringify({ op: 'cast', params: { system: 'qimen', date: '2026-11-20', time: '12:00', question: '测试合作' } }),
  });
  assert.equal(cmdRes.kind, 'success');
  assert.ok(cmdRes.text.startsWith('ZHIMING_STATE:'));
  state = projDef.apply(state, { type: 'command/done', data: { kind: 'success', text: cmdRes.text } });
  projectionStateBySession.set(session, state);
  assert.equal(state.charts.length, 2);
  assert.equal(state.activeSystem, 'qimen');

  // DeepSeek reads back the UI-cast chart
  const readTool = registeredTools.get('zhiming_read');
  const readCur = await readTool.execute({ action: 'current' }, { agent: { session } });
  assert.equal(readCur.found, true);
  assert.equal(readCur.chart.system, 'qimen');
  assert.ok(readCur.text.includes('阴遁6局'));

  const readList = await readTool.execute({ action: 'list' }, { agent: { session } });
  assert.equal(readList.count, 2);

  // The read tool must distinguish the two entered clocks from the corrected clocks.
  const hepanArgs = {
    ...DEMO_PRESETS.hepan,
    personA: { ...DEMO_PRESETS.hepan.personA, time: '09:00', longitude: 121.5 },
    personB: { ...DEMO_PRESETS.hepan.personB, time: '17:00', longitude: 113.3 },
  };
  const hepanRes = await cmd.handler({
    agent: { session },
    rawInput: JSON.stringify({ op: 'cast', params: hepanArgs }),
  });
  assert.equal(hepanRes.kind, 'success');
  state = projDef.apply(state, { type: 'command/done', data: { kind: 'success', text: hepanRes.text } });
  projectionStateBySession.set(session, state);
  const hepanReadArgs = { action: 'by_id', chartId: state.activeChartId };
  const hepanRead = await readTool.execute(hepanReadArgs, { agent: { session } });
  const hepanText = readTool.output.render(hepanReadArgs, hepanRead)[0].text;
  assert.ok(hepanText.includes('出生时间（北京时间 UTC+8） 1995-05-18 09:00:00 | 排盘真太阳时 1995-05-18 09:09:38'));
  assert.ok(hepanText.includes('出生时间（北京时间 UTC+8） 1998-03-12 17:00:00 | 排盘真太阳时 1998-03-12 16:23:22'));

  const withoutInputTime = ({ civilDate, apparentSolarDate, ...person }) => person;
  const historicalText = formatChartForModel({
    ...hepanRead.chart,
    personA: withoutInputTime(hepanRead.chart.personA),
    personB: withoutInputTime(hepanRead.chart.personB),
  });
  assert.ok(historicalText.includes('历史盘记录的排盘时刻 1998-03-12 16:23 | 原始出生时间待核对'));
  assert.ok(!historicalText.includes('出生时间（北京时间 UTC+8）'));

  // `/zhiming help` returns helpful instructions instead of casting Meihua
  const helpRes = await cmd.handler({ agent: { session }, rawInput: 'help' });
  assert.equal(helpRes.kind, 'success');
  assert.ok(helpRes.text.includes('/zhiming demo'));

  // Tutorial tool lookup
  const tut = await registeredTools.get('zhiming_tutorial').execute({ topic: '喜用神' });
  assert.ok(tut.matches.length >= 1);
  assert.ok(lookupTutorial('overview').systems.length === 5);

  // Verify clean teardown
  for (const d of disposers) await d();
  assert.equal(registeredTools.size, 0);
  assert.equal(registeredCommands.size, 0);
  assert.equal(registeredSections.length, 0);
});

test('Client bundle loads cleanly, registers all slots & locales, and forbids DSH internal requires', async () => {
  const clientCode = readFileSync(resolve(root, 'client.js'), 'utf8');
  // Ensure no require('@deepseek-ai/...') anywhere in client.js
  assert.equal(/require\s*\(\s*['"]@deepseek-ai\//.test(clientCode), false, 'client.js must not require Harness Client packages');
  // Ensure no SVG stretching anywhere in client.js
  assert.equal(/preserveAspectRatio\s*:\s*['"]none['"]/.test(clientCode), false, 'client.js must never use preserveAspectRatio: "none" (stretches circles/stars)');

  let loadedSpec = null;
  const sandbox = {
    window: {
      __ModuleLoader__: {
        load(spec) {
          loadedSpec = spec;
        },
      },
    },
    Date,
    Math,
    JSON,
    Set,
    Map,
    Number,
    String,
    Object,
    Array,
    Promise,
    setTimeout,
    clearTimeout,
  };
  vm.runInNewContext(clientCode, sandbox);
  assert.ok(loadedSpec, 'client.js did not invoke window.__ModuleLoader__.load');
  assert.equal(loadedSpec.id, '@local/dsh-zhiming');

  // Mock minimal React
  let nextId = 0;
  const mockReact = {
    createElement: (type, props, ...children) => ({ type, props, children }),
    Fragment: Symbol('Fragment'),
    Component: class Component { constructor(p) { this.props = p; } },
    memo: c => c,
    useId: () => `mock-id-${++nextId}`,
    useState: init => [typeof init === 'function' ? init() : init, () => {}],
    useEffect: () => {},
    useLayoutEffect: () => {},
    useMemo: fn => fn(),
    useCallback: fn => fn,
    useRef: v => ({ current: v }),
    useSyncExternalStore: (_sub, get) => get(),
  };

  const plugin = loadedSpec.factory(mod => {
    assert.equal(mod, 'react', `Unexpected client require("${mod}")`);
    return mockReact;
  });
  assert.deepEqual([...plugin.inject], ['slots', 'locale', 'sessions', 'remote', 'remote.commands']);

  const slotsRegistered = [];
  const localeRegistered = {};
  const tabRegistered = [];
  const disposers = [];
  const selectedPanels = [];

  const declaredInjects = new Set([...plugin.inject]);
  let mockExecute = async () => ({ ok: true, value: { result: { kind: 'success' } } });
  const mockClientCtx = {
    get(k) {
      if (k === 'remote.commands') return { execute: (...args) => mockExecute(...args) };
      return this[k];
    },
    effect(fn) {
      const d = fn();
      if (typeof d === 'function') disposers.push(d);
      return () => { if (typeof d === 'function') d(); };
    },
    inject(_deps, cb) { cb(mockClientCtx); },
    locale: {
      register(ns, dicts) {
        localeRegistered[ns] = dicts;
        return () => { delete localeRegistered[ns]; };
      },
      bind(ns) {
        return key => localeRegistered[ns]?.zh?.[key] || key;
      },
    },
    layout: { selectPanel: panel => selectedPanels.push(panel) },
    sidebarRight: { openTab() {} },
    sidebarRightTabs: {
      register(def) {
        tabRegistered.push(def);
        return () => {};
      },
    },
    sessions: { binding: () => undefined },
    remote: {
      get commands() {
        if (!declaredInjects.has('remote.commands')) {
          throw new Error('cannot get property "remote.commands" without inject');
        }
        return { execute: (...args) => mockExecute(...args) };
      },
    },
    slots: {
      inject(_owner, cb) {
        const registration = cb();
        if (typeof registration === 'function') return registration;
        const cleanup = [...registration];
        return () => cleanup.reverse().forEach(dispose => dispose());
      },
      register(meta, component) {
        slotsRegistered.push({ meta, component });
        return () => {};
      },
    },
  };

  plugin.apply(mockClientCtx);

  // Verify zh & en dictionary key parity
  assert.ok(localeRegistered.zhiming?.zh);
  assert.ok(localeRegistered.zhiming?.en);
  assert.deepEqual(
    Object.keys(localeRegistered.zhiming.zh).sort(),
    Object.keys(localeRegistered.zhiming.en).sort(),
    'zh and en locale dictionaries must have identical keys',
  );

  // Verify all expected slots registered
  const slotNames = slotsRegistered.map(s => `${s.meta.name}:${s.meta.key || s.meta.id}`);
  const workspaceEntry = slotsRegistered.find(s => s.meta.name === 'main');
  const sidebarEntry = slotsRegistered.find(s => s.meta.name === 'sidebar.panellist');
  const workspaceBody = slotsRegistered.find(s => s.meta.name === 'zhiming.workspace');
  assert.equal(sidebarEntry.meta.id, '@local/dsh-zhiming');
  assert.equal(sidebarEntry.meta.id, workspaceEntry.meta.key);
  assert.equal(sidebarEntry.meta.label(), '虚白罗盘');
  assert.equal(workspaceEntry.meta.children[workspaceBody.meta.name].scope, 'session-maybe');
  const emptyWorkspace = workspaceBody.meta.inject(undefined);
  assert.equal(emptyWorkspace.executeZhiming, undefined);
  emptyWorkspace.onReturnToConversation();
  assert.deepEqual(selectedPanels, [null]);
  assert.ok(slotNames.includes('sidebar.right.pane.tab:@local/dsh-zhiming'));
  assert.ok(slotNames.includes('sidebar.right.pane.tab.title:@local/dsh-zhiming'));
  assert.ok(!slotsRegistered.some(s => s.meta.name === 'conversation.composer.dock'));
  assert.ok(slotNames.includes('tool.call.toolview:zhiming_chart'));
  assert.ok(slotNames.includes('tool.call.toolview:zhiming_read'));
  assert.ok(slotNames.includes('conversation.chat.commandview:zhiming'));
  assert.equal(tabRegistered.length, 1);
  assert.equal(tabRegistered[0].kind, 'zhiming');

  const demoCharts = ['bazi', 'qimen', 'meihua', 'ziwei', 'hepan'].map(sys => castChart({ ...DEMO_PRESETS[sys] }));
  const renderTree = node => {
    if (node == null || typeof node !== 'object') return;
    if (Array.isArray(node)) { node.forEach(renderTree); return; }
    if (typeof node.type === 'function') {
      if (node.type.prototype && typeof node.type.prototype.render === 'function') {
        const inst = new node.type({ ...(node.props || {}), children: node.children });
        renderTree(inst.render());
      } else {
        renderTree(node.type({ ...(node.props || {}), children: node.children }));
      }
      return;
    }
    if (Array.isArray(node.children)) node.children.forEach(renderTree);
  };

  const tFn = k => localeRegistered.zhiming.zh[k] || k;
  const studioEntry = slotsRegistered.find(s => s.meta.name === 'sidebar.right.pane.tab');
  const workspaceWithSession = workspaceBody.component({ sessionId: 's1', ...workspaceBody.meta.inject('s1'), t: tFn });
  assert.equal(workspaceWithSession.type, studioEntry.component);
  assert.equal(workspaceWithSession.props.uiNavFace, studioEntry.meta.inject('s1').uiNavFace);
  const collectText = (node, acc = [], details) => {
    if (node == null) return acc;
    if (typeof node === 'string' || typeof node === 'number') { acc.push(String(node)); return acc; }
    if (Array.isArray(node)) { node.forEach(n => collectText(n, acc, details)); return acc; }
    if (typeof node === 'object') {
      if (typeof node.type === 'function') {
        if (node.type.prototype && typeof node.type.prototype.render === 'function') {
          const inst = new node.type({ ...(node.props || {}), children: node.children });
          collectText(inst.render(), acc, details);
        } else {
          collectText(node.type({ ...(node.props || {}), children: node.children }), acc, details);
        }
        return acc;
      }
      if (node.type === 'details') details?.push(node.props);
      if (Array.isArray(node.children)) node.children.forEach(c => collectText(c, acc, details));
    }
    return acc;
  };
  const origUseState = mockReact.useState;
  const renderWithOverrides = (overrides, stateSnap, details) => {
    mockReact.useState = init => {
      const v = typeof init === 'function' ? init() : init;
      for (const [match, next] of overrides) {
        if (v === match) return [next, () => {}];
      }
      return [v, () => {}];
    };
    try {
      return collectText(mockReact.createElement(studioEntry.component, {
        ...studioEntry.meta.inject('s1'),
        useProjection: key => (key === 'zhiming' ? stateSnap : undefined),
        t: tFn,
      }), [], details).join(' ');
    } finally {
      mockReact.useState = origUseState;
    }
  };

  for (const theme of ['light', 'dark']) {
    for (const ch of demoCharts) {
      const stateSnap = { version: 1, activeChartId: ch.id, activeSystem: ch.system, focusedPart: null, charts: demoCharts };
      const details = [];
      const txt = renderWithOverrides([['light', theme]], stateSnap, details);
      assert.equal(details[0]?.open, true, `${ch.system} details should open by default`);
      assert.ok(txt.includes('浅色') && txt.includes('深色'));
      if (ch.system === 'bazi') {
        for (const label of ['五行天象仪', '八宅罗盘', '干支关系', '六合', '六冲', '六害', '三会局', '扶抑用神', '若日主偏弱', '若日主偏强']) {
          assert.ok(txt.includes(label), `Bazi should show ${label}`);
        }
        assert.ok(txt.includes('年柱亥与月柱巳'));
      }
      if (ch.system === 'qimen') assert.ok(txt.includes('360° 浑天仪') && txt.includes('洛书九宫'));
      if (ch.system === 'meihua') assert.ok(txt.includes('卦辞') && txt.includes('大象') && txt.includes('体用类象'));
      if (ch.system === 'ziwei') assert.ok(txt.includes('星图轮盘') && txt.includes('星曜组合'));
      if (ch.system === 'hepan') {
        assert.ok(txt.includes('明干支五行占比') && txt.includes('地支、十神与紫微宫位') && txt.includes('0%'));
        assert.ok(txt.includes('十六组跨盘配对') && txt.includes(ch.branchInteractions.六害[0]));
      }
    }
    // Verify idle (empty) monumental artwork renders cleanly on every tab in both Light and Dark themes
    for (const sys of ['bazi', 'qimen', 'meihua', 'ziwei', 'hepan', 'tutorial']) {
      const idleSnap = { version: 1, activeChartId: null, activeSystem: sys, focusedPart: null, charts: [] };
      const txt = renderWithOverrides([['light', theme]], idleSnap);
      assert.ok(txt.length > 20, `Idle view for ${sys} in ${theme} theme should render`);
    }
  }

  // Test secondary stage modes across all systems
  assert.ok(renderWithOverrides([['orrery', 'compass']], { version: 1, activeChartId: demoCharts[0].id, activeSystem: 'bazi', focusedPart: null, charts: demoCharts }).includes('西四命'));
  assert.ok(renderWithOverrides([['compass', 'grid']], { version: 1, activeChartId: demoCharts[1].id, activeSystem: 'qimen', focusedPart: null, charts: demoCharts }).includes('中五宫'));
  const changedDemo = demoCharts[2];
  const changedView = renderWithOverrides([['main', 'changed']], { version: 1, activeChartId: changedDemo.id, activeSystem: 'meihua', focusedPart: null, charts: demoCharts });
  assert.ok(changedView.includes(`变用 ${changedDemo.tiYong.changedYongTrigram.name}`) && changedView.includes(changedDemo.tiYong.changedRelation.relation));
  assert.ok(renderWithOverrides([['wheel', 'square'], ['natal', demoCharts[3].yearlyHoroscopes[1].year]], { version: 1, activeChartId: demoCharts[3].id, activeSystem: 'ziwei', focusedPart: null, charts: demoCharts }).includes('流命'));
  assert.ok(renderWithOverrides([['compare', 'wave']], { version: 1, activeChartId: demoCharts[4].id, activeSystem: 'hepan', focusedPart: null, charts: demoCharts }).includes(demoCharts[4].timeline30y.personA[0].startDate));
  assert.ok(renderWithOverrides([], { version: 1, activeChartId: null, activeSystem: 'tutorial', focusedPart: null, charts: [] }).includes('中 → 乾 → 兑 → 艮 → 离 → 坎 → 坤 → 震 → 巽'));

  const legacy = { ...demoCharts[0], rulesVersion: undefined };
  const oldView = renderWithOverrides([], { version: 1, activeChartId: legacy.id, activeSystem: legacy.system, focusedPart: null, charts: [legacy] });
  assert.ok(oldView.includes('请输入原始资料重新排盘'));
  assert.ok(!oldView.includes('月令本气·正印'));

  const emptyFace = { getSnapshot: () => ({ version: 1, activeChartId: null, activeSystem: 'tutorial', focusedPart: null, charts: [] }), subscribe: () => () => {} };
  renderTree(mockReact.createElement(studioEntry.component, { ...studioEntry.meta.inject('s1'), projectionFace: emptyFace, t: tFn }));

  // Render inline tool and command cards and the sidebar tab title.
  const chartToolEntry = slotsRegistered.find(s => s.meta.key === 'zhiming_chart');
  for (const ch of demoCharts) {
    renderTree(mockReact.createElement(chartToolEntry.component, { ...chartToolEntry.meta.inject('s1'), phase: 'result', block: { time: 0, meta: { chart: ch } }, t: tFn }));
  }
  renderTree(mockReact.createElement(chartToolEntry.component, { ...chartToolEntry.meta.inject('s1'), phase: 'result', block: { isError: true, error: { reason: 'Missing birth date' } }, t: tFn }));
  renderTree(mockReact.createElement(chartToolEntry.component, { ...chartToolEntry.meta.inject('s1'), phase: 'preparing', block: {}, t: tFn }));

  const readToolEntry = slotsRegistered.find(s => s.meta.key === 'zhiming_read');
  renderTree(mockReact.createElement(readToolEntry.component, { ...readToolEntry.meta.inject('s1'), phase: 'result', block: {}, t: tFn }));
  renderTree(mockReact.createElement(readToolEntry.component, { ...readToolEntry.meta.inject('s1'), phase: 'result', block: { isError: true }, t: tFn }));

  const cmdEntry = slotsRegistered.find(s => s.meta.name === 'conversation.chat.commandview');
  renderTree(mockReact.createElement(cmdEntry.component, { ...cmdEntry.meta.inject('s1'), node: { outcome: { kind: 'success', text: 'ZHIMING_STATE:' + JSON.stringify({ op: 'chart', chart: demoCharts[0] }) } }, t: tFn }));
  renderTree(mockReact.createElement(cmdEntry.component, { ...cmdEntry.meta.inject('s1'), node: { outcome: { kind: 'success', text: 'ZHIMING_STATE:' + JSON.stringify({ op: 'focus' }) } }, t: tFn }));
  renderTree(mockReact.createElement(cmdEntry.component, { ...cmdEntry.meta.inject('s1'), node: { outcome: { kind: 'success', text: '虚白指令帮助' } }, t: tFn }));
  renderTree(mockReact.createElement(cmdEntry.component, { ...cmdEntry.meta.inject('s1'), node: { outcome: { kind: 'error', text: '排盘失败' } }, t: tFn }));

  const titleEntry = slotsRegistered.find(s => s.meta.name === 'sidebar.right.pane.tab.title');
  renderTree(mockReact.createElement(titleEntry.component, { ...titleEntry.meta.inject('s1'), useProjection: () => ({ activeChartId: demoCharts[0].id, charts: demoCharts }), t: tFn }));

  // Verify executeZhiming properly surfaces command miss and handler error
  const injectedErrTest = studioEntry.meta.inject('s-err');
  mockExecute = async () => ({ ok: true, value: undefined });
  const missRes = await injectedErrTest.executeZhiming({ op: 'demo', system: 'bazi' });
  assert.equal(missRes.ok, false);
  mockExecute = async () => ({ ok: true, value: { result: { kind: 'error', text: '日期格式错误' } } });
  const errRes = await injectedErrTest.executeZhiming({ op: 'demo', system: 'bazi' });
  assert.equal(errRes.ok, false);
  assert.equal(errRes.error, '日期格式错误');

  // Verify clean disposal
  for (const d of disposers) d();
  assert.equal(localeRegistered.zhiming, undefined);
});

test('Bundle manifest, patch, locales, icon.svg, and docs/preview.svg satisfy DSH rules', () => {
  const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
  const patch = readFileSync(resolve(root, 'cordis.patch.yml'), 'utf8');
  assert.equal(pkg.name, '@local/dsh-zhiming');
  assert.equal(pkg.type, 'module');
  assert.equal(pkg.exports['.'], './index.js');
  assert.equal(pkg.exports['./client'], './client.js');
  assert.equal(pkg.exports['./icon'], './icon.svg');
  assert.equal(pkg.exports['./locale/*.json'], './locale/*.json');
  assert.equal(pkg.dsh.bundle.patch, './cordis.patch.yml');
  assert.equal(pkg.dsh.client.platform, 'web');
  assert.equal(pkg.dsh.client.immediately, true);
  assert.ok(patch.includes("name: '@local/dsh-zhiming'"));

  // Every declared file in pkg.files exists
  for (const entry of pkg.files) {
    if (!entry.includes('*')) {
      assert.ok(existsSync(resolve(root, entry)), `Missing file in package.json files: ${entry}`);
    }
  }

  // Locales & detail docs
  for (const lang of ['en', 'zh']) {
    const loc = JSON.parse(readFileSync(resolve(root, `locale/${lang}.json`), 'utf8'));
    assert.ok(loc.meta.title && loc.meta.description && loc.meta.detail);
    const detailPath = resolve(root, loc.meta.detail);
    assert.ok(existsSync(detailPath), `Missing meta.detail file: ${loc.meta.detail}`);
    const detailMd = readFileSync(detailPath, 'utf8').trim();
    assert.match(detailMd, /^!\[.+\]\(preview\.svg\)$/, `${loc.meta.detail} must be a single image line`);
  }

  // SVG icon rules (36x36, <256 KiB, no <text>, <script>, <style>, <image>, foreignObject)
  const iconSvg = readFileSync(resolve(root, 'icon.svg'), 'utf8');
  assert.ok(Buffer.byteLength(iconSvg, 'utf8') < 256 * 1024);
  assert.ok(iconSvg.includes('width="36"') && iconSvg.includes('height="36"') && iconSvg.includes('viewBox="0 0 36 36"'));
  assert.equal(/<(text|script|style|image|foreignObject)\b/i.test(iconSvg), false);

  // Preview SVG rules (640x300, <1 MiB, no <text>, <script>, <style>, foreignObject)
  const previewSvg = readFileSync(resolve(root, 'docs/preview.svg'), 'utf8');
  assert.ok(Buffer.byteLength(previewSvg, 'utf8') < 1024 * 1024);
  assert.ok(previewSvg.includes('width="640"') && previewSvg.includes('height="300"') && previewSvg.includes('viewBox="0 0 640 300"'));
  assert.equal(/<(text|script|style|foreignObject)\b/i.test(previewSvg), false);
});
