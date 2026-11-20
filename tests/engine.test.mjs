import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

import { castChart, lookupTutorial, formatChartForModel, DEMO_PRESETS } from '../lib/engine/index.js';
import { HEXAGRAMS_BY_KEY, HEXAGRAMS_BY_NUMBER } from '../lib/data/hexagrams.js';
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
      assert.ok(h.symbol && h.fullName && h.judgment && h.summary);
    }
  }
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

  // True solar longitude shift (Urumqi ~87.6°E -> ~-130 min -> 08:30 becomes 06:20 卯时)
  const baziTst = castChart({
    system: 'bazi',
    date: '1995-05-18',
    time: '08:30',
    gender: 'male',
    longitude: 87.6,
  });
  assert.equal(baziTst.meta.trueSolarApplied, true);
  assert.equal(baziTst.pillars[3].zhi, '卯');
  // Verify missing birth date errors cleanly unless useDemo: true
  assert.throws(() => castChart({ system: 'bazi' }), /Missing birth date/);
  assert.throws(() => castChart({ system: 'ziwei' }), /Missing birth date/);
  assert.throws(() => castChart({ system: 'hepan' }), /Missing personA\/personB/);
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
    // Round 2 Meihua additions: Timing & WanWu LeiXiang imagery
    assert.ok(mh.timing?.responseNumber >= 2 && mh.timing?.shortRange && mh.timing?.favorableMonths);
    assert.ok(mh.imagery?.ti?.direction && mh.imagery?.yong?.direction);
  }
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
  assert.ok(Array.isArray(zw.patterns) && zw.patterns.length >= 1);
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
    assert.ok(hp.overallScore >= 35 && hp.overallScore <= 98);
    assert.ok(hp.highlights.length >= 1);
    assert.ok(hp.cautions.length >= 1);
    assert.ok(hp.advice.length >= 1);
    assert.ok(formatChartForModel(hp).includes(hp.relationLabel));
    // Round 2 Hepan additions: 30y sync timeline, element synergy matrix, MingGua
    assert.equal(hp.timeline30y.length, 10);
    assert.equal(hp.elementSynergy.length, 5);
    assert.ok(hp.personA.mingGua && hp.personB.mingGua);
  }
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

  const mockCtx = {
    logger: { warn() {}, error() {} },
    effect(fn) {
      const d = fn();
      if (typeof d === 'function') disposers.push(d);
      return () => { if (typeof d === 'function') d(); };
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
  assert.equal(registeredSections.length, 1);
  assert.ok(registeredProjections.has('zhiming'));

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
  const mockReact = {
    createElement: (type, props, ...children) => ({ type, props, children }),
    Fragment: Symbol('Fragment'),
    Component: class Component { constructor(p) { this.props = p; } },
    memo: c => c,
    useState: init => [typeof init === 'function' ? init() : init, () => {}],
    useEffect: () => {},
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
      inject(_owner, cb) { return cb(); },
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
  assert.ok(slotNames.includes('sidebar.right.pane.tab:@local/dsh-zhiming'));
  assert.ok(slotNames.includes('sidebar.right.pane.tab.title:@local/dsh-zhiming'));
  assert.ok(slotNames.includes('conversation.composer.dock:dsh-zhiming-dock'));
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
  const collectText = (node, acc = []) => {
    if (node == null) return acc;
    if (typeof node === 'string' || typeof node === 'number') { acc.push(String(node)); return acc; }
    if (Array.isArray(node)) { node.forEach(n => collectText(n, acc)); return acc; }
    if (typeof node === 'object') {
      if (typeof node.type === 'function') {
        if (node.type.prototype && typeof node.type.prototype.render === 'function') {
          const inst = new node.type({ ...(node.props || {}), children: node.children });
          collectText(inst.render(), acc);
        } else {
          collectText(node.type({ ...(node.props || {}), children: node.children }), acc);
        }
        return acc;
      }
      if (Array.isArray(node.children)) node.children.forEach(c => collectText(c, acc));
    }
    return acc;
  };
  const origUseState = mockReact.useState;
  const renderWithOverrides = (overrides, stateSnap) => {
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
      })).join(' ');
    } finally {
      mockReact.useState = origUseState;
    }
  };

  for (const theme of ['light', 'dark']) {
    for (const ch of demoCharts) {
      const stateSnap = { version: 1, activeChartId: ch.id, activeSystem: ch.system, focusedPart: null, charts: demoCharts };
      const txt = renderWithOverrides([['light', theme]], stateSnap);
      assert.ok(txt.includes('浅色') && txt.includes('深色'));
      if (ch.system === 'bazi') assert.ok(txt.includes('五行天象仪') && txt.includes('八宅罗盘'));
      if (ch.system === 'qimen') assert.ok(txt.includes('360° 浑天仪') && txt.includes('洛书九宫'));
      if (ch.system === 'meihua') assert.ok(txt.includes('先天应数') && txt.includes('体用万物类象速查'));
      if (ch.system === 'ziwei') assert.ok(txt.includes('星图轮盘') && txt.includes('紫微经典格局识别'));
      if (ch.system === 'hepan') assert.ok(txt.includes('双星引力') && txt.includes('双方五行互补对比'));
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
  assert.ok(renderWithOverrides([['wheel', 'square'], ['natal', demoCharts[3].yearlyHoroscopes[1].year]], { version: 1, activeChartId: demoCharts[3].id, activeSystem: 'ziwei', focusedPart: null, charts: demoCharts }).includes('流命'));
  assert.ok(renderWithOverrides([['orrery', 'wave']], { version: 1, activeChartId: demoCharts[4].id, activeSystem: 'hepan', focusedPart: null, charts: demoCharts }).includes('双星共旺期'));
  assert.ok(renderWithOverrides([], { version: 1, activeChartId: null, activeSystem: 'tutorial', focusedPart: null, charts: [] }).includes('玄空流年九宫飞星'));

  const emptyFace = { getSnapshot: () => ({ version: 1, activeChartId: null, activeSystem: 'tutorial', focusedPart: null, charts: [] }), subscribe: () => () => {} };
  renderTree(mockReact.createElement(studioEntry.component, { ...studioEntry.meta.inject('s1'), projectionFace: emptyFace, t: tFn }));

  // Render Composer Dock, Tool Cards (success + error + preparing), Command Card (chart + focus + help + error), Tab Title
  const dockEntry = slotsRegistered.find(s => s.meta.name === 'conversation.composer.dock');
  renderTree(mockReact.createElement(dockEntry.component, { ...dockEntry.meta.inject('s1'), useProjection: () => ({ activeChartId: demoCharts[0].id, charts: demoCharts }), t: tFn }));

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
  renderTree(mockReact.createElement(cmdEntry.component, { ...cmdEntry.meta.inject('s1'), node: { outcome: { kind: 'success', text: '知命指令帮助' } }, t: tFn }));
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
