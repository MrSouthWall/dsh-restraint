/**
 * Four Pillars (Bazi / 四柱八字) calculation engine powered by 6tail/lunar-javascript.
 */

import { Solar, LunarUtil } from '../vendor/chart-libraries.js';
import { currentBeijingSolar, getPillarGanZhi, parseDateTimeInput } from './date-time.js';
import {
  DI_ZHI,
  GAN_INFO,
  ZHI_INFO,
  WU_XING_ORDER,
  WU_XING_META,
  SHI_SHEN_GLOSSARY,
  GAN_HE,
  GAN_CHONG,
  ZHI_LIU_HE,
  ZHI_SAN_HE,
  ZHI_SAN_HUI,
  ZHI_LIU_CHONG,
  ZHI_LIU_HAI,
  ZHI_XING,
} from '../data/constants.js';

// Classical BaZhai Eight-Mansion Table (八宅游年九星方位)
const BAZHAI_GUA_META = {
  1: { name: '坎卦', group: '东四命', element: '水', dirs: { 正北: '伏位', 东南: '生气', 正东: '天医', 正南: '延年', 正西: '祸害', 东北: '五鬼', 西北: '六煞', 西南: '绝命' } },
  2: { name: '坤卦', group: '西四命', element: '土', dirs: { 西南: '伏位', 东北: '生气', 正西: '天医', 西北: '延年', 正东: '祸害', 东南: '五鬼', 正南: '六煞', 正北: '绝命' } },
  3: { name: '震卦', group: '东四命', element: '木', dirs: { 正东: '伏位', 正南: '生气', 正北: '天医', 东南: '延年', 西南: '祸害', 西北: '五鬼', 东北: '六煞', 正西: '绝命' } },
  4: { name: '巽卦', group: '东四命', element: '木', dirs: { 东南: '伏位', 正北: '生气', 正南: '天医', 正东: '延年', 西北: '祸害', 西南: '五鬼', 正西: '六煞', 东北: '绝命' } },
  6: { name: '乾卦', group: '西四命', element: '金', dirs: { 西北: '伏位', 正西: '生气', 东北: '天医', 西南: '延年', 东南: '祸害', 正东: '五鬼', 正北: '六煞', 正南: '绝命' } },
  7: { name: '兑卦', group: '西四命', element: '金', dirs: { 正西: '伏位', 西北: '生气', 西南: '天医', 东北: '延年', 正北: '祸害', 正南: '五鬼', 东南: '六煞', 正东: '绝命' } },
  8: { name: '艮卦', group: '西四命', element: '土', dirs: { 东北: '伏位', 西南: '生气', 西北: '天医', 正西: '延年', 正南: '祸害', 正北: '五鬼', 正东: '六煞', 东南: '绝命' } },
  9: { name: '离卦', group: '东四命', element: '火', dirs: { 正南: '伏位', 正东: '生气', 东南: '天医', 正北: '延年', 东北: '祸害', 正西: '五鬼', 西南: '六煞', 西北: '绝命' } },
};

const BAZHAI_STAR_DESC = {
  生气: { luck: '吉', role: '大吉财位 · 事业晋升与生机活力位' },
  天医: { luck: '吉', role: '贵人健康位 · 休养招贵人与逢凶化吉' },
  延年: { luck: '吉', role: '感情人脉位 · 利婚姻和谐与长久合作' },
  伏位: { luck: '吉', role: '文昌安稳位 · 利学习专注与书房卧床' },
  祸害: { luck: '凶', role: '小阻口舌位 · 宜作储物/卫浴，保持整洁' },
  六煞: { luck: '凶', role: '情绪波动位 · 忌作主卧床头，宜清爽通风' },
  五鬼: { luck: '凶', role: '多变焦躁位 · 忌摆尖锐杂物，宜柔和灯光' },
  绝命: { luck: '凶', role: '能量低谷位 · 宜避开主座与床头朝向' },
};

function computeMingGua(yearNum, genderCode) {
  const rem = ((yearNum - 1) % 9) + 1;
  let guaNum = genderCode === 1
    ? ((11 - rem - 1 + 9) % 9) + 1
    : ((rem + 4 - 1) % 9) + 1;
  if (guaNum === 5) guaNum = genderCode === 1 ? 2 : 8;
  const meta = BAZHAI_GUA_META[guaNum];
  const directions = Object.entries(meta.dirs).map(([dir, star]) => ({
    direction: dir,
    star,
    luck: BAZHAI_STAR_DESC[star].luck,
    desc: BAZHAI_STAR_DESC[star].role,
  }));
  const auspicious = directions.filter(d => d.luck === '吉');
  return {
    guaNum,
    name: meta.name,
    group: meta.group,
    element: meta.element,
    directions,
    bestWealthDir: auspicious.find(d => d.star === '生气')?.direction || '',
    bestHealthDir: auspicious.find(d => d.star === '天医')?.direction || '',
    bestLoveDir: auspicious.find(d => d.star === '延年')?.direction || '',
    bestStudyDir: auspicious.find(d => d.star === '伏位')?.direction || '',
  };
}

