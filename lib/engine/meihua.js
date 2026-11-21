/**
 * Meihua Yishu (梅花易数 - 传本《梅花易数》) calculation engine.
 * Supports time, numbers, single-number, text, and random casting methods.
 * Computes Main (本卦), Mutual (互卦), Changed (变卦), Opposite (错卦), Inverted (综卦),
 * Ti-Yong Five-Element relations (体用生克), and seasonal vigor (旺相休囚死).
 */

import { getPillarGanZhi, parseDateTimeInput } from './date-time.js';
import {
  DI_ZHI,
  ZHI_INFO,
  WU_XING_META,
  BAGUA_BY_NUM,
  BAGUA_BY_LINES,
} from '../data/constants.js';
import { lookupHexagram } from '../data/hexagrams.js';

function castingRemainder(n, base) {
  return n % base || base;
}

function readCastingNumber(input, label) {
  const n = typeof input === 'string' && /^\d+$/.test(input.trim()) ? Number(input) : input;
  if (!Number.isSafeInteger(n) || n <= 0) throw new Error(`${label}须为正整数。`);
  return n;
}

function hexagramFromLines(lines) {
  const lowerKey = lines.slice(0, 3).join('');
  const upperKey = lines.slice(3, 6).join('');
  const lower = BAGUA_BY_LINES[lowerKey];
  const upper = BAGUA_BY_LINES[upperKey];
  const info = lookupHexagram(upper.num, lower.num);
  return {
    ...info,
    lines: [...lines],
    upperTrigram: upper,
    lowerTrigram: lower,
  };
}

// 《梅花易数》卷二〈体用总诀〉。
function evalTiYong(tiEl, yongEl) {
  if (tiEl === yongEl) return { relation: '体用比和', verdict: '比和', desc: `体与用同属${tiEl}。` };
  if (WU_XING_META[yongEl].generates === tiEl) return { relation: '用生体', verdict: '生扶', desc: `用卦${yongEl}生体卦${tiEl}。` };
  if (WU_XING_META[tiEl].controls === yongEl) return { relation: '体克用', verdict: '体能制用', desc: `体卦${tiEl}克用卦${yongEl}。` };
  if (WU_XING_META[tiEl].generates === yongEl) return { relation: '体生用', verdict: '泄体', desc: `体卦${tiEl}生用卦${yongEl}。` };
  return { relation: '用克体', verdict: '体受克', desc: `用卦${yongEl}克体卦${tiEl}。` };
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
  // 《梅花易数》卷一〈字占〉分上下；取〈为人占〉按一句话的字数起例。
  const chars = [...String(text ?? '').normalize('NFC')].filter(ch => /[\p{L}\p{N}]/u.test(ch));
  if (chars.length < 2) throw new Error('字数起卦至少需要两个字。单字占可用报数模式，前三项依次填左侧、右侧与全字笔画数。');
  const n1 = Math.floor(chars.length / 2);
  return { n1, n2: chars.length - n1 };
}

