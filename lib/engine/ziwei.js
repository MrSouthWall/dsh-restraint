/**
 * Ziwei Doushu (紫微斗数) calculation engine powered by SylarLong/iztro.
 * Includes full 12-palace 4x4 grid coordinates, Tri-Aspect (三方四正) links,
 * Four Mutagens (生年四化) summary, and beginner plain-language glossaries.
 */

import { astro } from '../vendor/chart-libraries.js';
import { normalizeGender } from './bazi.js';
import { currentBeijingSolar, parseDateTimeInput } from './date-time.js';
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
  const { solar, civilSolar, calendar, trueSolarApplied, solarOffsetSeconds } = parseDateTimeInput(input, { requireBirth: true });
  const gender = normalizeGender(input.gender);

  const solarStr = solar.toYmd();
  const timeIndex = hourToIztroTimeIndex(solar.getHour());
  const chart = astro.withOptions({
    type: 'solar',
    dateStr: solarStr,
    timeIndex,
    gender: gender.label,
    fixLeap: true,
    language: 'zh-CN',
    config: { yearDivide: 'normal', horoscopeDivide: 'normal', ageDivide: 'normal', dayDivide: 'forward', algorithm: 'default' },
  });

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

  // Compare verified placements, without treating a preliminary combination as a full reading.
  const patterns = [];
  const opposite = palaces[soulPalace.oppositeIndex];
  const relatedPalaces = [soulPalace, opposite, ...soulPalace.trineIndices.map(i => palaces[i])];
  const triStars = relatedPalaces.flatMap(p => [...p.majorStars, ...p.minorStars]);
  const triStarNames = new Set(triStars.map(s => s.name));
  const triMutagens = new Set(triStars.map(s => s.mutagen));
  const hasMajor = (palace, ...stars) => stars.every(name => palace.majorStars.some(s => s.name === name));
  const hasInTrine = (...stars) => stars.every(name => triStarNames.has(name));
  const addPattern = (name, desc) => patterns.push({ name, nature: '组合', desc });

  if (hasMajor(soulPalace, '紫微', '天府')) {
    addPattern('紫府同宫', '紫微与天府同守命宫。');
  } else if (hasInTrine('紫微', '天府')) {
    addPattern('紫府会照', '命宫三方四正见紫微与天府。');
  }
  if (['七杀', '破军', '贪狼'].some(star => hasMajor(soulPalace, star))
      && hasInTrine('七杀', '破军', '贪狼')) {
    addPattern('杀破狼坐命', '七杀、破军、贪狼之一入命，其余见于命宫三方四正。');
  }
  if (hasInTrine('天机', '太阴', '天同', '天梁')) {
    addPattern('机月同梁会照', '天机、太阴、天同、天梁同见于命宫三方四正。');
  }
  if (hasMajor(careerPalace, '天府') && hasMajor(wealthPalace, '天相')) {
    addPattern('府相朝垣', '天府在官禄宫，天相在财帛宫，两宫会照命宫。');
  }
  if (hasInTrine('太阳', '太阴')) addPattern('日月会照', '太阳与太阴均在命宫三方四正。');
  if (hasMajor(soulPalace, '巨门', '太阳') || hasMajor(opposite, '巨门', '太阳')) {
    addPattern('巨日照命', '巨门与太阳同宫，所居为命宫或其对宫。');
  }
  const jiJuPalaces = relatedPalaces.filter(p => hasMajor(p, '天机', '巨门'));
  if (jiJuPalaces.length) {
    addPattern('机巨同临格', `天机与巨门同在${jiJuPalaces.map(p => p.name).join('、')}宫。`);
  }
  if (hasInTrine('太阳', '天梁', '文昌', '禄存')) {
    addPattern('阳梁昌禄格', '太阳、天梁、文昌、禄存齐见于命宫三方四正。');
  }
  if (hasMajor(soulPalace, '紫微') && hasInTrine('左辅', '右弼')) {
    addPattern('紫微会辅弼', '紫微坐命，左辅与右弼在命宫三方四正。');
  }
  if (['禄', '权', '科'].every(m => triMutagens.has(m))) {
    addPattern('三奇嘉会', '生年化禄、化权、化科齐会命宫三方四正。');
  }
  for (const p of relatedPalaces) {
    const names = new Set([...p.majorStars, ...p.minorStars].map(s => s.name));
    if (names.has('贪狼') && names.has('火星')) addPattern('火贪同宫', `火星与贪狼同在${p.name}宫。`);
    if (names.has('贪狼') && names.has('铃星')) addPattern('铃贪同宫', `铃星与贪狼同在${p.name}宫。`);
    if (names.has('禄存') && names.has('天马')) addPattern('禄马同宫', `禄存与天马同在${p.name}宫。`);
  }
  if (hasInTrine('文昌', '文曲')) addPattern('昌曲会照', '文昌、文曲均在命宫三方四正。');
  if (hasInTrine('天魁', '天钺')) addPattern('魁钺会照', '天魁、天钺均在命宫三方四正。');
  if (soulPalace.majorStars.length === 0) addPattern('命无正曜', '命宫无主星，可同看对宫迁移宫的主星。');

  const baseYear = currentBeijingSolar().getYear();
  const mutagenLabels = ['禄', '权', '科', '忌'];
  const yearlyHoroscopes = [baseYear - 1, baseYear, baseYear + 1].filter(y => y >= solar.getYear()).map(y => {
    try {
      const date = `${y}-06-15`;
      const hs = chart.horoscope(date < solarStr ? solarStr : date);
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
    sourceEngine: 'SylarLong/iztro 安星与运限 · 星曜组合由项目按图匹配',
    meta: {
      name: input.name || '',
      gender: gender.label,
      calendar,
      annualReferenceYear: baseYear,
      civilDate: civilSolar.toYmdHms(),
      ...(trueSolarApplied && { apparentSolarDate: solar.toYmdHms(), solarOffsetSeconds }),
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
    summaryText: `五行局：${chart.fiveElementsClass}，命主${chart.soul}、身主${chart.body}；命宫(${soulPalace?.stemBranch})：${starNames(soulPalace)}；官禄宫：${starNames(careerPalace)}；财帛宫：${starNames(wealthPalace)}；四化：${mutagens.map(m => `${m.star}化${m.mutagen}(${m.palace})`).join('、')}${patterns.length ? `；星曜组合：${patterns.map(p => p.name).join('、')}` : ''}。`,
  };
}