function computePillarInteractions(pillars) {
  const list = [];
  for (let i = 0; i < 4; i++) {
    for (let j = i + 1; j < 4; j++) {
      const a = pillars[i];
      const b = pillars[j];
      const gPair = a.gan + b.gan;
      const zPair = a.zhi + b.zhi;
      if (GAN_HE[gPair]) {
        list.push({ type: '天干五合', polarity: 'good', from: i, to: j, layer: 'gan', label: `${gPair}合`, desc: `${a.label}与${b.label}天干相合，传统配属${GAN_HE[gPair].slice(1)}，实际合化还须结合全局。` });
      } else if (GAN_CHONG.has(gPair)) {
        list.push({ type: '天干相冲', polarity: 'warn', from: i, to: j, layer: 'gan', label: `${gPair}冲`, desc: `${a.label}与${b.label}天干相冲（${gPair}），主思维张力大、行动力强但也防冲动。` });
      }
      if (ZHI_LIU_HE[zPair]) {
        list.push({ type: '地支六合', polarity: 'good', from: i, to: j, layer: 'zhi', label: `${zPair}合`, desc: `${a.label}与${b.label}的地支在六合表中相配。` });
      }
      if (ZHI_LIU_CHONG.has(zPair)) {
        list.push({ type: '地支六冲', polarity: 'warn', from: i, to: j, layer: 'zhi', label: `${zPair}冲`, desc: `${a.label}与${b.label}的地支在六冲表中相对。` });
      }
      if (ZHI_XING.has(zPair)) {
        list.push({ type: '地支相刑', polarity: 'warn', from: i, to: j, layer: 'zhi', label: `${zPair}刑`, desc: `${a.label}与${b.label}地支相刑（${zPair}），主自我要求高、易反复琢磨细节。` });
      }
      if (ZHI_LIU_HAI.has(zPair)) {
        list.push({ type: '地支六害', polarity: 'warn', from: i, to: j, layer: 'zhi', label: `${zPair}害`, desc: `${a.label}与${b.label}的地支在六害表中相穿。` });
      }
      const san = ZHI_SAN_HE.find(g => a.zhi !== b.zhi && g.branches.includes(a.zhi) && g.branches.includes(b.zhi));
      if (san) {
        const complete = san.branches.every(branch => pillars.some(p => p.zhi === branch));
        const hasCardinal = zPair.includes(san.branches[1]);
        const type = complete ? '地支三合齐见' : hasCardinal ? '地支半合' : '地支拱合';
        list.push({
          type, polarity: 'good', from: i, to: j, layer: 'zhi',
          label: `${zPair}${type.slice(2)}`,
          desc: complete ? `${san.branches.join('、')}齐见于四柱，为${san.name}的三支。`
            : `${a.label}与${b.label}同属${san.name}的地支。`,
        });
      }
    }
  }
  return list;
}

function getBaziAnalysis(pillars) {
  const [, month, day] = pillars;
  const branches = new Set(pillars.map(pillar => pillar.zhi));
  const branchMeetings = ZHI_SAN_HUI
    .filter(group => [...group.branches].every(branch => branches.has(branch)))
    .map(group => ({
      name: `${group.branches}三会${group.element}局`,
      pillarIndices: pillars.flatMap((pillar, index) => group.branches.includes(pillar.zhi) ? [index] : []),
    }));

  const element = day.ganElement;
  const { generatedBy, generates, controlledBy } = WU_XING_META[element];
  const monthMain = month.hiddenDetails[0];
  const fuyi = {
    monthCommand: `${month.zhi}月 · 本气${monthMain.gan}${monthMain.element}（${monthMain.shiShen}）`,
    rootClues: pillars.flatMap(pillar => pillar.hiddenDetails
      .filter(hidden => hidden.element === element)
      .map(hidden => `${pillar.label}${pillar.zhi}藏${hidden.gan}（${hidden.shiShen}）`)),
    otherStems: pillars.filter(pillar => pillar.key !== 'day')
      .map(pillar => `${pillar.label}${pillar.gan}（${pillar.shiShenGan}）`),
    ifWeak: `印星${generatedBy}生身、比劫${element}帮身`,
    ifStrong: `食伤${generates}泄身、官杀${controlledBy}制身`,
  };
  return { branchMeetings, fuyi };
}

