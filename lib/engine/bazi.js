/**
 * Four Pillars (Bazi / 四柱八字) calculation engine powered by 6tail/lunar-javascript.
 */

import lunarPkg from 'lunar-javascript';
import {
  GAN_INFO,
  ZHI_INFO,
  WU_XING_ORDER,
  WU_XING_META,
  SHI_SHEN_GLOSSARY,
  GAN_HE,
  GAN_CHONG,
  ZHI_LIU_HE,
  ZHI_SAN_HE,
  ZHI_LIU_CHONG,
  ZHI_LIU_HAI,
  ZHI_XING,
} from '../data/constants.js';

const { Solar, Lunar } = lunarPkg;

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
        list.push({ type: '天干五合', polarity: 'good', from: i, to: j, layer: 'gan', label: `${gPair}${GAN_HE[gPair]}`, desc: `${a.label}与${b.label}天干五合（${gPair}${GAN_HE[gPair]}），主和谐有情、资源串联。` });
      } else if (GAN_CHONG.has(gPair)) {
        list.push({ type: '天干相冲', polarity: 'warn', from: i, to: j, layer: 'gan', label: `${gPair}冲`, desc: `${a.label}与${b.label}天干相冲（${gPair}），主思维张力大、行动力强但也防冲动。` });
      }
      if (ZHI_LIU_HE[zPair]) {
        list.push({ type: '地支六合', polarity: 'good', from: i, to: j, layer: 'zhi', label: `${zPair}${ZHI_LIU_HE[zPair]}`, desc: `${a.label}与${b.label}地支六合（${zPair}${ZHI_LIU_HE[zPair]}），主根基稳固、暗中得助。` });
      } else if (ZHI_LIU_CHONG.has(zPair)) {
        list.push({ type: '地支六冲', polarity: 'warn', from: i, to: j, layer: 'zhi', label: `${zPair}冲`, desc: `${a.label}与${b.label}地支六冲（${zPair}），主变动与突破契机，宜借变化求新。` });
      } else if (ZHI_XING.has(zPair)) {
        list.push({ type: '地支相刑', polarity: 'warn', from: i, to: j, layer: 'zhi', label: `${zPair}刑`, desc: `${a.label}与${b.label}地支相刑（${zPair}），主自我要求高、易反复琢磨细节。` });
      } else if (ZHI_LIU_HAI.has(zPair)) {
        list.push({ type: '地支六害', polarity: 'warn', from: i, to: j, layer: 'zhi', label: `${zPair}害`, desc: `${a.label}与${b.label}地支相穿（${zPair}），提醒重要约定落实细节、减少内耗。` });
      } else {
        const san = ZHI_SAN_HE.find(g => a.zhi !== b.zhi && g.branches.includes(a.zhi) && g.branches.includes(b.zhi));
        if (san) {
          list.push({ type: '地支半合', polarity: 'good', from: i, to: j, layer: 'zhi', label: `${zPair}半合${san.element}`, desc: `${a.label}与${b.label}构成${san.name}之半合，增强「${san.element}」气场。` });
        }
      }
    }
  }
  return list;
}

function detectBaziPattern(pillars) {
  const month = pillars[1];
  const mainHidden = month.hiddenDetails[0];
  const ss = mainHidden?.shiShen || month.shiShenGan;
  if (ss === '比肩') return { name: '建禄格', desc: '月令为日主禄地，自立自强、白手兴家之象，宜搭配财官展现大格局。' };
  if (ss === '劫财') return { name: '月刃格', desc: '月令见阳刃/劫财，魄力与抗压能力极强，喜有官杀或食伤疏导成就大器。' };
  const map = {
    正官: '清正有度、重规则信誉，利管理晋升、公职与大型平台发展。',
    七杀: '果敢敏锐、具破局与领导魄力，适合高挑战赛道与独立掌局。',
    正财: '务实稳健、擅长精细经营与长期复利积累。',
    偏财: '商业嗅觉灵敏、善于资源整合与捕捉机遇财富。',
    食神: '温和有才华、审美与创意出众，靠专业输出与口碑自然生财。',
    伤官: '才思泉涌、敢于创新突破，宜配印星或规则沉淀作品。',
    正印: '重学识修养、自带贵人庇护，利教育研究、咨询与专业权威路线。',
    偏印: '直觉深邃、具跨界与非传统洞察力，利科技研发、设计策划与玄学哲学。',
  };
  return { name: `${ss}格`, desc: map[ss] || '月令主气清晰，结合喜用神顺势发挥即可。' };
}

