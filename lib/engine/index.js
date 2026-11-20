/**
 * Unified ZhiMing metaphysics engine facade shared by Host tools, slash commands, and tests.
 */

import { calculateBazi } from './bazi.js';
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

  switch (system) {
    case 'bazi':
      return calculateBazi(effectiveParams);
    case 'qimen':
      return calculateQimen(effectiveParams);
    case 'meihua':
      return calculateMeihua(effectiveParams);
    case 'ziwei':
      return calculateZiwei(effectiveParams);
    case 'hepan':
      return calculateHepan(effectiveParams);
    default:
      throw new Error(`Unsupported system "${system}"`);
  }
}

export function lookupTutorial(topic = '') {
  const key = String(topic || '').trim();
  if (!key || key === 'overview' || key === 'all') {
    return {
      topic: 'overview',
      title: '知命 · 五大术数新手总览',
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
  const lines = [];
  lines.push(`### ${chart.title}`);
  lines.push(`- 盘面编号: ${chart.id} | 类型: ${chart.system} | 引擎: ${chart.sourceEngine}`);
  lines.push(`- 概要: ${chart.subtitle}`);
  if (chart.question) lines.push(`- 所问事项: ${chart.question}`);
  if (focusedPart) lines.push(`- 用户当前在插件中聚焦查看: ${typeof focusedPart === 'string' ? focusedPart : JSON.stringify(focusedPart)}`);

  if (chart.system === 'bazi') {
    lines.push(`- 公历: ${chart.meta.solarDate} | 农历: ${chart.meta.lunarDate} | 生肖: ${chart.meta.zodiac}`);
    lines.push(`- 四柱: ${chart.pillars.map(p => `${p.label}${p.ganZhi}(${p.shiShenGan}/${p.naYin}/地势:${p.diShi}/藏干:${p.hiddenDetails.map(h => `${h.gan}${h.shiShen}`).join(',')})`).join(' | ')}`);
    lines.push(`- 日主: ${chart.dayMaster.gan}${chart.dayMaster.element}(${chart.dayMaster.yinYang}) — ${chart.dayMaster.desc}`);
    lines.push(`- 五行比例: ${Object.entries(chart.wuxing.percentages).map(([k, v]) => `${k}${v}%`).join(' ')} | 强弱: ${chart.wuxing.bodyStrength} | 喜用神: ${chart.wuxing.favorable.join('、')} | 忌神: ${chart.wuxing.unfavorable.join('、')}`);
    lines.push(`- 胎元/命宫/身宫: ${chart.meta.taiYuan} / ${chart.meta.mingGong} / ${chart.meta.shenGong}`);
    if (chart.pattern) lines.push(`- 子平格局: ${chart.pattern.name} — ${chart.pattern.desc}`);
    if (chart.mingGua) lines.push(`- 八宅命卦风水: ${chart.mingGua.name}（${chart.mingGua.group}）| 生气财位:${chart.mingGua.bestWealthDir} | 天医健康:${chart.mingGua.bestHealthDir} | 延年感情:${chart.mingGua.bestLoveDir} | 伏位文昌:${chart.mingGua.bestStudyDir}`);
    if (chart.interactions?.length) lines.push(`- 四柱内部合冲刑害: ${chart.interactions.map(x => `${x.type}(${x.label})`).join('、')}`);
    if (chart.currentYear) lines.push(`- ${chart.currentYear.year}流年: ${chart.currentYear.note}`);
    lines.push(`- 神煞: ${chart.shenSha.map(s => s.name).join('、') || '无特殊冲克神煞'}`);
    lines.push(`- 起运: ${chart.meta.startYunDesc}`);
    lines.push(`- 大运: ${chart.daYun.map(d => `${d.startAge}岁(${d.startYear})${d.ganZhi}[${d.shiShenGan}]`).join(' → ')}`);
    lines.push(`- 风水调候建议: ${chart.wuxing.fengshuiTips.join('；')}`);
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
    lines.push(`- 本卦: ${main.symbol} ${main.fullName}（上${main.upperTrigram.name}${main.upperTrigram.element}/下${main.lowerTrigram.name}${main.lowerTrigram.element}，${main.luck}）— ${main.judgment}`);
    lines.push(`- 互卦: ${mutual.symbol} ${mutual.fullName} — ${mutual.summary}`);
    lines.push(`- 变卦: ${changed.symbol} ${changed.fullName}（${chart.meta.movingLineLabel}动，${changed.luck}）— ${changed.summary}`);
    lines.push(`- 错卦: ${opposite.fullName} | 综卦: ${inverted.fullName}`);
    lines.push(`- 体用生克: ${chart.tiYong.tiLabel}（${chart.tiYong.tiTrigram.name}${chart.tiYong.tiTrigram.element}，月令${chart.tiYong.tiSeason.state}） vs ${chart.tiYong.yongLabel}（${chart.tiYong.yongTrigram.name}${chart.tiYong.yongTrigram.element}，月令${chart.tiYong.yongSeason.state}）`);
    lines.push(`- 当下关系: ${chart.tiYong.mainRelation.relation}（${chart.tiYong.mainRelation.verdict}）| 结局关系: ${chart.tiYong.changedRelation.relation}（${chart.tiYong.changedRelation.verdict}）| 综合: ${chart.tiYong.overallVerdict} (${chart.tiYong.overallScore}分)`);
    if (chart.timing) lines.push(`- 应期参考: ${chart.timing.desc}`);
    lines.push(`- 风水方位提示: ${chart.tiYong.fengshuiTip}`);
  } else if (chart.system === 'ziwei') {
    lines.push(`- 公历: ${chart.meta.solarDate} | 农历: ${chart.meta.lunarDate} | 四柱: ${chart.meta.chineseDate}`);
    lines.push(`- 五行局: ${chart.meta.fiveElementsClass} | 命主: ${chart.meta.soulStar} | 身主: ${chart.meta.bodyStar} | 身宫落: ${chart.meta.bodyPalaceName}`);
    lines.push(`- 生年四化: ${chart.mutagens.map(m => `${m.star}化${m.mutagen}(${m.palace})`).join('、')}`);
    if (chart.patterns?.length) lines.push(`- 紫微格局: ${chart.patterns.map(p => `${p.name}(${p.nature})`).join('、')}`);
    if (chart.yearlyHoroscopes?.length) {
      const cur = chart.yearlyHoroscopes[1] || chart.yearlyHoroscopes[0];
      lines.push(`- ${cur.year}流年(${cur.stemBranch}): 命宫落「${cur.palaceName}」，流年四化：${cur.mutagens.map(m => `${m.star}化${m.mutagen}`).join('、')}`);
    }
    lines.push('- 十二宫主辅星:');
    for (const p of chart.palaces) {
      const maj = p.majorStars.map(s => `${s.name}${s.brightness ? `(${s.brightness})` : ''}${s.mutagen ? `[化${s.mutagen}]` : ''}`).join('、') || '空宫';
      const min = p.minorStars.map(s => `${s.name}${s.mutagen ? `[化${s.mutagen}]` : ''}`).join('、');
      lines.push(`  - ${p.name}[${p.stemBranch}${p.isBodyPalace ? '·身宫' : ''}, 大限${p.decadalRange[0]}-${p.decadalRange[1]}岁]: 主星(${maj})${min ? ` | 辅煞(${min})` : ''}`);
    }
  } else if (chart.system === 'hepan') {
    lines.push(`- 合盘类型: ${chart.relationLabel} | 综合契合度: ${chart.overallScore}分（${chart.grade}）`);
    lines.push(`- ${chart.personA.name}: ${chart.personA.gender} ${chart.personA.solarDate} | 八字:${chart.personA.fourPillars.join(' ')} | 日主:${chart.personA.dayMaster} | 喜用:${chart.personA.favorable.join('、')} | 紫微命宫:${chart.personA.ziweiSoulStars}`);
    lines.push(`- ${chart.personB.name}: ${chart.personB.gender} ${chart.personB.solarDate} | 八字:${chart.personB.fourPillars.join(' ')} | 日主:${chart.personB.dayMaster} | 喜用:${chart.personB.favorable.join('、')} | 紫微命宫:${chart.personB.ziweiSoulStars}`);
    lines.push(`- 六维评分: ${chart.dimensions.map(d => `${d.label}${d.score}分(${d.tags.join('/')})`).join(' | ')}`);
    lines.push(`- 相合亮点: ${chart.highlights.join(' ')}`);
    lines.push(`- 磨合提醒: ${chart.cautions.join(' ')}`);
    lines.push(`- 调和建议: ${chart.advice.join(' ')}`);
  }

  return lines.join('\n');
}

export { DEMO_PRESETS, SYSTEM_META };