export function withBaziAnalysis(chart) {
  if (chart?.system !== 'bazi' || chart.rulesVersion !== 2 || (chart.branchMeetings && chart.fuyi)) return chart;
  return { ...chart, ...getBaziAnalysis(chart.pillars) };
}

const LU_BY_GAN = { 甲: '寅', 乙: '卯', 丙: '巳', 丁: '午', 戊: '巳', 己: '午', 庚: '申', 辛: '酉', 壬: '亥', 癸: '子' };
const YANG_BLADE_BY_GAN = { 甲: '卯', 丙: '午', 戊: '午', 庚: '酉', 壬: '子' };

function describeMonthCommand(pillars) {
  const month = pillars[1];
  const dayGan = pillars[2].gan;
  const mainHidden = month.hiddenDetails[0];
  if (month.zhi === LU_BY_GAN[dayGan]) return { name: '月令建禄', desc: `日干${dayGan}的禄在${month.zhi}，与月支相同。` };
  if (month.zhi === YANG_BLADE_BY_GAN[dayGan]) return { name: '月令阳刃', desc: `日干${dayGan}的阳刃在${month.zhi}，与月支相同。` };
  return {
    name: `月令本气·${mainHidden.shiShen}`,
    desc: `月支${month.zhi}本气为${mainHidden.gan}，相对日干${dayGan}为${mainHidden.shiShen}。子平定格还需结合透干及其余四柱。`,
  };
}

export function normalizeGender(gender) {
  const value = String(gender ?? '').trim().toLowerCase();
  if (['0', 'female', '女', '女命', 'f'].includes(value)) {
    return { code: 0, label: '女', en: 'female' };
  }
  if (['1', 'male', '男', '男命', 'm'].includes(value)) {
    return { code: 1, label: '男', en: 'male' };
  }
  throw new Error('请提供传统排盘使用的性别（男或女）。');
}

function computeShiShen(dayGan, targetGan) {
  return LunarUtil.SHI_SHEN[dayGan + targetGan] || '';
}

// 《三命通会》〈论天乙贵人〉所载甲戊庚取丑未一说。
const TIAN_YI_BRANCHES = {
  甲: ['丑', '未'], 戊: ['丑', '未'], 庚: ['丑', '未'],
  乙: ['子', '申'], 己: ['子', '申'],
  丙: ['亥', '酉'], 丁: ['亥', '酉'],
  壬: ['卯', '巳'], 癸: ['卯', '巳'],
  辛: ['寅', '午'],
};

function computeShenSha(pillars) {
  const day = pillars[2];
  const groups = [pillars[0].zhi, day.zhi].map(zhi => ZHI_SAN_HE.find(g => g.branches.includes(zhi)).branches);
  const list = [];
  const matchBranches = (name, targets, rule) => {
    const matches = pillars.filter(p => targets.includes(p.zhi)).map(p => `${p.label}${p.zhi}`);
    if (matches.length) list.push({ name, nature: matches.join('、'), desc: rule });
  };

  matchBranches('天乙贵人', TIAN_YI_BRANCHES[day.gan], '以日干查天乙贵人支。');
  const foodGan = Object.keys(GAN_INFO).find(gan => computeShiShen(day.gan, gan) === '食神');
  matchBranches('文昌贵人', [LU_BY_GAN[foodGan]], '按食神禄法，取日干之食神的禄支。');
  matchBranches('禄神', [LU_BY_GAN[day.gan]], '以日干查十干禄支。');
  matchBranches('阳刃', [YANG_BLADE_BY_GAN[day.gan]], '以五阳干阳刃表取支。');

  const nextBranch = (zhi, steps) => DI_ZHI[(DI_ZHI.indexOf(zhi) + steps) % DI_ZHI.length];
  matchBranches('咸池桃花', groups.map(g => nextBranch(g[0], 1)), '取年支、日支所在三合组长生支的下一支。');
  matchBranches('驿马', groups.map(g => nextBranch(g[0], 6)), '取年支、日支所在三合组长生支的对冲支。');
  matchBranches('华盖', groups.map(g => g[2]), '取年支、日支所在三合组的墓支。');
  matchBranches('将星', groups.map(g => g[1]), '取年支、日支所在三合组的中支。');

  if (['庚辰', '庚戌', '壬辰', '戊戌'].includes(day.ganZhi)) {
    list.push({ name: '魁罡', nature: `日柱${day.ganZhi}`, desc: '本日柱在《三命通会》所列四个魁罡日之内。' });
  }
  return list;
}

