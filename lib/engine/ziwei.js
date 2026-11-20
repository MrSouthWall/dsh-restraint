/**
 * Ziwei Doushu (紫微斗数) calculation engine powered by SylarLong/iztro.
 * Includes full 12-palace 4x4 grid coordinates, Tri-Aspect (三方四正) links,
 * Four Mutagens (生年四化) summary, and beginner plain-language glossaries.
 */

import { astro } from 'iztro';
import { parseDateTimeInput, normalizeGender } from './bazi.js';
import {
  ZIWEI_PALACE_GLOSSARY,
  ZIWEI_STAR_GLOSSARY,
  ZIWEI_MUTAGEN_GLOSSARY,
} from '../data/constants.js';

// Traditional 4x4 astrolabe coordinates keyed by iztro palace index (0=寅..11=丑)
const GRID_POS_BY_INDEX = {
  3: { row: 0, col: 0 }, // 巳
  4: { row: 0, col: 1 }, // 午
  5: { row: 0, col: 2 }, // 未
  6: { row: 0, col: 3 }, // 申
  2: { row: 1, col: 0 }, // 辰
  7: { row: 1, col: 3 }, // 酉
  1: { row: 2, col: 0 }, // 卯
  8: { row: 2, col: 3 }, // 戌
  0: { row: 3, col: 0 }, // 寅
  11: { row: 3, col: 1 }, // 丑
  10: { row: 3, col: 2 }, // 子
  9: { row: 3, col: 3 }, // 亥
};

export function hourToIztroTimeIndex(hour) {
  const h = Math.max(0, Math.min(23, Math.trunc(Number(hour) || 0)));
  if (h === 0) return 0; // 早子时 00:00-01:00
  if (h >= 23) return 12; // 晚子时 23:00-00:00
  return Math.floor((h + 1) / 2);
}

