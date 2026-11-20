/**
 * Meihua Yishu (梅花易数 - 宋·邵雍心法) calculation engine.
 * Supports time, numbers, single-number, text, and random casting methods.
 * Computes Main (本卦), Mutual (互卦), Changed (变卦), Opposite (错卦), Inverted (综卦),
 * Ti-Yong Five-Element relations (体用生克), and seasonal vigor (旺相休囚死).
 */

import { parseDateTimeInput } from './bazi.js';
import {
  DI_ZHI,
  ZHI_INFO,
  WU_XING_META,
  BAGUA_BY_NUM,
  BAGUA_BY_LINES,
} from '../data/constants.js';
import { lookupHexagram } from '../data/hexagrams.js';

function modPositive(n, base) {
  const v = ((Math.abs(Math.trunc(n)) % base) + base) % base;
  return v === 0 ? base : v;
}

function hexagramFromLines(lines) {
  const lowerKey = lines.slice(0, 3).join('');
  const upperKey = lines.slice(3, 6).join('');
  const lower = BAGUA_BY_LINES[lowerKey] || BAGUA_BY_NUM[8];
  const upper = BAGUA_BY_LINES[upperKey] || BAGUA_BY_NUM[1];
  const info = lookupHexagram(upper.num, lower.num);
  return {
    ...info,
    lines: [...lines],
    upperTrigram: upper,
    lowerTrigram: lower,
  };
}

function evalTiYong(tiEl, yongEl) {
  if (tiEl === yongEl) {
    return {
      relation: '体用比和',
      verdict: '大吉',
      score: 90,
      color: '#10b981',
      desc: `体（${tiEl}）与用（${yongEl}）同气比和，主顺遂和谐、沟通畅达、事半功倍。`,
    };
  }
  if (WU_XING_META[yongEl].generates === tiEl) {
    return {
      relation: '用生体',
      verdict: '大吉',
      score: 95,
      color: '#10b981',
      desc: `用（${yongEl}）生体（${tiEl}），主外力相助、贵人来扶、所求易得且进益明显。`,
    };
  }
  if (WU_XING_META[tiEl].controls === yongEl) {
    return {
      relation: '体克用',
      verdict: '中吉',
      score: 76,
      color: '#3b82f6',
      desc: `体（${tiEl}）克用（${yongEl}），主自身占主动权，虽需付出努力掌控，但终能成事。`,
    };
  }
  if (WU_XING_META[tiEl].generates === yongEl) {
    return {
      relation: '体生用',
      verdict: '偏耗',
      score: 56,
      color: '#f59e0b',
      desc: `体（${tiEl}）生用（${yongEl}），主付出多、耗心神或成本略高，宜控制节奏防过度投入。`,
    };
  }
  return {
    relation: '用克体',
    verdict: '慎行',
    score: 38,
    color: '#ef4444',
    desc: `用（${yongEl}）克体（${tiEl}），主外界阻力或压力较大，宜暂缓硬冲、借势化解或调整方案。`,
  };
}

function getSeasonalState(targetEl, monthZhi) {
  const monthEl = ZHI_INFO[monthZhi]?.element || '土';
  if (targetEl === monthEl) return { state: '旺', strength: '极强', desc: `当令得时（${monthZhi}月属${monthEl}），能量最饱满。` };
  if (WU_XING_META[monthEl].generates === targetEl) return { state: '相', strength: '次强', desc: `得月令${monthEl}相生，后劲充足。` };
  if (WU_XING_META[targetEl].generates === monthEl) return { state: '休', strength: '温和', desc: `功成退气，宜稳守调养。` };
  if (WU_XING_META[targetEl].controls === monthEl) return { state: '囚', strength: '偏弱', desc: `受月令牵制，宜借外力辅助。` };
  return { state: '死', strength: '衰微', desc: `受月令克制，时机尚未成熟，宜蓄力等待转令。` };
}