function analyzeWuXing(pillars) {
  const counts = Object.fromEntries(WU_XING_ORDER.map(el => [el, 0]));
  const hiddenCounts = { ...counts };
  for (const pillar of pillars) {
    counts[pillar.ganElement] += 1;
    counts[pillar.zhiElement] += 1;
    for (const hidden of pillar.hiddenDetails) hiddenCounts[hidden.element] += 1;
  }
  return {
    counts,
    hiddenCounts,
    percentages: Object.fromEntries(WU_XING_ORDER.map(el => [el, counts[el] / 8 * 100])),
    missingElements: WU_XING_ORDER.filter(el => counts[el] === 0),
  };
}

export function calculateBazi(input = {}, { daYunThroughYear } = {}) {
  const { solar, lunar, civilSolar, civilLunar, calendar, trueSolarApplied, solarOffsetSeconds } =
    parseDateTimeInput(input, { requireBirth: true });
  const gender = normalizeGender(input.gender);
  const [year, month, day, time] = getPillarGanZhi(civilLunar, lunar);
  const dayGan = day[0];

  const pillars = [
    ['year', '年柱', '祖辈与早年', year],
    ['month', '月柱', '月令与父母', month],
    ['day', '日柱', '日主与日支', day],
    ['time', '时柱', '时辰与子女', time],
  ].map(([key, label, roleDesc, ganZhi]) => {
    const [gan, zhi] = ganZhi;
    const hiddenStems = LunarUtil.ZHI_HIDE_GAN[zhi];
    const shiShenGan = key === 'day' ? '日主' : computeShiShen(dayGan, gan);
    const growthOffset = LunarUtil.CHANG_SHENG_OFFSET[dayGan];
    const branchIndex = DI_ZHI.indexOf(zhi);
    const growthIndex = (growthOffset + (GAN_INFO[dayGan].yinYang === '阳' ? branchIndex : -branchIndex) + 12) % 12;
    return {
      key, label, roleDesc, ganZhi, gan, zhi,
      ganElement: GAN_INFO[gan].element,
      ganYinYang: GAN_INFO[gan].yinYang,
      zhiElement: ZHI_INFO[zhi].element,
      zhiYinYang: ZHI_INFO[zhi].yinYang,
      shiShenGan,
      shiShenDesc: SHI_SHEN_GLOSSARY[shiShenGan] || '',
      hiddenStems,
      hiddenDetails: hiddenStems.map(hg => ({ gan: hg, element: GAN_INFO[hg].element, shiShen: computeShiShen(dayGan, hg) })),
      naYin: LunarUtil.NAYIN[ganZhi],
      diShi: LunarUtil.CHANG_SHENG[growthIndex],
      xunKong: LunarUtil.getXunKong(ganZhi),
    };
  });

  const wuxing = analyzeWuXing(pillars);
  const shenSha = computeShenSha(pillars);
  const interactions = computePillarInteractions(pillars);
  const pattern = describeMonthCommand(pillars);
  const liChun = civilLunar.getJieQiTable()['立春'];
  const mingGuaYear = civilSolar.getYear() - Number(civilSolar.toYmdHms() < liChun.toYmdHms());
  const mingGua = computeMingGua(mingGuaYear, gender.code);

  const civilEightChar = civilLunar.getEightChar();
  const monthZhiIndex = LunarUtil.MONTH_ZHI.indexOf(month[1]);
  const timeMonthIndex = LunarUtil.MONTH_ZHI.indexOf(time[1]);
  const mingOffset = (monthZhiIndex + timeMonthIndex >= 14 ? 26 : 14) - monthZhiIndex - timeMonthIndex;
  const shenOffset = ((monthZhiIndex + LunarUtil.ZHI.indexOf(time[1]) - 1) % 12) + 1;
  const palaceFor = offset => {
    const ganIndex = ((civilLunar.getYearGanIndexExact() + 1) * 2 + offset - 1) % 10 + 1;
    const palace = LunarUtil.GAN[ganIndex] + LunarUtil.MONTH_ZHI[offset];
    return `${palace}（${LunarUtil.NAYIN[palace]}）`;
  };

  // Current year (2026 丙午) quick resonance note
  const curSolar = currentBeijingSolar();
  const curYearNum = curSolar.getYear();
  const curYearGZ = Solar.fromYmd(curYearNum, 6, 15).getLunar().getYearInGanZhiExact();
  const curYearGanEl = GAN_INFO[curYearGZ[0]]?.element || '火';
  const curYearZhiEl = ZHI_INFO[curYearGZ[1]]?.element || '火';
  const curYearSS = computeShiShen(dayGan, curYearGZ[0]);
  const currentYear = {
    year: curYearNum,
    ganZhi: curYearGZ,
    shiShen: curYearSS,
    elements: [curYearGanEl, curYearZhiEl],
    note: `${curYearNum}年立春起为${curYearGZ}，天干${curYearGZ[0]}相对日主为${curYearSS}，干支五行为${curYearGanEl}、${curYearZhiEl}。`,
  };

  const yun = civilEightChar.getYun(gender.code, 1);
  const startYunSolar = yun.getStartSolar();
  const coveredYears = (daYunThroughYear ?? startYunSolar.getYear()) - startYunSolar.getYear();
  const daYunCount = Math.max(8, Math.floor(coveredYears / 10) + 1);
  const daYun = yun.getDaYun(daYunCount + 1).slice(1).map((dy, i) => {
    const gz = dy.getGanZhi();
    const gan = gz[0] || '';
    const zhi = gz[1] || '';
    const liuNian = dy.getLiuNian(10).map(ln => ({
      year: ln.getYear(),
      age: ln.getAge(),
      ganZhi: ln.getGanZhi(),
      shiShen: computeShiShen(dayGan, ln.getGanZhi()[0]),
    }));
    return {
      index: i + 1,
      ganZhi: gz,
      gan,
      zhi,
      ganElement: GAN_INFO[gan]?.element || '',
      zhiElement: ZHI_INFO[zhi]?.element || '',
      shiShenGan: computeShiShen(dayGan, gan),
      startDate: startYunSolar.nextYear(i * 10).toYmd(),
      endExclusive: startYunSolar.nextYear((i + 1) * 10).toYmd(),
      startYear: dy.getStartYear(),
      endYear: dy.getEndYear(),
      startAge: dy.getStartAge(),
      endAge: dy.getEndAge(),
      liuNian,
    };
  });

  const prevJie = civilLunar.getPrevJie(false);
  const nextJie = civilLunar.getNextJie(false);

  return {
    id: `bazi-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    system: 'bazi',
    createdAt: new Date().toISOString(),
    title: input.name ? `${input.name} · 四柱八字` : `${dayGan}${GAN_INFO[dayGan].element}日主 · 四柱八字`,
    subtitle: `${solar.toYmd()} ${String(solar.getHour()).padStart(2, '0')}:${String(solar.getMinute()).padStart(2, '0')} · ${gender.label}命`,
    question: input.question || '',
    sourceEngine: '6tail/lunar-javascript 历法与大运 · 月令取《子平真诠》口径',
    meta: {
      name: input.name || '',
      gender: gender.label,
      genderCode: gender.code,
      calendar,
      trueSolarApplied,
      civilDate: civilSolar.toYmdHms(),
      ...(trueSolarApplied && { apparentSolarDate: solar.toYmdHms(), solarOffsetSeconds }),
      mingGuaYear,
      solarDate: `${solar.toYmd()} ${String(solar.getHour()).padStart(2, '0')}:${String(solar.getMinute()).padStart(2, '0')}`,
      lunarDate: `${lunar.getYearInChinese()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()} ${lunar.getTimeZhi()}时`,
      zodiac: civilLunar.getYearShengXiaoExact(),
      taiYuan: `${civilEightChar.getTaiYuan()}（${civilEightChar.getTaiYuanNaYin()}）`,
      mingGong: palaceFor(mingOffset),
      shenGong: palaceFor(shenOffset),
      prevJie: prevJie ? `${prevJie.getName()} ${prevJie.getSolar().toYmdHms()}` : '',
      nextJie: nextJie ? `${nextJie.getName()} ${nextJie.getSolar().toYmdHms()}` : '',
      startYunDesc: `出生后 ${yun.getStartYear()}年${yun.getStartMonth()}个月${yun.getStartDay()}天起运（${startYunSolar.toYmd()}）`,
    },
    dayMaster: {
      gan: dayGan,
      element: GAN_INFO[dayGan].element,
      yinYang: GAN_INFO[dayGan].yinYang,
      desc: GAN_INFO[dayGan].desc,
    },
    pillars,
    wuxing,
    shenSha,
    interactions,
    ...getBaziAnalysis(pillars),
    pattern,
    mingGua,
    currentYear,
    daYun,
    summaryText: `四柱 ${pillars.map(p => p.ganZhi).join(' ')}，${pattern.name}。日主${dayGan}${GAN_INFO[dayGan].element}。八宅命卦为${mingGua.name}（${mingGua.group}）。`,
  };
}
