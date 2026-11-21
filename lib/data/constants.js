/**
 * Reference tables for the rules documented in docs/SOURCES.zh.md,
 * plus editorial glossaries for the interface.
 */

export const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
export const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

export const WU_XING_ORDER = ['木', '火', '土', '金', '水'];

export const WU_XING_META = {
  木: {
    en: 'Wood',
    color: '#10b981',
    direction: '东方',
    season: '春季',
    numbers: [3, 8],
    generates: '火',
    controls: '土',
    generatedBy: '水',
    controlledBy: '金',
    trait: '生发、仁善、成长、创意与条理性',
    fengshui: '宜绿植、原木材质、青绿色系，对应住宅正东与东南方位。',
  },
  火: {
    en: 'Fire',
    color: '#ef4444',
    direction: '南方',
    season: '夏季',
    numbers: [2, 7],
    generates: '土',
    controls: '金',
    generatedBy: '木',
    controlledBy: '水',
    trait: '光明、热情、礼仪、表达力与行动力',
    fengshui: '宜采光通风、暖色灯光、赤红/紫橙点缀，对应住宅正南方位。',
  },
  土: {
    en: 'Earth',
    color: '#d97706',
    direction: '中央 / 四隅',
    season: '四季末',
    numbers: [5, 10],
    generates: '金',
    controls: '水',
    generatedBy: '火',
    controlledBy: '木',
    trait: '厚重、诚信、包容、稳定与承载力',
    fengshui: '宜陶瓷玉石、大地黄/米棕色系、整洁稳重布局，对应中宫及东北/西南方位。',
  },
  金: {
    en: 'Metal',
    color: '#eab308',
    direction: '西方',
    season: '秋季',
    numbers: [4, 9],
    generates: '水',
    controls: '木',
    generatedBy: '土',
    controlledBy: '火',
    trait: '果断、义气、收敛、规则感与执行力',
    fengshui: '宜金属饰品、留白利落线条、金银白色系，对应住宅正西与西北方位。',
  },
  水: {
    en: 'Water',
    color: '#3b82f6',
    direction: '北方',
    season: '冬季',
    numbers: [1, 6],
    generates: '木',
    controls: '火',
    generatedBy: '金',
    controlledBy: '土',
    trait: '智慧、变通、流动、洞察力与人脉沟通',
    fengshui: '宜流动水景、玻璃质感、深蓝/玄黑色系，对应住宅正北方位。',
  },
};

export const GAN_INFO = {
  甲: { element: '木', yinYang: '阳', desc: '参天大树：正直有主见、喜向上突破，适合担当骨干。' },
  乙: { element: '木', yinYang: '阴', desc: '花草藤蔓：柔韧善变通、注重人际与美感，适应力强。' },
  丙: { element: '火', yinYang: '阳', desc: '太阳之火：热情大方、光芒外露，富有感染力与号召力。' },
  丁: { element: '火', yinYang: '阴', desc: '灯烛星火：细腻温和、洞察入微，擅长专注钻研与策划。' },
  戊: { element: '土', yinYang: '阳', desc: '城墙高山：稳重踏实、信守承诺，抗压能力突出。' },
  己: { element: '土', yinYang: '阴', desc: '田园沃土：包容务实、细心周到，善于协调与滋养他人。' },
  庚: { element: '金', yinYang: '阳', desc: '刀剑矿石：刚毅果决、讲究原则，执行力与改革魄力强。' },
  辛: { element: '金', yinYang: '阴', desc: '珠玉首饰：精致敏锐、重视品质与体面，审美与细节佳。' },
  壬: { element: '水', yinYang: '阳', desc: '江河大海：格局宏大、思维活跃、善于借势与统筹全局。' },
  癸: { element: '水', yinYang: '阴', desc: '雨露清泉：聪慧内敛、灵感丰富，善于润物细无声地解决问题。' },
};

