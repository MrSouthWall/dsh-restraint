/**
 * Dual-Chart Synastry (合盘 - 八字 + 紫微双引擎六维合参) calculation engine.
 * Combines 6tail/lunar-javascript (Bazi) and SylarLong/iztro (Ziwei Doushu).
 */

import { calculateBazi } from './bazi.js';
import { calculateZiwei } from './ziwei.js';
import {
  GAN_HE,
  GAN_CHONG,
  ZHI_LIU_HE,
  ZHI_SAN_HE,
  ZHI_LIU_CHONG,
  ZHI_LIU_HAI,
  ZHI_XING,
  WU_XING_ORDER,
  WU_XING_META,
  getWuXingRelation,
} from '../data/constants.js';

const RELATION_META = {
  love: {
    label: '恋爱婚姻合盘',
    weights: { dayPillar: 0.25, wuxing: 0.22, branches: 0.14, naYin: 0.11, shiShen: 0.13, ziwei: 0.15 },
  },
  business: {
    label: '事业合伙合盘',
    weights: { dayPillar: 0.16, wuxing: 0.26, branches: 0.14, naYin: 0.08, shiShen: 0.18, ziwei: 0.18 },
  },
  family: {
    label: '挚友亲子合盘',
    weights: { dayPillar: 0.18, wuxing: 0.22, branches: 0.16, naYin: 0.14, shiShen: 0.14, ziwei: 0.16 },
  },
};

const NA_YIN_ELEMENT = naYin => {
  const last = String(naYin || '').slice(-1);
  return WU_XING_ORDER.includes(last) ? last : '土';
};

const STAR_ARCHETYPE = {
  七杀: '开创型', 破军: '开创型', 廉贞: '开创型', 贪狼: '开创型',
  紫微: '领导型', 天府: '领导型', 武曲: '领导型', 天相: '领导型',
  太阳: '支援型', 巨门: '支援型', 天机: '支援型',
  太阴: '合作型', 天梁: '合作型', 天同: '合作型',
};

function clampScore(v) {
  return Math.max(35, Math.min(98, Math.round(v)));
}

function getTenGodBetween(selfEl, selfPol, otherEl, otherPol) {
  const same = selfPol === otherPol;
  if (selfEl === otherEl) return same ? '比肩' : '劫财';
  if (WU_XING_META[selfEl].generates === otherEl) return same ? '食神' : '伤官';
  if (WU_XING_META[selfEl].controls === otherEl) return same ? '偏财' : '正财';
  if (WU_XING_META[otherEl].controls === selfEl) return same ? '七杀' : '正官';
  if (WU_XING_META[otherEl].generates === selfEl) return same ? '偏印' : '正印';
  return '平和';
}

function isSanHePair(b1, b2) {
  if (b1 === b2) return null;
  for (const group of ZHI_SAN_HE) {
    if (group.branches.includes(b1) && group.branches.includes(b2)) return group;
  }
  return null;
}