export function parseDateTimeInput(input = {}) {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();
  let hour = now.getHours();
  let minute = now.getMinutes();

  if (typeof input.date === 'string' && input.date.trim()) {
    const m = input.date.trim().match(/^(\d{4})[-/.年](\d{1,2})[-/.月](\d{1,2})/);
    if (m) {
      year = Number(m[1]);
      month = Number(m[2]);
      day = Number(m[3]);
    }
  }
  if (Number.isInteger(input.year)) year = input.year;
  if (Number.isInteger(input.month)) month = input.month;
  if (Number.isInteger(input.day)) day = input.day;

  if (typeof input.time === 'string' && input.time.trim()) {
    const t = input.time.trim().match(/^(\d{1,2})(?::(\d{1,2}))?/);
    if (t) {
      hour = Number(t[1]);
      minute = t[2] !== undefined ? Number(t[2]) : 0;
    }
  }
  if (Number.isInteger(input.hour)) hour = input.hour;
  if (Number.isInteger(input.minute)) minute = input.minute;

  year = Math.max(1901, Math.min(2099, year));
  month = Math.max(1, Math.min(12, month));
  day = Math.max(1, Math.min(31, day));
  hour = Math.max(0, Math.min(23, hour));
  minute = Math.max(0, Math.min(59, minute));

  const calendar = input.calendar === 'lunar' ? 'lunar' : 'solar';
  const isLeapMonth = Boolean(input.isLeapMonth);

  // Optional simple longitude True Solar Time adjustment (Beijing standard = 120°E)
  let trueSolarApplied = false;
  let solar;
  if (calendar === 'lunar') {
    const lunarMonth = isLeapMonth ? -Math.abs(month) : Math.abs(month);
    const lunar = Lunar.fromYmdHms(year, lunarMonth, day, hour, minute, 0);
    solar = lunar.getSolar();
  } else {
    solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  }

  if (typeof input.longitude === 'number' && Number.isFinite(input.longitude)) {
    const offsetMinutes = Math.round((input.longitude - 120) * 4);
    if (offsetMinutes !== 0) {
      const dt = new Date(
        solar.getYear(),
        solar.getMonth() - 1,
        solar.getDay(),
        solar.getHour(),
        solar.getMinute() + offsetMinutes,
        0,
      );
      solar = Solar.fromYmdHms(
        dt.getFullYear(),
        dt.getMonth() + 1,
        dt.getDay(),
        dt.getHours(),
        dt.getMinutes(),
        0,
      );
      trueSolarApplied = true;
    }
  }

  return { solar, lunar: solar.getLunar(), calendar, trueSolarApplied };
}

export function normalizeGender(gender) {
  if (gender === 0 || gender === '0' || gender === 'female' || gender === '女' || gender === 'F' || gender === 'f') {
    return { code: 0, label: '女', en: 'female' };
  }
  return { code: 1, label: '男', en: 'male' };
}

function computeShiShen(dayGan, targetGan) {
  if (!dayGan || !targetGan || !GAN_INFO[dayGan] || !GAN_INFO[targetGan]) return '';
  const d = GAN_INFO[dayGan];
  const t = GAN_INFO[targetGan];
  const samePol = d.yinYang === t.yinYang;
  if (d.element === t.element) return samePol ? '比肩' : '劫财';
  if (WU_XING_META[d.element].generates === t.element) return samePol ? '食神' : '伤官';
  if (WU_XING_META[d.element].controls === t.element) return samePol ? '偏财' : '正财';
  if (WU_XING_META[t.element].controls === d.element) return samePol ? '七杀' : '正官';
  if (WU_XING_META[t.element].generates === d.element) return samePol ? '偏印' : '正印';
  return '';
}