export const ZHI_INFO = {
  子: { element: '水', yinYang: '阳', zodiac: '鼠', hourRange: '23:00-01:00', season: '冬', hidden: ['癸'] },
  丑: { element: '土', yinYang: '阴', zodiac: '牛', hourRange: '01:00-03:00', season: '冬末', hidden: ['己', '癸', '辛'] },
  寅: { element: '木', yinYang: '阳', zodiac: '虎', hourRange: '03:00-05:00', season: '春', hidden: ['甲', '丙', '戊'] },
  卯: { element: '木', yinYang: '阴', zodiac: '兔', hourRange: '05:00-07:00', season: '春', hidden: ['乙'] },
  辰: { element: '土', yinYang: '阳', zodiac: '龙', hourRange: '07:00-09:00', season: '春末', hidden: ['戊', '乙', '癸'] },
  巳: { element: '火', yinYang: '阴', zodiac: '蛇', hourRange: '09:00-11:00', season: '夏', hidden: ['丙', '庚', '戊'] },
  午: { element: '火', yinYang: '阳', zodiac: '马', hourRange: '11:00-13:00', season: '夏', hidden: ['丁', '己'] },
  未: { element: '土', yinYang: '阴', zodiac: '羊', hourRange: '13:00-15:00', season: '夏末', hidden: ['己', '丁', '乙'] },
  申: { element: '金', yinYang: '阳', zodiac: '猴', hourRange: '15:00-17:00', season: '秋', hidden: ['庚', '壬', '戊'] },
  酉: { element: '金', yinYang: '阴', zodiac: '鸡', hourRange: '17:00-19:00', season: '秋', hidden: ['辛'] },
  戌: { element: '土', yinYang: '阳', zodiac: '狗', hourRange: '19:00-21:00', season: '秋末', hidden: ['戊', '辛', '丁'] },
  亥: { element: '水', yinYang: '阴', zodiac: '猪', hourRange: '21:00-23:00', season: '冬', hidden: ['壬', '甲'] },
};

// TianGan 5 Combinations (天干五合)
export const GAN_HE = {
  甲己: '化土', 己甲: '化土',
  乙庚: '化金', 庚乙: '化金',
  丙辛: '化水', 辛丙: '化水',
  丁壬: '化木', 壬丁: '化木',
  戊癸: '化火', 癸戊: '化火',
};

// TianGan 4 Clashes (天干相冲)
export const GAN_CHONG = new Set(['甲庚', '庚甲', '乙辛', '辛乙', '丙壬', '壬丙', '丁癸', '癸丁']);

// DiZhi 6 Harmonies (地支六合)
export const ZHI_LIU_HE = {
  子丑: '合土', 丑子: '合土',
  寅亥: '合木', 亥寅: '合木',
  卯戌: '合火', 戌卯: '合火',
  辰酉: '合金', 酉辰: '合金',
  巳申: '合水', 申巳: '合水',
  午未: '合火土', 未午: '合火土',
};

// DiZhi 3 Harmonies (地支三合局)
export const ZHI_SAN_HE = [
  { branches: ['申', '子', '辰'], element: '水', name: '申子辰三合水局' },
  { branches: ['亥', '卯', '未'], element: '木', name: '亥卯未三合木局' },
  { branches: ['寅', '午', '戌'], element: '火', name: '寅午戌三合火局' },
  { branches: ['巳', '酉', '丑'], element: '金', name: '巳酉丑三合金局' },
];

export const ZHI_SAN_HUI = [
  { branches: '寅卯辰', element: '木' },
  { branches: '巳午未', element: '火' },
  { branches: '申酉戌', element: '金' },
  { branches: '亥子丑', element: '水' },
];

// DiZhi 6 Clashes (地支六冲)
export const ZHI_LIU_CHONG = new Set([
  '子午', '午子', '丑未', '未丑', '寅申', '申寅',
  '卯酉', '酉卯', '辰戌', '戌辰', '巳亥', '亥巳',
]);

// DiZhi 6 Harms (地支六害/相穿)
export const ZHI_LIU_HAI = new Set([
  '子未', '未子', '丑午', '午丑', '寅巳', '巳寅',
  '卯辰', '辰卯', '申亥', '亥申', '酉戌', '戌酉',
]);

// DiZhi Punishments (地支相刑)
export const ZHI_XING = new Set([
  '子卯', '卯子',
  '寅巳', '巳寅', '巳申', '申巳', '寅申', '申寅',
  '丑戌', '戌丑', '戌未', '未戌', '丑未', '未丑',
  '辰辰', '午午', '酉酉', '亥亥',
]);

