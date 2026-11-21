/**
 * Qimen Dunjia (奇门遁甲 - 拆补法转盘时家奇门) calculation engine.
 * Calendar & astronomical solar terms powered by 6tail/lunar-javascript.
 * Algorithm follows classical ChaiBu ZhuanPan conventions aligned with open-source
 * Qimen projects (qfdk/qimen, anthonylee1994/qimen, perfhelf/bigfishmarquis-qimen).
 */

import { getPillarGanZhi, parseDateTimeInput } from './date-time.js';
import {
  DI_ZHI,
  JIA_ZI_60,
  XUN_HEADS,
  WU_XING_META,
  QIMEN_SOLAR_TERM_JU,
  LUOSHU_PALACES,
  QIMEN_RING_ORDER,
  QIMEN_GRID_ORDER,
  QIMEN_GATES_INFO,
  QIMEN_STARS_INFO,
  QIMEN_DEITIES_INFO,
  QIMEN_JIXING,
  QIMEN_RUMU,
} from '../data/constants.js';

const QI_YI_SEQ = ['戊', '己', '庚', '辛', '壬', '癸', '丁', '丙', '乙'];
const DEITIES_SEQ = ['值符', '腾蛇', '太阴', '六合', '白虎', '玄武', '九地', '九天'];
// 《遁甲演义·三奇得使》：天盘三奇各临指定的地盘六仪。
const QI_ENVOYS = new Set(['乙己', '乙辛', '丙戊', '丙庚', '丁壬', '丁癸']);
const CONFLICTING_QI_ENVOYS = new Set(['乙辛', '丙庚', '丁癸']);
const STEM_FORMATIONS = {
  戊丙: { name: '青龙返首', nature: '传统吉格' },
  丙戊: { name: '飞鸟跌穴', nature: '传统吉格' },
  乙辛: { name: '青龙逃走', nature: '传统凶格' },
  辛乙: { name: '白虎猖狂', nature: '传统凶格' },
  癸丁: { name: '腾蛇夭矫', nature: '传统凶格' },
  丁癸: { name: '朱雀投江', nature: '传统凶格' },
  庚丙: { name: '太白入荧', nature: '传统凶格' },
  丙庚: { name: '荧入太白', nature: '传统凶格' },
  癸癸: { name: '天网四张', nature: '传统凶格' },
};

function getFuTouAndYuan(dayGZ) {
  const idx = JIA_ZI_60.indexOf(dayGZ);
  const fuTouIdx = idx >= 0 ? idx - (idx % 5) : 0;
  const fuTou = JIA_ZI_60[fuTouIdx];
  const zhiIdx = DI_ZHI.indexOf(fuTou[1]);
  // 子卯午酉 -> 上元(0), 寅巳申亥 -> 中元(1), 丑辰未戌 -> 下元(2)
  let yuanIndex = 0;
  let yuanLabel = '上元';
  if (zhiIdx % 3 === 2) {
    yuanIndex = 1;
    yuanLabel = '中元';
  } else if (zhiIdx % 3 === 1) {
    yuanIndex = 2;
    yuanLabel = '下元';
  }
  return { fuTou, yuanIndex, yuanLabel };
}

function getYiMaBranch(zhi) {
  if (['申', '子', '辰'].includes(zhi)) return '寅';
  if (['寅', '午', '戌'].includes(zhi)) return '申';
  if (['巳', '酉', '丑'].includes(zhi)) return '亥';
  return '巳';
}

function getBranchPalace(branch) {
  for (let p = 1; p <= 9; p++) {
    if (LUOSHU_PALACES[p].branches.includes(branch)) return p;
  }
  return 0;
}

