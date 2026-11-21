/**
 * Unified Restraint metaphysics engine facade shared by Host tools, slash commands, and tests.
 */

import { calculateBazi, withBaziAnalysis } from './bazi.js';
import { calculateQimen } from './qimen.js';
import { calculateMeihua } from './meihua.js';
import { calculateZiwei } from './ziwei.js';
import { calculateHepan } from './hepan.js';
import { SYSTEM_META, DEMO_PRESETS, TERM_GLOSSARY } from '../data/tutorials.js';
import {
  SHI_SHEN_GLOSSARY,
  QIMEN_GATES_INFO,
  QIMEN_STARS_INFO,
  QIMEN_DEITIES_INFO,
  ZIWEI_PALACE_GLOSSARY,
  ZIWEI_STAR_GLOSSARY,
  ZIWEI_MUTAGEN_GLOSSARY,
  WU_XING_META,
} from '../data/constants.js';

export const VALID_SYSTEMS = ['bazi', 'qimen', 'meihua', 'ziwei', 'hepan'];
const CALCULATORS = { bazi: calculateBazi, qimen: calculateQimen, meihua: calculateMeihua, ziwei: calculateZiwei, hepan: calculateHepan };

export function castChart(params = {}) {
  const system = String(params.system || '').toLowerCase().trim();
  if (!VALID_SYSTEMS.includes(system)) {
    throw new Error(`Unsupported system "${system}". Expected one of: ${VALID_SYSTEMS.join(', ')}`);
  }

  const effectiveParams = params.useDemo
    ? { ...DEMO_PRESETS[system], ...params, useDemo: undefined }
    : params;

  if (!params.useDemo) {
    if ((system === 'bazi' || system === 'ziwei') && !effectiveParams.date && !Number.isInteger(effectiveParams.year)) {
      throw new Error(`Missing birth date for ${system}. Provide "date" (YYYY-MM-DD) or set "useDemo": true.`);
    }
    if (system === 'hepan') {
      const hasA = effectiveParams.personA && (effectiveParams.personA.date || Number.isInteger(effectiveParams.personA.year));
      const hasB = effectiveParams.personB && (effectiveParams.personB.date || Number.isInteger(effectiveParams.personB.year));
      if (!hasA || !hasB) {
        throw new Error('Missing personA/personB birth date for hepan. Provide both persons\' birth dates or set "useDemo": true.');
      }
    }
  }

  return { ...CALCULATORS[system](effectiveParams), rulesVersion: 2 };
}

export function lookupTutorial(topic = '') {
  const key = String(topic || '').trim();
  if (!key || key === 'overview' || key === 'all') {
    return {
      topic: 'overview',
      title: '虚白 · 五大术数新手总览',
      systems: Object.values(SYSTEM_META).map(s => ({
        id: s.id,
        name: s.name,
        enName: s.enName,
        tagline: s.tagline,
        bestFor: s.bestFor,
        howToRead: s.howToRead,
        samplePrompt: s.samplePrompt,
      })),
    };
  }
  const lower = key.toLowerCase();
  if (SYSTEM_META[lower]) {
    return { topic: lower, system: SYSTEM_META[lower], demo: DEMO_PRESETS[lower] };
  }
  // Search term glossaries
  const matches = [];
  const dicts = [
    ['基础术语', TERM_GLOSSARY],
    ['十神', SHI_SHEN_GLOSSARY],
    ['紫微宫位', ZIWEI_PALACE_GLOSSARY],
    ['紫微主星', ZIWEI_STAR_GLOSSARY],
    ['紫微四化', ZIWEI_MUTAGEN_GLOSSARY],
  ];
  for (const [category, dict] of dicts) {
    for (const [term, desc] of Object.entries(dict)) {
      if (term.includes(key) || key.includes(term)) {
        matches.push({ category, term, desc });
      }
    }
  }
  for (const [term, info] of Object.entries(QIMEN_GATES_INFO)) {
    if (term.includes(key) || key.includes(term)) matches.push({ category: '奇门八门', term, desc: `${info.nature}（${info.element}）：${info.summary}` });
  }
  for (const [term, info] of Object.entries(QIMEN_STARS_INFO)) {
    if (term.includes(key) || key.includes(term)) matches.push({ category: '奇门九星', term, desc: `${info.nature}（${info.element}）：${info.summary}` });
  }
  for (const [term, info] of Object.entries(QIMEN_DEITIES_INFO)) {
    if (term.includes(key) || key.includes(term)) matches.push({ category: '奇门八神', term, desc: `${info.nature}：${info.summary}` });
  }
  for (const [el, info] of Object.entries(WU_XING_META)) {
    if (el === key || info.en.toLowerCase() === lower) {
      matches.push({ category: '五行', term: el, desc: `方位${info.direction}，生${info.generates}、克${info.controls}；特质：${info.trait}；风水：${info.fengshui}` });
    }
  }

  return {
    topic: key,
    matches,
    availableTerms: Object.keys(TERM_GLOSSARY),
  };
}