export const SHI_SHEN_GLOSSARY = {
  日主: '命盘核心，代表「你自己」，所有十神都围绕日主与其它干支的关系来定。',
  比肩: '与你同性同行，代表同辈、朋友、独立意识与自我坚持；适度主自主，过旺易固执。',
  劫财: '与你异性同行，代表人脉社交、竞争合作与行动力；利开拓资源，也要留意冲动消费。',
  食神: '我生之同性，代表才华输出、口福审美、温和创造力与享受生活的能力。',
  伤官: '我生之异性，代表敏锐表达、创新突破、敢言不拘常规；宜配合规则与印星沉淀。',
  偏财: '我克之同性，代表机遇财、投资理财、商业眼光与人际大方。',
  正财: '我克之异性，代表稳健收入、务实积累、责任心与精细经营。',
  七杀: '克我之同性，代表魄力、危机应对、事业野心与高压突破；有制化则成大器。',
  正官: '克我之异性，代表秩序、名誉、自律、管理能力与正规晋升路径。',
  偏印: '生我之同性（枭神），代表直觉灵感、非传统思维、深度钻研与独特领悟力。',
  正印: '生我之异性，代表学识修养、贵人庇护、包容稳定与精神滋养。',
};

// 60 JiaZi table
export const JIA_ZI_60 = Array.from({ length: 60 }, (_, i) => TIAN_GAN[i % 10] + DI_ZHI[i % 12]);

// 6 Xun heads (六甲旬首) and their concealed Yi (遁仪)
export const XUN_HEADS = [
  { xun: '甲子', yi: '戊', kong: ['戌', '亥'] },
  { xun: '甲戌', yi: '己', kong: ['申', '酉'] },
  { xun: '甲申', yi: '庚', kong: ['午', '未'] },
  { xun: '甲午', yi: '辛', kong: ['辰', '巳'] },
  { xun: '甲辰', yi: '壬', kong: ['寅', '卯'] },
  { xun: '甲寅', yi: '癸', kong: ['子', '丑'] },
];

// 24 Solar Terms -> Qimen ChaiBu Yin/Yang Dun & Upper/Middle/Lower Yuan Ju numbers
export const QIMEN_SOLAR_TERM_JU = {
  冬至: { dun: '阳遁', ju: [1, 7, 4] },
  小寒: { dun: '阳遁', ju: [2, 8, 5] },
  大寒: { dun: '阳遁', ju: [3, 9, 6] },
  立春: { dun: '阳遁', ju: [8, 5, 2] },
  雨水: { dun: '阳遁', ju: [9, 6, 3] },
  惊蛰: { dun: '阳遁', ju: [1, 7, 4] },
  春分: { dun: '阳遁', ju: [3, 9, 6] },
  清明: { dun: '阳遁', ju: [4, 1, 7] },
  谷雨: { dun: '阳遁', ju: [5, 2, 8] },
  立夏: { dun: '阳遁', ju: [4, 1, 7] },
  小满: { dun: '阳遁', ju: [5, 2, 8] },
  芒种: { dun: '阳遁', ju: [6, 3, 9] },
  夏至: { dun: '阴遁', ju: [9, 3, 6] },
  小暑: { dun: '阴遁', ju: [8, 2, 5] },
  大暑: { dun: '阴遁', ju: [7, 1, 4] },
  立秋: { dun: '阴遁', ju: [2, 5, 8] },
  处暑: { dun: '阴遁', ju: [1, 4, 7] },
  白露: { dun: '阴遁', ju: [9, 3, 6] },
  秋分: { dun: '阴遁', ju: [7, 1, 4] },
  寒露: { dun: '阴遁', ju: [6, 9, 3] },
  霜降: { dun: '阴遁', ju: [5, 8, 2] },
  立冬: { dun: '阴遁', ju: [6, 9, 3] },
  小雪: { dun: '阴遁', ju: [5, 8, 2] },
  大雪: { dun: '阴遁', ju: [4, 7, 1] },
};