function computeShenSha(pillars) {
  const [y, m, d, t] = pillars;
  const allBranches = [y.zhi, m.zhi, d.zhi, t.zhi];
  const dayGan = d.gan;
  const yearZhi = y.zhi;
  const dayZhi = d.zhi;
  const list = [];

  // 天乙贵人 (by dayGan)
  const tianYiMap = {
    甲: ['丑', '未'], 戊: ['丑', '未'], 庚: ['丑', '未'],
    乙: ['子', '申'], 己: ['子', '申'],
    丙: ['亥', '酉'], 丁: ['亥', '酉'],
    壬: ['卯', '巳'], 癸: ['卯', '巳'],
    辛: ['午', '寅'],
  };
  const tianYiTargets = tianYiMap[dayGan] || [];
  if (allBranches.some(b => tianYiTargets.includes(b))) {
    list.push({ name: '天乙贵人', nature: '大吉', desc: '命带贵人星，遇关键节点常得长辈、前辈或良师益友助力。' });
  }

  // 文昌贵人 (by dayGan)
  const wenChangMap = { 甲: '巳', 乙: '午', 丙: '申', 丁: '酉', 戊: '申', 己: '酉', 庚: '亥', 辛: '子', 壬: '寅', 癸: '卯' };
  if (allBranches.includes(wenChangMap[dayGan])) {
    list.push({ name: '文昌贵人', nature: '吉', desc: '聪慧好学、文思敏捷，利考试深造、写作策划与专业技术精进。' });
  }

  // 禄神 (by dayGan)
  const luMap = { 甲: '寅', 乙: '卯', 丙: '巳', 丁: '午', 戊: '巳', 己: '午', 庚: '申', 辛: '酉', 壬: '亥', 癸: '子' };
  if (allBranches.includes(luMap[dayGan])) {
    list.push({ name: '禄神', nature: '吉', desc: '自带衣食福禄与自立底气，主靠专业能力获得稳定回报。' });
  }

  // 羊刃 (by yang dayGan)
  const yangRenMap = { 甲: '卯', 丙: '午', 戊: '午', 庚: '酉', 壬: '子' };
  if (yangRenMap[dayGan] && allBranches.includes(yangRenMap[dayGan])) {
    list.push({ name: '羊刃', nature: '刚烈', desc: '意志刚强、爆发力足，宜把魄力投入事业攻坚，注意情绪管理。' });
  }

  // 桃花 / 咸池 (by yearZhi or dayZhi)
  const taoHuaMap = {
    申: '酉', 子: '酉', 辰: '酉',
    寅: '卯', 午: '卯', 戌: '卯',
    巳: '午', 酉: '午', 丑: '午',
    亥: '子', 卯: '子', 未: '子',
  };
  if (allBranches.includes(taoHuaMap[yearZhi]) || allBranches.includes(taoHuaMap[dayZhi])) {
    list.push({ name: '咸池桃花', nature: '人缘', desc: '自带魅力与审美感染力，人缘佳、异性缘或观众缘活跃。' });
  }

  // 驿马 (by yearZhi or dayZhi)
  const yiMaMap = {
    申: '寅', 子: '寅', 辰: '寅',
    寅: '申', 午: '申', 戌: '申',
    巳: '亥', 酉: '亥', 丑: '亥',
    亥: '巳', 卯: '巳', 未: '巳',
  };
  if (allBranches.includes(yiMaMap[yearZhi]) || allBranches.includes(yiMaMap[dayZhi])) {
    list.push({ name: '驿马', nature: '动象', desc: '喜动不喜静，利出差、远行、跨城发展、外贸或互联网远方生财。' });
  }

  // 华盖 (by yearZhi or dayZhi)
  const huaGaiMap = {
    申: '辰', 子: '辰', 辰: '辰',
    寅: '戌', 午: '戌', 戌: '戌',
    巳: '丑', 酉: '丑', 丑: '丑',
    亥: '未', 卯: '未', 未: '未',
  };
  if (allBranches.includes(huaGaiMap[yearZhi]) || allBranches.includes(huaGaiMap[dayZhi])) {
    list.push({ name: '华盖', nature: '艺智', desc: '独立思考能力强，具艺术审美、哲学直觉或深度钻研天赋。' });
  }

  // 将星
  const jiangXingMap = {
    申: '子', 子: '子', 辰: '子',
    寅: '午', 午: '午', 戌: '午',
    巳: '酉', 酉: '酉', 丑: '酉',
    亥: '卯', 卯: '卯', 未: '卯',
  };
  if (allBranches.includes(jiangXingMap[yearZhi]) || allBranches.includes(jiangXingMap[dayZhi])) {
    list.push({ name: '将星', nature: '吉', desc: '具备组织统筹力与临危不乱的气场，适合带团队或负责关键模块。' });
  }

  // 魁罡
  if (['庚辰', '庚戌', '壬辰', '戊戌'].includes(d.ganZhi)) {
    list.push({ name: '魁罡', nature: '刚明', desc: '聪慧果断、不畏强权，格局鲜明，成事靠魄力与坚守正道。' });
  }

  return list;
}