export function formatChartForModel(chart, focusedPart = null) {
  if (!chart) return '当前插件尚未排盘。';
  if (!chart.rulesVersion) return `历史盘「${chart.title}」（${chart.id}）按旧版规则生成。请使用原始输入重排后再引用盘面结论。`;
  chart = withBaziAnalysis(chart);
  const lines = [];
  lines.push(`### ${chart.title}`);
  lines.push(`- 盘面编号: ${chart.id} | 类型: ${chart.system} | 引擎: ${chart.sourceEngine}`);
  lines.push(`- 概要: ${chart.subtitle}`);
  if (chart.meta?.apparentSolarDate) {
    lines.push(`- 输入北京时间 ${chart.meta.civilDate}，排盘使用当地真太阳时 ${chart.meta.apparentSolarDate}。`);
  }
  lines.push('- 解读口径：以下为传统术数规则下的盘面与古籍文本。具体解读请指明规则来源。');
  if (chart.question) lines.push(`- 所问事项: ${chart.question}`);
  if (focusedPart) lines.push(`- 用户当前在插件中聚焦查看: ${typeof focusedPart === 'string' ? focusedPart : JSON.stringify(focusedPart)}`);

  if (chart.system === 'bazi') {
    lines.push(`- 公历: ${chart.meta.solarDate} | 农历: ${chart.meta.lunarDate} | 生肖: ${chart.meta.zodiac}`);
    lines.push(`- 四柱: ${chart.pillars.map(p => `${p.label}${p.ganZhi}(${p.shiShenGan}/${p.naYin}/地势:${p.diShi}/藏干:${p.hiddenDetails.map(h => `${h.gan}${h.shiShen}`).join(',')})`).join(' | ')}`);
    lines.push(`- 日主: ${chart.dayMaster.gan}${chart.dayMaster.element}(${chart.dayMaster.yinYang}) — ${chart.dayMaster.desc}`);
    lines.push(`- 五行计数（八个明干支）: ${Object.entries(chart.wuxing.counts).map(([k, v]) => `${k}${v}`).join(' ')}`);
    lines.push(`- 胎元/命宫/身宫: ${chart.meta.taiYuan} / ${chart.meta.mingGong} / ${chart.meta.shenGong}`);
    if (chart.pattern) lines.push(`- 月令信息: ${chart.pattern.name} — ${chart.pattern.desc}`);
    if (chart.mingGua) lines.push(`- 八宅命卦风水: ${chart.mingGua.name}（${chart.mingGua.group}）| 生气:${chart.mingGua.bestWealthDir} | 天医:${chart.mingGua.bestHealthDir} | 延年:${chart.mingGua.bestLoveDir} | 伏位:${chart.mingGua.bestStudyDir}`);
    if (chart.interactions?.length) {
      const interactions = chart.interactions.map(({ type, label, from, to }) =>
        `${type}（${chart.pillars[from].label}与${chart.pillars[to].label} ${label}）`);
      lines.push(`- 四柱内部合冲刑害: ${interactions.join('、')}`);
    }
    if (chart.branchMeetings) {
      const meetings = chart.branchMeetings.map(({ name, pillarIndices }) =>
        `${name}（${pillarIndices.map(i => `${chart.pillars[i].label}${chart.pillars[i].zhi}`).join('、')}）`);
      lines.push(`- 三会局（仅查三支齐见）: ${meetings.join('、') || '四柱未见同组三支齐全'}`);
    }
    if (chart.fuyi) {
      const { monthCommand, rootClues, otherStems, ifWeak, ifStrong } = chart.fuyi;
      lines.push(`- 扶抑用神参考（尚未判定日主强弱或用神）: ${monthCommand}；同类藏干 ${rootClues.join('、') || '无'}；其余天干 ${otherStems.join('、')}。`);
      lines.push(`  - 按扶抑取法，若日主偏弱，可考察${ifWeak}。若日主偏强，可考察${ifStrong}。具体取用需结合透干及全局配合。`);
    }
    if (chart.currentYear) lines.push(`- ${chart.currentYear.year}流年: ${chart.currentYear.note}`);
    lines.push(`- 神煞: ${chart.shenSha.map(s => `${s.name}（${s.nature}）`).join('、') || '所列规则未匹配'}`);
    lines.push(`- 起运: ${chart.meta.startYunDesc}`);
    lines.push(`- 大运: ${chart.daYun.map(d => `${d.startAge}岁(${d.startYear})${d.ganZhi}[${d.shiShenGan}]`).join(' → ')}`);
  } else if (chart.system === 'qimen') {
    lines.push(`- 四柱: ${chart.meta.fourPillars} | 节气: ${chart.meta.solarTerm}（${chart.meta.yuan}）| 局数: ${chart.meta.juTitle}`);
    lines.push(`- 旬首: ${chart.meta.xunHead} | 值符: ${chart.meta.zhiFuStar}落${chart.meta.zhiFuPalace} | 值使: ${chart.meta.zhiShiGate}落${chart.meta.zhiShiPalace}`);
    lines.push(`- 时空亡: ${chart.meta.kongWang} | 驿马: ${chart.meta.yiMa}`);
    lines.push('- 九宫排布:');
    for (const p of chart.palaces) {
      if (p.isCenter) {
        lines.push(`  - ${p.name}: 地盘${p.earthStem}（寄坤二）`);
      } else {
        const flags = [
          p.isZhiFu ? '值符' : '',
          p.isZhiShi ? '值使' : '',
          p.isKong ? '空亡' : '',
          p.isYiMa ? '驿马' : '',
          ...p.alerts.map(a => a.tag),
        ].filter(Boolean).join('/');
        lines.push(`  - ${p.name}(${p.direction}/${p.element}): 神[${p.deity}] 星[${p.star}${p.carriedStar ? `+${p.carriedStar}` : ''}] 门[${p.gate}] 天盘[${p.heavenStem}${p.carriedStem ? `/${p.carriedStem}` : ''}] 地盘[${p.earthStem}]${flags ? ` | 标记:${flags}` : ''}`);
      }
    }
    if (chart.formations?.length) {
      lines.push(`- 奇门格局识别: ${chart.formations.map(f => `${f.name}[${f.nature}${f.palaceName ? `·${f.palaceName}` : ''}]`).join('、')}`);
    }
    lines.push(`- 三吉门方位: ${chart.goodDirections.map(d => d.tip).join('；')}`);
  } else if (chart.system === 'meihua') {
    const { main, mutual, changed, opposite, inverted } = chart.hexagrams;
    lines.push(`- 起卦方式: ${chart.meta.methodLabel}（${chart.meta.seedDetail}）| 时间四柱: ${chart.meta.fourPillars}`);
    lines.push(`- 本卦: ${main.symbol} ${main.fullName}（上${main.upperTrigram.name}${main.upperTrigram.element}/下${main.lowerTrigram.name}${main.lowerTrigram.element}）— ${main.judgment}`);
    lines.push(`- 互卦: ${mutual.symbol} ${mutual.fullName}${chart.meta.mutualFromChanged ? "（取变卦的中间四爻）" : ""}`);
    lines.push(`- 变卦: ${changed.symbol} ${changed.fullName}（${chart.meta.movingLineLabel}动）— ${changed.judgment}`);
    lines.push(`- 错卦: ${opposite.fullName} | 综卦: ${inverted.fullName}`);
    lines.push(`- 体用生克: ${chart.tiYong.tiLabel}（${chart.tiYong.tiTrigram.name}${chart.tiYong.tiTrigram.element}，月令${chart.tiYong.tiSeason.state}） vs ${chart.tiYong.yongLabel}（${chart.tiYong.yongTrigram.name}${chart.tiYong.yongTrigram.element}，月令${chart.tiYong.yongSeason.state}）`);
    lines.push(`- 体用关系: 本卦${chart.tiYong.mainRelation.relation}，变卦${chart.tiYong.changedRelation.relation}。`);
    lines.push(`- 风水方位提示: ${chart.tiYong.fengshuiTip}`);
  } else if (chart.system === 'ziwei') {
    lines.push(`- 公历: ${chart.meta.solarDate} | 农历: ${chart.meta.lunarDate} | 四柱: ${chart.meta.chineseDate}`);
    lines.push(`- 五行局: ${chart.meta.fiveElementsClass} | 命主: ${chart.meta.soulStar} | 身主: ${chart.meta.bodyStar} | 身宫落: ${chart.meta.bodyPalaceName}`);
    lines.push(`- 生年四化: ${chart.mutagens.map(m => `${m.star}化${m.mutagen}(${m.palace})`).join('、')}`);
    if (chart.patterns?.length) lines.push(`- 紫微星曜组合: ${chart.patterns.map(p => `${p.name}(${p.nature})`).join('、')}`);
    if (chart.yearlyHoroscopes?.length) {
      const cur = chart.yearlyHoroscopes.find(item => item.year === chart.meta.annualReferenceYear) || chart.yearlyHoroscopes[0];
      lines.push(`- ${cur.year}流年(${cur.stemBranch}): 命宫落「${cur.palaceName}」，流年四化：${cur.mutagens.map(m => `${m.star}化${m.mutagen}`).join('、')}`);
    }
    lines.push('- 十二宫主辅星:');
    for (const p of chart.palaces) {
      const maj = p.majorStars.map(s => `${s.name}${s.brightness ? `(${s.brightness})` : ''}${s.mutagen ? `[化${s.mutagen}]` : ''}`).join('、') || '空宫';
      const min = p.minorStars.map(s => `${s.name}${s.mutagen ? `[化${s.mutagen}]` : ''}`).join('、');
      lines.push(`  - ${p.name}[${p.stemBranch}${p.isBodyPalace ? '·身宫' : ''}, 大限${p.decadalRange[0]}-${p.decadalRange[1]}岁]: 主星(${maj})${min ? ` | 辅煞(${min})` : ''}`);
    }
  } else if (chart.system === 'hepan') {
    lines.push(`- 合盘类型: ${chart.relationLabel}`);
    for (const person of [chart.personA, chart.personB]) {
      const birthTime = person.civilDate
        ? `出生时间（北京时间 UTC+8） ${person.civilDate}`
        : `历史盘记录的排盘时刻 ${person.solarDate} | 原始出生时间待核对`;
      const apparentTime = person.apparentSolarDate ? ` | 排盘真太阳时 ${person.apparentSolarDate}` : '';
      lines.push(`- ${person.name}（${person.gender}） | ${birthTime}${apparentTime} | 八字:${person.fourPillars.join(' ')} | 日主:${person.dayMaster} | 紫微命宫:${person.ziweiSoulStars}`);
    }
    for (const dimension of chart.dimensions) lines.push(`- ${dimension.label}: ${dimension.summary}`);
    for (const [type, pairs] of Object.entries(chart.branchInteractions || {})) {
      if (pairs.length) lines.push(`  - 跨盘${type}配对: ${pairs.join('；')}`);
    }
    const { personA, personB } = chart.timeline30y;
    for (const [person, periods] of [[chart.personA, personA], [chart.personB, personB]]) {
      const ranges = periods.map(d => `${d.ganZhi}（${d.startDate}起，至${d.endExclusive}交下一运）`);
      lines.push(`- ${person.name}的大运: ${ranges.join('、') || '该区间无已起大运'}`);
    }
  }

  return lines.join('\n');
}

export { DEMO_PRESETS, SYSTEM_META };