// LuoShu Nine Palaces (洛书九宫)
export const LUOSHU_PALACES = {
  1: { num: 1, name: '坎一宫', trigram: '坎', symbol: '☵', direction: '正北', element: '水', branches: ['子'], baseStar: '天蓬', baseGate: '休门' },
  2: { num: 2, name: '坤二宫', trigram: '坤', symbol: '☷', direction: '西南', element: '土', branches: ['未', '申'], baseStar: '天芮', baseGate: '死门' },
  3: { num: 3, name: '震三宫', trigram: '震', symbol: '☳', direction: '正东', element: '木', branches: ['卯'], baseStar: '天冲', baseGate: '伤门' },
  4: { num: 4, name: '巽四宫', trigram: '巽', symbol: '☴', direction: '东南', element: '木', branches: ['辰', '巳'], baseStar: '天辅', baseGate: '杜门' },
  5: { num: 5, name: '中五宫', trigram: '中', symbol: '☯', direction: '中央', element: '土', branches: [], baseStar: '天禽', baseGate: '' },
  6: { num: 6, name: '乾六宫', trigram: '乾', symbol: '☰', direction: '西北', element: '金', branches: ['戌', '亥'], baseStar: '天心', baseGate: '开门' },
  7: { num: 7, name: '兑七宫', trigram: '兑', symbol: '☱', direction: '正西', element: '金', branches: ['酉'], baseStar: '天柱', baseGate: '惊门' },
  8: { num: 8, name: '艮八宫', trigram: '艮', symbol: '☶', direction: '东北', element: '土', branches: ['丑', '寅'], baseStar: '天任', baseGate: '生门' },
  9: { num: 9, name: '离九宫', trigram: '离', symbol: '☲', direction: '正南', element: '火', branches: ['午'], baseStar: '天英', baseGate: '景门' },
};

// Clockwise 8 outer palaces in ZhuanPan Qimen: 坎1 -> 艮8 -> 震3 -> 巽4 -> 离9 -> 坤2 -> 兑7 -> 乾6
export const QIMEN_RING_ORDER = [1, 8, 3, 4, 9, 2, 7, 6];

// Display grid order (3x3 LuoShu traditional South-on-top):
// [巽4, 离9, 坤2]
// [震3, 中5, 兑7]
// [艮8, 坎1, 乾6]
export const QIMEN_GRID_ORDER = [4, 9, 2, 3, 5, 7, 8, 1, 6];

export const QIMEN_GATES_INFO = {
  休门: { element: '水', nature: '吉门', summary: '休养生息、贵人相助、宜洽谈合作、求职拜访与休整调养。' },
  生门: { element: '土', nature: '大吉', summary: '生机勃发、求财营商、置业搬迁、开启新项目的首选吉门。' },
  伤门: { element: '木', nature: '凶门', summary: '竞争激烈、行动力强但易有磕碰争执，利讨债竞赛，忌温和求稳。' },
  杜门: { element: '木', nature: '平偏闭', summary: '闭塞隐藏、技术研发、保密防守，宜潜心钻研，不利高调推广。' },
  景门: { element: '火', nature: '中平偏吉', summary: '文书宣传、创意策划、考试面试、公开展示，主亮丽但也防虚浮。' },
  死门: { element: '土', nature: '凶门', summary: '停滞终结、宜复盘止损、了结旧事，忌启动重要喜事或投资。' },
  惊门: { element: '金', nature: '凶门', summary: '口舌官非、惊疑波动，利辩论律师演讲，日常决策需防焦虑误判。' },
  开门: { element: '金', nature: '大吉', summary: '豁达通畅、利开业升迁、公开行动、远行办事与展示实力。' },
};

export const QIMEN_STARS_INFO = {
  天蓬: { element: '水', nature: '凶星/大智慧', summary: '胆大谋略、善于变通，遇吉门主大财大计，遇凶门防冒险失度。' },
  天任: { element: '土', nature: '吉星', summary: '仁厚踏实、稳步积累、耕耘见效，利房产农业与长期稳健规划。' },
  天冲: { element: '木', nature: '吉星', summary: '雷厉风行、冲劲十足、快速决断，利开拓执行与救急突破。' },
  天辅: { element: '木', nature: '大吉', summary: '文昌教育、师长扶持、策划文化，利学习考试与体面谈判。' },
  天英: { element: '火', nature: '中平', summary: '光彩礼仪、社交传播、热情急躁，利形象品牌，防虎头蛇尾。' },
  天芮: { element: '土', nature: '病星/学星', summary: '主问题症结、健康调养、也主结交求学，提醒查漏补缺。' },
  天禽: { element: '土', nature: '大吉(中宫)', summary: '中正厚德、统领全局，常寄于坤二宫随天芮同行，主忠厚得助。' },
  天柱: { element: '金', nature: '凶星/口才', summary: '能言善辩、顶梁支撑，利演说审计，亦防口舌争执或破损。' },
  天心: { element: '金', nature: '大吉', summary: '医药管理、领导统筹、精明谋划，利决策规划、治病救难。' },
};