function analyzeWuXing(pillars) {
  const scores = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  const counts = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };

  // Pillar weights: Month branch (月令) carries strongest seasonal weight
  const ganWeights = [10, 12, 12, 10];
  const zhiWeights = [12, 30, 14, 12]; // Month branch weighted heavily for seasonal command
  const hiddenSplit = [[1.0], [0.7, 0.3], [0.6, 0.25, 0.15]];

  pillars.forEach((p, idx) => {
    const gEl = GAN_INFO[p.gan].element;
    const zEl = ZHI_INFO[p.zhi].element;
    counts[gEl] += 1;
    counts[zEl] += 1;
    scores[gEl] += ganWeights[idx];
    const hidden = p.hiddenStems.length ? p.hiddenStems : [ZHI_INFO[p.zhi].hidden[0]];
    const ratios = hiddenSplit[Math.min(hidden.length - 1, 2)];
    hidden.forEach((hg, hIdx) => {
      const el = GAN_INFO[hg]?.element || zEl;
      scores[el] += zhiWeights[idx] * (ratios[hIdx] || 0.15);
    });
  });

  const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  const percentages = {};
  for (const el of WU_XING_ORDER) {
    percentages[el] = Math.round((scores[el] / total) * 100);
  }
  // Normalize rounding drift on max element
  const sumPct = Object.values(percentages).reduce((a, b) => a + b, 0);
  if (sumPct !== 100) {
    const maxEl = WU_XING_ORDER.reduce((a, b) => (scores[a] >= scores[b] ? a : b));
    percentages[maxEl] += 100 - sumPct;
  }

  const dayEl = GAN_INFO[pillars[2].gan].element;
  const resourceEl = WU_XING_META[dayEl].generatedBy; // 印星
  const outputEl = WU_XING_META[dayEl].generates;     // 食伤
  const wealthEl = WU_XING_META[dayEl].controls;      // 财星
  const officerEl = WU_XING_META[dayEl].controlledBy; // 官杀

  const supportScore = scores[dayEl] + scores[resourceEl];
  const drainScore = scores[outputEl] + scores[wealthEl] + scores[officerEl];
  const supportRatio = supportScore / total;

  let bodyStrength = '中和偏稳';
  let bodyLevel = 'balanced';
  let favorable = [];
  let unfavorable = [];
  let strengthAdvice = '';

  if (supportRatio >= 0.56) {
    bodyStrength = '身强（能量充沛）';
    bodyLevel = 'strong';
    // Favorable: drain / channel energy (官杀、财星、食伤) ordered by lowest present score
    favorable = [wealthEl, officerEl, outputEl].sort((a, b) => scores[a] - scores[b]).slice(0, 2);
    unfavorable = [resourceEl, dayEl];
    strengthAdvice = `日主${pillars[2].gan}${dayEl}得令得助、自身能量饱满，喜「${favorable.join('、')}」来疏导变现（如以食伤展才华、以财官定目标），忌再过度堆叠${unfavorable.join('、')}。`;
  } else if (supportRatio <= 0.43) {
    bodyStrength = '身弱（喜得生扶）';
    bodyLevel = 'weak';
    favorable = [resourceEl, dayEl];
    unfavorable = [officerEl, wealthEl, outputEl].sort((a, b) => scores[b] - scores[a]).slice(0, 2);
    strengthAdvice = `日主${pillars[2].gan}${dayEl}在全局中占比偏轻，喜「${favorable.join('、')}」滋养帮扶（多借贵人团队与学习积累蓄力），避免同时扛过多高压消耗。`;
  } else {
    bodyStrength = '中和（五行较匀）';
    bodyLevel = 'balanced';
    const sorted = [...WU_XING_ORDER].sort((a, b) => scores[a] - scores[b]);
    favorable = sorted.slice(0, 2);
    unfavorable = sorted.slice(-1);
    strengthAdvice = `日主${pillars[2].gan}${dayEl}与全局力量大体均衡，顺势调候即可；适当补足偏弱的「${favorable.join('、')}」能让气场更流畅。`;
  }

  const missingElements = WU_XING_ORDER.filter(el => counts[el] === 0);
  const fengshuiTips = favorable.map(el => `${el}（${WU_XING_META[el].direction}）：${WU_XING_META[el].fengshui}`);

  return {
    scores: Object.fromEntries(WU_XING_ORDER.map(el => [el, Math.round(scores[el])])),
    counts,
    percentages,
    dayElement: dayEl,
    supportRatio: Math.round(supportRatio * 100),
    drainRatio: Math.round((drainScore / total) * 100),
    bodyStrength,
    bodyLevel,
    favorable,
    unfavorable,
    missingElements,
    strengthAdvice,
    fengshuiTips,
  };
}