export function calculateHepan(input = {}) {
  const relation = RELATION_META[input.relation] ? input.relation : 'love';
  const relMeta = RELATION_META[relation];

  const personAInput = input.personA || { name: '甲方', date: '1995-05-18', time: '08:30', gender: 'male' };
  const personBInput = input.personB || { name: '乙方', date: '1996-11-08', time: '15:20', gender: 'female' };

  const nameA = personAInput.name || '甲方';
  const nameB = personBInput.name || '乙方';

  const baziA = calculateBazi({ ...personAInput, name: nameA });
  const baziB = calculateBazi({ ...personBInput, name: nameB });
  const ziweiA = calculateZiwei({ ...personAInput, name: nameA });
  const ziweiB = calculateZiwei({ ...personBInput, name: nameB });

  const highlights = [];
  const cautions = [];
  const advice = [];

  // 1. Day Pillar (日柱天干与夫妻宫地支)
  const dayA = baziA.pillars[2];
  const dayB = baziB.pillars[2];
  const ganPair = dayA.gan + dayB.gan;
  const zhiPair = dayA.zhi + dayB.zhi;
  let dayScore = 72;
  const dayTags = [];

  const ganHe = GAN_HE[ganPair];
  const zhiHe = ZHI_LIU_HE[zhiPair];
  const zhiSan = isSanHePair(dayA.zhi, dayB.zhi);
  const ganRel = getWuXingRelation(dayA.ganElement, dayB.ganElement);

  if (ganHe && zhiHe) {
    dayScore += 24;
    dayTags.push(`天合地合（${ganPair}${ganHe} · ${zhiPair}${zhiHe}）`);
    highlights.push(`双方日柱构成罕见的「天合地合」（${dayA.ganZhi} 与 ${dayB.ganZhi}），先天磁场高度投契，天然有默契与吸引力。`);
  } else {
    if (ganHe) {
      dayScore += 16;
      dayTags.push(`日干五合（${ganPair}${ganHe}）`);
      highlights.push(`双方日干「${ganPair}${ganHe}」，核心观念与情感频段容易同频。`);
    } else if (GAN_CHONG.has(ganPair)) {
      dayScore -= 10;
      dayTags.push(`日干相冲（${ganPair}冲）`);
      cautions.push(`日干「${ganPair}」相冲，表达风格与处事立场较直接，遇事宜多给对方台阶。`);
    } else if (ganRel.type === '相生' || ganRel.type === '受生') {
      dayScore += 10;
      dayTags.push(`日主相生（${ganRel.label}）`);
      highlights.push(`双方日主五行相生（${ganRel.label}），日常相处自带滋养与欣赏感。`);
    } else if (ganRel.type === '比和') {
      dayScore += 8;
      dayTags.push('日主同气比和');
    }

    if (zhiHe) {
      dayScore += 14;
      dayTags.push(`夫妻宫六合（${zhiPair}${zhiHe}）`);
      highlights.push(`日支（夫妻宫）「${zhiPair}${zhiHe}」，生活习惯与私下相处亲密省力。`);
    } else if (zhiSan) {
      dayScore += 10;
      dayTags.push(`日支半合（${zhiSan.name}）`);
    } else if (ZHI_LIU_CHONG.has(zhiPair)) {
      dayScore -= 16;
      dayTags.push(`夫妻宫相冲（${zhiPair}冲）`);
      cautions.push(`双方日支「${zhiPair}」相冲，生活节奏或日常小习惯易碰撞，建议保留各自独立空间。`);
      advice.push(`针对日支「${zhiPair}冲」，遇分歧时先冷处理 10 分钟再沟通，并用共同目标替代情绪拉扯。`);
    } else if (ZHI_LIU_HAI.has(zhiPair)) {
      dayScore -= 8;
      dayTags.push(`日支相害（${zhiPair}害）`);
      cautions.push(`日支「${zhiPair}」略带相穿，重在有话直说，避免闷在心里胡思乱想。`);
    } else if (ZHI_XING.has(zhiPair)) {
      dayScore -= 8;
      dayTags.push(`日支相刑（${zhiPair}刑）`);
      cautions.push(`日支「${zhiPair}」带相刑，容易因过于在意而互相较劲，多用肯定式表达可化解。`);
    }
  }
  dayScore = clampScore(dayScore);

  // 2. Five Elements & Favorable Element Complementarity (五行喜用互补)
  const favA = baziA.wuxing.favorable;
  const favB = baziB.wuxing.favorable;
  let wxScore = 66;
  const wxTags = [];
  const aHelpsB = favB.filter(el => baziA.wuxing.percentages[el] >= 22);
  const bHelpsA = favA.filter(el => baziB.wuxing.percentages[el] >= 22);

  if (aHelpsB.length > 0 && bHelpsA.length > 0) {
    wxScore += 24;
    wxTags.push(`双向喜用互补（${nameA}补${aHelpsB.join('')} · ${nameB}补${bHelpsA.join('')}）`);
    highlights.push(`五行喜用神双向互补：${nameA}自带${nameB}所需的「${aHelpsB.join('、')}」，${nameB}亦补足${nameA}所需的「${bHelpsA.join('、')}」，相处互旺运势！`);
  } else if (aHelpsB.length > 0 || bHelpsA.length > 0) {
    wxScore += 14;
    const helper = aHelpsB.length > 0 ? `${nameA}助旺${nameB}（补${aHelpsB.join('')}）` : `${nameB}助旺${nameA}（补${bHelpsA.join('')}）`;
    wxTags.push(`单向喜用相助（${helper}）`);
    highlights.push(`五行气场有明显互补：${helper}，在一起能带来稳定加分。`);
  }

  // Combined five-element balance check
  const combinedPct = {};
  let variance = 0;
  for (const el of WU_XING_ORDER) {
    combinedPct[el] = Math.round((baziA.wuxing.percentages[el] + baziB.wuxing.percentages[el]) / 2);
    variance += Math.abs(combinedPct[el] - 20);
  }
  if (variance <= 28) {
    wxScore += 8;
    wxTags.push('合盘五行高度均衡');
  } else if (variance >= 55) {
    wxScore -= 6;
    const weakest = WU_XING_ORDER.reduce((a, b) => (combinedPct[a] <= combinedPct[b] ? a : b));
    wxTags.push(`合盘共同偏缺「${weakest}」`);
    advice.push(`双方合盘共同偏弱的五行为「${weakest}」，共同生活或办公空间可在${WU_XING_META[weakest].direction}适当点缀相关元素（${WU_XING_META[weakest].fengshui}）。`);
  }
  wxScore = clampScore(wxScore);

  // 3. Global Branch Interactions (四柱地支整体合冲)
  const branchesA = baziA.pillars.map(p => p.zhi);
  const branchesB = baziB.pillars.map(p => p.zhi);
  let heCount = 0;
  let chongCount = 0;
  for (const a of branchesA) {
    for (const b of branchesB) {
      if (ZHI_LIU_HE[a + b] || isSanHePair(a, b)) heCount += 1;
      if (ZHI_LIU_CHONG.has(a + b)) chongCount += 1;
    }
  }
  const branchScore = clampScore(70 + heCount * 5 - chongCount * 7);
  const branchTags = [`合局 ${heCount} 组`, `冲局 ${chongCount} 组`];

  // 4. Year NaYin & Zodiac (年命纳音与生肖)
  const yearA = baziA.pillars[0];
  const yearB = baziB.pillars[0];
  const nyElA = NA_YIN_ELEMENT(yearA.naYin);
  const nyElB = NA_YIN_ELEMENT(yearB.naYin);
  const nyRel = getWuXingRelation(nyElA, nyElB);
  let nyScore = 72;
  const nyTags = [`${yearA.naYin} vs ${yearB.naYin}`];
  if (nyRel.type === '比和' || nyRel.type === '相生' || nyRel.type === '受生') {
    nyScore += 14;
    nyTags.push(`纳音${nyRel.type}`);
  } else if (nyRel.type === '相克' || nyRel.type === '受克') {
    nyScore -= 8;
    nyTags.push(`纳音${nyRel.label}`);
  }
  const yzPair = yearA.zhi + yearB.zhi;
  if (ZHI_LIU_HE[yzPair]) {
    nyScore += 12;
    nyTags.push(`生肖六合（${baziA.meta.zodiac}合${baziB.meta.zodiac}）`);
    highlights.push(`双方生肖「${baziA.meta.zodiac}」与「${baziB.meta.zodiac}」构成六合，家庭观念与长辈缘分融洽。`);
  } else if (isSanHePair(yearA.zhi, yearB.zhi)) {
    nyScore += 9;
    nyTags.push(`生肖三合（${baziA.meta.zodiac}·${baziB.meta.zodiac}）`);
  } else if (ZHI_LIU_CHONG.has(yzPair)) {
    nyScore -= 10;
    nyTags.push(`生肖相冲（${baziA.meta.zodiac}冲${baziB.meta.zodiac}）`);
    cautions.push(`年支生肖「${baziA.meta.zodiac}」与「${baziB.meta.zodiac}」相冲，成长背景或消费观可能不同，多尊重彼此原生家庭习惯即可。`);
  }
  nyScore = clampScore(nyScore);

  // 5. Mutual Ten-God Role Synergy (十神互动与角色分工)
  const bInA = getTenGodBetween(dayA.ganElement, dayA.ganYinYang, dayB.ganElement, dayB.ganYinYang);
  const aInB = getTenGodBetween(dayB.ganElement, dayB.ganYinYang, dayA.ganElement, dayA.ganYinYang);
  let ssScore = 74;
  const goodTenGods = relation === 'business'
    ? ['正财', '偏财', '正官', '正印', '食神', '比肩']
    : ['正财', '正官', '正印', '食神', '比肩', '偏印'];
  if (goodTenGods.includes(bInA)) ssScore += 9;
  if (goodTenGods.includes(aInB)) ssScore += 9;
  if (bInA === '七杀' || aInB === '七杀') {
    ssScore -= 6;
    cautions.push(`十神互见「七杀」，一方气场较强、推动感足，相处宜约定边界与明确分工。`);
  }
  const ssTags = [`${nameB}是${nameA}的「${bInA}」`, `${nameA}是${nameB}的「${aInB}」`];
  ssScore = clampScore(ssScore);

  // 6. Ziwei Doushu Core Star Resonance (紫微主星与宫位合参，空宫依古法借对宫主星)
  const getEffectivePrimaryStar = zwChart => {
    const soul = zwChart.palaces[zwChart.meta.soulPalaceIndex];
    if (soul?.majorStars?.length) {
      return { name: soul.majorStars[0].name, borrowed: false };
    }
    const opp = zwChart.palaces[soul?.oppositeIndex ?? 0];
    if (opp?.majorStars?.length) {
      return { name: opp.majorStars[0].name, borrowed: true };
    }
    return { name: '紫微', borrowed: true };
  };
  const starInfoA = getEffectivePrimaryStar(ziweiA);
  const starInfoB = getEffectivePrimaryStar(ziweiB);
  const primaryStarA = starInfoA.name;
  const primaryStarB = starInfoB.name;
  const archA = STAR_ARCHETYPE[primaryStarA] || '均衡型';
  const archB = STAR_ARCHETYPE[primaryStarB] || '均衡型';
  let zwScore = 75;
  const zwTags = [
    `${nameA}命宫:${primaryStarA}${starInfoA.borrowed ? '(借对宫)' : ''}[${archA}]`,
    `${nameB}命宫:${primaryStarB}${starInfoB.borrowed ? '(借对宫)' : ''}[${archB}]`,
  ];

  const complementaryPairs = new Set([
    '开创型-合作型', '合作型-开创型',
    '领导型-支援型', '支援型-领导型',
    '领导型-合作型', '合作型-领导型',
    '开创型-支援型', '支援型-开创型',
  ]);
  if (complementaryPairs.has(`${archA}-${archB}`)) {
    zwScore += 15;
    zwTags.push('紫微星性刚柔互补');
    highlights.push(`紫微命宫主星呈「${archA} × ${archB}」黄金互补，一个主外突破/统筹，一个主内稳健/协调，分工极佳。`);
  } else if (archA === archB) {
    zwScore += 8;
    zwTags.push('紫微星性同频共振');
  }

  // Check if either person's HuaLu (化禄) sits in relationship/wealth palaces
  const luA = ziweiA.mutagens.find(m => m.mutagen === '禄');
  const luB = ziweiB.mutagens.find(m => m.mutagen === '禄');
  const targetPalaces = relation === 'business' ? ['官禄', '财帛', '仆役', '命宫'] : ['夫妻', '福德', '命宫', '田宅'];
  if (luA && targetPalaces.includes(luA.palace)) {
    zwScore += 5;
    zwTags.push(`${nameA}${luA.star}化禄入${luA.palace}`);
  }
  if (luB && targetPalaces.includes(luB.palace)) {
    zwScore += 5;
    zwTags.push(`${nameB}${luB.star}化禄入${luB.palace}`);
  }
  zwScore = clampScore(zwScore);

  const dimensions = [
    { key: 'dayPillar', label: '日柱契合', score: dayScore, tags: dayTags, summary: `${dayA.ganZhi} × ${dayB.ganZhi}：${dayTags.join('；') || '平和相安'}` },
    { key: 'wuxing', label: '五行互补', score: wxScore, tags: wxTags, summary: wxTags.join('；') || '双方五行分布各自独立，可通过环境配色平衡。' },
    { key: 'branches', label: '地支互动', score: branchScore, tags: branchTags, summary: `四柱地支共形成 ${heCount} 组相合、${chongCount} 组相冲。` },
    { key: 'naYin', label: '纳音生肖', score: nyScore, tags: nyTags, summary: `${baziA.meta.zodiac}(${yearA.naYin}) × ${baziB.meta.zodiac}(${yearB.naYin})` },
    { key: 'shiShen', label: '十神分工', score: ssScore, tags: ssTags, summary: ssTags.join('；') },
    { key: 'ziwei', label: '紫微星盘', score: zwScore, tags: zwTags, summary: `${primaryStarA}(${archA}) × ${primaryStarB}(${archB})` },
  ];

  const overallScore = Math.round(
    dimensions.reduce((sum, d) => sum + d.score * relMeta.weights[d.key], 0),
  );

  let grade = '重在经营';
  if (overallScore >= 88) grade = '天作之合';
  else if (overallScore >= 80) grade = '佳偶良缘';
  else if (overallScore >= 72) grade = '互补默契';
  else if (overallScore >= 64) grade = '磨合见真';

  if (highlights.length === 0) {
    highlights.push('双方命局整体平和稳定，没有极端偏枯，适合细水长流式共同成长。');
  }
  if (cautions.length === 0) {
    cautions.push('盘面未见明显硬冲，日常相处注意保持沟通透明、定期复盘共同目标即可。');
  }
  if (advice.length === 0) {
    const commonEl = WU_XING_ORDER.find(el => favA.includes(el) && favB.includes(el)) || favA[0] || '木';
    advice.push(`双方共同受益的调和五行为「${commonEl}」，居家或会面可优先选用${WU_XING_META[commonEl].direction}区域与对应暖润色调。`);
  }
  advice.push('合盘的意义在于“提前看清省力区与磨合点”：发挥互补优势、提前约定摩擦时的沟通机制，好关系永远靠双向用心经营。');

  // 30-Year Dual Fortune Sync Curve (未来30年双人大运同步共振曲线)
  const startYear = new Date().getFullYear();
  const evalDaYunLuck = (baziChart, targetYear) => {
    const active = baziChart.daYun.find(d => targetYear >= d.startYear && targetYear <= d.endYear) || baziChart.daYun[0];
    if (!active) return { score: 70, ganZhi: '' };
    const fav = baziChart.wuxing.favorable;
    const unfav = baziChart.wuxing.unfavorable;
    let sc = 68;
    if (fav.includes(active.ganElement)) sc += 14;
    if (fav.includes(active.zhiElement)) sc += 14;
    if (unfav.includes(active.ganElement)) sc -= 10;
    if (unfav.includes(active.zhiElement)) sc -= 10;
    return { score: Math.max(42, Math.min(96, sc)), ganZhi: active.ganZhi };
  };
  const timeline30y = Array.from({ length: 10 }, (_, idx) => {
    const year = startYear + idx * 3;
    const a = evalDaYunLuck(baziA, year);
    const b = evalDaYunLuck(baziB, year);
    const syncGap = Math.abs(a.score - b.score);
    let phase = '平稳同行';
    if (a.score >= 78 && b.score >= 78) phase = '双星共旺黄金期';
    else if (syncGap >= 22) phase = '互补托底期';
    else if (a.score <= 58 && b.score <= 58) phase = '蓄力磨砺期';
    return { year, scoreA: a.score, scoreB: b.score, daYunA: a.ganZhi, daYunB: b.ganZhi, phase };
  });

  // Five-Element Complementarity Matrix (双方五行互补对照)
  const elementSynergy = WU_XING_ORDER.map(el => ({
    element: el,
    pctA: baziA.wuxing.percentages[el] || 0,
    pctB: baziB.wuxing.percentages[el] || 0,
    combined: combinedPct[el] || 0,
    aNeeds: favA.includes(el),
    bNeeds: favB.includes(el),
  }));

  return {
    id: `hepan-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    system: 'hepan',
    createdAt: new Date().toISOString(),
    title: `${nameA} × ${nameB} · ${relMeta.label}`,
    subtitle: `综合契合度 ${overallScore} 分 · ${grade}`,
    question: input.question || '',
    sourceEngine: '6tail/lunar-javascript + SylarLong/iztro 双引擎合参',
    relation,
    relationLabel: relMeta.label,
    overallScore,
    grade,
    personA: {
      name: nameA,
      gender: baziA.meta.gender,
      solarDate: baziA.meta.solarDate,
      zodiac: baziA.meta.zodiac,
      fourPillars: baziA.pillars.map(p => p.ganZhi),
      dayMaster: `${dayA.gan}${dayA.ganElement}`,
      naYin: yearA.naYin,
      favorable: baziA.wuxing.favorable,
      wuxingPct: baziA.wuxing.percentages,
      mingGua: `${baziA.mingGua.name}（${baziA.mingGua.group}）`,
      ziweiClass: ziweiA.meta.fiveElementsClass,
      ziweiSoulStars: ziweiA.keyHighlights.soul.stars,
      ziweiSpouseStars: ziweiA.keyHighlights.spouse.stars,
    },
    personB: {
      name: nameB,
      gender: baziB.meta.gender,
      solarDate: baziB.meta.solarDate,
      zodiac: baziB.meta.zodiac,
      fourPillars: baziB.pillars.map(p => p.ganZhi),
      dayMaster: `${dayB.gan}${dayB.ganElement}`,
      naYin: yearB.naYin,
      favorable: baziB.wuxing.favorable,
      wuxingPct: baziB.wuxing.percentages,
      mingGua: `${baziB.mingGua.name}（${baziB.mingGua.group}）`,
      ziweiClass: ziweiB.meta.fiveElementsClass,
      ziweiSoulStars: ziweiB.keyHighlights.soul.stars,
      ziweiSpouseStars: ziweiB.keyHighlights.spouse.stars,
    },
    combinedWuXing: combinedPct,
    elementSynergy,
    timeline30y,
    dimensions,
    highlights,
    cautions,
    advice,
    summaryText: `${nameA}（${baziA.pillars.map(p => p.ganZhi).join(' ')}）与${nameB}（${baziB.pillars.map(p => p.ganZhi).join(' ')}）${relMeta.label}综合评分 ${overallScore} 分（${grade}）。`,
  };
}