function computeTextNumbers(text) {
  const cleaned = String(text || '').replace(/\s+/g, '');
  if (!cleaned) return { n1: 3, n2: 7, detail: '默认心数 3 / 7' };
  const chars = [...cleaned];
  if (chars.length === 1) {
    const code = chars[0].codePointAt(0) || 1;
    const n1 = (code % 19) + 1;
    const n2 = ((code >> 3) % 19) + 1;
    return { n1, n2, detail: `单字「${cleaned}」字象取数 (${n1}, ${n2})` };
  }
  const mid = Math.floor(chars.length / 2);
  const left = chars.slice(0, mid);
  const right = chars.slice(mid);
  const weight = arr => arr.reduce((sum, ch) => sum + ((ch.codePointAt(0) || 1) % 24) + 1, 0);
  const n1 = weight(left);
  const n2 = weight(right);
  return { n1, n2, detail: `文字「${left.join('')} | ${right.join('')}」取数 (${n1}, ${n2})` };
}

export function calculateMeihua(input = {}) {
  const { solar, lunar } = parseDateTimeInput(input);
  const ec = lunar.getEightChar();

  const yearZhi = ec.getYearZhi();
  const monthZhi = ec.getMonthZhi();
  const hourZhi = ec.getTimeZhi();
  const yearZhiNum = DI_ZHI.indexOf(yearZhi) + 1;
  const lunarMonth = Math.abs(lunar.getMonth());
  const lunarDay = lunar.getDay();
  const hourZhiNum = DI_ZHI.indexOf(hourZhi) + 1;

  const method = input.method || (input.text ? 'text' : input.num1 !== undefined ? 'numbers' : 'time');

  let upperNum;
  let lowerNum;
  let movingLine;
  let methodLabel = '时间起卦';
  let seedDetail = '';

  if (method === 'numbers') {
    const n1 = Number(input.num1) || 3;
    const n2 = Number(input.num2) || 7;
    const n3 = input.num3 !== undefined && input.num3 !== null && input.num3 !== '' ? Number(input.num3) : null;
    upperNum = modPositive(n1, 8);
    lowerNum = modPositive(n2, 8);
    movingLine = n3 !== null && Number.isFinite(n3)
      ? modPositive(n3, 6)
      : modPositive(Math.abs(Math.trunc(n1)) + Math.abs(Math.trunc(n2)) + hourZhiNum, 6);
    methodLabel = n3 !== null ? '三数起卦' : '双数起卦';
    seedDetail = n3 !== null
      ? `上数 ${n1} → ${BAGUA_BY_NUM[upperNum].name}，下数 ${n2} → ${BAGUA_BY_NUM[lowerNum].name}，动数 ${n3} → 第${movingLine}爻动`
      : `上数 ${n1} → ${BAGUA_BY_NUM[upperNum].name}，下数 ${n2} → ${BAGUA_BY_NUM[lowerNum].name}，(${n1}+${n2}+${hourZhi}时${hourZhiNum}) ÷ 6 → 第${movingLine}爻动`;
  } else if (method === 'text') {
    const { n1, n2, detail } = computeTextNumbers(input.text || input.question || '知命');
    upperNum = modPositive(n1, 8);
    lowerNum = modPositive(n2, 8);
    movingLine = modPositive(n1 + n2 + hourZhiNum, 6);
    methodLabel = '文字起卦';
    seedDetail = `${detail}，配${hourZhi}时(${hourZhiNum}) → 第${movingLine}爻动`;
  } else if (method === 'random') {
    const n1 = Math.floor(Math.random() * 64) + 1;
    const n2 = Math.floor(Math.random() * 64) + 1;
    upperNum = modPositive(n1, 8);
    lowerNum = modPositive(n2, 8);
    movingLine = modPositive(n1 + n2 + hourZhiNum, 6);
    methodLabel = '灵感随机起卦';
    seedDetail = `随机灵感数 (${n1}, ${n2}) + ${hourZhi}时(${hourZhiNum}) → 第${movingLine}爻动`;
  } else {
    // Classic Shao Yong Time Casting (年月日时起卦)
    const upperSum = yearZhiNum + lunarMonth + lunarDay;
    const lowerSum = upperSum + hourZhiNum;
    upperNum = modPositive(upperSum, 8);
    lowerNum = modPositive(lowerSum, 8);
    movingLine = modPositive(lowerSum, 6);
    methodLabel = '时间起卦';
    seedDetail = `(${yearZhi}年${yearZhiNum}+农历${lunarMonth}月+${lunarDay}日)=${upperSum}→上卦${BAGUA_BY_NUM[upperNum].name}；加${hourZhi}时${hourZhiNum}=${lowerSum}→下卦${BAGUA_BY_NUM[lowerNum].name}、第${movingLine}爻动`;
  }

  const upperTri = BAGUA_BY_NUM[upperNum];
  const lowerTri = BAGUA_BY_NUM[lowerNum];
  const mainLines = [...lowerTri.lines, ...upperTri.lines]; // index 0..5 = yao 1..6

  const mainHex = hexagramFromLines(mainLines);

  // Mutual hexagram (互卦): lower = yao 2,3,4; upper = yao 3,4,5
  const mutualLines = [mainLines[1], mainLines[2], mainLines[3], mainLines[2], mainLines[3], mainLines[4]];
  const mutualHex = hexagramFromLines(mutualLines);

  // Changed hexagram (变卦): flip movingLine (1-based)
  const changedLines = mainLines.map((v, i) => (i === movingLine - 1 ? (v === 1 ? 0 : 1) : v));
  const changedHex = hexagramFromLines(changedLines);

  // Opposite hexagram (错卦): flip all 6 lines
  const oppositeHex = hexagramFromLines(mainLines.map(v => (v === 1 ? 0 : 1)));

  // Inverted hexagram (综卦): reverse 6 lines
  const invertedHex = hexagramFromLines([...mainLines].reverse());

  // Ti & Yong determination (动爻在下卦则上体下用；动爻在上卦则下体上用)
  const tiPosition = movingLine <= 3 ? 'upper' : 'lower';
  const tiTrigram = tiPosition === 'upper' ? mainHex.upperTrigram : mainHex.lowerTrigram;
  const yongTrigram = tiPosition === 'upper' ? mainHex.lowerTrigram : mainHex.upperTrigram;
  const changedYongTrigram = tiPosition === 'upper' ? changedHex.lowerTrigram : changedHex.upperTrigram;

  const mainTiYong = evalTiYong(tiTrigram.element, yongTrigram.element);
  const mutualUpperRel = evalTiYong(tiTrigram.element, mutualHex.upperTrigram.element);
  const mutualLowerRel = evalTiYong(tiTrigram.element, mutualHex.lowerTrigram.element);
  const changedTiYong = evalTiYong(tiTrigram.element, changedYongTrigram.element);

  const tiSeason = getSeasonalState(tiTrigram.element, monthZhi);
  const yongSeason = getSeasonalState(yongTrigram.element, monthZhi);

  // Composite score & beginner summary
  const overallScore = Math.round(mainTiYong.score * 0.4 + changedTiYong.score * 0.45 + ((mutualUpperRel.score + mutualLowerRel.score) / 2) * 0.15);
  let overallVerdict = '中平可为';
  if (overallScore >= 82) overallVerdict = '上吉顺遂';
  else if (overallScore >= 68) overallVerdict = '偏吉稳进';
  else if (overallScore < 52) overallVerdict = '宜守慎行';

  const yaoNames = ['初爻（最下）', '二爻', '三爻', '四爻', '五爻', '上爻（最上）'];
  const stageNarrative = [
    `【起 · 本卦 ${mainHex.fullName}】${mainTiYong.relation}（${mainTiYong.verdict}）— ${mainHex.summary}`,
    `【承 · 互卦 ${mutualHex.fullName}】中间过程见${mutualHex.upperTrigram.name}(${mutualHex.upperTrigram.element})与${mutualHex.lowerTrigram.name}(${mutualHex.lowerTrigram.element}) — ${mutualHex.summary}`,
    `【结 · 变卦 ${changedHex.fullName}】最终${changedTiYong.relation}（${changedTiYong.verdict}）— ${changedHex.summary}`,
  ];

  // Response timing estimation (梅花应期推算) & WanWu LeiXiang (万物类象)
  const responseNumber = upperNum + lowerNum;
  const boostEl = WU_XING_META[tiTrigram.element].generatedBy;
  const elMonths = { 木: '寅卯月（农历正二月）', 火: '巳午月（农历四五月）', 土: '辰戌丑未月（季末）', 金: '申酉月（农历七八月）', 水: '亥子月（农历十、十一月）' };
  const timing = {
    responseNumber,
    shortRange: `${Math.max(1, Math.round(responseNumber / 2))}–${responseNumber} 天内（急事按小时或日计）`,
    mediumRange: `${responseNumber} 天左右或逢「${boostEl}/${tiTrigram.element}」旺日`,
    favorableMonths: `${elMonths[boostEl]}、${elMonths[tiTrigram.element]}`,
    desc: `先天体用合数为 ${responseNumber}，参考应期可留意第 ${responseNumber} 天（或尾数含 ${upperNum}/${lowerNum} 之日），以及生扶体卦的「${boostEl}、${tiTrigram.element}」旺时。`,
  };
  const imagery = {
    ti: {
      name: `${tiTrigram.symbol} ${tiTrigram.name}为${tiTrigram.nature}`,
      element: tiTrigram.element,
      direction: tiTrigram.direction,
      color: tiTrigram.color,
      role: tiTrigram.role,
      body: tiTrigram.body,
      number: tiTrigram.num,
    },
    yong: {
      name: `${yongTrigram.symbol} ${yongTrigram.name}为${yongTrigram.nature}`,
      element: yongTrigram.element,
      direction: yongTrigram.direction,
      color: yongTrigram.color,
      role: yongTrigram.role,
      body: yongTrigram.body,
      number: yongTrigram.num,
    },
  };

  return {
    id: `meihua-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    system: 'meihua',
    createdAt: new Date().toISOString(),
    title: `梅花易数 · ${mainHex.fullName} 之 ${changedHex.fullName}`,
    subtitle: `${methodLabel} · 第${movingLine}爻动 · ${overallVerdict}`,
    question: input.question || '',
    sourceEngine: '宋·邵雍《梅花易数》体系 + 64卦全集',
    meta: {
      solarDate: `${solar.toYmd()} ${String(solar.getHour()).padStart(2, '0')}:${String(solar.getMinute()).padStart(2, '0')}`,
      lunarDate: `${lunar.getYearInChinese()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()} ${hourZhi}时`,
      fourPillars: `${ec.getYear()} ${ec.getMonth()} ${ec.getDay()} ${ec.getTime()}`,
      method,
      methodLabel,
      seedDetail,
      movingLine,
      movingLineLabel: yaoNames[movingLine - 1],
      monthBranch: monthZhi,
    },
    hexagrams: {
      main: mainHex,
      mutual: mutualHex,
      changed: changedHex,
      opposite: oppositeHex,
      inverted: invertedHex,
    },
    tiYong: {
      tiPosition,
      tiLabel: tiPosition === 'upper' ? '上卦为体（代表自己）' : '下卦为体（代表自己）',
      yongLabel: tiPosition === 'upper' ? '下卦为用（代表所问之事）' : '上卦为用（代表所问之事）',
      tiTrigram,
      yongTrigram,
      changedYongTrigram,
      mainRelation: mainTiYong,
      changedRelation: changedTiYong,
      mutualUpperRelation: mutualUpperRel,
      mutualLowerRelation: mutualLowerRel,
      tiSeason,
      yongSeason,
      overallScore,
      overallVerdict,
      responseNumber,
      fengshuiTip: `体卦属${tiTrigram.element}（${tiTrigram.direction}），助旺体卦宜优先参考「${boostEl}」（${WU_XING_META[boostEl].direction}）与「${tiTrigram.element}」（${tiTrigram.direction}）方位及色系。`,
    },
    timing,
    imagery,
    stageNarrative,
    summaryText: `本卦【${mainHex.fullName}】→互卦【${mutualHex.fullName}】→变卦【${changedHex.fullName}】（第${movingLine}爻动），体${tiTrigram.name}(${tiTrigram.element})、用${yongTrigram.name}(${yongTrigram.element})，当下${mainTiYong.relation}、结局${changedTiYong.relation}，综合：${overallVerdict}。`,
  };
}