export function calculateQimen(input = {}) {
  const { solar, lunar, civilLunar } = parseDateTimeInput(input);
  // 时家拆补以子初换日，符头与起时干使用同一个干支日。
  const [yearGZ, monthGZ, dayGZ, hourGZ] = getPillarGanZhi(civilLunar, lunar, 1);
  const hourGan = hourGZ[0];
  const hourZhi = hourGZ[1];

  // Exact astronomical solar term (wholeDay = false)
  const prevJQ = civilLunar.getPrevJieQi(false);
  const solarTermName = prevJQ?.getName();
  const solarTermTime = prevJQ?.getSolar().toYmdHms();
  const termConfig = QIMEN_SOLAR_TERM_JU[solarTermName];
  if (!termConfig) throw new Error('无法确定拆补局数对应的节气。');

  const { fuTou, yuanIndex, yuanLabel } = getFuTouAndYuan(dayGZ);
  const isYang = termConfig.dun === '阳遁';
  const juNum = termConfig.ju[yuanIndex];

  // 1. Lay out Earth Plate (地盘三奇六仪)
  const earthStems = {};
  for (let i = 0; i < 9; i++) {
    const palaceNum = isYang
      ? ((juNum - 1 + i) % 9) + 1
      : ((juNum - 1 - i + 90) % 9) + 1;
    earthStems[palaceNum] = QI_YI_SEQ[i];
  }

  // 2. Xun Head (旬首), ZhiFu Star (值符), ZhiShi Gate (值使)
  const hourIdx = Math.max(0, JIA_ZI_60.indexOf(hourGZ));
  const xunIndex = Math.floor(hourIdx / 10);
  const xunInfo = XUN_HEADS[xunIndex] || XUN_HEADS[0];
  const hourOffset = hourIdx % 10;

  let xunPalace = 1;
  for (let p = 1; p <= 9; p++) {
    if (earthStems[p] === xunInfo.yi) {
      xunPalace = p;
      break;
    }
  }

  const zhiFuStar = LUOSHU_PALACES[xunPalace].baseStar;
  const zhiShiGate = xunPalace === 5 ? LUOSHU_PALACES[2].baseGate : LUOSHU_PALACES[xunPalace].baseGate;

  // 3. ZhuanPan Rotation for Nine Stars & Heaven Plate (天盘九星 + 奇仪)
  const effectiveHourGan = hourGan === '甲' ? xunInfo.yi : hourGan;
  let hourGanPalace = xunPalace;
  for (let p = 1; p <= 9; p++) {
    if (earthStems[p] === effectiveHourGan) {
      hourGanPalace = p;
      break;
    }
  }
  const fromStarPalace = xunPalace === 5 ? 2 : xunPalace;
  const targetStarPalace = hourGanPalace === 5 ? 2 : hourGanPalace;
  const starDelta = (QIMEN_RING_ORDER.indexOf(targetStarPalace) - QIMEN_RING_ORDER.indexOf(fromStarPalace) + 8) % 8;

  const heavenStems = {};
  const carriedStems = {};
  const stars = {};
  const carriedStars = {};

  for (let i = 0; i < 8; i++) {
    const origP = QIMEN_RING_ORDER[i];
    const destP = QIMEN_RING_ORDER[(i + starDelta) % 8];
    stars[destP] = LUOSHU_PALACES[origP].baseStar;
    heavenStems[destP] = earthStems[origP];
    if (origP === 2) {
      // 中五宫天禽与地盘中五干寄坤二同行
      carriedStars[destP] = '天禽';
      carriedStems[destP] = earthStems[5];
    }
  }

  // 4. ZhuanPan Rotation for Eight Gates (人盘八门)
  const rawZhiShiPalace = isYang
    ? ((xunPalace - 1 + hourOffset) % 9) + 1
    : ((xunPalace - 1 - hourOffset + 90) % 9) + 1;
  const targetGatePalace = rawZhiShiPalace === 5 ? 2 : rawZhiShiPalace;
  const fromGatePalace = xunPalace === 5 ? 2 : xunPalace;
  const gateDelta = (QIMEN_RING_ORDER.indexOf(targetGatePalace) - QIMEN_RING_ORDER.indexOf(fromGatePalace) + 8) % 8;

  const gates = {};
  for (let i = 0; i < 8; i++) {
    const origP = QIMEN_RING_ORDER[i];
    const destP = QIMEN_RING_ORDER[(i + gateDelta) % 8];
    gates[destP] = LUOSHU_PALACES[origP].baseGate;
  }

  // 5. ZhuanPan Eight Deities (神盘八神)
  const deities = {};
  const deityStartIdx = QIMEN_RING_ORDER.indexOf(targetStarPalace);
  for (let i = 0; i < 8; i++) {
    const ringIdx = isYang ? (deityStartIdx + i) % 8 : (deityStartIdx - i + 8) % 8;
    deities[QIMEN_RING_ORDER[ringIdx]] = DEITIES_SEQ[i];
  }

  // 6. KongWang (空亡) & YiMa (驿马)
  const kongPalaces = new Set(xunInfo.kong.map(getBranchPalace).filter(Boolean));
  const yiMaBranch = getYiMaBranch(hourZhi);
  const yiMaPalace = getBranchPalace(yiMaBranch);

  // Build 9 palaces in standard 3x3 LuoShu display order
  const palaces = QIMEN_GRID_ORDER.map(pNum => {
    const base = LUOSHU_PALACES[pNum];
    if (pNum === 5) {
      return {
        num: 5,
        name: base.name,
        trigram: base.trigram,
        symbol: base.symbol,
        direction: base.direction,
        element: base.element,
        isCenter: true,
        earthStem: earthStems[5],
        heavenStem: '',
        carriedStem: '',
        star: '天禽（寄坤二）',
        carriedStar: '',
        gate: '',
        deity: '',
        isZhiFu: false,
        isZhiShi: false,
        isKong: false,
        isYiMa: false,
        alerts: [],
        note: `中五宫属土，地盘寄「${earthStems[5]}」，按转盘规制随坤二宫（天芮）同转。`,
      };
    }

    const hStem = heavenStems[pNum];
    const eStem = earthStems[pNum];
    const gate = gates[pNum];
    const star = stars[pNum];
    const deity = deities[pNum];
    const isKong = kongPalaces.has(pNum);
    const isYiMa = yiMaPalace === pNum;

    const alerts = [];
    const formations = [];
    const gateMeta = QIMEN_GATES_INFO[gate];
    const heavenStemsHere = [hStem, carriedStems[pNum]].filter(Boolean);
    const isGatePressure = gateMeta && WU_XING_META[gateMeta.element]?.controls === base.element;
    if (isGatePressure) {
      alerts.push({ tag: '门迫', level: 'warn', desc: `${gate}（${gateMeta.element}）克${base.name}（${base.element}）。` });
    }
    for (const stem of heavenStemsHere) {
      if (QIMEN_JIXING[stem] === pNum) {
        alerts.push({ tag: '击刑', level: 'warn', desc: `天盘${stem}落${base.name}，对应六仪击刑表。` });
      }
      if (QIMEN_RUMU[stem] === pNum) {
        alerts.push({ tag: '入墓', level: 'info', desc: `天盘${stem}奇落${base.name}，对应三奇入墓表。` });
      }

      const pair = stem + eStem;
      if (QI_ENVOYS.has(pair)) {
        const conflicting = CONFLICTING_QI_ENVOYS.has(pair) && pNum !== targetStarPalace;
        formations.push({
          name: '三奇得使',
          nature: conflicting ? '兼见冲克' : '传统吉格',
          desc: `天盘${stem}奇加地盘${eStem}仪。${conflicting ? '此干对另兼凶格，且本旬值符未同宫。' : ''}`,
        });
      }
    }
    for (const stem of heavenStemsHere) {
      const pair = stem + eStem;
      const stemFormation = STEM_FORMATIONS[pair];
      if (stemFormation) formations.push({ ...stemFormation, desc: `天盘${stem}加地盘${eStem}。` });
      if (pair === '丙丁' && gate === '生门' && !isGatePressure && QIMEN_RUMU[stem] !== pNum) {
        formations.push({ name: '天遁', nature: '传统吉格', desc: '丙奇加地盘丁，同宫为生门。' });
      }
      if (pair === '乙己' && gate === '开门') formations.push({ name: '地遁', nature: '传统吉格', desc: '乙奇加地盘己，同宫为开门。' });
      if (stem === '丁' && gate === '休门' && deity === '太阴') formations.push({ name: '人遁', nature: '传统吉格', desc: '丁奇、休门、太阴同宫。' });
    }
    if (eStem === '丁' && pNum === targetGatePalace) formations.push({ name: '玉女守门', nature: '传统吉格', desc: '值使门临地盘丁奇。' });

    const isAuspiciousGate = ['开门', '休门', '生门'].includes(gate);

    return {
      num: pNum,
      name: base.name,
      trigram: base.trigram,
      symbol: base.symbol,
      direction: base.direction,
      element: base.element,
      isCenter: false,
      earthStem: eStem,
      heavenStem: hStem,
      carriedStem: carriedStems[pNum] || '',
      star,
      carriedStar: carriedStars[pNum] || '',
      starInfo: QIMEN_STARS_INFO[star] || null,
      gate,
      gateInfo: gateMeta || null,
      deity,
      deityInfo: QIMEN_DEITIES_INFO[deity] || null,
      isZhiFu: pNum === targetStarPalace,
      isZhiShi: pNum === targetGatePalace,
      isKong,
      isYiMa,
      alerts,
      formations,
      auspiciousness: isAuspiciousGate ? '三吉门' : '',
    };
  });

  // Global formations (伏吟 / 反吟) + aggregated palace formations
  const globalFormations = [];
  if (starDelta === 0) globalFormations.push({ name: '星伏吟', nature: '全局', palaceNum: 5, desc: '星盘与本位重合。' });
  if (starDelta === 4) globalFormations.push({ name: '星反吟', nature: '全局', palaceNum: 5, desc: '星盘转至各星本位的对宫。' });
  if (gateDelta === 0) globalFormations.push({ name: '门伏吟', nature: '全局', palaceNum: 5, desc: '八门归本位。' });
  if (gateDelta === 4) globalFormations.push({ name: '门反吟', nature: '全局', palaceNum: 5, desc: '八门均转至本位的对宫。' });
  for (const p of palaces) {
    if (!p.isCenter && p.formations?.length) {
      for (const f of p.formations) {
        globalFormations.push({ ...f, palaceNum: p.num, palaceName: p.name, direction: p.direction });
      }
    }
  }

  // Beginner YongShen Radar (一键聚焦不同诉求该看哪一宫)
  const findPalace = pred => palaces.find(p => !p.isCenter && pred(p))?.num || null;
  const uniqNums = arr => [...new Set(arr.filter(Boolean))];
  const yongshenGuides = {
    all: { label: '值符值使', palaceNums: uniqNums([targetStarPalace, targetGatePalace]), tip: `值符落${LUOSHU_PALACES[targetStarPalace].name}，值使落${LUOSHU_PALACES[targetGatePalace].name}。` },
    career: { label: '开门与值符', palaceNums: uniqNums([findPalace(p => p.gate === '开门'), targetStarPalace]), tip: '定位开门与值符所在的宫。' },
    wealth: { label: '生门与戊', palaceNums: uniqNums([findPalace(p => p.gate === '生门'), findPalace(p => p.heavenStem === '戊' || p.carriedStem === '戊')]), tip: '定位生门与天盘戊仪所在的宫。' },
    love: { label: '六合与乙庚', palaceNums: uniqNums([findPalace(p => p.deity === '六合'), findPalace(p => p.heavenStem === '乙' || p.carriedStem === '乙'), findPalace(p => p.heavenStem === '庚' || p.carriedStem === '庚')]), tip: '定位六合与天盘乙、庚所在的宫。' },
    health: { label: '天芮与天心', palaceNums: uniqNums([findPalace(p => p.star === '天芮'), findPalace(p => p.star === '天心')]), tip: '定位天芮、天心二星。' },
    travel: { label: '驿马与九天', palaceNums: uniqNums([yiMaPalace, findPalace(p => p.deity === '九天')]), tip: '定位时支驿马与九天所在的宫。' },
  };

  // Top favorable directions for beginners
  const goodDirections = palaces
    .filter(p => !p.isCenter && ['开门', '休门', '生门'].includes(p.gate))
    .map(p => ({
      direction: p.direction,
      palaceName: p.name,
      gate: p.gate,
      star: p.star,
      deity: p.deity,
      clean: !p.isKong && p.alerts.length === 0,
      tip: `${p.direction}（${p.name}）见${p.gate}、${p.star}、${p.deity}${p.isKong ? '，兼有空亡' : ''}${p.alerts.length ? `，见${p.alerts.map(a => a.tag).join('、')}` : ''}`,
    }));

  const juTitle = `${termConfig.dun}${juNum}局`;

  return {
    id: `qimen-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    system: 'qimen',
    createdAt: new Date().toISOString(),
    title: `奇门遁甲 · ${juTitle}`,
    subtitle: `${solar.toYmd()} ${String(solar.getHour()).padStart(2, '0')}:${String(solar.getMinute()).padStart(2, '0')} · ${solarTermName}${yuanLabel}`,
    question: input.question || '',
    sourceEngine: '时家转盘拆补 · 局数本《筮箧理数日抄》 · 格局参考《遁甲演义》',
    meta: {
      solarDate: `${solar.toYmd()} ${String(solar.getHour()).padStart(2, '0')}:${String(solar.getMinute()).padStart(2, '0')}`,
      lunarDate: `${lunar.getYearInChinese()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()} ${hourZhi}时`,
      fourPillars: `${yearGZ} ${monthGZ} ${dayGZ} ${hourGZ}`,
      solarTerm: solarTermName,
      solarTermTime,
      fuTou,
      yuan: yuanLabel,
      dun: termConfig.dun,
      juNum,
      juTitle,
      xunHead: `${xunInfo.xun}（遁${xunInfo.yi}）`,
      zhiFuStar,
      zhiFuPalace: LUOSHU_PALACES[targetStarPalace].name,
      zhiShiGate,
      zhiShiPalace: LUOSHU_PALACES[targetGatePalace].name,
      kongWang: xunInfo.kong.join('、'),
      yiMa: `${yiMaBranch}（${LUOSHU_PALACES[yiMaPalace].name}·${LUOSHU_PALACES[yiMaPalace].direction}）`,
    },
    palaces,
    formations: globalFormations,
    yongshenGuides,
    goodDirections,
    summaryText: `${juTitle}（${solarTermName}${yuanLabel}），四柱${yearGZ} ${monthGZ} ${dayGZ} ${hourGZ}；值符${zhiFuStar}落${LUOSHU_PALACES[targetStarPalace].name}，值使${zhiShiGate}落${LUOSHU_PALACES[targetGatePalace].name}${globalFormations.length ? `；格局：${globalFormations.slice(0, 3).map(f => f.name).join('、')}` : ''}。`,
  };
}