export const QIMEN_DEITIES_INFO = {
  值符: { nature: '吉神之首', summary: '百恶消散、贵人主事、代表核心领导、高层支持与事物大方向。' },
  腾蛇: { nature: '虚惊变化', summary: '缠绕反复、多思多虑、突发变数，提醒核实细节、避免被表象迷惑。' },
  太阴: { nature: '阴佑吉神', summary: '暗中相助、细腻策划、幕后贵人，宜低调筹谋、蓄力而发。' },
  六合: { nature: '和合吉神', summary: '合作共赢、婚恋中介、多方协调，利谈判签约、团队协作。' },
  白虎: { nature: '刚猛凶神', summary: '阻隔威严、突发刚烈、行动力猛，需防冲突、伤灾或硬碰硬。' },
  玄武: { nature: '暧昧暗耗', summary: '信息不明、玄妙智慧、也防欺瞒遗失，重在看清隐藏信息。' },
  九地: { nature: '稳守吉神', summary: '坤厚载物、低调坚守、长线布局，宜守不宜冒进，主持久稳固。' },
  九天: { nature: '高远吉神', summary: '志向远大、扬名出击、宜出行推广、大步迈进与开拓远方。' },
};

// Six Yi JiXing (六仪击刑): stem -> palaceNum where it suffers punishment
export const QIMEN_JIXING = {
  戊: 3, // 甲子戊落震三宫 (子卯刑)
  己: 2, // 甲戌己落坤二宫 (戌未刑)
  庚: 8, // 甲申庚落艮八宫 (申寅刑)
  辛: 9, // 甲午辛落离九宫 (午午自刑)
  壬: 4, // 甲辰壬落巽四宫 (辰辰自刑)
  癸: 4, // 甲寅癸落巽四宫 (寅巳刑)
};

// 《遁甲演义·三奇入墓》所引王璋取法。
export const QIMEN_RUMU = {
  乙: 2, // 未，坤二宫
  丙: 6, // 戌，乾六宫
  丁: 8, // 丑，艮八宫
};

// Meihua Yishu Congenital Bagua (先天八卦数 1-8)
export const BAGUA_LIST = [
  { num: 1, name: '乾', nature: '天', symbol: '☰', lines: [1, 1, 1], element: '金', direction: '西北', role: '父/领导/刚健', body: '头/骨', color: '白/金' },
  { num: 2, name: '兑', nature: '泽', symbol: '☱', lines: [1, 1, 0], element: '金', direction: '正西', role: '少女/口才/喜悦', body: '口/肺', color: '白/银' },
  { num: 3, name: '离', nature: '火', symbol: '☲', lines: [1, 0, 1], element: '火', direction: '正南', role: '中女/文明/亮丽', body: '目/心', color: '红/紫' },
  { num: 4, name: '震', nature: '雷', symbol: '☳', lines: [1, 0, 0], element: '木', direction: '正东', role: '长男/行动/震动', body: '足/肝', color: '青/绿' },
  { num: 5, name: '巽', nature: '风', symbol: '☴', lines: [0, 1, 1], element: '木', direction: '东南', role: '长女/顺入/传播', body: '股/胆', color: '碧/绿' },
  { num: 6, name: '坎', nature: '水', symbol: '☵', lines: [0, 1, 0], element: '水', direction: '正北', role: '中男/险陷/智慧', body: '耳/肾', color: '黑/蓝' },
  { num: 7, name: '艮', nature: '山', symbol: '☶', lines: [0, 0, 1], element: '土', direction: '东北', role: '少男/止稳/阻隔', body: '手/背', color: '黄/棕' },
  { num: 8, name: '坤', nature: '地', symbol: '☷', lines: [0, 0, 0], element: '土', direction: '西南', role: '母/包容/大众', body: '腹/脾', color: '黄/褐' },
];
// Note: lines are ordered bottom-to-top [yao1, yao2, yao3] (1=Yang solid —, 0=Yin broken - -)

export const BAGUA_BY_NUM = Object.fromEntries(BAGUA_LIST.map(g => [g.num, g]));
export const BAGUA_BY_LINES = Object.fromEntries(BAGUA_LIST.map(g => [g.lines.join(''), g]));