export function calculateBazi(input = {}) {
  const { solar, lunar, calendar, trueSolarApplied } = parseDateTimeInput(input);
  const gender = normalizeGender(input.gender);
  const ec = lunar.getEightChar();

  const buildPillar = (key, label, roleDesc, ganZhi, gan, zhi, naYin, shiShenGan, hideGan, shiShenZhi, diShi, xunKong) => ({
    key,
    label,
    roleDesc,
    ganZhi,
    gan,
    zhi,
    ganElement: GAN_INFO[gan].element,
    ganYinYang: GAN_INFO[gan].yinYang,
    zhiElement: ZHI_INFO[zhi].element,
    zhiYinYang: ZHI_INFO[zhi].yinYang,
    shiShenGan: key === 'day' ? '日主' : shiShenGan,
    shiShenDesc: SHI_SHEN_GLOSSARY[key === 'day' ? '日主' : shiShenGan] || '',
    hiddenStems: hideGan,
    hiddenDetails: hideGan.map((hg, i) => ({
      gan: hg,
      element: GAN_INFO[hg]?.element || '',
      shiShen: shiShenZhi[i] || '',
    })),
    naYin,
    diShi,
    xunKong,
  });

  const pillars = [
    buildPillar(
      'year', '年柱', '祖辈根基 · 童年环境（0-16岁）',
      ec.getYear(), ec.getYearGan(), ec.getYearZhi(), ec.getYearNaYin(),
      ec.getYearShiShenGan(), ec.getYearHideGan(), ec.getYearShiShenZhi(),
      ec.getYearDiShi(), ec.getYearXunKong(),
    ),
    buildPillar(
      'month', '月柱', '父母宫 · 事业格局与青年（17-32岁）',
      ec.getMonth(), ec.getMonthGan(), ec.getMonthZhi(), ec.getMonthNaYin(),
      ec.getMonthShiShenGan(), ec.getMonthHideGan(), ec.getMonthShiShenZhi(),
      ec.getMonthDiShi(), ec.getMonthXunKong(),
    ),
    buildPillar(
      'day', '日柱', '日主本人 · 日支为夫妻宫（33-48岁）',
      ec.getDay(), ec.getDayGan(), ec.getDayZhi(), ec.getDayNaYin(),
      '日主', ec.getDayHideGan(), ec.getDayShiShenZhi(),
      ec.getDayDiShi(), ec.getDayXunKong(),
    ),
    buildPillar(
      'time', '时柱', '子女宫 · 晚年归宿与事业成果（49岁后）',
      ec.getTime(), ec.getTimeGan(), ec.getTimeZhi(), ec.getTimeNaYin(),
      ec.getTimeShiShenGan(), ec.getTimeHideGan(), ec.getTimeShiShenZhi(),
      ec.getTimeDiShi(), ec.getTimeXunKong(),
    ),
  ];

  const dayGan = ec.getDayGan();
  const wuxing = analyzeWuXing(pillars);
  const shenSha = computeShenSha(pillars);
  const interactions = computePillarInteractions(pillars);
  const pattern = detectBaziPattern(pillars);
  const mingGua = computeMingGua(lunar.getYear(), gender.code);

  // Current year (2026 丙午) quick resonance note
  const curSolar = Solar.fromDate(new Date());
  const curYearNum = curSolar.getYear();
  const curYearGZ = curSolar.getLunar().getYearInGanZhiExact();
  const curYearGanEl = GAN_INFO[curYearGZ[0]]?.element || '火';
  const curYearZhiEl = ZHI_INFO[curYearGZ[1]]?.element || '火';
  const curYearSS = computeShiShen(dayGan, curYearGZ[0]);
  const curYearFavMatch = wuxing.favorable.includes(curYearGanEl) || wuxing.favorable.includes(curYearZhiEl);
  const currentYear = {
    year: curYearNum,
    ganZhi: curYearGZ,
    shiShen: curYearSS,
    elements: [curYearGanEl, curYearZhiEl],
    favorableMatch: curYearFavMatch,
    note: curYearFavMatch
      ? `${curYearNum}年（${curYearGZ}，天干${curYearSS}）带喜用「${[curYearGanEl, curYearZhiEl].filter(e => wuxing.favorable.includes(e)).join('、')}」，整体顺势加分，宜积极推进重点计划。`
      : `${curYearNum}年（${curYearGZ}，天干${curYearSS}）主「${curYearGanEl}/${curYearZhiEl}」气场，宜稳中求进、多借喜用神「${wuxing.favorable.join('、')}」方位与配色平衡节奏。`,
  };

  const yun = ec.getYun(gender.code);
  const rawDaYun = yun.getDaYun(9); // index 0 is childhood (童限), 1..8 are 8 decades
  const daYun = rawDaYun.slice(1, 9).map((dy, i) => {
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
      startYear: dy.getStartYear(),
      endYear: dy.getEndYear(),
      startAge: dy.getStartAge(),
      endAge: dy.getEndAge(),
      liuNian,
    };
  });

  const prevJie = lunar.getPrevJie(false);
  const nextJie = lunar.getNextJie(false);

  return {
    id: `bazi-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    system: 'bazi',
    createdAt: new Date().toISOString(),
    title: input.name ? `${input.name} · 四柱八字` : `${ec.getDayGan()}${GAN_INFO[dayGan].element}日主 · 四柱八字`,
    subtitle: `${solar.toYmd()} ${String(solar.getHour()).padStart(2, '0')}:${String(solar.getMinute()).padStart(2, '0')} · ${gender.label}命`,
    question: input.question || '',
    sourceEngine: '6tail/lunar-javascript',
    meta: {
      name: input.name || '',
      gender: gender.label,
      genderCode: gender.code,
      calendar,
      trueSolarApplied,
      solarDate: `${solar.toYmd()} ${String(solar.getHour()).padStart(2, '0')}:${String(solar.getMinute()).padStart(2, '0')}`,
      lunarDate: `${lunar.getYearInChinese()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()} ${lunar.getTimeZhi()}时`,
      zodiac: lunar.getYearShengXiaoExact(),
      taiYuan: `${ec.getTaiYuan()}（${ec.getTaiYuanNaYin()}）`,
      mingGong: `${ec.getMingGong()}（${ec.getMingGongNaYin()}）`,
      shenGong: `${ec.getShenGong()}（${ec.getShenGongNaYin()}）`,
      prevJie: prevJie ? `${prevJie.getName()} ${prevJie.getSolar().toYmdHms()}` : '',
      nextJie: nextJie ? `${nextJie.getName()} ${nextJie.getSolar().toYmdHms()}` : '',
      startYunDesc: `出生后 ${yun.getStartYear()}年${yun.getStartMonth()}个月${yun.getStartDay()}天起运（${yun.getStartSolar().toYmd()}）`,
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
    pattern,
    mingGua,
    currentYear,
    daYun,
    summaryText: `四柱：${pillars.map(p => p.ganZhi).join(' ')}（${pattern.name}）；日主${dayGan}${GAN_INFO[dayGan].element}（${wuxing.bodyStrength}），喜用神：${wuxing.favorable.join('、')}；八宅${mingGua.name}（${mingGua.group}，财位${mingGua.bestWealthDir}）。`,
  };
}