export function calculateZiwei(input = {}) {
  const { solar, lunar, calendar } = parseDateTimeInput(input);
  const gender = normalizeGender(input.gender);

  const solarStr = `${solar.getYear()}-${solar.getMonth()}-${solar.getDay()}`;
  const timeIndex = hourToIztroTimeIndex(solar.getHour());
  const chart = astro.bySolar(solarStr, timeIndex, gender.label, true, 'zh-CN');

  const mutagens = [];
  let soulPalaceIndex = 0;
  let bodyPalaceIndex = 0;

  const palaces = chart.palaces.map(p => {
    const pos = GRID_POS_BY_INDEX[p.index] || { row: 0, col: 0 };
    const isSoulPalace = p.name === '命宫';
    if (isSoulPalace) soulPalaceIndex = p.index;
    if (p.isBodyPalace) bodyPalaceIndex = p.index;

    const mapStar = s => {
      if (s.mutagen) {
        mutagens.push({
          mutagen: s.mutagen,
          star: s.name,
          palace: p.name,
          palaceIndex: p.index,
          branch: p.earthlyBranch,
          meaning: ZIWEI_MUTAGEN_GLOSSARY[s.mutagen] || '',
        });
      }
      return {
        name: s.name,
        type: s.type,
        brightness: s.brightness || '',
        mutagen: s.mutagen || '',
        glossary: ZIWEI_STAR_GLOSSARY[s.name] || '',
      };
    };

    const majorStars = (p.majorStars || []).map(mapStar);
    const minorStars = (p.minorStars || []).map(mapStar);
    const adjectiveStars = (p.adjectiveStars || []).map(s => ({
      name: s.name,
      type: s.type,
    }));

    return {
      index: p.index,
      name: p.name,
      isSoulPalace,
      isBodyPalace: Boolean(p.isBodyPalace),
      heavenlyStem: p.heavenlyStem,
      earthlyBranch: p.earthlyBranch,
      stemBranch: `${p.heavenlyStem}${p.earthlyBranch}`,
      gridRow: pos.row,
      gridCol: pos.col,
      oppositeIndex: (p.index + 6) % 12,
      trineIndices: [(p.index + 4) % 12, (p.index + 8) % 12],
      majorStars,
      minorStars,
      adjectiveStars,
      changsheng12: p.changsheng12 || '',
      boshi12: p.boshi12 || '',
      decadalRange: p.decadal?.range || [0, 0],
      decadalStemBranch: p.decadal ? `${p.decadal.heavenlyStem}${p.decadal.earthlyBranch}` : '',
      glossary: ZIWEI_PALACE_GLOSSARY[p.name] || '',
    };
  });

  // Order mutagens canonically: 禄, 权, 科, 忌
  const mutagenOrder = { 禄: 0, 权: 1, 科: 2, 忌: 3 };
  mutagens.sort((a, b) => (mutagenOrder[a.mutagen] ?? 9) - (mutagenOrder[b.mutagen] ?? 9));

  const soulPalace = palaces[soulPalaceIndex];
  const bodyPalace = palaces[bodyPalaceIndex];
  const careerPalace = palaces.find(p => p.name === '官禄') || palaces[0];
  const wealthPalace = palaces.find(p => p.name === '财帛') || palaces[0];
  const spousePalace = palaces.find(p => p.name === '夫妻') || palaces[0];

  const starNames = p => (p.majorStars.length ? p.majorStars.map(s => `${s.name}${s.brightness ? `(${s.brightness})` : ''}${s.mutagen ? `[化${s.mutagen}]` : ''}`).join('、') : '空宫（借对宫主星）');

  // Detect classic Ziwei patterns (紫微经典格局识别)
  const patterns = [];
  const soulTriIdx = [soulPalace.index, soulPalace.oppositeIndex, ...soulPalace.trineIndices];
  const triStarNames = new Set(
    soulTriIdx.flatMap(idx => [
      ...(palaces[idx]?.majorStars || []).map(s => s.name),
      ...(palaces[idx]?.minorStars || []).map(s => s.name),
    ]),
  );
  const soulMajorSet = new Set(soulPalace.majorStars.map(s => s.name));
  const triMutagens = new Set(
    soulTriIdx.flatMap(idx => [
      ...(palaces[idx]?.majorStars || []).map(s => s.mutagen),
      ...(palaces[idx]?.minorStars || []).map(s => s.mutagen),
    ]).filter(Boolean),
  );
  if (soulMajorSet.has('紫微') && soulMajorSet.has('天府')) {
    patterns.push({ name: '紫府同宫格', nature: '大吉', desc: '帝星与令星同守命宫，气度稳重、一生贵人多且自带资源统筹力。' });
  } else if (triStarNames.has('紫微') && triStarNames.has('天府')) {
    patterns.push({ name: '紫府朝垣格', nature: '大吉', desc: '紫微与天府分守三方拱照命宫，格局宽广、自带统筹管理与厚重根基。' });
  }
  if (triStarNames.has('七杀') && triStarNames.has('破军') && triStarNames.has('贪狼')) {
    patterns.push({ name: '杀破狼格', nature: '开创', desc: '人生充满变局与突破能量，敢闯敢拼、宜在前沿变动行业大展拳脚。' });
  }
  if (triStarNames.has('天机') && triStarNames.has('太阴') && triStarNames.has('天同') && triStarNames.has('天梁')) {
    patterns.push({ name: '机月同梁格', nature: '稳健', desc: '聪慧温和、善策划与专业服务，极利大企业骨干、公职、研发与专业顾问。' });
  }
  if (triStarNames.has('天府') && triStarNames.has('天相')) {
    patterns.push({ name: '府相朝垣格', nature: '吉', desc: '衣食丰足、人缘厚重，重信守诺、擅长管理运营与稳定积财。' });
  }
  if (triStarNames.has('太阳') && triStarNames.has('太阴')) {
    patterns.push({ name: '日月并明 / 辉映', nature: '吉', desc: '阴阳调和、名利兼收之象，表达力与细腻度兼具。' });
  }
  if (triStarNames.has('巨门') && triStarNames.has('太阳')) {
    patterns.push({ name: '巨日照命格', nature: '吉', desc: '太阳光芒驱散巨门幽暗，极利口才表达、深度研究、顾问谈判与异地扬名。' });
  }
  if (triStarNames.has('天机') && triStarNames.has('巨门')) {
    patterns.push({ name: '机巨同临格', nature: '智谋', desc: '思维敏锐、洞察力强、善辩与策划，宜以专业知识与分析能力立身。' });
  }
  if (triStarNames.has('太阳') && triStarNames.has('天梁') && (triStarNames.has('文昌') || triStarNames.has('禄存'))) {
    patterns.push({ name: '阳梁昌禄格', nature: '大吉', desc: '经典科甲学术大格！极利考试深造、专业权威认证与公信力事业。' });
  }
  if (soulMajorSet.has('紫微') && (triStarNames.has('左辅') || triStarNames.has('右弼') || triStarNames.has('天魁') || triStarNames.has('天钺'))) {
    patterns.push({ name: '君臣庆会格', nature: '大吉', desc: '紫微得辅弼或魁钺拱照，主团队得力、领导力出众且常遇伯乐提拔。' });
  }
  if (triMutagens.has('禄') && triMutagens.has('权') && triMutagens.has('科')) {
    patterns.push({ name: '三奇嘉会格', nature: '大吉', desc: '化禄、化权、化科齐聚命宫三方四正，财官名声并美，极具成大事之潜能。' });
  }
  if ((soulMajorSet.has('贪狼') || triStarNames.has('贪狼')) && (triStarNames.has('火星') || triStarNames.has('铃星'))) {
    patterns.push({ name: '火贪 / 铃贪格', nature: '奇遇', desc: '爆发力与机遇运强，善抓风口与跨界红利，提醒见好就收守成果。' });
  }
  if (triStarNames.has('禄存') && triStarNames.has('天马')) {
    patterns.push({ name: '禄马交驰格', nature: '财吉', desc: '动中生财之象，越走出去拓展、出差合作或跨城发展，财路越宽。' });
  }
  if (triStarNames.has('文昌') && triStarNames.has('文曲')) {
    patterns.push({ name: '昌曲会照', nature: '文雅', desc: '才华细腻、审美与文字表达出众，利文化创意、教育设计与专业口碑。' });
  }
  if (triStarNames.has('天魁') && triStarNames.has('天钺')) {
    patterns.push({ name: '坐贵向贵（魁钺格）', nature: '贵人', desc: '天魁天钺双贵人拱照，关键节点常得长辈、前辈或平台机遇提携。' });
  }
  if (soulPalace.majorStars.length === 0) {
    patterns.push({ name: '命无正曜（借星格）', nature: '灵动', desc: '命宫空宫借对宫迁移主星，代表适应力极强、可塑性高、遇强则强。' });
  }
  if (patterns.length === 0 && soulPalace.majorStars.length > 0) {
    const names = soulPalace.majorStars.map(s => s.name).join('·');
    patterns.push({ name: `${names}坐命格`, nature: '本命', desc: `以${names}为本命主轴星群，三方四正星力集中，宜深耕核心专长稳步放大优势。` });
  }

  // Yearly & Decadal Horoscopes (2025 / 2026 / 2027 流年三层运限 + 流年四化)
  const baseYear = new Date().getFullYear();
  const mutagenLabels = ['禄', '权', '科', '忌'];
  const yearlyHoroscopes = [baseYear - 1, baseYear, baseYear + 1].map(y => {
    try {
      const hs = chart.horoscope(`${y}-6-15`);
      const yearlyMutagens = (hs.yearly?.mutagen || []).map((starName, idx) => {
        const hostPalace = palaces.find(p =>
          p.majorStars.some(s => s.name === starName) || p.minorStars.some(s => s.name === starName),
        );
        return {
          mutagen: mutagenLabels[idx] || '',
          star: starName,
          palace: hostPalace?.name || '',
          palaceIndex: hostPalace?.index ?? -1,
        };
      });
      return {
        year: y,
        stemBranch: `${hs.yearly?.heavenlyStem || ''}${hs.yearly?.earthlyBranch || ''}`,
        palaceIndex: hs.yearly?.index ?? 0,
        palaceName: palaces[hs.yearly?.index ?? 0]?.name || '',
        decadalIndex: hs.decadal?.index ?? 0,
        decadalStemBranch: `${hs.decadal?.heavenlyStem || ''}${hs.decadal?.earthlyBranch || ''}`,
        decadalPalaceName: palaces[hs.decadal?.index ?? 0]?.name || '',
        mutagens: yearlyMutagens,
      };
    } catch {
      return null;
    }
  }).filter(Boolean);

  return {
    id: `ziwei-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    system: 'ziwei',
    createdAt: new Date().toISOString(),
    title: input.name ? `${input.name} · 紫微斗数` : `${chart.fiveElementsClass} · 紫微斗数`,
    subtitle: `${solar.toYmd()} ${chart.time}（${chart.timeRange}） · ${gender.label}命`,
    question: input.question || '',
    sourceEngine: 'SylarLong/iztro',
    meta: {
      name: input.name || '',
      gender: gender.label,
      calendar,
      solarDate: `${solar.toYmd()} ${String(solar.getHour()).padStart(2, '0')}:${String(solar.getMinute()).padStart(2, '0')}`,
      lunarDate: chart.lunarDate,
      chineseDate: chart.chineseDate,
      time: chart.time,
      timeRange: chart.timeRange,
      zodiac: chart.zodiac,
      sign: chart.sign,
      fiveElementsClass: chart.fiveElementsClass,
      soulStar: chart.soul,
      bodyStar: chart.body,
      earthlyBranchOfSoulPalace: chart.earthlyBranchOfSoulPalace,
      earthlyBranchOfBodyPalace: chart.earthlyBranchOfBodyPalace,
      soulPalaceIndex,
      bodyPalaceIndex,
      bodyPalaceName: bodyPalace?.name || '',
    },
    palaces,
    mutagens,
    patterns,
    yearlyHoroscopes,
    keyHighlights: {
      soul: { palace: soulPalace?.name, branch: soulPalace?.earthlyBranch, stars: starNames(soulPalace) },
      career: { palace: careerPalace?.name, branch: careerPalace?.earthlyBranch, stars: starNames(careerPalace) },
      wealth: { palace: wealthPalace?.name, branch: wealthPalace?.earthlyBranch, stars: starNames(wealthPalace) },
      spouse: { palace: spousePalace?.name, branch: spousePalace?.earthlyBranch, stars: starNames(spousePalace) },
    },
    summaryText: `五行局：${chart.fiveElementsClass}，命主${chart.soul}、身主${chart.body}；命宫(${soulPalace?.stemBranch})：${starNames(soulPalace)}；官禄宫：${starNames(careerPalace)}；财帛宫：${starNames(wealthPalace)}；四化：${mutagens.map(m => `${m.star}化${m.mutagen}(${m.palace})`).join('、')}${patterns.length ? `；格局：${patterns.map(p => p.name).join('、')}` : ''}。`,
  };
}