export function calculateMeihua(input = {}) {
  const { solar, lunar, civilLunar } = parseDateTimeInput(input);
  const [yearGZ, monthGZ, dayGZ, hourGZ] = getPillarGanZhi(civilLunar, lunar);
  const yearZhi = lunar.getYearZhi();
  const monthZhi = monthGZ[1];
  const hourZhi = hourGZ[1];
  const yearZhiNum = DI_ZHI.indexOf(yearZhi) + 1;
  const lunarMonth = Math.abs(lunar.getMonth());
  const lunarDay = lunar.getDay();
  const hourZhiNum = DI_ZHI.indexOf(hourZhi) + 1;

  const method = input.method ?? (input.text ? 'text' : input.num1 !== undefined ? 'numbers' : 'time');
  if (!['numbers', 'text', 'random', 'time'].includes(method)) throw new Error('未知的梅花起卦方式。');

  let upperNum;
  let lowerNum;
  let movingLine;
  let methodLabel = '时间起卦';
  let seedDetail = '';

  if (method === 'numbers') {
    const n1 = readCastingNumber(input.num1, '第一数');
    const n2 = readCastingNumber(input.num2, '第二数');
    const hasThirdNumber = input.num3 !== undefined && input.num3 !== null && input.num3 !== '';
    const n3 = hasThirdNumber ? readCastingNumber(input.num3, '动数') : null;
    upperNum = castingRemainder(n1, 8);
    lowerNum = castingRemainder(n2, 8);
    movingLine = castingRemainder(n3 ?? (n1 % 6 + n2 % 6 + hourZhiNum), 6);
    methodLabel = hasThirdNumber ? '三数起卦' : '双数起卦';
    seedDetail = hasThirdNumber
      ? `上数 ${n1} → ${BAGUA_BY_NUM[upperNum].name}，下数 ${n2} → ${BAGUA_BY_NUM[lowerNum].name}，动数 ${n3} → 第${movingLine}爻动`
      : `上数 ${n1} → ${BAGUA_BY_NUM[upperNum].name}，下数 ${n2} → ${BAGUA_BY_NUM[lowerNum].name}，(${n1}+${n2}+${hourZhi}时${hourZhiNum}) 除以6取余 → 第${movingLine}爻动`;
  } else if (method === 'text') {
    const { n1, n2 } = computeTextNumbers(input.text ?? input.question);
    upperNum = castingRemainder(n1, 8);
    lowerNum = castingRemainder(n2, 8);
    movingLine = castingRemainder(n1 + n2, 6);
    methodLabel = '字数起卦';
    seedDetail = `按字数分上卦 ${n1}、下卦 ${n2}，合计 ${n1 + n2} 字除以6取余 → 第${movingLine}爻动`;
  } else if (method === 'random') {
    const n1 = Math.floor(Math.random() * 64) + 1;
    const n2 = Math.floor(Math.random() * 64) + 1;
    upperNum = castingRemainder(n1, 8);
    lowerNum = castingRemainder(n2, 8);
    movingLine = castingRemainder(n1 + n2 + hourZhiNum, 6);
    methodLabel = '程序随机起卦';
    seedDetail = `随机灵感数 (${n1}, ${n2}) + ${hourZhi}时(${hourZhiNum}) → 第${movingLine}爻动`;
  } else {
    // Classic Shao Yong Time Casting (年月日时起卦)
    const upperSum = yearZhiNum + lunarMonth + lunarDay;
    const lowerSum = upperSum + hourZhiNum;
    upperNum = castingRemainder(upperSum, 8);
    lowerNum = castingRemainder(lowerSum, 8);
    movingLine = castingRemainder(lowerSum, 6);
    methodLabel = '时间起卦';
    seedDetail = `(${yearZhi}年${yearZhiNum}+农历${lunarMonth}月+${lunarDay}日)=${upperSum}→上卦${BAGUA_BY_NUM[upperNum].name}；加${hourZhi}时${hourZhiNum}=${lowerSum}→下卦${BAGUA_BY_NUM[lowerNum].name}、第${movingLine}爻动`;
  }

  const upperTri = BAGUA_BY_NUM[upperNum];
  const lowerTri = BAGUA_BY_NUM[lowerNum];
  const mainLines = [...lowerTri.lines, ...upperTri.lines]; // index 0..5 = yao 1..6

  const mainHex = hexagramFromLines(mainLines);

  // Changed hexagram (变卦): flip movingLine (1-based)
  const changedLines = mainLines.map((v, i) => (i === movingLine - 1 ? (v === 1 ? 0 : 1) : v));
  const changedHex = hexagramFromLines(changedLines);

  // 《互卦起例》载「乾坤无互，互其变卦」。
  const mutualFromChanged = mainHex.number <= 2;
  const mutualBase = mutualFromChanged ? changedLines : mainLines;
  const mutualHex = hexagramFromLines([
    mutualBase[1], mutualBase[2], mutualBase[3], mutualBase[2], mutualBase[3], mutualBase[4],
  ]);

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

  const yaoNames = ['初爻（最下）', '二爻', '三爻', '四爻', '五爻', '上爻（最上）'];
  const stageNarrative = [
    `【起 · 本卦 ${mainHex.fullName}】${mainTiYong.relation}（${mainTiYong.verdict}）— ${mainHex.image}`,
    `【承 · 互卦 ${mutualHex.fullName}】中间过程见${mutualHex.upperTrigram.name}(${mutualHex.upperTrigram.element})与${mutualHex.lowerTrigram.name}(${mutualHex.lowerTrigram.element}) — ${mutualHex.image}`,
    `【结 · 变卦 ${changedHex.fullName}】最终${changedTiYong.relation}（${changedTiYong.verdict}）— ${changedHex.image}`,
  ];

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
    subtitle: `${methodLabel} · 第${movingLine}爻动`,
    question: input.question || '',
    sourceEngine: method === 'numbers' || method === 'random'
      ? '项目报数／随机取数 · 《梅花易数》卦数与体用 · 《周易》卦辞'
      : '传本《梅花易数》起卦与体用 · 《周易》卦辞',
    meta: {
      solarDate: `${solar.toYmd()} ${String(solar.getHour()).padStart(2, '0')}:${String(solar.getMinute()).padStart(2, '0')}`,
      lunarDate: `${lunar.getYearInChinese()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()} ${hourZhi}时`,
      fourPillars: [yearGZ, monthGZ, dayGZ, hourGZ].join(' '),
      method,
      methodLabel,
      seedDetail,
      movingLine,
      mutualFromChanged,
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
      fengshuiTip: `体卦${tiTrigram.name}按后天八卦取${tiTrigram.direction}，五行属${tiTrigram.element}。`,
    },
    imagery,
    stageNarrative,
    summaryText: `本卦【${mainHex.fullName}】→互卦【${mutualHex.fullName}】→变卦【${changedHex.fullName}】（第${movingLine}爻动），体${tiTrigram.name}(${tiTrigram.element})、用${yongTrigram.name}(${yongTrigram.element})，当下${mainTiYong.relation}，变卦${changedTiYong.relation}。`,
  };
}
