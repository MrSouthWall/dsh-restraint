/**
 * Side-by-side comparison of two Bazi and Ziwei charts.
 * All displayed values are placements, counts, or named relationships.
 */
import { calculateBazi } from './bazi.js';
import { currentBeijingSolar } from './date-time.js';
import { calculateZiwei } from './ziwei.js';
import {
  GAN_HE,
  GAN_CHONG,
  WU_XING_ORDER,
  ZHI_LIU_HE,
  ZHI_LIU_CHONG,
  ZHI_LIU_HAI,
  ZHI_XING,
  getWuXingRelation,
} from '../data/constants.js';
import { LunarUtil } from '../vendor/chart-libraries.js';

const RELATIONS = {
  love: { label: '恋爱婚姻合盘', focus: ['夫妻', '福德'] },
  business: { label: '事业合伙合盘', focus: ['官禄', '财帛'] },
  family: { label: '挚友亲子合盘', focus: ['仆役', '父母', '子女'] },
};

function compareBranches(a, b) {
  const pair = a + b;
  return [
    ZHI_LIU_HE[pair] && '六合',
    ZHI_LIU_CHONG.has(pair) && '六冲',
    ZHI_LIU_HAI.has(pair) && '六害',
    ZHI_XING.has(pair) && '相刑',
  ].filter(Boolean);
}

function describePerson(name, bazi, ziwei) {
  const year = bazi.pillars[0];
  const { gender, civilDate, solarDate, apparentSolarDate } = bazi.meta;
  return {
    name,
    gender,
    civilDate,
    solarDate,
    ...(apparentSolarDate && { apparentSolarDate }),
    zodiac: bazi.meta.zodiac,
    fourPillars: bazi.pillars.map(p => p.ganZhi),
    dayMaster: `${bazi.dayMaster.gan}${bazi.dayMaster.element}`,
    naYin: year.naYin,
    wuxingPct: bazi.wuxing.percentages,
    mingGua: `${bazi.mingGua.name}（${bazi.mingGua.group}）`,
    ziweiClass: ziwei.meta.fiveElementsClass,
    ziweiSoulStars: ziwei.keyHighlights.soul.stars,
    ziweiSpouseStars: ziwei.keyHighlights.spouse.stars,
  };
}

export function calculateHepan(input = {}) {
  const relation = input.relation ?? 'love';
  const relMeta = RELATIONS[relation];
  if (!relMeta) throw new Error('请选择恋爱婚姻、事业合伙或挚友亲子。');
  if (!input.personA || !input.personB) throw new Error('请提供双方的出生日期和时间。');

  const nameA = input.personA.name || '甲方';
  const nameB = input.personB.name || '乙方';
  const startYear = currentBeijingSolar().getYear();
  const daYunThroughYear = startYear + 29;
  const baziA = calculateBazi(input.personA, { daYunThroughYear });
  const baziB = calculateBazi(input.personB, { daYunThroughYear });
  const ziweiA = calculateZiwei(input.personA);
  const ziweiB = calculateZiwei(input.personB);

  const dayA = baziA.pillars[2];
  const dayB = baziB.pillars[2];
  const dayGans = dayA.gan + dayB.gan;
  const dayBranches = dayA.zhi + dayB.zhi;
  const dayTags = [
    getWuXingRelation(dayA.ganElement, dayB.ganElement).label,
    GAN_HE[dayGans] && `日干${dayGans}五合`,
    GAN_CHONG.has(dayGans) && `日干${dayGans}相冲`,
    ...compareBranches(dayA.zhi, dayB.zhi).map(type => `日支${dayBranches}${type}`),
  ].filter(Boolean);

  const elementSynergy = WU_XING_ORDER.map(element => ({
    element,
    pctA: baziA.wuxing.percentages[element],
    pctB: baziB.wuxing.percentages[element],
  }));

  const branchInteractions = { 六合: [], 六冲: [], 六害: [], 相刑: [] };
  for (const a of baziA.pillars) {
    for (const b of baziB.pillars) {
      for (const type of compareBranches(a.zhi, b.zhi)) {
        branchInteractions[type].push(`${nameA}${a.label}${a.zhi} · ${nameB}${b.label}${b.zhi}`);
      }
    }
  }
  const branchTags = Object.entries(branchInteractions).map(([type, matches]) => `${type} ${matches.length} 对`);

  const yearA = baziA.pillars[0];
  const yearB = baziB.pillars[0];
  const naYinRelation = getWuXingRelation(yearA.naYin.at(-1), yearB.naYin.at(-1)).label;
  const tenGodTags = [
    `${nameB}日干相对${nameA}为${LunarUtil.SHI_SHEN[dayGans]}`,
    `${nameA}日干相对${nameB}为${LunarUtil.SHI_SHEN[dayB.gan + dayA.gan]}`,
  ];

  const ziweiTags = ['命宫', ...relMeta.focus].map(palaceName => {
    const starsAt = chart => chart.palaces.find(p => p.name === palaceName).majorStars.map(s => s.name).join('、') || '无主星';
    return `${palaceName} · ${nameA} ${starsAt(ziweiA)} / ${nameB} ${starsAt(ziweiB)}`;
  });

  const dimensions = [
    { key: 'dayPillar', label: '日柱关系', tags: dayTags, summary: `${dayA.ganZhi} × ${dayB.ganZhi} · ${dayTags.join('、')}` },
    { key: 'wuxing', label: '五行分布', tags: [], summary: '分别统计两张八字盘上八个明干支的五行。' },
    { key: 'branches', label: '地支关系', tags: branchTags, summary: branchTags.join(' · ') },
    { key: 'naYin', label: '纳音与生肖', tags: [], summary: `${baziA.meta.zodiac}（${yearA.naYin}） × ${baziB.meta.zodiac}（${yearB.naYin}） · ${naYinRelation}` },
    { key: 'shiShen', label: '日干十神', tags: tenGodTags, summary: tenGodTags.join(' · ') },
    { key: 'ziwei', label: '紫微宫位', tags: ziweiTags, summary: ziweiTags.join('；') },
  ];

  const from = `${startYear}-01-01`;
  const toExclusive = `${startYear + 30}-01-01`;
  const withinRange = chart => chart.daYun
    .filter(d => d.endExclusive > from && d.startDate < toExclusive)
    .map(d => ({ startDate: d.startDate, endExclusive: d.endExclusive, ganZhi: d.ganZhi }));

  return {
    id: `hepan-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    system: 'hepan',
    createdAt: new Date().toISOString(),
    title: `${nameA} × ${nameB} · ${relMeta.label}`,
    subtitle: '四柱、五行、紫微宫位与大运对照',
    question: input.question || '',
    sourceEngine: 'lunar-javascript 四柱与大运 · iztro 紫微星盘 · 项目并列对照',
    relation,
    relationLabel: relMeta.label,
    personA: describePerson(nameA, baziA, ziweiA),
    personB: describePerson(nameB, baziB, ziweiB),
    elementSynergy,
    branchInteractions,
    timeline30y: { from, toExclusive, personA: withinRange(baziA), personB: withinRange(baziB) },
    dimensions,
    summaryText: `${nameA}与${nameB}的${relMeta.label}。日柱${dayA.ganZhi} × ${dayB.ganZhi}，地支${branchTags.join('、')}。`,
  };
}