// Ziwei Doushu beginner glossaries
export const ZIWEI_PALACE_GLOSSARY = {
  命宫: '全盘核心：代表你的先天性格、核心气质、人生格局与处事底色。',
  兄弟: '代表手足情谊、亲密挚友、团队平级协作及现金流储备（财帛之田宅）。',
  夫妻: '代表感情观念、伴侣特质、亲密关系相处模式及长期合作契约。',
  子女: '代表子女缘分、创意输出、晚辈下属及投资合伙与享乐倾向。',
  财帛: '代表赚钱方式、理财习惯、资金流通与财富获取路径。',
  疾厄: '代表体质特点、压力承载点、情绪健康与潜意识状态。',
  迁移: '代表外出发展、社交第一印象、贵人机缘与环境适应力（命宫对宫）。',
  仆役: '（交友宫）代表朋友圈层、人脉助力、客户受众及下属支持度。',
  交友: '代表朋友圈层、人脉助力、客户受众及下属支持度。',
  官禄: '（事业宫）代表职业方向、工作风格、行业适配与职场成就感。',
  田宅: '代表家庭氛围、居住风水环境、不动产积累与资产“财库”。',
  福德: '代表精神世界、内在幸福感、兴趣爱好、消费观与长远福气。',
  父母: '代表长辈缘分、上级领导、学业文书与外在形象背书。',
};

export const ZIWEI_STAR_GLOSSARY = {
  紫微: '帝王之星：自带格局与尊严感，重统筹与品质，喜左辅右弼相助，忌孤高自守。',
  天机: '智慧军师：反应敏捷、点子多、善规划与学习，宜专注落地防思虑过多。',
  太阳: '博爱之光：热情坦荡、乐于奉献与照亮他人，主名声远播，留意劳逸平衡。',
  武曲: '正财实干：果决务实、重信用与执行力，擅长金融商业与专业技术变现。',
  天同: '福德享乐：温和善良、人缘极佳、懂得生活情趣，宜在舒适中保持进取目标。',
  廉贞: '次桃花/秩序星：魅力鲜明、公关与审美出众、有原则，宜走正轨发挥才华。',
  天府: '财库令星：稳重保守、善守成与管理资源，抗风险强，重安全感。',
  太阴: '温柔财星：细腻体贴、重审美与家庭田宅，善细水长流式积累财富。',
  贪狼: '多才欲望：兴趣广泛、社交魅力强、善开拓新领域与跨界资源整合。',
  巨门: '口才辨析：逻辑犀利、洞察细节、利教育咨询与专业研究，重温和表达。',
  天相: '印绶辅佐：公平体面、讲规矩重口碑、极具协调与服务管理天赋。',
  天梁: '荫庇长者：有侠义心与责任感、逢凶化吉、利医疗教育咨询与专业顾问。',
  七杀: '将星开创：敢闯敢拼、独立果敢、喜突破常规，历练后最易独当一面。',
  破军: '先锋变革：创意爆棚、破旧立新、执行决绝，适合前沿开拓与革新赛道。',
};

export const ZIWEI_MUTAGEN_GLOSSARY = {
  禄: '化禄：主财源顺畅、缘分加分、轻松得利与乐观机遇。',
  权: '化权：主掌控力、行动力、责任晋升与专业话语权。',
  科: '化科：主名声口碑、贵人解厄、考试文书与温和体面。',
  忌: '化忌：主执着课题、反复磨砺、能量收束，提醒此处需多耐心经营。',
};

// Five-Element generation/control helper
export function getWuXingRelation(fromEl, toEl) {
  if (fromEl === toEl) return { type: '比和', label: '同类相助', polarity: 'positive' };
  if (WU_XING_META[fromEl]?.generates === toEl) return { type: '相生', label: `${fromEl}生${toEl}`, polarity: 'give' };
  if (WU_XING_META[toEl]?.generates === fromEl) return { type: '受生', label: `${toEl}生${fromEl}`, polarity: 'receive' };
  if (WU_XING_META[fromEl]?.controls === toEl) return { type: '相克', label: `${fromEl}克${toEl}`, polarity: 'control' };
  if (WU_XING_META[toEl]?.controls === fromEl) return { type: '受克', label: `${toEl}克${fromEl}`, polarity: 'controlled' };
  return { type: '平和', label: '平和', polarity: 'neutral' };
}
