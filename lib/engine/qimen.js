/**
 * Qimen Dunjia (奇门遁甲 - 拆补法转盘时家奇门) calculation engine.
 * Calendar & astronomical solar terms powered by 6tail/lunar-javascript.
 * Algorithm follows classical ChaiBu ZhuanPan conventions aligned with open-source
 * Qimen projects (qfdk/qimen, anthonylee1994/qimen, perfhelf/bigfishmarquis-qimen).
 */

import { parseDateTimeInput } from './bazi.js';
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
  const { solar, lunar } = parseDateTimeInput(input);
  const ec = lunar.getEightChar();

  const yearGZ = ec.getYear();
  const monthGZ = ec.getMonth();
  const dayGZ = ec.getDay();
  const hourGZ = ec.getTime();
  const hourGan = hourGZ[0];
  const hourZhi = hourGZ[1];

  // Exact astronomical solar term (wholeDay = false)
  const prevJQ = lunar.getPrevJieQi(false);
  const solarTermName = prevJQ ? prevJQ.getName() : '冬至';
  const solarTermTime = prevJQ ? prevJQ.getSolar().toYmdHms() : '';
  const termConfig = QIMEN_SOLAR_TERM_JU[solarTermName] || QIMEN_SOLAR_TERM_JU['冬至'];

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
        isZhiFu: zhiFuStar === '天禽',
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
    if (gateMeta && WU_XING_META[gateMeta.element]?.controls === base.element) {
      alerts.push({ tag: '门迫', level: 'warn', desc: `${gate}（${gateMeta.element}）克${base.name}（${base.element}），能量受阻，做事易费力。` });
    }
    if (QIMEN_JIXING[hStem] === pNum) {
      alerts.push({ tag: '击刑', level: 'warn', desc: `天盘「${hStem}」落${base.name}构成六仪击刑，提醒防纠结损耗与细节疏漏。` });
    }
    if (QIMEN_RUMU[hStem] === pNum) {
      alerts.push({ tag: '入墓', level: 'info', desc: `天盘「${hStem}」落${base.name}入墓，能量暂被收敛，宜静待时机破局。` });
    }

    // Classic Ten-Stem & Three-Qi Formations (奇门十干克应与吉凶格局)
    if (hStem === '戊' && eStem === '丙') formations.push({ name: '青龙返首', nature: '大吉', desc: '戊加丙：百事皆宜、贵人扶持、求谋易成之头等吉格。' });
    if (hStem === '丙' && eStem === '戊') formations.push({ name: '飞鸟跌穴', nature: '大吉', desc: '丙加戊：顺势得利、坐享良机、适合推进核心事务与求财。' });
    if (hStem === '丙' && eStem === '丁' && gate === '生门') formations.push({ name: '天遁吉格', nature: '大吉', desc: '丙临丁合生门：光明生发、利求职晋升、签约策划与开拓。' });
    if (hStem === '乙' && eStem === '己' && gate === '开门') formations.push({ name: '地遁吉格', nature: '大吉', desc: '乙临己合开门：根基稳固、利置业布局、稳健合作。' });
    if (hStem === '丁' && gate === '休门' && deity === '太阴') formations.push({ name: '人遁吉格', nature: '大吉', desc: '丁合休门太阴：暗中得人助、利洽谈协调与寻觅良缘。' });
    if (['乙', '丙', '丁'].includes(hStem) && pNum === targetGatePalace) formations.push({ name: '三奇得使', nature: '吉', desc: '三奇临值使门：有真助力落地，计划容易推进见效。' });
    if (eStem === '丁' && pNum === targetGatePalace) formations.push({ name: '玉女守门', nature: '吉', desc: '值使临地盘丁奇：利宴请交际、婚恋合作与文书谈判。' });
    if (hStem === '乙' && eStem === '辛') formations.push({ name: '青龙逃走', nature: '凶', desc: '乙加辛：主变动流失或计划生变，合作宜防中途撤退。' });
    if (hStem === '辛' && eStem === '乙') formations.push({ name: '白虎猖狂', nature: '凶', desc: '辛加乙：易因冲动或强硬引发争执，宜退一步海阔天空。' });
    if (hStem === '癸' && eStem === '丁') formations.push({ name: '腾蛇夭矫', nature: '凶', desc: '癸加丁：信息反复或虚惊一场，务必核实细节莫轻信。' });
    if (hStem === '丁' && eStem === '癸') formations.push({ name: '朱雀投江', nature: '凶', desc: '丁加癸：文书消息易滞后或误读，重要沟通建议留书面确认。' });
    if (hStem === '庚' && eStem === '丙') formations.push({ name: '太白入荧', nature: '慎', desc: '庚加丙：主外来冲击或竞争加剧，防守反击胜过贸然出击。' });
    if (hStem === '丙' && eStem === '庚') formations.push({ name: '荧入太白', nature: '慎', desc: '丙加庚：防中途受阻或耗损，适合清理旧问题、见好就收。' });
    if (hStem === '癸' && eStem === '癸') formations.push({ name: '天网四张', nature: '慎', desc: '癸加癸：局势纠缠暂难明朗，宜低调静观其变。' });

    const isAuspiciousGate = ['开门', '休门', '生门'].includes(gate);
    const formBonus = formations.reduce((acc, f) => acc + (f.nature === '大吉' ? 2 : f.nature === '吉' ? 1 : -1), 0);
    const score =
      (isAuspiciousGate ? 2 : ['景门'].includes(gate) ? 1 : 0) +
      (['值符', '太阴', '六合', '九地', '九天'].includes(deity) ? 1 : 0) +
      (['天辅', '天心', '天任', '天冲'].includes(star) ? 1 : 0) +
      formBonus -
      (isKong ? 1 : 0) -
      alerts.length;

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
      auspiciousness: score >= 3 ? '大吉' : score >= 2 ? '偏吉' : score >= 1 ? '中平' : '慎行',
    };
  });

  // Global formations (伏吟 / 反吟) + aggregated palace formations
  const globalFormations = [];
  if (starDelta === 0) globalFormations.push({ name: '星伏吟', nature: '平', palaceNum: 5, desc: '九星归本位：节奏偏慢、宜守旧求稳、不宜急躁求快。' });
  if (starDelta === 4) globalFormations.push({ name: '星反吟', nature: '慎', palaceNum: 5, desc: '九星居对宫：事情易反复反转，适合快速决断或短线变通。' });
  if (gateDelta === 0) globalFormations.push({ name: '门伏吟', nature: '平', palaceNum: 5, desc: '八门归本位：外部推动慢，宜深耕内部或等待窗口。' });
  if (gateDelta === 4) globalFormations.push({ name: '门反吟', nature: '慎', palaceNum: 5, desc: '八门居对宫：变化来得快、来去匆匆，宜做好两手预案。' });
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
    all: { label: '综合全局', palaceNums: uniqNums([targetStarPalace, targetGatePalace]), tip: `先看值符（${LUOSHU_PALACES[targetStarPalace].name}）与值使（${LUOSHU_PALACES[targetGatePalace].name}），把握全局贵人与推进节奏。` },
    career: { label: '事业面试', palaceNums: uniqNums([findPalace(p => p.gate === '开门'), targetStarPalace]), tip: '测事业/求职/升迁重点看「开门」落宫（代表工作平台）与「值符」（代表领导/面试官）。' },
    wealth: { label: '求财投资', palaceNums: uniqNums([findPalace(p => p.gate === '生门'), findPalace(p => p.heavenStem === '戊')]), tip: '测财运/营商重点看「生门」（利润生机）与天盘「戊」（本金资本）落宫生克。' },
    love: { label: '感情合作', palaceNums: uniqNums([findPalace(p => p.deity === '六合'), findPalace(p => p.heavenStem === '乙'), findPalace(p => p.heavenStem === '庚')]), tip: '测感情/合伙重点看「六合」（关系纽带）及「乙」「庚」两宫是否和谐无冲。' },
    health: { label: '健康调养', palaceNums: uniqNums([findPalace(p => p.star === '天芮'), findPalace(p => p.star === '天心')]), tip: '测健康状态看「天芮」（症结提醒）与「天心」（医药良方与调理方向）。' },
    travel: { label: '出行方位', palaceNums: uniqNums([yiMaPalace, findPalace(p => p.deity === '九天')]), tip: '测出行/出差/搬家看「驿马」动向与「九天」高飞方位，结合三吉门避开空亡。' },
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
      tip: `${p.direction}（${p.name}）见${p.gate}+${p.star}+${p.deity}${p.isKong ? '（逢空亡宜缓）' : p.alerts.length ? `（留意${p.alerts.map(a => a.tag).join('/')}）` : '（气场清朗）'}`,
    }));

  const juTitle = `${termConfig.dun}${juNum}局`;

  return {
    id: `qimen-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    system: 'qimen',
    createdAt: new Date().toISOString(),
    title: `奇门遁甲 · ${juTitle}`,
    subtitle: `${solar.toYmd()} ${String(solar.getHour()).padStart(2, '0')}:${String(solar.getMinute()).padStart(2, '0')} · ${solarTermName}${yuanLabel}`,
    question: input.question || '',
    sourceEngine: '拆补转盘时家奇门 (lunar-javascript 历法)',
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
