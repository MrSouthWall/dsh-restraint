/**
 * Browser client module for @local/dsh-zhiming (知命 · 风水玄学罗盘插件).
 * Generated from src/client/*.js via scripts/build-client.mjs.
 * Zero external runtime imports beyond browser-provided React.
 */
window.__ModuleLoader__.load({
  id: '@local/dsh-zhiming',
  factory(require) {
    const React = require('react');

    // --- src/client/locales.js ---
    const ZH_DICT = {
      'lang.code': 'zh',
      'brand.title': '知命 · 风水玄学罗盘',
      'brand.short': '知命罗盘',
      'brand.subtitle': '四柱八字 · 奇门遁甲 · 梅花易数 · 紫微斗数 · 双人合盘',
      'tab.title': '知命罗盘',
      'guide.title': '知命 · 风水玄学罗盘',
      'guide.description': '四柱八字、奇门遁甲、梅花易数、紫微斗数与合盘可视化工作台，支持与 DeepSeek 双向对话排盘与解读。',
      'nav.tutorial': '新手指南',
      'nav.bazi': '四柱八字',
      'nav.qimen': '奇门遁甲',
      'nav.meihua': '梅花易数',
      'nav.ziwei': '紫微斗数',
      'nav.hepan': '双人合盘',
      'action.cast': '立即排盘',
      'action.castNow': '此刻起局',
      'action.castHex': '起卦推演',
      'action.castHepan': '开始合盘',
      'action.demo': '新手演示',
      'action.askDeepSeek': '请 DeepSeek 深度解读',
      'action.askFocus': '问 DeepSeek 此项含义',
      'action.openStudio': '在知命罗盘中展开',
      'action.editInput': '修改参数 / 重新排盘',
      'action.hideInput': '收起参数表单',
      'action.beginnerOn': '白话提示：开',
      'action.beginnerOff': '白话提示：关',
      'action.themeLight': '浅色',
      'action.themeDark': '深色',
      'action.history': '历史盘面',
      'action.clearHistory': '清空',
      'action.confirmClear': '确认清空？',
      'action.tryPrompt': '点此发给 DeepSeek',
      'dock.empty': '知命罗盘 · 打开工作台与新手教程',
      'dock.open': '打开罗盘',
      'dock.ask': '请 DeepSeek 解读',
      'status.casting': '正在排盘推演中...',
      'status.sending': '发送中...',
      'status.sentPrompt': '已发送解读请求给 DeepSeek',
      'status.syncError': '同步失败，请稍后重试',
      'status.cmdMissing': '未检测到 /zhiming 宿主指令，请确认插件已启用并重启 DSH',
      'status.noCommandChannel': '当前会话暂不支持命令执行通道',
      'status.noPromptChannel': '未找到当前会话发送通道，请直接在左侧输入框向 DeepSeek 提问',
      'tool.charting': '知命罗盘正在排盘计算...',
      'tool.chartError': '知命排盘未成功',
      'tool.reading': 'DeepSeek 正在读取知命罗盘当前盘面...',
      'tool.readDone': 'DeepSeek 已读取知命罗盘数据，正在为你解读',
      'tool.readError': '读取知命罗盘数据失败',
      'cmd.synced': '已在知命罗盘排盘并同步给 DeepSeek',
      'cmd.focused': '已同步知命罗盘当前查看焦点',
      'cmd.cleared': '已清空本次会话盘面记录',
      'cmd.help': '知命指令帮助',
      'form.birthDate': '出生日期',
      'form.birthTime': '出生时间',
      'form.gender': '性别',
      'form.male': '男命（乾造）',
      'form.female': '女命（坤造）',
      'form.calendar': '历法',
      'form.solar': '公历（阳历）',
      'form.lunar': '农历（阴历）',
      'form.lunarYear': '农历年',
      'form.lunarMonth': '农历月',
      'form.lunarDay': '农历日',
      'form.leapMonth': '闰月',
      'form.name': '称呼（可选）',
      'form.question': '关注方向（可选）',
      'form.advancedTst': '高级：真太阳时（出生地经度）',
      'form.longitudeOff': '不修正（按北京时间 120°E）',
      'form.qimenDate': '起局日期',
      'form.qimenTime': '起局时刻',
      'form.qimenQuestion': '所问事项（建议填写，便于定用神）',
      'form.hepanPersonA': '甲方信息',
      'form.hepanPersonB': '乙方信息',
      'form.hepanQuestion': '想重点了解的问题（可选）',
      'form.searchGlossary': '搜索术语，如：四化',
      'empty.baziTitle': '尚未排出四柱八字',
      'empty.baziDesc': '在上方输入出生时间排盘，点击「新手演示」，或直接告诉 DeepSeek 你的生辰。',
      'empty.qimenTitle': '尚未起奇门遁甲局',
      'empty.qimenDesc': '点击「此刻起局」立即排算当下时家奇门九宫，或在对话中让 DeepSeek 为你起局。',
      'empty.meihuaTitle': '尚未起梅花易数卦',
      'empty.meihuaDesc': '默念心中一事，随口报两个数字或点击「灵感一卦」，3 秒看清起承转合。',
      'empty.ziweiTitle': '尚未排出紫微斗数命盘',
      'empty.ziweiDesc': '输入出生时间即可生成传统十二宫星盘与三方四正动态星线。',
      'empty.hepanTitle': '尚未生成双人合盘报告',
      'empty.hepanDesc': '支持恋爱婚姻、事业合伙、挚友亲子三种合盘模式，一键体验双引擎六维雷达。',
      'glossary.empty': '词典暂未收录该词条，可直接让 DeepSeek 为你白话解释：',
      'error.boundary': '知命视图渲染遇到异常，请点击重置恢复。',
      'error.reset': '重新加载视图',
    };

    const EN_DICT = {
      'lang.code': 'en',
      'brand.title': 'ZhiMing · Feng Shui studio',
      'brand.short': 'ZhiMing',
      'brand.subtitle': 'Bazi · Qimen Dunjia · Meihua Yishu · Ziwei Doushu · Synastry',
      'tab.title': 'ZhiMing studio',
      'guide.title': 'ZhiMing Feng Shui studio',
      'guide.description': 'Interactive Bazi, Qimen Dunjia, Meihua Yishu, Ziwei Doushu, and synastry studio with bidirectional DeepSeek chat integration.',
      'nav.tutorial': 'Beginner guide',
      'nav.bazi': 'Four pillars',
      'nav.qimen': 'Qimen Dunjia',
      'nav.meihua': 'Meihua Yishu',
      'nav.ziwei': 'Ziwei Doushu',
      'nav.hepan': 'Synastry',
      'action.cast': 'Cast chart',
      'action.castNow': 'Cast for now',
      'action.castHex': 'Cast hexagram',
      'action.castHepan': 'Run synastry',
      'action.demo': 'Load demo',
      'action.askDeepSeek': 'Ask DeepSeek to interpret',
      'action.askFocus': 'Ask DeepSeek about this',
      'action.openStudio': 'Open in ZhiMing studio',
      'action.editInput': 'Edit parameters / Recast',
      'action.hideInput': 'Hide form',
      'action.beginnerOn': 'Beginner tips: on',
      'action.beginnerOff': 'Beginner tips: off',
      'action.themeLight': 'Light',
      'action.themeDark': 'Dark',
      'action.history': 'History',
      'action.clearHistory': 'Clear',
      'action.confirmClear': 'Confirm clear?',
      'action.tryPrompt': 'Send to DeepSeek',
      'dock.empty': 'ZhiMing studio · Open workbench & beginner guide',
      'dock.open': 'Open studio',
      'dock.ask': 'Ask DeepSeek',
      'status.casting': 'Calculating chart...',
      'status.sending': 'Sending...',
      'status.sentPrompt': 'Sent interpretation request to DeepSeek',
      'status.syncError': 'Sync failed. Please retry.',
      'status.cmdMissing': 'Host /zhiming command was not found. Enable the plugin and restart DSH if updated.',
      'status.noCommandChannel': 'This session does not expose a command execution channel.',
      'status.noPromptChannel': 'Session prompt channel unavailable. Ask DeepSeek directly in the chat box.',
      'tool.charting': 'ZhiMing studio is calculating the chart...',
      'tool.chartError': 'Chart calculation failed',
      'tool.reading': 'DeepSeek is reading the active chart from ZhiMing studio...',
      'tool.readDone': 'DeepSeek read your active ZhiMing chart data',
      'tool.readError': 'Failed to read ZhiMing chart data',
      'cmd.synced': 'Chart cast in ZhiMing studio and synced for DeepSeek',
      'cmd.focused': 'Synced active focus in ZhiMing studio',
      'cmd.cleared': 'Cleared session chart history',
      'cmd.help': 'ZhiMing command help',
      'form.birthDate': 'Birth date',
      'form.birthTime': 'Birth time',
      'form.gender': 'Gender',
      'form.male': 'Male (男)',
      'form.female': 'Female (女)',
      'form.calendar': 'Calendar',
      'form.solar': 'Solar (Gregorian)',
      'form.lunar': 'Lunar (Chinese)',
      'form.lunarYear': 'Lunar year',
      'form.lunarMonth': 'Lunar month',
      'form.lunarDay': 'Lunar day',
      'form.leapMonth': 'Leap month',
      'form.name': 'Label / name (optional)',
      'form.question': 'Focus / question (optional)',
      'form.advancedTst': 'Advanced: True solar time (longitude)',
      'form.longitudeOff': 'None (Beijing 120°E standard)',
      'form.qimenDate': 'Date',
      'form.qimenTime': 'Time',
      'form.qimenQuestion': 'Question or decision topic (recommended)',
      'form.hepanPersonA': 'Person A',
      'form.hepanPersonB': 'Person B',
      'form.hepanQuestion': 'Relationship focus / question (optional)',
      'form.searchGlossary': 'Search term...',
      'empty.baziTitle': 'No Four Pillars chart yet',
      'empty.baziDesc': 'Enter a birth date above, load the beginner demo, or tell DeepSeek your birth date in chat.',
      'empty.qimenTitle': 'No Qimen Dunjia chart yet',
      'empty.qimenDesc': 'Click Cast for now to compute the current hour LuoShu nine-palace chart, or ask DeepSeek.',
      'empty.meihuaTitle': 'No Meihua hexagram yet',
      'empty.meihuaDesc': 'Hold one question in mind, enter two numbers or click random cast for an instant reading.',
      'empty.ziweiTitle': 'No Ziwei Doushu astrolabe yet',
      'empty.ziweiDesc': 'Enter birth details to generate the 12-palace astrolabe with interactive Tri-Aspect lines.',
      'empty.hepanTitle': 'No synastry report yet',
      'empty.hepanDesc': 'Compare two birth charts across 6 dimensions for love, business, or family harmony.',
      'glossary.empty': 'Not found in built-in glossary. Ask DeepSeek for a plain explanation:',
      'error.boundary': 'ZhiMing view encountered an error. Reset to recover.',
      'error.reset': 'Reset view',
    };

    const CITY_LONGITUDES = [
      { label: '不修正（北京时间 120°E）', value: '' },
      { label: '北京 (116.4°E)', value: '116.4' },
      { label: '上海 (121.5°E)', value: '121.5' },
      { label: '广州 / 深圳 (113.3°E)', value: '113.3' },
      { label: '成都 / 重庆 (104.1°E)', value: '104.1' },
      { label: '西安 (108.9°E)', value: '108.9' },
      { label: '武汉 (114.3°E)', value: '114.3' },
      { label: '杭州 (120.2°E)', value: '120.2' },
      { label: '沈阳 / 哈尔滨 (125.0°E)', value: '125.0' },
      { label: '乌鲁木齐 (87.6°E)', value: '87.6' },
    ];

    const WUXING_STYLE = {
      木: { color: 'var(--zm-green)', soft: 'rgba(16,185,129,0.13)', border: 'rgba(16,185,129,0.42)', label: '木 · Wood', dir: '正东/东南', trait: '生发、仁善、成长与创意' },
      火: { color: 'var(--zm-red)', soft: 'rgba(239,68,68,0.13)', border: 'rgba(239,68,68,0.42)', label: '火 · Fire', dir: '正南', trait: '光明、热情、表达与行动' },
      土: { color: 'var(--zm-amber)', soft: 'rgba(217,119,6,0.14)', border: 'rgba(217,119,6,0.42)', label: '土 · Earth', dir: '中宫/四隅', trait: '厚重、诚信、包容与承载' },
      金: { color: 'var(--zm-gold)', soft: 'rgba(202,138,4,0.14)', border: 'rgba(202,138,4,0.44)', label: '金 · Metal', dir: '正西/西北', trait: '果断、义气、秩序与执行' },
      水: { color: 'var(--zm-blue)', soft: 'rgba(59,130,246,0.13)', border: 'rgba(59,130,246,0.42)', label: '水 · Water', dir: '正北', trait: '智慧、变通、洞察与人脉' },
    };

    const MUTAGEN_COLOR = {
      禄: { bg: 'rgba(16,185,129,0.15)', fg: 'var(--zm-green)', border: 'rgba(16,185,129,0.48)', desc: '化禄：财源顺畅、缘分加分' },
      权: { bg: 'rgba(217,119,6,0.15)', fg: 'var(--zm-amber)', border: 'rgba(217,119,6,0.48)', desc: '化权：掌控力、晋升与行动力' },
      科: { bg: 'rgba(59,130,246,0.15)', fg: 'var(--zm-blue)', border: 'rgba(59,130,246,0.48)', desc: '化科：名声口碑、贵人解厄' },
      忌: { bg: 'rgba(239,68,68,0.15)', fg: 'var(--zm-red)', border: 'rgba(239,68,68,0.48)', desc: '化忌：执着课题、需多耐心经营' },
    };

    const SYSTEM_TABS = [
      { id: 'tutorial', icon: '✦', labelKey: 'nav.tutorial', accent: 'var(--zm-gold)' },
      { id: 'bazi', icon: '柱', labelKey: 'nav.bazi', accent: 'var(--zm-green)' },
      { id: 'qimen', icon: '遁', labelKey: 'nav.qimen', accent: 'var(--zm-indigo)' },
      { id: 'meihua', icon: '卦', labelKey: 'nav.meihua', accent: 'var(--zm-red)' },
      { id: 'ziwei', icon: '星', labelKey: 'nav.ziwei', accent: 'var(--zm-purple)' },
      { id: 'hepan', icon: '合', labelKey: 'nav.hepan', accent: 'var(--zm-pink)' },
    ];

    const CLIENT_TUTORIAL_DATA = {
      quickPrompts: [
        {
          system: 'bazi',
          tag: '四柱八字',
          title: '测生辰八字与家居五行',
          prompt: '帮我排一下 1995年5月18日早上8点30分男命的四柱八字，用白话讲讲我的日主性格、喜用神和家居五行布置建议。',
        },
        {
          system: 'qimen',
          tag: '奇门遁甲',
          title: '测今日行动与有利方位',
          prompt: '用奇门遁甲起一个现在的时家拆补局，帮我看看今天谈重要合作顺不顺利、朝哪个方位最有利。',
        },
        {
          system: 'meihua',
          tag: '梅花易数',
          title: '报数速断换工作/做选择',
          prompt: '我心想数字 3 和 7，请用梅花易数帮我起一卦问近期换赛道或新项目是否顺利，讲清体用生克和行动建议。',
        },
        {
          system: 'ziwei',
          tag: '紫微斗数',
          title: '看紫微十二宫与四化',
          prompt: '帮我排一下 1998年3月12日21点30分女命的紫微斗数命盘，重点解读命宫、官禄宫、财帛宫和生年四化。',
        },
        {
          system: 'hepan',
          tag: '双人合盘',
          title: '看恋爱/合伙六维合盘',
          prompt: '帮我做一份恋爱合盘：甲方 1995-05-18 08:30 男，乙方 1998-03-12 21:30 女，分析我们的五行互补和相处小建议。',
        },
      ],
      systemGuide: [
        {
          id: 'bazi',
          name: '四柱八字 (Bazi)',
          scene: '看人生底色、五行平衡、喜用神与每十年大运起伏',
          need: '出生年月日时 + 性别',
          keyTip: '先看「日主」代表自己，再看「喜用神」找最旺你的颜色、行业和家居方位。',
        },
        {
          id: 'qimen',
          name: '奇门遁甲 (Qimen Dunjia)',
          scene: '看具体决策时机、合作签约、面试出行与吉凶方位',
          need: '当下时间或约定时间 + 所问之事',
          keyTip: '重点找「开、休、生」三吉门所落方位，留意值符（贵人）与值使（进度）。',
        },
        {
          id: 'meihua',
          name: '梅花易数 (Meihua Yishu)',
          scene: '突发灵感想快速拿主意、问单件事的起承转合',
          need: '当下时间 / 随口报两个数 / 输入关键词',
          keyTip: '记住「本卦看现状、互卦看过程、变卦看结局」，体卦是自己、用卦是事情。',
        },
        {
          id: 'ziwei',
          name: '紫微斗数 (Ziwei Doushu)',
          scene: '像地图一样细看人生十二大领域（事业/财运/感情/田宅等）',
          need: '出生年月日时 + 性别',
          keyTip: '点选任意一宫，金色连线会标出「三方四正」；禄权科忌四化是全盘重点。',
        },
        {
          id: 'hepan',
          name: '双人合盘 (Synastry)',
          scene: '评估恋爱婚姻、创业合伙、亲子挚友的天然默契与磨合点',
          need: '双方出生年月日时 + 关系类型',
          keyTip: '合盘不是判决书，而是提前看清“天然省力区”和“需要刻意沟通的磨合区”。',
        },
      ],
      shichenTable: [
        ['子时', '23:00-01:00', '水', '鼠'],
        ['丑时', '01:00-03:00', '土', '牛'],
        ['寅时', '03:00-05:00', '木', '虎'],
        ['卯时', '05:00-07:00', '木', '兔'],
        ['辰时', '07:00-09:00', '土', '龙'],
        ['巳时', '09:00-11:00', '火', '蛇'],
        ['午时', '11:00-13:00', '火', '马'],
        ['未时', '13:00-15:00', '土', '羊'],
        ['申时', '15:00-17:00', '金', '猴'],
        ['酉时', '17:00-19:00', '金', '鸡'],
        ['戌时', '19:00-21:00', '土', '狗'],
        ['亥时', '21:00-23:00', '水', '猪'],
      ],
      glossary: [
        ['日主', '八字中日柱的天干，代表「你自己」，整张盘围绕日主展开。'],
        ['喜用神', '能让你的五行趋于平衡流通的关键元素，对应最助运的颜色与方位。'],
        ['十神', '以日主为中心划分的十种社会角色：比劫(朋友)、食伤(才华)、财(资源)、官杀(事业)、印(贵人学识)。'],
        ['大运/流年', '大运是每 10 年切换的人生大阶段，流年是具体某一年的事件触发器。'],
        ['值符/值使', '奇门遁甲里的“总司令(贵人/大势)”与“执行官(行动/落地节奏)”。'],
        ['三吉门', '奇门中的开门(通畅)、休门(贵人)、生门(生机求财)，其落宫方位最利行动。'],
        ['空亡/门迫', '奇门提示能量暂虚(空亡)或受阻费力(门迫)，提醒放缓节奏或另寻良机。'],
        ['体用生克', '梅花易数核心：无动爻为体(自己)，有动爻为用(事情)。用生体、比和最吉。'],
        ['本/互/变卦', '梅花易数三阶段：本卦是当下起点，互卦是中间隐情，变卦是最终走向。'],
        ['三方四正', '紫微看盘法则：看任何一宫，都要结合对宫与两个三合宫联动判断。'],
        ['生年四化', '化禄(顺畅得利)、化权(掌控执行)、化科(名声贵人)、化忌(执着课题)。'],
        ['天合地合', '合盘中双方日柱天干五合、地支六合，代表先天磁场极其投契。'],
        ['八宅命卦', '按出生年份与性别分为东四命与西四命，对应个人四大吉位（生气财位、天医健康、延年人脉、伏位文昌）。'],
        ['九宫飞星', '玄空风水每年飞临房屋九大方位的一白至九紫九颗流年星，下元九运（2024–2043）以九紫最当旺。'],
        ['奇门格局', '天盘干与地盘干组合形成的经典吉凶象意，如青龙返首、飞鸟跌穴大吉，伏吟宜守、反吟宜速。'],
      ],
    };

    // --- src/client/styles.js ---
    const ZHIMING_CSS = `
    /* =========================================================================
       ZhiMing Dual-Theme Cohesive Design System
       - Light Mode (data-zm-theme="light"): Imperial Xuan-Paper & Bronze Gold
       - Dark Mode  (data-zm-theme="dark") : Obsidian Starfield & Celestial Gold
       ========================================================================= */

    .zm-root, .zm-dock-wrap, .zm-chat-card {
      --zm-bg: #faf7f0;
      --zm-surface: #ffffff;
      --zm-surface-soft: #f4eee2;
      --zm-border: rgba(176, 134, 62, 0.24);
      --zm-border-strong: rgba(176, 134, 62, 0.50);
      --zm-text: #1c2230;
      --zm-text-sub: #4c5569;
      --zm-text-muted: #788194;
      --zm-stage-bg: radial-gradient(circle at 50% 44%, #fffef9 0%, #f7f0e2 56%, #ece1cc 100%);
      --zm-stage-border: rgba(180, 136, 56, 0.42);
      --zm-stage-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.8), 0 12px 32px rgba(130, 96, 38, 0.11);
      --zm-stage-bracket: rgba(168, 120, 38, 0.55);
      --zm-glass: rgba(255, 253, 248, 0.86);
      --zm-glass-border: rgba(176, 134, 62, 0.30);
      --zm-gold: #9a6700;
      --zm-gold-bright: #c58f24;
      --zm-green: #047857;
      --zm-red: #c81e3a;
      --zm-amber: #b45309;
      --zm-blue: #1d4ed8;
      --zm-indigo: #4338ca;
      --zm-purple: #7c3aed;
      --zm-pink: #be185d;
      --zm-btn-gold-bg: linear-gradient(135deg, #b57c18, #8c5a09);
      --zm-btn-gold-hover: linear-gradient(135deg, #c78b1e, #9c660e);
      --zm-bar-track: rgba(154, 103, 0, 0.10);
    }

    @media (prefers-color-scheme: dark) {
      .zm-dock-wrap, .zm-chat-card {
        --zm-bg: #080c17;
        --zm-surface: #101627;
        --zm-surface-soft: #151e34;
        --zm-border: rgba(240, 201, 117, 0.20);
        --zm-border-strong: rgba(240, 201, 117, 0.45);
        --zm-text: #f3f5fa;
        --zm-text-sub: #c2cadc;
        --zm-text-muted: #8b96b2;
        --zm-gold: #f0c975;
        --zm-gold-bright: #fae2a0;
        --zm-green: #34d399;
        --zm-red: #fb7185;
        --zm-amber: #fbbf24;
        --zm-blue: #60a5fa;
        --zm-indigo: #a5b4fc;
        --zm-purple: #d8b4fe;
        --zm-pink: #f472b6;
      }
    }

    html[data-theme="dark"] .zm-dock-wrap,
    html[data-theme="dark"] .zm-chat-card,
    .dark .zm-dock-wrap,
    .dark .zm-chat-card {
      --zm-bg: #080c17;
      --zm-surface: #101627;
      --zm-surface-soft: #151e34;
      --zm-border: rgba(240, 201, 117, 0.20);
      --zm-border-strong: rgba(240, 201, 117, 0.45);
      --zm-text: #f3f5fa;
      --zm-text-sub: #c2cadc;
      --zm-text-muted: #8b96b2;
      --zm-gold: #f0c975;
      --zm-gold-bright: #fae2a0;
      --zm-green: #34d399;
      --zm-red: #fb7185;
      --zm-amber: #fbbf24;
      --zm-blue: #60a5fa;
      --zm-indigo: #a5b4fc;
      --zm-purple: #d8b4fe;
      --zm-pink: #f472b6;
    }

    .zm-root[data-zm-theme="dark"] {
      --zm-bg: #080c17;
      --zm-surface: #0f1526;
      --zm-surface-soft: #151e34;
      --zm-border: rgba(240, 201, 117, 0.18);
      --zm-border-strong: rgba(240, 201, 117, 0.44);
      --zm-text: #f3f5fa;
      --zm-text-sub: #c2cadc;
      --zm-text-muted: #8894b0;
      --zm-stage-bg: radial-gradient(circle at 50% 44%, #141d3a 0%, #0b1023 56%, #070a15 100%);
      --zm-stage-border: rgba(240, 201, 117, 0.34);
      --zm-stage-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05), 0 14px 36px rgba(0, 0, 0, 0.56);
      --zm-stage-bracket: rgba(240, 201, 117, 0.52);
      --zm-glass: rgba(11, 16, 33, 0.80);
      --zm-glass-border: rgba(240, 201, 117, 0.28);
      --zm-gold: #f0c975;
      --zm-gold-bright: #fae2a0;
      --zm-green: #34d399;
      --zm-red: #fb7185;
      --zm-amber: #fbbf24;
      --zm-blue: #60a5fa;
      --zm-indigo: #a5b4fc;
      --zm-purple: #d8b4fe;
      --zm-pink: #f472b6;
      --zm-btn-gold-bg: linear-gradient(135deg, #c48a20, #8f5e0c);
      --zm-btn-gold-hover: linear-gradient(135deg, #d89b28, #a46d12);
      --zm-bar-track: rgba(255, 255, 255, 0.09);
      color-scheme: dark;
    }

    .zm-root[data-zm-theme="light"] {
      color-scheme: light;
    }

    @keyframes zm-spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes zm-spin-rev {
      from { transform: rotate(360deg); }
      to { transform: rotate(0deg); }
    }
    @keyframes zm-pulse-glow {
      0%, 100% { opacity: 0.72; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.06); }
    }
    @keyframes zm-fade-up {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes zm-dash-flow {
      from { stroke-dashoffset: 36; }
      to { stroke-dashoffset: 0; }
    }
    @keyframes zm-twinkle {
      0%, 100% { opacity: 0.24; }
      50% { opacity: 0.94; }
    }
    @keyframes zm-aura-breathe {
      0%, 100% { opacity: 0.56; transform: scale(0.985); }
      50% { opacity: 1; transform: scale(1.025); }
    }

    @media (prefers-reduced-motion: reduce) {
      .zm-spin-slow, .zm-spin-rev, .zm-pulse-glow, .zm-animate, .zm-chat-card, .zm-dash-flow, .zm-twinkle, .zm-aura {
        animation: none !important;
        transition: none !important;
      }
    }

    .zm-spin-slow { animation: zm-spin-slow 46s linear infinite; transform-box: fill-box; transform-origin: center; }
    .zm-spin-rev { animation: zm-spin-rev 62s linear infinite; transform-box: fill-box; transform-origin: center; }
    .zm-pulse-glow { animation: zm-pulse-glow 2.4s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
    .zm-dash-flow { animation: zm-dash-flow 1.8s linear infinite; }
    .zm-twinkle { animation: zm-twinkle 3.4s ease-in-out infinite; }
    .zm-aura { animation: zm-aura-breathe 3.8s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }

    /* Root Layout */
    .zm-root {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
      container-type: inline-size;
      background: var(--zm-bg);
      color: var(--zm-text);
      font-size: 13px;
      line-height: 1.5;
      overflow: hidden;
      position: relative;
      transition: background-color 0.22s ease, color 0.22s ease;
    }

    .zm-root * { box-sizing: border-box; }

    .zm-btn:focus-visible,
    .zm-nav-pill:focus-visible,
    .zm-dock-main:focus-visible,
    .zm-dayun-pill:focus-visible,
    .zm-qimen-cell:focus-visible,
    .zm-hex-card:focus-visible,
    .zm-zw-cell:focus-visible,
    .zm-bar-row:focus-visible,
    .zm-stage-tab:focus-visible,
    .zm-theme-seg button:focus-visible {
      outline: 2px solid var(--zm-gold-bright);
      outline-offset: 2px;
    }

    /* Header & Navigation */
    .zm-hero-bar {
      position: relative;
      padding: 10px 14px 9px;
      border-bottom: 1px solid var(--zm-border);
      background: var(--zm-surface);
      flex-shrink: 0;
    }

    .zm-hero-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      flex-wrap: wrap;
    }

    .zm-brand-wrap {
      display: flex;
      align-items: center;
      gap: 9px;
      min-width: 0;
    }

    .zm-brand-title {
      font-size: 14.5px;
      font-weight: 800;
      letter-spacing: 0.03em;
      color: var(--zm-text);
    }

    .zm-brand-sub {
      font-size: 10.5px;
      color: var(--zm-text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .zm-hero-actions {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }

    /* Light / Dark Theme Segmented Switch */
    .zm-theme-seg {
      display: inline-flex;
      padding: 2px;
      border-radius: 999px;
      background: var(--zm-surface-soft);
      border: 1px solid var(--zm-border);
      gap: 2px;
    }
    .zm-theme-seg button {
      padding: 2px 8px;
      border-radius: 999px;
      border: none;
      background: transparent;
      color: var(--zm-text-muted);
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.16s ease;
    }
    .zm-theme-seg button.zm-on {
      background: var(--zm-surface);
      color: var(--zm-gold);
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
    }

    .zm-nav {
      display: flex;
      gap: 5px;
      margin-top: 8px;
      overflow-x: auto;
      padding-bottom: 2px;
      scrollbar-width: none;
    }
    .zm-nav::-webkit-scrollbar { display: none; }

    .zm-nav-pill {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 10px;
      border-radius: 999px;
      border: 1px solid var(--zm-border);
      background: var(--zm-surface-soft);
      color: var(--zm-text-sub);
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.16s ease;
    }
    .zm-nav-pill:hover {
      border-color: var(--zm-border-strong);
      color: var(--zm-text);
    }
    .zm-nav-pill.zm-active {
      background: color-mix(in srgb, var(--zm-accent, var(--zm-gold)) 16%, var(--zm-surface));
      border-color: color-mix(in srgb, var(--zm-accent, var(--zm-gold)) 58%, var(--zm-border));
      color: var(--zm-text);
    }

    .zm-nav-glyph {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 17px;
      height: 17px;
      border-radius: 50%;
      font-size: 10px;
      font-weight: 800;
      background: color-mix(in srgb, var(--zm-accent, var(--zm-gold)) 18%, transparent);
      color: var(--zm-accent, var(--zm-gold));
    }

    .zm-body {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      padding: 12px 14px 16px;
      display: flex;
      flex-direction: column;
      gap: 11px;
    }

    .zm-animate { animation: zm-fade-up 0.24s ease-out; }

    /* =========================================================================
       Monumental Pure-Visual Showcase Canvas (Cohesive in BOTH Light & Dark!)
       ========================================================================= */
    .zm-canvas {
      position: relative;
      border-radius: 16px;
      padding: 12px;
      background: var(--zm-stage-bg);
      border: 1px solid var(--zm-stage-border);
      box-shadow: var(--zm-stage-shadow);
      color: var(--zm-text);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    /* Engraved corner hairline brackets */
    .zm-canvas::before, .zm-canvas::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      border-color: var(--zm-stage-bracket);
      border-style: solid;
      pointer-events: none;
      z-index: 3;
    }
    .zm-canvas::before {
      top: 7px; left: 7px;
      border-width: 1.5px 0 0 1.5px;
      border-top-left-radius: 4px;
    }
    .zm-canvas::after {
      bottom: 7px; right: 7px;
      border-width: 0 1.5px 1.5px 0;
      border-bottom-right-radius: 4px;
    }

    .zm-canvas-bar {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      flex-wrap: wrap;
      position: relative;
      z-index: 3;
    }

    .zm-canvas-artwork {
      width: 100%;
      max-width: 440px;
      margin: 0 auto;
      position: relative;
      z-index: 2;
    }

    .zm-stage-tabs {
      display: inline-flex;
      gap: 3px;
      padding: 2.5px;
      border-radius: 999px;
      background: var(--zm-glass);
      border: 1px solid var(--zm-glass-border);
      backdrop-filter: blur(8px);
    }
    .zm-stage-tab {
      padding: 3px 9px;
      border-radius: 999px;
      border: none;
      background: transparent;
      color: var(--zm-text-sub);
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
    }
    .zm-stage-tab:hover { color: var(--zm-text); }
    .zm-stage-tab.zm-on {
      background: color-mix(in srgb, var(--zm-gold-bright) 24%, transparent);
      color: var(--zm-gold);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--zm-gold-bright) 48%, transparent);
    }

    .zm-canvas-footer {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      flex-wrap: wrap;
      position: relative;
      z-index: 3;
    }

    .zm-glass-pill {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 600;
      background: var(--zm-glass);
      border: 1px solid var(--zm-glass-border);
      color: var(--zm-text);
      backdrop-filter: blur(8px);
    }

    /* Cards & Controls */
    .zm-card {
      background: var(--zm-surface);
      border: 1px solid var(--zm-border);
      border-radius: 12px;
      padding: 11px 13px;
      position: relative;
    }

    .zm-card-title {
      font-size: 12.5px;
      font-weight: 700;
      color: var(--zm-text);
      margin: 0 0 8px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      flex-wrap: wrap;
    }

    .zm-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      padding: 6px 11px;
      border-radius: 8px;
      border: 1px solid var(--zm-border-strong);
      background: var(--zm-surface);
      color: var(--zm-text);
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
    }
    .zm-btn:hover:not(:disabled) {
      background: var(--zm-surface-soft);
      border-color: var(--zm-gold-bright);
    }
    .zm-btn:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }

    .zm-btn-primary {
      background: color-mix(in srgb, var(--zm-gold-bright) 18%, var(--zm-surface));
      color: var(--zm-gold);
      border-color: var(--zm-gold-bright);
    }

    .zm-btn-gold {
      background: var(--zm-btn-gold-bg);
      color: #ffffff;
      border-color: rgba(255, 255, 255, 0.18);
      font-weight: 600;
    }
    .zm-btn-gold:hover:not(:disabled) {
      background: var(--zm-btn-gold-hover);
      color: #ffffff;
    }

    .zm-btn-sm {
      padding: 4px 8px;
      font-size: 11px;
      border-radius: 7px;
    }

    .zm-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 600;
      border: 1px solid var(--zm-border);
      background: var(--zm-surface-soft);
      color: var(--zm-text-sub);
    }

    .zm-tip-banner {
      border-radius: 10px;
      padding: 8px 11px;
      border: 1px solid var(--zm-border);
      background: color-mix(in srgb, var(--zm-gold-bright) 8%, var(--zm-surface));
      font-size: 11.5px;
      color: var(--zm-text-sub);
    }
    .zm-tip-banner strong { color: var(--zm-text); }

    /* Collapsible details summary */
    .zm-details {
      border: 1px solid var(--zm-border);
      border-radius: 12px;
      background: var(--zm-surface);
      overflow: hidden;
    }
    .zm-details > summary {
      list-style: none;
      cursor: pointer;
      padding: 9px 13px;
      font-size: 12px;
      font-weight: 700;
      color: var(--zm-text);
      display: flex;
      align-items: center;
      justify-content: space-between;
      user-select: none;
    }
    .zm-details > summary::-webkit-details-marker { display: none; }
    .zm-details[open] > summary {
      border-bottom: 1px solid var(--zm-border);
    }
    .zm-details-body {
      padding: 11px 13px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    /* Forms */
    .zm-form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 8px;
    }
    .zm-field {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .zm-field label {
      font-size: 11px;
      font-weight: 600;
      color: var(--zm-text-muted);
    }
    .zm-input, .zm-select {
      width: 100%;
      padding: 6px 8px;
      border-radius: 7px;
      border: 1px solid var(--zm-border-strong);
      background: var(--zm-bg);
      color: var(--zm-text);
      font-size: 12px;
      outline: none;
    }
    .zm-input:focus, .zm-select:focus {
      border-color: var(--zm-gold-bright);
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--zm-gold-bright) 22%, transparent);
    }
    .zm-lunar-row {
      display: grid;
      grid-template-columns: 1.2fr 1fr 1fr auto;
      gap: 6px;
      align-items: end;
      grid-column: 1 / -1;
    }
    .zm-check-label {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: var(--zm-text-sub);
      padding-bottom: 6px;
      cursor: pointer;
      white-space: nowrap;
    }
    .zm-form-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-top: 10px;
      flex-wrap: wrap;
    }

    /* Five Elements & Progress Bars */
    .zm-wuxing-grid {
      display: grid;
      grid-template-columns: 146px 1fr;
      gap: 12px;
      align-items: center;
    }
    .zm-bar-row {
      width: 100%;
      display: grid;
      grid-template-columns: 40px 1fr 38px;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      background: none;
      border: none;
      padding: 2px 0;
      color: inherit;
      cursor: pointer;
      text-align: left;
      font-family: inherit;
    }
    .zm-bar-track {
      height: 7px;
      border-radius: 999px;
      background: var(--zm-bar-track);
      overflow: hidden;
    }
    .zm-bar-fill {
      height: 100%;
      border-radius: 999px;
      transition: width 0.45s cubic-bezier(0.22, 1, 0.36, 1);
    }

    /* DaYun Timeline */
    .zm-dayun-strip {
      display: flex;
      gap: 6px;
      overflow-x: auto;
      padding-bottom: 4px;
    }
    .zm-dayun-pill {
      flex: 0 0 auto;
      min-width: 62px;
      padding: 6px 8px;
      border-radius: 9px;
      border: 1px solid var(--zm-border);
      background: var(--zm-bg);
      color: inherit;
      text-align: center;
      cursor: pointer;
      transition: all 0.15s ease;
      font: inherit;
    }
    .zm-dayun-pill:hover, .zm-dayun-pill.zm-selected {
      border-color: var(--zm-gold-bright);
      background: color-mix(in srgb, var(--zm-gold-bright) 14%, var(--zm-surface));
    }

    /* Qimen 3x3 LuoShu Grid (inside theme-adaptive canvas) */
    .zm-qimen-grid {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 6px;
    }
    .zm-qimen-cell {
      width: 100%;
      border-radius: 11px;
      border: 1px solid var(--zm-glass-border);
      background: var(--zm-glass);
      color: var(--zm-text);
      padding: 8px 7px;
      min-height: 98px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      cursor: pointer;
      position: relative;
      text-align: left;
      font: inherit;
      transition: all 0.16s ease;
    }
    .zm-qimen-cell:hover {
      border-color: var(--zm-indigo);
      transform: translateY(-1px);
    }
    .zm-qimen-cell.zm-selected {
      border-color: var(--zm-gold-bright);
      box-shadow: 0 0 0 1.5px color-mix(in srgb, var(--zm-gold-bright) 48%, transparent);
    }
    .zm-qimen-cell.zm-radar-hit {
      border-color: var(--zm-green);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--zm-green) 45%, transparent);
    }
    .zm-qimen-cell.zm-center {
      background: color-mix(in srgb, var(--zm-gold-bright) 12%, var(--zm-glass));
      border-style: dashed;
      border-color: var(--zm-gold-bright);
    }

    /* Meihua 3-Stage Cards */
    .zm-hex-stage {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 7px;
    }
    .zm-hex-card {
      width: 100%;
      border-radius: 11px;
      border: 1px solid var(--zm-border);
      background: var(--zm-surface);
      color: inherit;
      padding: 9px 6px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      cursor: pointer;
      font: inherit;
      transition: all 0.16s ease;
    }
    .zm-hex-card:hover, .zm-hex-card.zm-selected {
      border-color: var(--zm-gold-bright);
      box-shadow: 0 0 0 1.5px color-mix(in srgb, var(--zm-gold-bright) 34%, transparent);
    }

    /* Ziwei 4x4 Traditional Grid (inside theme-adaptive canvas) */
    .zm-ziwei-scroll {
      width: 100%;
      overflow-x: auto;
      padding-bottom: 2px;
    }
    .zm-ziwei-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(82px, 1fr));
      grid-template-rows: repeat(4, minmax(92px, auto));
      gap: 5px;
      min-width: 348px;
      position: relative;
    }
    .zm-zw-cell {
      width: 100%;
      border-radius: 9px;
      border: 1px solid var(--zm-glass-border);
      background: var(--zm-glass);
      color: var(--zm-text);
      padding: 6px 5px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      cursor: pointer;
      transition: all 0.15s ease;
      min-width: 0;
      text-align: left;
      font: inherit;
    }
    .zm-zw-cell:hover { border-color: var(--zm-purple); }
    .zm-zw-cell.zm-zw-self {
      border-color: var(--zm-gold-bright);
      background: color-mix(in srgb, var(--zm-gold-bright) 16%, var(--zm-glass));
    }
    .zm-zw-cell.zm-zw-trine {
      border-color: var(--zm-purple);
      background: color-mix(in srgb, var(--zm-purple) 12%, var(--zm-glass));
    }
    .zm-zw-cell.zm-zw-yearly {
      box-shadow: inset 0 0 0 1.5px #38bdf8;
    }
    .zm-zw-center {
      grid-column: 2 / 4;
      grid-row: 2 / 4;
      border-radius: 12px;
      border: 1px solid var(--zm-stage-border);
      background: var(--zm-glass);
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 8px;
      text-align: center;
      overflow: hidden;
    }
    .zm-zw-center-scrim {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
      align-items: center;
      padding: 6px 9px;
      border-radius: 9px;
      background: var(--zm-glass);
      border: 1px solid var(--zm-glass-border);
      backdrop-filter: blur(6px);
    }

    .zm-two-col {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(175px, 1fr));
      gap: 8px;
    }

    @container (min-width: 720px) {
      .zm-wide-split {
        display: grid;
        grid-template-columns: 1.2fr 1fr;
        gap: 12px;
        align-items: start;
      }
    }

    @container (max-width: 440px) {
      .zm-wuxing-grid { grid-template-columns: 1fr; }
      .zm-hex-stage { grid-template-columns: 1fr; }
    }

    /* Composer Dock Pill */
    .zm-dock-wrap {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 999px;
      border: 1px solid color-mix(in srgb, #c9973b 38%, var(--dsw-alias-border-l2));
      background: color-mix(in srgb, #c9973b 7%, var(--dsw-alias-card-fill));
      color: var(--dsw-alias-label-primary);
      font-size: 12px;
      max-width: 100%;
      transition: all 0.16s ease;
    }
    .zm-dock-wrap:hover {
      border-color: color-mix(in srgb, #c9973b 65%, var(--dsw-alias-border-l3));
      background: color-mix(in srgb, #c9973b 12%, var(--dsw-alias-card-fill));
    }
    .zm-dock-main {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: none;
      border: none;
      padding: 0;
      color: inherit;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      min-width: 0;
    }
    .zm-dock-text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 250px;
    }

    /* Inline Chat Tool & Command Cards */
    .zm-chat-card {
      border-radius: 12px;
      border: 1px solid color-mix(in srgb, #c9973b 36%, var(--dsw-alias-border-l2));
      background:
        radial-gradient(circle at 96% 8%, rgba(201, 151, 59, 0.11), transparent 48%),
        var(--dsw-alias-card-fill);
      padding: 10px 12px;
      margin: 4px 0;
      color: var(--dsw-alias-label-primary);
      font-size: 12px;
      animation: zm-fade-up 0.2s ease-out;
    }
    .zm-chat-card-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      flex-wrap: wrap;
    }
    .zm-chat-mini-strip {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 8px;
    }

    .zm-toast {
      position: sticky;
      bottom: 0;
      padding: 7px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 500;
      background: var(--zm-surface-soft);
      border: 1px solid var(--zm-border-strong);
      color: var(--zm-text);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      z-index: 5;
    }

    .zm-muted { color: var(--zm-text-muted); font-size: 11px; }
    .zm-sep { height: 1px; background: var(--zm-border); margin: 6px 0; }
    `;

    // --- src/client/visuals.js ---
    function createVisuals(React) {
      const h = React.createElement;

      class ZhimingErrorBoundary extends React.Component {
        constructor(props) {
          super(props);
          this.state = { hasError: false, message: '' };
        }
        static getDerivedStateFromError(error) {
          return { hasError: true, message: error?.message || String(error) };
        }
        render() {
          if (this.state.hasError) {
            return h('div', { className: 'zm-card', style: { margin: 8 } },
              h('div', { style: { fontWeight: 600, marginBottom: 6 } }, this.props.fallbackText || '知命视图渲染异常'),
              h('div', { className: 'zm-muted', style: { marginBottom: 8 } }, this.state.message),
              h('button', {
                type: 'button',
                className: 'zm-btn zm-btn-sm',
                onClick: () => this.setState({ hasError: false, message: '' }),
              }, this.props.resetText || '重新加载视图'),
            );
          }
          return this.props.children;
        }
      }

      function LuopanEmblem({ size = 34, spin = true }) {
        const ticks = [];
        for (let i = 0; i < 12; i++) {
          const deg = i * 30;
          const rad = (deg * Math.PI) / 180;
          const x1 = 32 + Math.cos(rad) * 23;
          const y1 = 32 + Math.sin(rad) * 23;
          const x2 = 32 + Math.cos(rad) * 28.5;
          const y2 = 32 + Math.sin(rad) * 28.5;
          ticks.push(h('line', {
            key: i,
            x1: x1.toFixed(2), y1: y1.toFixed(2),
            x2: x2.toFixed(2), y2: y2.toFixed(2),
            stroke: i % 3 === 0 ? '#c9973b' : 'rgba(201,151,59,0.55)',
            strokeWidth: i % 3 === 0 ? 1.8 : 1.1,
            strokeLinecap: 'round',
          }));
        }
        const baguaMarks = [];
        for (let i = 0; i < 8; i++) {
          const deg = i * 45 + 22.5;
          const rad = (deg * Math.PI) / 180;
          const cx = 32 + Math.cos(rad) * 18.5;
          const cy = 32 + Math.sin(rad) * 18.5;
          baguaMarks.push(h('circle', {
            key: i,
            cx: cx.toFixed(2),
            cy: cy.toFixed(2),
            r: 1.35,
            fill: i % 2 === 0 ? '#c9973b' : '#6366f1',
          }));
        }
        return h('svg', {
          width: size,
          height: size,
          viewBox: '0 0 64 64',
          fill: 'none',
          'aria-hidden': true,
          style: { flexShrink: 0, display: 'block' },
        },
          h('g', { className: spin ? 'zm-spin-slow' : '' },
            h('circle', { cx: 32, cy: 32, r: 29, stroke: 'rgba(201,151,59,0.55)', strokeWidth: 1.4 }),
            ...ticks,
          ),
          h('g', { className: spin ? 'zm-spin-rev' : '' },
            h('circle', { cx: 32, cy: 32, r: 21.5, stroke: 'rgba(99,102,241,0.45)', strokeWidth: 1, strokeDasharray: '3 3' }),
            ...baguaMarks,
          ),
          h('circle', { cx: 32, cy: 32, r: 12.5, fill: '#1e1b2e', stroke: '#c9973b', strokeWidth: 1.5 }),
          h('path', {
            d: 'M32 19.5 A12.5 12.5 0 0 1 32 44.5 A6.25 6.25 0 0 1 32 32 A6.25 6.25 0 0 0 32 19.5 Z',
            fill: '#f3d999',
          }),
          h('circle', { cx: 32, cy: 25.75, r: 2.1, fill: '#1e1b2e' }),
          h('circle', { cx: 32, cy: 38.25, r: 2.1, fill: '#f3d999' }),
        );
      }

      function GuideArtworkSvg({ size = 20 }) {
        return h(LuopanEmblem, { size, spin: false });
      }

      function WuXingPentagonSvg({ percentages = {}, favorable = [], selectedElement = null, onSelectElement }) {
        const elements = ['木', '火', '土', '金', '水'];
        const cx = 75;
        const cy = 76;
        const outerR = 54;
        const pts = elements.map((el, i) => {
          const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
          return { el, x: cx + Math.cos(angle) * outerR, y: cy + Math.sin(angle) * outerR, angle };
        });

        const maxPct = Math.max(35, ...elements.map(e => Number(percentages[e]) || 0));
        const dataPoints = pts.map(p => {
          const val = Number(percentages[p.el]) || 10;
          const ratio = 0.22 + (val / maxPct) * 0.72;
          return `${(cx + Math.cos(p.angle) * outerR * ratio).toFixed(1)},${(cy + Math.sin(p.angle) * outerR * ratio).toFixed(1)}`;
        }).join(' ');

        const starOrder = [0, 2, 4, 1, 3, 0];
        const starPath = starOrder.map((idx, k) => `${k === 0 ? 'M' : 'L'}${pts[idx].x.toFixed(1)} ${pts[idx].y.toFixed(1)}`).join(' ');

        return h('svg', {
          viewBox: '0 0 150 150',
          width: 146,
          height: 146,
          role: 'img',
          'aria-label': '五行能量五角星图',
          style: { display: 'block', margin: '0 auto', overflow: 'visible' },
        },
          h('polygon', {
            points: pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '),
            fill: 'none',
            stroke: 'rgba(201,151,59,0.42)',
            strokeWidth: 1.2,
          }),
          h('path', {
            d: starPath,
            fill: 'none',
            stroke: 'rgba(148,163,184,0.28)',
            strokeWidth: 1,
            strokeDasharray: '2.5 2.5',
          }),
          h('polygon', {
            points: dataPoints,
            fill: 'rgba(201,151,59,0.20)',
            stroke: '#c9973b',
            strokeWidth: 1.8,
            strokeLinejoin: 'round',
          }),
          ...pts.map(p => {
            const meta = WUXING_STYLE[p.el];
            const isFav = favorable.includes(p.el);
            const isSel = selectedElement === p.el;
            return h('g', {
              key: p.el,
              role: onSelectElement ? 'button' : undefined,
              tabIndex: onSelectElement ? 0 : undefined,
              'aria-label': meta.label,
              style: { cursor: onSelectElement ? 'pointer' : 'default' },
              onClick: onSelectElement ? () => onSelectElement(p.el) : undefined,
              onKeyDown: onSelectElement ? e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectElement(p.el);
                }
              } : undefined,
            },
              isFav ? h('circle', {
                cx: p.x, cy: p.y, r: 16.5,
                fill: 'none', stroke: meta.color, strokeWidth: 1.2, strokeDasharray: '2 2',
              }) : null,
              h('circle', {
                cx: p.x,
                cy: p.y,
                r: isSel ? 14 : 12.5,
                fill: meta.soft,
                stroke: meta.color,
                strokeWidth: isSel ? 2.2 : 1.5,
              }),
              h('text', {
                x: p.x,
                y: p.y + 4,
                textAnchor: 'middle',
                fill: meta.color,
                fontSize: 11,
                fontWeight: 800,
              }, p.el),
            );
          }),
        );
      }

      function HexagramLinesSvg({ lines = [1, 1, 1, 1, 1, 1], movingLine = 0, tiPosition = '', compact = false }) {
        const w = compact ? 66 : 92;
        const lineH = compact ? 6 : 8;
        const gap = compact ? 4 : 6;
        const totalH = 6 * lineH + 5 * gap + 8;

        const rows = [];
        for (let idx = 5; idx >= 0; idx--) {
          const yaoNum = idx + 1;
          const isYang = lines[idx] === 1;
          const isMoving = movingLine === yaoNum;
          const y = (5 - idx) * (lineH + gap) + 4;
          const isUpper = idx >= 3;
          const isTi = (tiPosition === 'upper' && isUpper) || (tiPosition === 'lower' && !isUpper);
          const fill = isMoving ? 'var(--zm-red)' : isTi ? 'var(--zm-gold-bright)' : 'var(--zm-indigo)';

          if (isYang) {
            rows.push(h('rect', {
              key: `y-${yaoNum}`,
              x: 6, y, width: w - 12, height: lineH, rx: lineH / 2,
              fill,
              className: isMoving ? 'zm-pulse-glow' : '',
            }));
          } else {
            const segW = (w - 22) / 2;
            rows.push(
              h('rect', {
                key: `y-${yaoNum}-l`,
                x: 6, y, width: segW, height: lineH, rx: lineH / 2,
                fill,
                className: isMoving ? 'zm-pulse-glow' : '',
              }),
              h('rect', {
                key: `y-${yaoNum}-r`,
                x: 6 + segW + 10, y, width: segW, height: lineH, rx: lineH / 2,
                fill,
                className: isMoving ? 'zm-pulse-glow' : '',
              }),
            );
          }

          if (isMoving) {
            rows.push(h('circle', {
              key: `dot-${yaoNum}`,
              cx: w - 2,
              cy: y + lineH / 2,
              r: 2.5,
              fill: 'var(--zm-red)',
            }));
          }
        }

        const midY = 3 * lineH + 2.5 * gap + 4;
        rows.push(h('line', {
          key: 'div',
          x1: 2, y1: midY, x2: w - 2, y2: midY,
          stroke: 'rgba(148,163,184,0.28)',
          strokeWidth: 0.8,
          strokeDasharray: '2 2',
        }));

        return h('svg', {
          viewBox: `0 0 ${w} ${totalH}`,
          width: w,
          height: totalH,
          'aria-hidden': true,
          style: { display: 'block' },
        }, ...rows);
      }

      function ScoreRingSvg({ score = 80, label = '', accent = 'var(--zm-gold)', size = 112 }) {
        const r = 42;
        const c = 2 * Math.PI * r;
        const clamped = Math.max(0, Math.min(100, Number(score) || 0));
        const offset = c * (1 - clamped / 100);
        return h('svg', {
          viewBox: '0 0 108 108',
          width: size,
          height: size,
          role: 'img',
          'aria-label': `${clamped} ${label}`,
          style: { display: 'block' },
        },
          h('circle', {
            cx: 54, cy: 54, r,
            fill: 'none',
            stroke: 'rgba(148,163,184,0.22)',
            strokeWidth: 8,
          }),
          h('circle', {
            cx: 54, cy: 54, r,
            fill: 'none',
            stroke: accent,
            strokeWidth: 8,
            strokeLinecap: 'round',
            strokeDasharray: c.toFixed(2),
            strokeDashoffset: offset.toFixed(2),
            transform: 'rotate(-90 54 54)',
            style: { transition: 'stroke-dashoffset 0.6s ease' },
          }),
          h('text', {
            x: 54, y: 53,
            textAnchor: 'middle',
            fill: 'currentColor',
            fontSize: 24,
            fontWeight: 800,
          }, String(clamped)),
          h('text', {
            x: 54, y: 70,
            textAnchor: 'middle',
            fill: accent,
            fontSize: 10,
            fontWeight: 700,
          }, label),
        );
      }

      function RadarChartSvg({ dimensions = [] }) {
        const items = dimensions.slice(0, 6);
        if (items.length < 3) return null;
        const cx = 105;
        const cy = 92;
        const r = 60;
        const n = items.length;
        const rings = [0.35, 0.68, 1.0];

        const pointAt = (i, ratio) => {
          const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
          return { x: cx + Math.cos(a) * r * ratio, y: cy + Math.sin(a) * r * ratio };
        };

        const dataPoly = items.map((d, i) => {
          const p = pointAt(i, Math.max(0.2, (Number(d.score) || 60) / 100));
          return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
        }).join(' ');

        return h('svg', {
          viewBox: '0 0 210 184',
          width: '100%',
          height: 176,
          role: 'img',
          'aria-label': '六维合盘雷达图',
          style: { display: 'block', maxWidth: 230, margin: '0 auto' },
        },
          ...rings.map((ratio, ri) => h('polygon', {
            key: `r-${ri}`,
            points: items.map((_, i) => {
              const p = pointAt(i, ratio);
              return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
            }).join(' '),
            fill: 'none',
            stroke: 'rgba(148,163,184,0.28)',
            strokeWidth: 1,
          })),
          ...items.map((_, i) => {
            const p = pointAt(i, 1);
            return h('line', {
              key: `ax-${i}`,
              x1: cx, y1: cy, x2: p.x.toFixed(1), y2: p.y.toFixed(1),
              stroke: 'rgba(148,163,184,0.22)',
              strokeWidth: 1,
            });
          }),
          h('polygon', {
            points: dataPoly,
            fill: 'rgba(236,72,153,0.22)',
            stroke: 'var(--zm-pink)',
            strokeWidth: 2,
            strokeLinejoin: 'round',
          }),
          ...items.map((d, i) => {
            const p = pointAt(i, Math.max(0.2, (Number(d.score) || 60) / 100));
            const lp = pointAt(i, 1.24);
            return h('g', { key: d.key || i },
              h('circle', { cx: p.x, cy: p.y, r: 3.4, fill: 'var(--zm-pink)' }),
              h('text', {
                x: lp.x,
                y: lp.y + 3,
                textAnchor: 'middle',
                fill: 'currentColor',
                fontSize: 9.5,
                fontWeight: 600,
              }, `${d.label} ${d.score}`),
            );
          }),
        );
      }

      const ZW_ANCHOR = {
        3: { x: 4, y: 4 },
        4: { x: 26, y: 4 },
        5: { x: 74, y: 4 },
        6: { x: 96, y: 4 },
        2: { x: 4, y: 26 },
        7: { x: 96, y: 26 },
        1: { x: 4, y: 74 },
        8: { x: 96, y: 74 },
        0: { x: 4, y: 96 },
        11: { x: 26, y: 96 },
        10: { x: 74, y: 96 },
        9: { x: 96, y: 96 },
      };

      function ZiweiTriAspectSvg({ selectedPalace }) {
        if (!selectedPalace) return null;
        const pSelf = ZW_ANCHOR[selectedPalace.index];
        const pOpp = ZW_ANCHOR[selectedPalace.oppositeIndex];
        const pT1 = ZW_ANCHOR[selectedPalace.trineIndices?.[0]];
        const pT2 = ZW_ANCHOR[selectedPalace.trineIndices?.[1]];
        if (!pSelf || !pOpp || !pT1 || !pT2) return null;

        return h('svg', {
          viewBox: '0 0 100 100',
          preserveAspectRatio: 'xMidYMid meet',
          'aria-hidden': true,
          style: {
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            opacity: 0.78,
          },
        },
          h('line', {
            x1: pSelf.x, y1: pSelf.y, x2: pOpp.x, y2: pOpp.y,
            stroke: 'var(--zm-gold-bright)',
            strokeWidth: 1.5,
            strokeDasharray: '3 2',
          }),
          h('polygon', {
            points: `${pSelf.x},${pSelf.y} ${pT1.x},${pT1.y} ${pT2.x},${pT2.y}`,
            fill: 'rgba(168,85,247,0.10)',
            stroke: 'var(--zm-purple)',
            strokeWidth: 1.4,
          }),
          h('circle', { cx: pSelf.x, cy: pSelf.y, r: 3.2, fill: 'var(--zm-gold-bright)' }),
          h('circle', { cx: pOpp.x, cy: pOpp.y, r: 2.5, fill: 'var(--zm-gold-bright)' }),
          h('circle', { cx: pT1.x, cy: pT1.y, r: 2.5, fill: 'var(--zm-purple)' }),
          h('circle', { cx: pT2.x, cy: pT2.y, r: 2.5, fill: 'var(--zm-purple)' }),
        );
      }

      return {
        ZhimingErrorBoundary,
        LuopanEmblem,
        GuideArtworkSvg,
        WuXingPentagonSvg,
        HexagramLinesSvg,
        ScoreRingSvg,
        RadarChartSvg,
        ZiweiTriAspectSvg,
      };
    }

    // --- src/client/visuals-stage.js ---
    function createStageVisuals(React) {
      const h = React.createElement;

      function getPalette(isDark) {
        if (isDark) {
          return {
            key: 'd',
            gold: '#f0c975',
            goldBright: '#fae2a0',
            goldSoft: 'rgba(240,201,117,0.22)',
            goldLine: 'rgba(240,201,117,0.34)',
            goldFaint: 'rgba(240,201,117,0.14)',
            ink: '#f8fafc',
            inkSub: '#cbd5e1',
            inkMuted: 'rgba(203,213,225,0.68)',
            surface: '#0b1022',
            surfaceMid: '#121a33',
            wedgeIdle: 'rgba(15,23,42,0.70)',
            wedgeBorder: 'rgba(148,163,184,0.28)',
            goodFill: 'rgba(16,185,129,0.20)',
            goodFillSel: 'rgba(16,185,129,0.36)',
            goodStroke: '#34d399',
            badFill: 'rgba(244,63,94,0.14)',
            badFillSel: 'rgba(244,63,94,0.30)',
            badStroke: '#fb7185',
            selFill: 'rgba(240,201,117,0.24)',
            selStroke: '#fae2a0',
            trineFill: 'rgba(168,85,247,0.18)',
            trineStroke: '#c084fc',
            cyan: '#38bdf8',
            indigo: '#818cf8',
            purple: '#c084fc',
            pink: '#f472b6',
            blue: '#60a5fa',
            amber: '#fbbf24',
            taijiLight: '#f6df9e',
            taijiDark: '#0f162b',
            el: {
              木: { fg: '#34d399', fill: 'rgba(16,185,129,0.24)', ring: '#34d399' },
              火: { fg: '#fb7185', fill: 'rgba(244,63,94,0.24)', ring: '#fb7185' },
              土: { fg: '#fbbf24', fill: 'rgba(245,158,11,0.24)', ring: '#fbbf24' },
              金: { fg: '#fde047', fill: 'rgba(234,179,8,0.24)', ring: '#fde047' },
              水: { fg: '#60a5fa', fill: 'rgba(59,130,246,0.24)', ring: '#60a5fa' },
            },
          };
        }
        // Imperial Xuan-Paper & Mineral-Ink Bronze-Gold Light Theme
        return {
          key: 'l',
          gold: '#9a6700',
          goldBright: '#b88018',
          goldSoft: 'rgba(184,128,24,0.14)',
          goldLine: 'rgba(154,103,0,0.32)',
          goldFaint: 'rgba(154,103,0,0.13)',
          ink: '#1c2230',
          inkSub: '#475066',
          inkMuted: '#757e92',
          surface: '#fffdf8',
          surfaceMid: '#f6efe2',
          wedgeIdle: 'rgba(255,252,245,0.78)',
          wedgeBorder: 'rgba(168,124,48,0.28)',
          goodFill: 'rgba(5,150,105,0.13)',
          goodFillSel: 'rgba(5,150,105,0.24)',
          goodStroke: '#059669',
          badFill: 'rgba(200,30,58,0.08)',
          badFillSel: 'rgba(200,30,58,0.18)',
          badStroke: '#c81e3a',
          selFill: 'rgba(184,128,24,0.18)',
          selStroke: '#9a6700',
          trineFill: 'rgba(124,58,237,0.11)',
          trineStroke: '#7c3aed',
          cyan: '#0284c7',
          indigo: '#4338ca',
          purple: '#7c3aed',
          pink: '#be185d',
          blue: '#1d4ed8',
          amber: '#b45309',
          taijiLight: '#fffaf0',
          taijiDark: '#262d40',
          el: {
            木: { fg: '#047857', fill: 'rgba(5,150,105,0.15)', ring: '#059669' },
            火: { fg: '#c81e3a', fill: 'rgba(200,30,58,0.14)', ring: '#dc2626' },
            土: { fg: '#b45309', fill: 'rgba(217,119,6,0.15)', ring: '#d97706' },
            金: { fg: '#9a6700', fill: 'rgba(184,128,24,0.16)', ring: '#b88018' },
            水: { fg: '#1d4ed8', fill: 'rgba(29,78,216,0.14)', ring: '#2563eb' },
          },
        };
      }

      // Exact Bagua 3-line binary bars (top -> middle -> bottom; 1 = solid Yang, 0 = broken Yin)
      const TRIGRAM_BITS = {
        乾: [1, 1, 1], 兑: [0, 1, 1], 离: [1, 0, 1], 震: [0, 0, 1],
        巽: [1, 1, 0], 坎: [0, 1, 0], 艮: [1, 0, 0], 坤: [0, 0, 0],
      };

      // Renders crisp vector Bagua bars tangentially rotated at (x, y)
      function VectorTrigram({ name, x, y, width = 18, thickness = 2.4, gap = 2.4, angleDeg = 0, color }) {
        const bits = TRIGRAM_BITS[name] || [1, 1, 1];
        const totalH = thickness * 3 + gap * 2;
        const startY = -totalH / 2;
        const halfW = width / 2;
        const splitGap = width * 0.20;
        const segW = (width - splitGap) / 2;

        return h('g', { transform: `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${angleDeg.toFixed(1)})` },
          ...bits.flatMap((bit, i) => {
            const yy = startY + i * (thickness + gap);
            if (bit === 1) {
              return [h('rect', { key: i, x: -halfW, y: yy, width, height: thickness, rx: thickness / 2, fill: color })];
            }
            return [
              h('rect', { key: `${i}l`, x: -halfW, y: yy, width: segW, height: thickness, rx: thickness / 2, fill: color }),
              h('rect', { key: `${i}r`, x: splitGap / 2, y: yy, width: segW, height: thickness, rx: thickness / 2, fill: color }),
            ];
          }),
        );
      }

      // Sculpted Vector Yin-Yang Taiji Core
      function TaijiCore({ cx, cy, r, pal, spin = false }) {
        const r2 = r / 2;
        const dotR = Math.max(2, r * 0.145);
        return h('g', { className: spin ? 'zm-spin-slow' : '' },
          h('circle', { cx, cy, r, fill: pal.taijiDark, stroke: pal.gold, strokeWidth: 1.5 }),
          h('path', {
            d: `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${r2} ${r2} 0 0 1 ${cx} ${cy} A ${r2} ${r2} 0 0 0 ${cx} ${cy - r} Z`,
            fill: pal.taijiLight,
          }),
          h('circle', { cx, cy: cy - r2, r: dotR, fill: pal.taijiDark }),
          h('circle', { cx, cy: cy + r2, r: dotR, fill: pal.taijiLight }),
        );
      }

      // =========================================================================
      // 0. Aspect-Preserved Celestial Backdrop (NEVER stretches circles!)
      // Uses preserveAspectRatio="xMidYMid slice" on a 600x600 square viewBox.
      // =========================================================================
      const STAR_SEEDS = [
        [42, 48, 1.3, '0s'], [96, 84, 0.9, '0.6s'], [158, 36, 1.6, '1.2s'], [224, 68, 1.0, '1.8s'],
        [298, 28, 1.2, '0.4s'], [372, 56, 1.5, '1.5s'], [446, 40, 0.9, '2.1s'], [528, 72, 1.4, '0.9s'],
        [562, 134, 1.1, '1.7s'], [74, 152, 1.2, '2.3s'], [142, 188, 0.8, '0.3s'], [488, 168, 1.3, '1.1s'],
        [36, 256, 1.0, '1.9s'], [554, 248, 1.5, '0.5s'], [62, 344, 1.4, '1.4s'], [526, 336, 1.0, '2.2s'],
        [48, 442, 1.1, '0.7s'], [114, 496, 1.5, '1.6s'], [192, 548, 0.9, '2.5s'], [284, 564, 1.3, '0.8s'],
        [396, 546, 1.6, '1.3s'], [478, 502, 1.0, '2.0s'], [546, 448, 1.3, '0.2s'], [566, 542, 1.1, '1.0s'],
        [82, 558, 1.2, '1.8s'], [188, 118, 0.9, '0.9s'], [422, 112, 1.1, '2.4s'], [104, 412, 0.9, '1.2s'],
        [492, 416, 1.2, '0.6s'], [246, 514, 0.8, '1.5s'], [352, 508, 1.0, '2.1s'], [316, 88, 1.1, '0.4s'],
      ];

      function CelestialBackdropSvg({ isDark = true }) {
        const pal = getPalette(isDark);
        return h('svg', {
          viewBox: '0 0 600 600',
          preserveAspectRatio: 'xMidYMid slice',
          'aria-hidden': true,
          style: { position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 },
        },
          // Delicate astronomical background rings (true circles!)
          h('circle', { cx: 300, cy: 300, r: 274, fill: 'none', stroke: pal.goldFaint, strokeWidth: 0.9, strokeDasharray: '4 8' }),
          h('circle', { cx: 300, cy: 300, r: 232, fill: 'none', stroke: pal.goldFaint, strokeWidth: 0.7 }),
          // Subtle constellation hairlines in corners
          h('path', {
            d: 'M 42 48 L 96 84 L 158 36 M 446 40 L 528 72 L 562 134 M 48 442 L 114 496 L 192 548 M 478 502 L 546 448',
            fill: 'none',
            stroke: isDark ? 'rgba(199,210,254,0.14)' : 'rgba(154,103,0,0.12)',
            strokeWidth: 0.8,
          }),
          // Perfectly circular stars (dark) or delicate bronze-gold dust motes (light)
          ...STAR_SEEDS.map(([cx, cy, r, delay], i) => h('circle', {
            key: i,
            cx, cy, r,
            fill: isDark ? (i % 3 === 0 ? '#fae2a0' : '#c7d2fe') : (i % 2 === 0 ? '#b88018' : '#059669'),
            opacity: isDark ? 0.85 : 0.34,
            className: 'zm-twinkle',
            style: { animationDelay: delay },
          })),
        );
      }

      // Traditional Chinese compass orientation: South Top (-90°), West Right (0°), North Bottom (90°), East Left (180°)
      const COMPASS_ANGLES = {
        正南: -90, 西南: -45, 正西: 0, 西北: 45,
        正北: 90, 东北: 135, 正东: 180, 东南: -135,
      };

      function makeSectorPath(cx, cy, degCenter, halfSpread, r1, r2) {
        const a1 = ((degCenter - halfSpread) * Math.PI) / 180;
        const a2 = ((degCenter + halfSpread) * Math.PI) / 180;
        const x1o = cx + Math.cos(a1) * r2;
        const y1o = cy + Math.sin(a1) * r2;
        const x2o = cx + Math.cos(a2) * r2;
        const y2o = cy + Math.sin(a2) * r2;
        const x2i = cx + Math.cos(a2) * r1;
        const y2i = cy + Math.sin(a2) * r1;
        const x1i = cx + Math.cos(a1) * r1;
        const y1i = cy + Math.sin(a1) * r1;
        return `M ${x1o.toFixed(1)} ${y1o.toFixed(1)} A ${r2} ${r2} 0 0 1 ${x2o.toFixed(1)} ${y2o.toFixed(1)} L ${x2i.toFixed(1)} ${y2i.toFixed(1)} A ${r1} ${r1} 0 0 0 ${x1i.toFixed(1)} ${y1i.toFixed(1)} Z`;
      }

      // =========================================================================
      // 1. BAZI CELESTIAL ELEMENTAL ORRERY (420x420) — Works Idle + Active!
      // =========================================================================
      const BRANCHES_12 = ['午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳'];
      const PILLAR_ORBITS = [
        { idx: 0, tag: '年', deg: -135 },
        { idx: 1, tag: '月', deg: -45 },
        { idx: 2, tag: '日', deg: 45 },
        { idx: 3, tag: '时', deg: 135 },
      ];

      function BaziOrrerySvg({ chart, isDark = true, selectedPillarIdx = 2, selectedWuXing = null, onSelectPillar, onSelectWuXing }) {
        const pal = getPalette(isDark);
        const cx = 210;
        const cy = 210;
        const elements = ['木', '火', '土', '金', '水'];
        const pentR = 155;
        const pillarR = 96;

        const pcts = chart?.wuxing?.percentages || { 木: 20, 火: 20, 土: 20, 金: 20, 水: 20 };
        const favs = chart?.wuxing?.favorable || [];
        const maxPct = Math.max(36, ...elements.map(e => Number(pcts[e]) || 0));

        const elNodes = elements.map((el, i) => {
          const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
          const val = Number(pcts[el]) || 12;
          const ratio = 0.28 + (val / maxPct) * 0.68;
          return {
            el,
            x: cx + Math.cos(a) * pentR,
            y: cy + Math.sin(a) * pentR,
            dx: cx + Math.cos(a) * pentR * ratio,
            dy: cy + Math.sin(a) * pentR * ratio,
            pct: val,
          };
        });

        const pillarPos = PILLAR_ORBITS.map(o => {
          const rad = (o.deg * Math.PI) / 180;
          return { ...o, x: cx + Math.cos(rad) * pillarR, y: cy + Math.sin(rad) * pillarR };
        });

        const dmEl = chart?.dayMaster?.element || '金';
        const dmStyle = pal.el[dmEl] || pal.el['金'];
        const glowId = `zm-bz-glow-${pal.key}`;
        const coreGrad = `zm-bz-core-${pal.key}`;

        return h('svg', {
          viewBox: '0 0 420 420',
          width: '100%',
          role: 'img',
          'aria-label': chart ? `四柱五行天象仪 ${chart.title}` : '四柱五行天象仪待机图腾',
          style: { display: 'block', width: '100%', height: 'auto', aspectRatio: '1 / 1' },
        },
          h('defs', null,
            h('filter', { id: glowId, x: '-30%', y: '-30%', width: '160%', height: '160%' },
              h('feGaussianBlur', { stdDeviation: isDark ? 4 : 2.2, result: 'b' }),
              h('feMerge', null, h('feMergeNode', { in: 'b' }), h('feMergeNode', { in: 'SourceGraphic' })),
            ),
            h('radialGradient', { id: coreGrad, cx: '50%', cy: '45%', r: '55%' },
              h('stop', { offset: '0%', stopColor: isDark ? '#2b2447' : '#fffdf5' }),
              h('stop', { offset: '68%', stopColor: pal.surfaceMid }),
              h('stop', { offset: '100%', stopColor: pal.surface }),
            ),
          ),

          // Layer 1: Rotating 60-Tick Golden Vernier Degree Ring + 12 Branches
          h('g', { className: 'zm-spin-slow' },
            h('circle', { cx, cy, r: 202, fill: 'none', stroke: pal.goldLine, strokeWidth: 1.3 }),
            h('circle', { cx, cy, r: 176, fill: 'none', stroke: pal.goldFaint, strokeWidth: 1 }),
            ...Array.from({ length: 60 }, (_, i) => {
              const rad = (i * 6 * Math.PI) / 180;
              const major = i % 5 === 0;
              return h('line', {
                key: `t-${i}`,
                x1: (cx + Math.cos(rad) * (major ? 192 : 196)).toFixed(1),
                y1: (cy + Math.sin(rad) * (major ? 192 : 196)).toFixed(1),
                x2: (cx + Math.cos(rad) * 202).toFixed(1),
                y2: (cy + Math.sin(rad) * 202).toFixed(1),
                stroke: major ? pal.gold : pal.goldLine,
                strokeWidth: major ? 1.6 : 0.85,
              });
            }),
            ...BRANCHES_12.map((br, i) => {
              const deg = -90 + i * 30;
              const rad = (deg * Math.PI) / 180;
              return h('text', {
                key: `br-${br}`,
                x: (cx + Math.cos(rad) * 184).toFixed(1),
                y: (cy + Math.sin(rad) * 184 + 3.5).toFixed(1),
                textAnchor: 'middle',
                fill: pal.inkMuted,
                fontSize: 9.5,
                fontWeight: 700,
              }, br);
            }),
          ),

          // Layer 2: Five-Element Sacred Pentagon + Energy Field Polygon
          h('polygon', {
            points: elNodes.map(n => `${n.x.toFixed(1)},${n.y.toFixed(1)}`).join(' '),
            fill: 'none',
            stroke: pal.goldLine,
            strokeWidth: 1,
            strokeDasharray: '3 4',
          }),
          // Internal Sheng/Ke star lines
          h('polygon', {
            points: [0, 2, 4, 1, 3].map(i => `${elNodes[i].x.toFixed(1)},${elNodes[i].y.toFixed(1)}`).join(' '),
            fill: 'none',
            stroke: pal.goldFaint,
            strokeWidth: 0.9,
          }),
          // Dynamic Elemental Energy Aura Polygon
          h('polygon', {
            points: elNodes.map(n => `${n.dx.toFixed(1)},${n.dy.toFixed(1)}`).join(' '),
            fill: pal.goldSoft,
            stroke: pal.gold,
            strokeWidth: 1.8,
            strokeLinejoin: 'round',
            filter: `url(#${glowId})`,
          }),

          // Layer 3: Inner Pillar Orbit Track + Harmonic Interaction Filaments (合冲光弧)
          h('circle', { cx, cy, r: pillarR, fill: 'none', stroke: pal.goldFaint, strokeWidth: 1.1, strokeDasharray: '2 5' }),
          ...(chart?.interactions || []).slice(0, 5).map((it, idx) => {
            const p1 = pillarPos[it.from];
            const p2 = pillarPos[it.to];
            if (!p1 || !p2) return null;
            const curvePull = idx % 2 === 0 ? 0.56 : 0.34;
            const qx = cx + ((p1.x + p2.x) / 2 - cx) * curvePull;
            const qy = cy + ((p1.y + p2.y) / 2 - cy) * curvePull;
            const col = it.polarity === 'good' ? pal.goodStroke : pal.badStroke;
            return h('path', {
              key: `arc-${idx}`,
              d: `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Q ${qx.toFixed(1)} ${qy.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`,
              fill: 'none',
              stroke: col,
              strokeWidth: 2,
              strokeDasharray: '6 4',
              className: 'zm-dash-flow',
              opacity: 0.88,
            });
          }),

          // Layer 4: 5 Clickable Elemental Crystal Nodes
          ...elNodes.map(n => {
            const st = pal.el[n.el];
            const isFav = favs.includes(n.el);
            const isSel = selectedWuXing === n.el;
            return h('g', {
              key: `el-${n.el}`,
              role: onSelectWuXing ? 'button' : undefined,
              tabIndex: onSelectWuXing ? 0 : undefined,
              'aria-label': `${n.el} ${n.pct}%${isFav ? ' 喜用' : ''}`,
              style: { cursor: onSelectWuXing ? 'pointer' : 'default' },
              onClick: onSelectWuXing ? () => onSelectWuXing(n.el) : undefined,
              onKeyDown: onSelectWuXing ? e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectWuXing(n.el); } } : undefined,
            },
              isFav ? h('circle', {
                cx: n.x, cy: n.y, r: 21,
                fill: 'none', stroke: pal.goldBright, strokeWidth: 1.4, strokeDasharray: '3 2.5', className: 'zm-spin-rev',
              }) : null,
              h('circle', {
                cx: n.x, cy: n.y, r: isSel ? 17.5 : 15.5,
                fill: pal.surface,
                stroke: st.ring,
                strokeWidth: isSel ? 2.4 : 1.6,
              }),
              h('circle', { cx: n.x, cy: n.y, r: isSel ? 14 : 12.5, fill: st.fill }),
              h('text', { x: n.x, y: n.y + 4, textAnchor: 'middle', fill: st.fg, fontSize: 12.5, fontWeight: 800 }, n.el),
            );
          }),

          // Layer 5: 4 Sculpted Celestial Pillar Medallions (Active) OR 4 Sacred Glyph Orbs (Idle)
          ...pillarPos.map(pos => {
            const p = chart?.pillars?.[pos.idx];
            const isSel = chart && selectedPillarIdx === pos.idx;
            const gc = p ? (pal.el[p.ganElement] || pal.el['金']) : pal.el['金'];
            const zc = p ? (pal.el[p.zhiElement] || pal.el['水']) : pal.el['水'];
            return h('g', {
              key: `pil-${pos.idx}`,
              role: p && onSelectPillar ? 'button' : undefined,
              tabIndex: p && onSelectPillar ? 0 : undefined,
              'aria-label': p ? `${p.label} ${p.ganZhi}` : `${pos.tag}柱`,
              style: { cursor: p ? 'pointer' : 'default' },
              onClick: p && onSelectPillar ? () => onSelectPillar(pos.idx) : undefined,
              onKeyDown: p && onSelectPillar ? e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectPillar(pos.idx); } } : undefined,
            },
              isSel ? h('circle', {
                cx: pos.x, cy: pos.y, r: 30.5,
                fill: 'none', stroke: pal.goldBright, strokeWidth: 1.8, strokeDasharray: '4 3', className: 'zm-spin-slow',
              }) : null,
              h('circle', {
                cx: pos.x, cy: pos.y, r: 26,
                fill: pal.surface,
                stroke: isSel ? pal.goldBright : (pos.idx === 2 ? pal.gold : gc.ring),
                strokeWidth: isSel ? 2.4 : (pos.idx === 2 ? 2 : 1.4),
              }),
              h('circle', { cx: pos.x, cy: pos.y, r: 22, fill: gc.fill }),
              p ? h(React.Fragment, null,
                h('text', { x: pos.x, y: pos.y - 2.5, textAnchor: 'middle', fill: gc.fg, fontSize: 15, fontWeight: 800 }, p.gan),
                h('text', { x: pos.x, y: pos.y + 13.5, textAnchor: 'middle', fill: zc.fg, fontSize: 14, fontWeight: 800 }, p.zhi),
                h('circle', { cx: pos.x + 19, cy: pos.y - 18, r: 8, fill: pal.surface, stroke: pal.gold, strokeWidth: 1.1 }),
                h('text', { x: pos.x + 19, y: pos.y - 15.2, textAnchor: 'middle', fill: pal.gold, fontSize: 8.5, fontWeight: 800 }, pos.tag),
              ) : h(React.Fragment, null,
                h('text', { x: pos.x, y: pos.y + 5, textAnchor: 'middle', fill: pal.gold, fontSize: 15, fontWeight: 800, opacity: 0.72 }, pos.tag),
              ),
            );
          }),

          // Layer 6: Central Radiant Day Master Solar Core (or Sculpted Taiji in Idle)
          h('circle', { cx, cy, r: 54, fill: 'none', stroke: pal.goldLine, strokeWidth: 1.2, className: 'zm-aura' }),
          h('circle', { cx, cy, r: 46, fill: `url(#${coreGrad})`, stroke: chart ? dmStyle.ring : pal.gold, strokeWidth: 2.2 }),
          chart ? h(React.Fragment, null,
            h('circle', { cx, cy, r: 39, fill: 'none', stroke: pal.goldFaint, strokeWidth: 1, strokeDasharray: '2 2' }),
            h('text', { x: cx, y: cy - 4, textAnchor: 'middle', fill: dmStyle.fg, fontSize: 24, fontWeight: 800 }, chart.dayMaster.gan),
            h('text', { x: cx, y: cy + 16, textAnchor: 'middle', fill: pal.gold, fontSize: 11, fontWeight: 700 }, `${chart.dayMaster.element} · 日主`),
          ) : h(TaijiCore, { cx, cy, r: 34, pal, spin: true }),
        );
      }

      // =========================================================================
      // 2. IMPERIAL BAZHAI 360° CARVED LUOPAN (420x420)
      // =========================================================================
      const DIR_TRIGRAM = {
        正南: '离', 西南: '坤', 正西: '兑', 西北: '乾',
        正北: '坎', 东北: '艮', 正东: '震', 东南: '巽',
      };

      function BaZhaiCompassSvg({ mingGua, isDark = true, selectedDir, onSelectDir }) {
        const pal = getPalette(isDark);
        const cx = 210;
        const cy = 210;
        const dirs = mingGua?.directions || [
          { direction: '正南', star: '离', luck: '吉' }, { direction: '西南', star: '坤', luck: '吉' },
          { direction: '正西', star: '兑', luck: '吉' }, { direction: '西北', star: '乾', luck: '吉' },
          { direction: '正北', star: '坎', luck: '凶' }, { direction: '东北', star: '艮', luck: '凶' },
          { direction: '正东', star: '震', luck: '凶' }, { direction: '东南', star: '巽', luck: '凶' },
        ];
        const wealthDeg = COMPASS_ANGLES[mingGua?.bestWealthDir] ?? -90;

        return h('svg', {
          viewBox: '0 0 420 420',
          width: '100%',
          role: 'img',
          'aria-label': mingGua ? `八宅命卦风水罗盘 ${mingGua.name}` : '八宅风水罗盘',
          style: { display: 'block', width: '100%', height: 'auto', aspectRatio: '1 / 1' },
        },
          // Outer 72-tick rotating vernier bezel
          h('g', { className: 'zm-spin-slow' },
            h('circle', { cx, cy, r: 202, fill: 'none', stroke: pal.goldLine, strokeWidth: 1.4 }),
            h('circle', { cx, cy, r: 190, fill: 'none', stroke: pal.goldFaint, strokeWidth: 1 }),
            ...Array.from({ length: 72 }, (_, i) => {
              const rad = (i * 5 * Math.PI) / 180;
              const major = i % 9 === 0;
              const mid = i % 3 === 0;
              return h('line', {
                key: `bz-${i}`,
                x1: (cx + Math.cos(rad) * (major ? 190 : mid ? 194 : 197)).toFixed(1),
                y1: (cy + Math.sin(rad) * (major ? 190 : mid ? 194 : 197)).toFixed(1),
                x2: (cx + Math.cos(rad) * 202).toFixed(1),
                y2: (cy + Math.sin(rad) * 202).toFixed(1),
                stroke: major ? pal.goldBright : pal.goldLine,
                strokeWidth: major ? 1.8 : 0.9,
              });
            }),
          ),

          // Ring 2: Engraved Vector Trigrams Halo
          h('circle', { cx, cy, r: 162, fill: 'none', stroke: pal.goldLine, strokeWidth: 1 }),
          ...Object.entries(DIR_TRIGRAM).map(([dir, tri]) => {
            const deg = COMPASS_ANGLES[dir] ?? 0;
            const rad = (deg * Math.PI) / 180;
            return h(VectorTrigram, {
              key: `tri-${dir}`,
              name: tri,
              x: cx + Math.cos(rad) * 175,
              y: cy + Math.sin(rad) * 175,
              width: 20,
              thickness: 2.5,
              gap: 2.5,
              angleDeg: deg + 90,
              color: pal.gold,
            });
          }),

          // Ring 3: 8 Interactive Radial Sectors
          ...dirs.map(d => {
            const deg = COMPASS_ANGLES[d.direction] ?? 0;
            const rad = (deg * Math.PI) / 180;
            const isGood = d.luck === '吉';
            const isSel = selectedDir === d.direction;
            const isBest = mingGua?.bestWealthDir === d.direction;
            return h('g', {
              key: d.direction,
              role: 'button',
              tabIndex: 0,
              'aria-label': `${d.direction} ${d.star} ${d.luck}`,
              style: { cursor: 'pointer' },
              onClick: () => onSelectDir && onSelectDir(d.direction),
              onKeyDown: e => { if ((e.key === 'Enter' || e.key === ' ') && onSelectDir) { e.preventDefault(); onSelectDir(d.direction); } },
            },
              h('path', {
                d: makeSectorPath(cx, cy, deg, 21.4, 72, 158),
                fill: isSel
                  ? (isGood ? pal.goodFillSel : pal.badFillSel)
                  : (isGood ? pal.goodFill : pal.wedgeIdle),
                stroke: isSel ? pal.selStroke : (isBest ? pal.goldBright : (isGood ? pal.goodStroke : pal.wedgeBorder)),
                strokeWidth: isSel ? 2.4 : (isBest ? 1.8 : 1.1),
              }),
              h('text', {
                x: cx + Math.cos(rad) * 124,
                y: cy + Math.sin(rad) * 124 + 4,
                textAnchor: 'middle',
                fill: isGood ? pal.goodStroke : pal.inkSub,
                fontSize: 13.5,
                fontWeight: 800,
              }, d.star),
              h('text', {
                x: cx + Math.cos(rad) * 92,
                y: cy + Math.sin(rad) * 92 + 3.5,
                textAnchor: 'middle',
                fill: isSel ? pal.gold : pal.inkMuted,
                fontSize: 10.5,
                fontWeight: 700,
              }, d.direction),
            );
          }),

          // Heaven Pool Center + Gleaming Magnetic Compass Needle pointing to 生气大财位
          h('circle', { cx, cy, r: 66, fill: pal.surface, stroke: pal.gold, strokeWidth: 2 }),
          h('circle', { cx, cy, r: 58, fill: 'none', stroke: pal.goldFaint, strokeWidth: 1, strokeDasharray: '2 3' }),
          // Needle rotated toward best wealth direction
          h('g', { transform: `rotate(${(wealthDeg + 90).toFixed(1)} ${cx} ${cy})` },
            h('polygon', { points: `${cx},${cy - 54} ${cx - 5.5},${cy} ${cx + 5.5},${cy}`, fill: pal.goodStroke, opacity: 0.92 }),
            h('polygon', { points: `${cx},${cy + 46} ${cx - 4.5},${cy} ${cx + 4.5},${cy}`, fill: pal.goldLine, opacity: 0.65 }),
          ),
          h('circle', { cx, cy, r: 28, fill: pal.surface, stroke: pal.gold, strokeWidth: 1.5 }),
          h('text', { x: cx, y: cy - 1, textAnchor: 'middle', fill: pal.gold, fontSize: 14, fontWeight: 800 }, mingGua ? mingGua.name : '八宅'),
          h('text', { x: cx, y: cy + 15, textAnchor: 'middle', fill: pal.goodStroke, fontSize: 9.5, fontWeight: 700 }, mingGua ? mingGua.group : '罗盘'),
        );
      }

      // =========================================================================
      // 3. QIMEN 360° IMPERIAL ARMILLARY SPHERE (420x420) — Idle + Active!
      // =========================================================================
      const IDLE_QIMEN_SECTORS = [
        { num: 9, direction: '正南', trigram: '离', gate: '景门', star: '天英', deity: '值符', heavenStem: '丙', earthStem: '丙' },
        { num: 2, direction: '西南', trigram: '坤', gate: '死门', star: '天芮', deity: '腾蛇', heavenStem: '丁', earthStem: '丁' },
        { num: 7, direction: '正西', trigram: '兑', gate: '惊门', star: '天柱', deity: '太阴', heavenStem: '庚', earthStem: '庚' },
        { num: 6, direction: '西北', trigram: '乾', gate: '开门', star: '天心', deity: '六合', heavenStem: '辛', earthStem: '辛' },
        { num: 1, direction: '正北', trigram: '坎', gate: '休门', star: '天蓬', deity: '白虎', heavenStem: '壬', earthStem: '壬' },
        { num: 8, direction: '东北', trigram: '艮', gate: '生门', star: '天任', deity: '玄武', heavenStem: '戊', earthStem: '戊' },
        { num: 3, direction: '正东', trigram: '震', gate: '伤门', star: '天冲', deity: '九地', heavenStem: '乙', earthStem: '乙' },
        { num: 4, direction: '东南', trigram: '巽', gate: '杜门', star: '天辅', deity: '九天', heavenStem: '己', earthStem: '己' },
      ];

      function QimenArmillarySvg({ chart, isDark = true, selectedPalaceNum, radarHits = [], onSelectPalace }) {
        const pal = getPalette(isDark);
        const cx = 210;
        const cy = 210;
        const hitSet = new Set(radarHits);
        const outerPalaces = chart ? chart.palaces.filter(p => !p.isCenter) : IDLE_QIMEN_SECTORS;
        const centerPalace = chart?.palaces?.find(p => p.isCenter);
        const glowId = `zm-qm-glow-${pal.key}`;

        return h('svg', {
          viewBox: '0 0 420 420',
          width: '100%',
          role: 'img',
          'aria-label': chart ? `奇门遁甲玄天浑天仪 ${chart.meta.juTitle}` : '奇门遁甲玄天浑天仪',
          style: { display: 'block', width: '100%', height: 'auto', aspectRatio: '1 / 1' },
        },
          h('defs', null,
            h('filter', { id: glowId, x: '-25%', y: '-25%', width: '150%', height: '150%' },
              h('feGaussianBlur', { stdDeviation: isDark ? 3.5 : 1.8, result: 'b' }),
              h('feMerge', null, h('feMergeNode', { in: 'b' }), h('feMergeNode', { in: 'SourceGraphic' })),
            ),
          ),

          // Layer 1: Rotating 72-division engraved golden vernier bezel
          h('g', { className: 'zm-spin-slow' },
            h('circle', { cx, cy, r: 202, fill: 'none', stroke: pal.goldLine, strokeWidth: 1.4 }),
            ...Array.from({ length: 72 }, (_, i) => {
              const rad = (i * 5 * Math.PI) / 180;
              const major = i % 9 === 0;
              return h('line', {
                key: `qt-${i}`,
                x1: (cx + Math.cos(rad) * (major ? 191 : 196)).toFixed(1),
                y1: (cy + Math.sin(rad) * (major ? 191 : 196)).toFixed(1),
                x2: (cx + Math.cos(rad) * 202).toFixed(1),
                y2: (cy + Math.sin(rad) * 202).toFixed(1),
                stroke: major ? pal.goldBright : pal.goldLine,
                strokeWidth: major ? 1.8 : 0.85,
              });
            }),
          ),

          // Layer 2: Tangential Precision Vector Trigram Bars
          h('circle', { cx, cy, r: 164, fill: 'none', stroke: pal.goldFaint, strokeWidth: 1 }),
          ...outerPalaces.map(p => {
            const deg = COMPASS_ANGLES[p.direction] ?? 0;
            const rad = (deg * Math.PI) / 180;
            return h(VectorTrigram, {
              key: `qt-tri-${p.num}`,
              name: p.trigram,
              x: cx + Math.cos(rad) * 177,
              y: cy + Math.sin(rad) * 177,
              width: 19,
              thickness: 2.3,
              gap: 2.3,
              angleDeg: deg + 90,
              color: hitSet.has(p.num) ? pal.goodStroke : pal.gold,
            });
          }),

          // Layer 3: 8 Tiered Palace Wedges
          ...outerPalaces.map(p => {
            const deg = COMPASS_ANGLES[p.direction] ?? 0;
            const rad = (deg * Math.PI) / 180;
            const isSel = chart && selectedPalaceNum === p.num;
            const isHit = chart && hitSet.has(p.num);
            const isGood = ['开门', '休门', '生门'].includes(p.gate);
            const isTough = ['死门', '惊门', '伤门'].includes(p.gate);

            return h('g', {
              key: p.num,
              role: chart ? 'button' : undefined,
              tabIndex: chart ? 0 : undefined,
              'aria-label': `${p.direction} ${p.gate} ${p.star} ${p.deity}`,
              style: { cursor: chart ? 'pointer' : 'default' },
              onClick: chart && onSelectPalace ? () => onSelectPalace(p.num) : undefined,
              onKeyDown: chart && onSelectPalace ? e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectPalace(p.num); } } : undefined,
            },
              h('path', {
                d: makeSectorPath(cx, cy, deg, 21.4, 60, 160),
                fill: isSel ? pal.selFill : isHit ? pal.goodFill : pal.wedgeIdle,
                stroke: isSel ? pal.selStroke : isHit ? pal.goodStroke : pal.wedgeBorder,
                strokeWidth: isSel ? 2.4 : isHit ? 1.9 : 1.05,
              }),
              // YongShen Radar Laser Beam
              isHit ? h('g', null,
                h('line', {
                  x1: (cx + Math.cos(rad) * 58).toFixed(1),
                  y1: (cy + Math.sin(rad) * 58).toFixed(1),
                  x2: (cx + Math.cos(rad) * 160).toFixed(1),
                  y2: (cy + Math.sin(rad) * 160).toFixed(1),
                  stroke: pal.goodStroke,
                  strokeWidth: 2,
                  strokeDasharray: '5 4',
                  className: 'zm-dash-flow',
                  opacity: 0.72,
                  filter: `url(#${glowId})`,
                }),
                h('circle', {
                  cx: (cx + Math.cos(rad) * 106).toFixed(1),
                  cy: (cy + Math.sin(rad) * 106).toFixed(1),
                  r: 17,
                  fill: 'none',
                  stroke: pal.goodStroke,
                  strokeWidth: 1.2,
                  opacity: 0.55,
                  className: 'zm-aura',
                }),
              ) : null,
              // Tiered Glyphs (Deity -> Star -> Gate -> Stems)
              h('text', {
                x: cx + Math.cos(rad) * 144,
                y: cy + Math.sin(rad) * 144 + 3.5,
                textAnchor: 'middle',
                fill: p.isZhiFu ? pal.goldBright : pal.indigo,
                fontSize: 10.5,
                fontWeight: 700,
              }, `${p.deity}${p.isKong ? '·空' : ''}`),
              h('text', {
                x: cx + Math.cos(rad) * 123,
                y: cy + Math.sin(rad) * 123 + 3.5,
                textAnchor: 'middle',
                fill: pal.inkSub,
                fontSize: 10.5,
                fontWeight: 600,
              }, p.star),
              h('text', {
                x: cx + Math.cos(rad) * 101,
                y: cy + Math.sin(rad) * 101 + 4.5,
                textAnchor: 'middle',
                fill: isGood ? pal.goodStroke : isTough ? pal.badStroke : pal.ink,
                fontSize: 13.5,
                fontWeight: 800,
              }, p.gate),
              h('text', {
                x: cx + Math.cos(rad) * 76,
                y: cy + Math.sin(rad) * 76 + 3.5,
                textAnchor: 'middle',
                fill: pal.gold,
                fontSize: 11,
                fontWeight: 800,
              }, `${p.heavenStem}/${p.earthStem}`),
            );
          }),

          // Layer 4: Concentric Separator Hairlines
          h('circle', { cx, cy, r: 87, fill: 'none', stroke: pal.goldFaint, strokeWidth: 0.8 }),
          h('circle', { cx, cy, r: 113, fill: 'none', stroke: pal.goldFaint, strokeWidth: 0.8 }),

          // Layer 5: Central Sculpted Taiji Pool / Ju Title Core
          h('g', {
            role: chart ? 'button' : undefined,
            tabIndex: chart ? 0 : undefined,
            'aria-label': chart ? `中五宫 ${chart.meta.juTitle}` : '太极中宫',
            style: { cursor: chart ? 'pointer' : 'default' },
            onClick: chart && onSelectPalace ? () => onSelectPalace(5) : undefined,
            onKeyDown: chart && onSelectPalace ? e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectPalace(5); } } : undefined,
          },
            h('circle', { cx, cy, r: 56, fill: pal.surface, stroke: pal.gold, strokeWidth: 2 }),
            chart ? h(React.Fragment, null,
              h('g', { opacity: isDark ? 0.22 : 0.14 }, h(TaijiCore, { cx, cy, r: 46, pal, spin: true })),
              h('text', { x: cx, y: cy - 3, textAnchor: 'middle', fill: pal.gold, fontSize: 14.5, fontWeight: 800 }, chart.meta.juTitle),
              h('text', { x: cx, y: cy + 16, textAnchor: 'middle', fill: pal.inkMuted, fontSize: 10.5, fontWeight: 700 }, `中寄 ${centerPalace?.earthStem || ''}`),
            ) : h(TaijiCore, { cx, cy, r: 44, pal, spin: true }),
          ),
        );
      }

      // =========================================================================
      // 4. MEIHUA XIANTIAN BAGUA & 6-YAO RESONATOR (420x420) — Idle + Active!
      // =========================================================================
      const CONGENITAL_RING = [
        { num: 1, name: '乾', el: '金', deg: -90 },
        { num: 2, name: '兑', el: '金', deg: -135 },
        { num: 3, name: '离', el: '火', deg: 180 },
        { num: 4, name: '震', el: '木', deg: 135 },
        { num: 8, name: '坤', el: '土', deg: 90 },
        { num: 7, name: '艮', el: '土', deg: 45 },
        { num: 6, name: '坎', el: '水', deg: 0 },
        { num: 5, name: '巽', el: '木', deg: -45 },
      ];

      function MeihuaResonatorSvg({ chart, isDark = true, activeStage = 'main' }) {
        const pal = getPalette(isDark);
        const cx = 210;
        const cy = 210;
        const ringR = 158;
        const glowId = `zm-mh-glow-${pal.key}`;

        const tiNum = chart?.tiYong?.tiTrigram?.num ?? 0;
        const yongNum = chart?.tiYong?.yongTrigram?.num ?? 0;
        const posOf = num => {
          const g = CONGENITAL_RING.find(x => x.num === num) || CONGENITAL_RING[0];
          const rad = (g.deg * Math.PI) / 180;
          return { x: cx + Math.cos(rad) * ringR, y: cy + Math.sin(rad) * ringR };
        };
        const pTi = posOf(tiNum);
        const pYong = posOf(yongNum);
        const rel = chart?.tiYong?.mainRelation;
        const beamColor = !rel
          ? pal.gold
          : rel.score >= 85 ? pal.goodStroke : rel.score >= 70 ? pal.blue : rel.score >= 52 ? pal.amber : pal.badStroke;

        const hex = chart?.hexagrams?.[activeStage] || chart?.hexagrams?.main;
        const movingLine = activeStage === 'main' || activeStage === 'changed' ? (chart?.meta?.movingLine || 0) : 0;

        return h('svg', {
          viewBox: '0 0 420 420',
          width: '100%',
          role: 'img',
          'aria-label': chart ? `先天八卦星轨仪 ${hex?.fullName || ''}` : '先天八卦太极星轮',
          style: { display: 'block', width: '100%', height: 'auto', aspectRatio: '1 / 1' },
        },
          h('defs', null,
            h('filter', { id: glowId, x: '-30%', y: '-30%', width: '160%', height: '160%' },
              h('feGaussianBlur', { stdDeviation: isDark ? 4.2 : 2, result: 'b' }),
              h('feMerge', null, h('feMergeNode', { in: 'b' }), h('feMergeNode', { in: 'SourceGraphic' })),
            ),
          ),

          // Outer 64-Hexagram Celestial Ring
          h('g', { className: 'zm-spin-slow' },
            h('circle', { cx, cy, r: 200, fill: 'none', stroke: pal.goldLine, strokeWidth: 1.2 }),
            ...Array.from({ length: 64 }, (_, i) => {
              const rad = (i * (360 / 64) * Math.PI) / 180;
              const major = i % 8 === 0;
              return h('line', {
                key: `m64-${i}`,
                x1: (cx + Math.cos(rad) * (major ? 191 : 195)).toFixed(1),
                y1: (cy + Math.sin(rad) * (major ? 191 : 195)).toFixed(1),
                x2: (cx + Math.cos(rad) * 200).toFixed(1),
                y2: (cy + Math.sin(rad) * 200).toFixed(1),
                stroke: major ? pal.goldBright : pal.goldFaint,
                strokeWidth: major ? 1.6 : 0.9,
              });
            }),
          ),

          // Octagonal sacred halo linking the 8 Bagua nodes
          h('polygon', {
            points: CONGENITAL_RING.map(g => {
              const rad = (g.deg * Math.PI) / 180;
              return `${(cx + Math.cos(rad) * ringR).toFixed(1)},${(cy + Math.sin(rad) * ringR).toFixed(1)}`;
            }).join(' '),
            fill: 'none',
            stroke: pal.goldFaint,
            strokeWidth: 1,
          }),
          h('circle', { cx, cy, r: ringR, fill: 'none', stroke: pal.goldLine, strokeWidth: 1, strokeDasharray: '3 5' }),

          // Thick Multi-Layer Glowing Ti <-> Yong Energy Stream
          chart && tiNum && yongNum ? (
            tiNum !== yongNum ? h('g', null,
              h('path', {
                d: `M ${pYong.x.toFixed(1)} ${pYong.y.toFixed(1)} Q ${cx} ${cy} ${pTi.x.toFixed(1)} ${pTi.y.toFixed(1)}`,
                fill: 'none', stroke: beamColor, strokeWidth: 7, opacity: isDark ? 0.22 : 0.16, filter: `url(#${glowId})`,
              }),
              h('path', {
                d: `M ${pYong.x.toFixed(1)} ${pYong.y.toFixed(1)} Q ${cx} ${cy} ${pTi.x.toFixed(1)} ${pTi.y.toFixed(1)}`,
                fill: 'none', stroke: beamColor, strokeWidth: 2.6, strokeDasharray: '7 5', className: 'zm-dash-flow',
              }),
            ) : h('circle', {
              cx: pTi.x, cy: pTi.y, r: 34,
              fill: 'none', stroke: beamColor, strokeWidth: 2.2, strokeDasharray: '5 4', className: 'zm-dash-flow',
            })
          ) : null,

          // 8 Congenital Bagua Crystal Medallions (with crisp Vector Trigrams!)
          ...CONGENITAL_RING.map(g => {
            const rad = (g.deg * Math.PI) / 180;
            const x = cx + Math.cos(rad) * ringR;
            const y = cy + Math.sin(rad) * ringR;
            const isTi = chart && g.num === tiNum;
            const isYong = chart && g.num === yongNum;
            const elSt = pal.el[g.el];
            const ringColor = isTi ? pal.goldBright : (isYong ? pal.purple : elSt.ring);

            return h('g', { key: g.num },
              (isTi || isYong) ? h('circle', {
                cx: x, cy: y, r: 29,
                fill: 'none', stroke: ringColor, strokeWidth: 1.5, strokeDasharray: '3 3', className: 'zm-spin-rev',
              }) : null,
              h('circle', {
                cx: x, cy: y, r: 24,
                fill: pal.surface,
                stroke: ringColor,
                strokeWidth: (isTi || isYong) ? 2.4 : 1.3,
              }),
              h('circle', { cx: x, cy: y, r: 20.5, fill: isTi ? pal.goldSoft : isYong ? pal.trineFill : elSt.fill }),
              h(VectorTrigram, {
                name: g.name,
                x, y: y - 5.5,
                width: 18, thickness: 2.2, gap: 2, angleDeg: 0,
                color: isTi ? pal.gold : isYong ? pal.purple : elSt.fg,
              }),
              h('text', {
                x, y: y + 13.5,
                textAnchor: 'middle',
                fill: isTi ? pal.gold : isYong ? pal.purple : pal.ink,
                fontSize: 10.5,
                fontWeight: 800,
              }, isTi && isYong ? `${g.name}·体用` : isTi ? `${g.name}·体` : isYong ? `${g.name}·用` : g.name),
            );
          }),

          // Central Monumental Hexagram Altar (Active) OR Grand Sculpted Taiji Sphere (Idle)
          h('circle', { cx, cy, r: 96, fill: 'none', stroke: chart ? beamColor : pal.goldLine, strokeWidth: 1.4, opacity: 0.55, className: 'zm-aura' }),
          h('circle', { cx, cy, r: 90, fill: pal.surface, stroke: chart ? beamColor : pal.gold, strokeWidth: 2.2 }),
          hex ? h('g', null,
            h('g', { opacity: isDark ? 0.13 : 0.09 }, h(TaijiCore, { cx, cy, r: 82, pal })),
            // 6 Monumental Sculpted Yao Bars
            ...[5, 4, 3, 2, 1, 0].flatMap((idx, row) => {
              const yaoNum = idx + 1;
              const isYang = hex.lines[idx] === 1;
              const isMov = movingLine === yaoNum;
              const barW = 84;
              const barH = 8.5;
              const gapY = 6.5;
              const startY = cy - 54;
              const yy = startY + row * (barH + gapY);
              const isUpper = idx >= 3;
              const isTiBar = activeStage !== 'mutual' && ((chart.tiYong.tiPosition === 'upper' && isUpper) || (chart.tiYong.tiPosition === 'lower' && !isUpper));
              const barCol = isMov ? pal.badStroke : (isTiBar ? pal.goldBright : pal.indigo);
              const els = [];
              if (isYang) {
                els.push(h('rect', {
                  key: `yao-${yaoNum}`,
                  x: cx - barW / 2, y: yy, width: barW, height: barH, rx: 4.25,
                  fill: barCol,
                  filter: isMov ? `url(#${glowId})` : undefined,
                  className: isMov ? 'zm-pulse-glow' : '',
                }));
              } else {
                const segW = (barW - 16) / 2;
                els.push(
                  h('rect', { key: `yao-${yaoNum}-l`, x: cx - barW / 2, y: yy, width: segW, height: barH, rx: 4.25, fill: barCol, filter: isMov ? `url(#${glowId})` : undefined, className: isMov ? 'zm-pulse-glow' : '' }),
                  h('rect', { key: `yao-${yaoNum}-r`, x: cx + 8, y: yy, width: segW, height: barH, rx: 4.25, fill: barCol, filter: isMov ? `url(#${glowId})` : undefined, className: isMov ? 'zm-pulse-glow' : '' }),
                );
              }
              if (isMov) {
                els.push(h('polygon', {
                  key: `mov-${yaoNum}`,
                  points: `${cx + barW / 2 + 7},${yy + 4.25} ${cx + barW / 2 + 12},${yy} ${cx + barW / 2 + 17},${yy + 4.25} ${cx + barW / 2 + 12},${yy + 8.5}`,
                  fill: pal.badStroke,
                }));
              }
              return els;
            }),
            h('text', { x: cx, y: cy + 50, textAnchor: 'middle', fill: pal.gold, fontSize: 13.5, fontWeight: 800 }, hex.fullName),
            h('text', { x: cx, y: cy + 66, textAnchor: 'middle', fill: beamColor, fontSize: 10, fontWeight: 700 }, `${rel.relation} · ${chart.tiYong.overallVerdict}`),
          ) : h(TaijiCore, { cx, cy, r: 70, pal, spin: true }),
        );
      }

      // =========================================================================
      // 5. ZIWEI 12-PALACE CELESTIAL STAR-CHART WHEEL (420x420) — Idle + Active!
      // =========================================================================
      const IDLE_ZW_PALACES = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'].map((br, i) => ({
        index: i,
        name: ['命宫', '父母', '福德', '田宅', '官禄', '仆役', '迁移', '疾厄', '财帛', '子女', '夫妻', '兄弟'][i],
        earthlyBranch: br,
        majorStars: [],
        minorStars: [],
        oppositeIndex: (i + 6) % 12,
        trineIndices: [(i + 4) % 12, (i + 8) % 12],
      }));

      // Map 12 branches clockwise like traditional chart: 巳(3) top-left -> 午(4) top -> ...
      function ziweiAngleForIndex(idx) {
        // 午 (idx 4) at -75° / -105°, placing 巳(3)..申(6) across top, 亥(9)..寅(0) across bottom
        return -135 + (idx - 3) * 30;
      }

      function ZiweiStarWheelSvg({ chart, isDark = true, selectedPalaceIdx = 0, yearlyObj = null, onSelectPalace }) {
        const pal = getPalette(isDark);
        const cx = 210;
        const cy = 210;
        const palaces = chart?.palaces || IDLE_ZW_PALACES;
        const selPalace = palaces[selectedPalaceIdx] || palaces[0];
        const triSet = new Set([selPalace.oppositeIndex, ...(selPalace.trineIndices || [])]);
        const innerR = 98;
        const outerR = 192;
        const glowId = `zm-zw-glow-${pal.key}`;

        const yearlyMutByStar = {};
        if (yearlyObj?.mutagens) {
          for (const m of yearlyObj.mutagens) yearlyMutByStar[m.star] = m.mutagen;
        }

        const anchorOnInner = idx => {
          const rad = (ziweiAngleForIndex(idx) * Math.PI) / 180;
          return { x: cx + Math.cos(rad) * (innerR - 4), y: cy + Math.sin(rad) * (innerR - 4) };
        };

        const pSelf = anchorOnInner(selPalace.index);
        const pOpp = anchorOnInner(selPalace.oppositeIndex);
        const pT1 = anchorOnInner(selPalace.trineIndices[0]);
        const pT2 = anchorOnInner(selPalace.trineIndices[1]);

        const mutDotColor = { 禄: pal.goodStroke, 权: pal.amber, 科: pal.blue, 忌: pal.badStroke };

        return h('svg', {
          viewBox: '0 0 420 420',
          width: '100%',
          role: 'img',
          'aria-label': chart ? `紫微垣十二宫星图 ${chart.title}` : '紫微垣十二宫星图轮盘',
          style: { display: 'block', width: '100%', height: 'auto', aspectRatio: '1 / 1' },
        },
          h('defs', null,
            h('filter', { id: glowId, x: '-30%', y: '-30%', width: '160%', height: '160%' },
              h('feGaussianBlur', { stdDeviation: isDark ? 3.5 : 1.6, result: 'b' }),
              h('feMerge', null, h('feMergeNode', { in: 'b' }), h('feMergeNode', { in: 'SourceGraphic' })),
            ),
          ),

          // Outer Astronomical Degree Ring
          h('g', { className: 'zm-spin-slow' },
            h('circle', { cx, cy, r: 204, fill: 'none', stroke: pal.goldLine, strokeWidth: 1.2 }),
            ...Array.from({ length: 48 }, (_, i) => {
              const rad = (i * 7.5 * Math.PI) / 180;
              const maj = i % 4 === 0;
              return h('line', {
                key: `zt-${i}`,
                x1: (cx + Math.cos(rad) * (maj ? 196 : 199)).toFixed(1),
                y1: (cy + Math.sin(rad) * (maj ? 196 : 199)).toFixed(1),
                x2: (cx + Math.cos(rad) * 204).toFixed(1),
                y2: (cy + Math.sin(rad) * 204).toFixed(1),
                stroke: maj ? pal.goldBright : pal.goldFaint,
                strokeWidth: maj ? 1.5 : 0.8,
              });
            }),
          ),

          // 12 Radial Palace Wedges
          ...palaces.map(p => {
            const deg = ziweiAngleForIndex(p.index);
            const rad = (deg * Math.PI) / 180;
            const isSelf = chart && p.index === selectedPalaceIdx;
            const isTrine = chart && !isSelf && triSet.has(p.index);
            const isYearly = chart && yearlyObj && yearlyObj.palaceIndex === p.index;
            const starLabel = p.majorStars.slice(0, 2).map(s => s.name).join('·') || (chart ? '空' : p.earthlyBranch);
            const firstMut = p.majorStars.find(s => s.mutagen)?.mutagen || p.minorStars.find(s => s.mutagen)?.mutagen;
            const firstYMut = p.majorStars.map(s => yearlyMutByStar[s.name]).find(Boolean) || p.minorStars.map(s => yearlyMutByStar[s.name]).find(Boolean);
            const brightRadius = p.majorStars[0]?.brightness === '庙' ? 4.2 : p.majorStars[0]?.brightness === '旺' ? 3.5 : 2.6;

            return h('g', {
              key: p.index,
              role: chart ? 'button' : undefined,
              tabIndex: chart ? 0 : undefined,
              'aria-label': `${p.name} ${starLabel}`,
              style: { cursor: chart ? 'pointer' : 'default' },
              onClick: chart && onSelectPalace ? () => onSelectPalace(p.index) : undefined,
              onKeyDown: chart && onSelectPalace ? e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectPalace(p.index); } } : undefined,
            },
              h('path', {
                d: makeSectorPath(cx, cy, deg, 14.2, innerR, outerR),
                fill: isSelf ? pal.selFill : isTrine ? pal.trineFill : pal.wedgeIdle,
                stroke: isYearly ? pal.cyan : isSelf ? pal.selStroke : isTrine ? pal.trineStroke : pal.wedgeBorder,
                strokeWidth: (isSelf || isYearly) ? 2.2 : isTrine ? 1.6 : 1,
              }),
              // Glowing Star-Dot scaled by brightness
              h('circle', {
                cx: (cx + Math.cos(rad) * 116).toFixed(1),
                cy: (cy + Math.sin(rad) * 116).toFixed(1),
                r: p.majorStars.length ? brightRadius : 1.8,
                fill: isSelf ? pal.goldBright : (p.majorStars.length ? pal.purple : pal.inkMuted),
                filter: p.majorStars.length ? `url(#${glowId})` : undefined,
              }),
              // Primary Star Name(s)
              h('text', {
                x: cx + Math.cos(rad) * 145,
                y: cy + Math.sin(rad) * 145 + 3.5,
                textAnchor: 'middle',
                fill: p.majorStars.length ? (isSelf ? pal.gold : pal.purple) : pal.inkMuted,
                fontSize: starLabel.length > 3 ? 9 : 10.5,
                fontWeight: 800,
              }, starLabel),
              // Palace Name on outer rim
              h('text', {
                x: cx + Math.cos(rad) * 176,
                y: cy + Math.sin(rad) * 176 + 3.5,
                textAnchor: 'middle',
                fill: p.isSoulPalace ? pal.gold : isYearly ? pal.cyan : pal.inkSub,
                fontSize: 10,
                fontWeight: (p.isSoulPalace || isYearly) ? 800 : 600,
              }, p.name),
              // Natal Mutagen Gem
              firstMut ? h('g', null,
                h('circle', {
                  cx: (cx + Math.cos(rad - 0.12) * 130).toFixed(1),
                  cy: (cy + Math.sin(rad - 0.12) * 130).toFixed(1),
                  r: 6.5,
                  fill: mutDotColor[firstMut] || pal.gold,
                }),
                h('text', {
                  x: (cx + Math.cos(rad - 0.12) * 130).toFixed(1),
                  y: (cy + Math.sin(rad - 0.12) * 130 + 2.8).toFixed(1),
                  textAnchor: 'middle',
                  fill: '#ffffff',
                  fontSize: 7.5,
                  fontWeight: 800,
                }, firstMut),
              ) : null,
              // Yearly Flying Mutagen Gem
              firstYMut ? h('g', null,
                h('circle', {
                  cx: (cx + Math.cos(rad + 0.12) * 130).toFixed(1),
                  cy: (cy + Math.sin(rad + 0.12) * 130).toFixed(1),
                  r: 6.5,
                  fill: pal.cyan,
                }),
                h('text', {
                  x: (cx + Math.cos(rad + 0.12) * 130).toFixed(1),
                  y: (cy + Math.sin(rad + 0.12) * 130 + 2.8).toFixed(1),
                  textAnchor: 'middle',
                  fill: '#ffffff',
                  fontSize: 7.5,
                  fontWeight: 800,
                }, firstYMut),
              ) : null,
            );
          }),

          // Inner Polaris Star-Chart Core + Tri-Aspect Constellation Laser Geometry
          h('circle', { cx, cy, r: innerR - 2, fill: pal.surface, stroke: pal.gold, strokeWidth: 1.8 }),
          h('circle', { cx, cy, r: innerR - 14, fill: 'none', stroke: pal.goldFaint, strokeWidth: 0.9, strokeDasharray: '2 4' }),
          // Luminous Tri-Aspect Triangle (三合)
          h('polygon', {
            points: `${pSelf.x.toFixed(1)},${pSelf.y.toFixed(1)} ${pT1.x.toFixed(1)},${pT1.y.toFixed(1)} ${pT2.x.toFixed(1)},${pT2.y.toFixed(1)}`,
            fill: pal.trineFill,
            stroke: pal.trineStroke,
            strokeWidth: 1.8,
            strokeLinejoin: 'round',
            filter: `url(#${glowId})`,
          }),
          // Golden Opposition Spear (对宫冲照)
          h('line', {
            x1: pSelf.x.toFixed(1), y1: pSelf.y.toFixed(1), x2: pOpp.x.toFixed(1), y2: pOpp.y.toFixed(1),
            stroke: pal.goldBright,
            strokeWidth: 2,
            strokeDasharray: '6 4',
            className: 'zm-dash-flow',
          }),
          ...[pSelf, pOpp, pT1, pT2].map((pt, i) => h('circle', {
            key: `v-${i}`,
            cx: pt.x, cy: pt.y,
            r: i === 0 ? 5.2 : 3.8,
            fill: i <= 1 ? pal.goldBright : pal.trineStroke,
          })),

          // Center Core Medallion
          h('circle', { cx, cy, r: 42, fill: pal.surface, stroke: pal.goldLine, strokeWidth: 1.2, opacity: 0.92 }),
          chart ? h(React.Fragment, null,
            h('text', { x: cx, y: cy - 7, textAnchor: 'middle', fill: pal.gold, fontSize: 13.5, fontWeight: 800 }, chart.meta.fiveElementsClass),
            h('text', { x: cx, y: cy + 9, textAnchor: 'middle', fill: pal.ink, fontSize: 11, fontWeight: 700 }, selPalace.name),
            h('text', { x: cx, y: cy + 23, textAnchor: 'middle', fill: yearlyObj ? pal.cyan : pal.inkMuted, fontSize: 9.5, fontWeight: 700 },
              yearlyObj ? `${yearlyObj.year} ${yearlyObj.stemBranch}` : `主星 ${chart.meta.soulStar}`,
            ),
          ) : h(React.Fragment, null,
            h('text', { x: cx, y: cy - 2, textAnchor: 'middle', fill: pal.gold, fontSize: 15, fontWeight: 800 }, '紫微垣'),
            h('text', { x: cx, y: cy + 15, textAnchor: 'middle', fill: pal.inkMuted, fontSize: 9.5 }, '十二宫星盘'),
          ),
        );
      }

      // =========================================================================
      // 6. HEPAN BINARY-STAR GRAVITATIONAL ORRERY (420x360) — Idle + Active!
      // =========================================================================
      function HepanOrrerySvg({ chart, isDark = true }) {
        const pal = getPalette(isDark);
        const cx = 210;
        const cy = 180;
        const score = chart?.overallScore ?? 86;
        const accent = score >= 82 ? pal.pink : score >= 70 ? pal.gold : pal.blue;
        const ringR = 52;
        const circ = 2 * Math.PI * ringR;
        const dashOff = circ * (1 - score / 100);
        const glowId = `zm-hp-glow-${pal.key}`;
        const elements = ['木', '火', '土', '金', '水'];

        const renderElementMoons = (ox, oy, pctMap, tiltDeg) => elements.map((el, i) => {
          const a = ((i * 72 - 90 + tiltDeg) * Math.PI) / 180;
          const mx = ox + Math.cos(a) * 56;
          const my = oy + Math.sin(a) * 34;
          const pct = pctMap?.[el] ?? 20;
          const r = 3.2 + Math.min(4.6, pct / 9);
          return h('circle', {
            key: `${ox}-${el}`,
            cx: mx.toFixed(1), cy: my.toFixed(1), r: r.toFixed(1),
            fill: pal.el[el].fg,
            opacity: 0.9,
          });
        });

        // 6-petal harmonic lotus around central resonance core
        const dims = chart?.dimensions || [
          { score: 85 }, { score: 80 }, { score: 78 }, { score: 84 }, { score: 82 }, { score: 88 },
        ];
        const lotusPts = dims.slice(0, 6).map((d, i) => {
          const a = -Math.PI / 2 + (i * 2 * Math.PI) / 6;
          const rr = 64 + ((d.score || 75) / 100) * 34;
          return `${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`;
        }).join(' ');

        return h('svg', {
          viewBox: '0 0 420 360',
          width: '100%',
          role: 'img',
          'aria-label': chart ? `双星引力合盘图 ${score}分 ${chart.grade}` : '双星引力合盘星云',
          style: { display: 'block', width: '100%', height: 'auto' },
        },
          h('defs', null,
            h('filter', { id: glowId, x: '-30%', y: '-30%', width: '160%', height: '160%' },
              h('feGaussianBlur', { stdDeviation: isDark ? 4.5 : 2, result: 'b' }),
              h('feMerge', null, h('feMergeNode', { in: 'b' }), h('feMergeNode', { in: 'SourceGraphic' })),
            ),
            h('radialGradient', { id: `zm-hp-a-${pal.key}`, cx: '38%', cy: '32%', r: '66%' },
              h('stop', { offset: '0%', stopColor: isDark ? '#93c5fd' : '#dbeafe' }),
              h('stop', { offset: '55%', stopColor: isDark ? '#2563eb' : '#60a5fa' }),
              h('stop', { offset: '100%', stopColor: isDark ? '#1e3a8a' : '#1d4ed8' }),
            ),
            h('radialGradient', { id: `zm-hp-b-${pal.key}`, cx: '38%', cy: '32%', r: '66%' },
              h('stop', { offset: '0%', stopColor: isDark ? '#fbcfe8' : '#fce7f3' }),
              h('stop', { offset: '55%', stopColor: isDark ? '#db2777' : '#f472b6' }),
              h('stop', { offset: '100%', stopColor: isDark ? '#831843' : '#be185d' }),
            ),
          ),

          // Outer Cosmic Resonance Halo + 6-Axis Harmonic Polygon
          h('circle', { cx, cy, r: 146, fill: 'none', stroke: pal.goldFaint, strokeWidth: 1, strokeDasharray: '4 6', className: 'zm-spin-slow' }),
          h('polygon', {
            points: lotusPts,
            fill: isDark ? 'rgba(244,114,182,0.10)' : 'rgba(190,24,93,0.08)',
            stroke: accent,
            strokeWidth: 1.3,
            strokeDasharray: '3 3',
          }),

          // Dual Tilted 3D Orbital Rings
          h('ellipse', { cx: 78, cy, rx: 56, ry: 34, fill: 'none', stroke: pal.blue, strokeWidth: 1.2, opacity: 0.45, transform: `rotate(-18 78 ${cy})` }),
          h('ellipse', { cx: 342, cy, rx: 56, ry: 34, fill: 'none', stroke: pal.pink, strokeWidth: 1.2, opacity: 0.45, transform: `rotate(18 342 ${cy})` }),

          // Twin Intertwining Infinity Gravitational Ribbons
          h('path', {
            d: `M 78 ${cy} C 134 ${cy - 98}, 286 ${cy + 98}, 342 ${cy}`,
            fill: 'none', stroke: pal.goldBright, strokeWidth: 2.4, strokeDasharray: '7 5', className: 'zm-dash-flow', filter: `url(#${glowId})`,
          }),
          h('path', {
            d: `M 342 ${cy} C 286 ${cy - 98}, 134 ${cy + 98}, 78 ${cy}`,
            fill: 'none', stroke: accent, strokeWidth: 2.4, strokeDasharray: '7 5', className: 'zm-dash-flow',
          }),

          // Five-Element Satellite Moons around both planets
          ...renderElementMoons(78, cy, chart?.personA?.wuxingPct, -18),
          ...renderElementMoons(342, cy, chart?.personB?.wuxingPct, 18),

          // Planet A (Sapphire Orb)
          h('circle', { cx: 78, cy, r: 42, fill: 'none', stroke: pal.blue, strokeWidth: 1.2, opacity: 0.45, className: 'zm-aura' }),
          h('circle', { cx: 78, cy, r: 35, fill: `url(#zm-hp-a-${pal.key})`, stroke: pal.blue, strokeWidth: 1.6 }),
          h('text', { x: 78, y: cy - 3, textAnchor: 'middle', fill: '#ffffff', fontSize: 13, fontWeight: 800 }, chart ? chart.personA.name.slice(0, 4) : '乾 · 甲'),
          h('text', { x: 78, y: cy + 14, textAnchor: 'middle', fill: 'rgba(255,255,255,0.90)', fontSize: 10.5, fontWeight: 700 }, chart ? `${chart.personA.dayMaster}` : '日主星'),

          // Planet B (Rose-Gold Orb)
          h('circle', { cx: 342, cy, r: 42, fill: 'none', stroke: pal.pink, strokeWidth: 1.2, opacity: 0.45, className: 'zm-aura' }),
          h('circle', { cx: 342, cy, r: 35, fill: `url(#zm-hp-b-${pal.key})`, stroke: pal.pink, strokeWidth: 1.6 }),
          h('text', { x: 342, y: cy - 3, textAnchor: 'middle', fill: '#ffffff', fontSize: 13, fontWeight: 800 }, chart ? chart.personB.name.slice(0, 4) : '坤 · 乙'),
          h('text', { x: 342, y: cy + 14, textAnchor: 'middle', fill: 'rgba(255,255,255,0.90)', fontSize: 10.5, fontWeight: 700 }, chart ? `${chart.personB.dayMaster}` : '日主星'),

          // Central Resonance Core with Radial Score Arc
          h('circle', { cx, cy, r: ringR + 7, fill: pal.surface, stroke: pal.goldLine, strokeWidth: 1.3 }),
          h('circle', { cx, cy, r: ringR, fill: 'none', stroke: pal.goldFaint, strokeWidth: 6 }),
          h('circle', {
            cx, cy, r: ringR,
            fill: 'none',
            stroke: accent,
            strokeWidth: 6,
            strokeLinecap: 'round',
            strokeDasharray: circ.toFixed(1),
            strokeDashoffset: chart ? dashOff.toFixed(1) : (circ * 0.25).toFixed(1),
            transform: `rotate(-90 ${cx} ${cy})`,
            filter: `url(#${glowId})`,
            style: { transition: 'stroke-dashoffset 0.7s ease' },
          }),
          chart ? h(React.Fragment, null,
            h('text', { x: cx, y: cy + 3, textAnchor: 'middle', fill: pal.ink, fontSize: 30, fontWeight: 800 }, String(score)),
            h('text', { x: cx, y: cy + 23, textAnchor: 'middle', fill: accent, fontSize: 11.5, fontWeight: 800 }, chart.grade),
          ) : h(React.Fragment, null,
            h('text', { x: cx, y: cy + 4, textAnchor: 'middle', fill: pal.gold, fontSize: 18, fontWeight: 800 }, '合盘'),
            h('text', { x: cx, y: cy + 22, textAnchor: 'middle', fill: pal.inkMuted, fontSize: 10 }, '双星共振'),
          ),
        );
      }

      // 30-Year Dual Fortune Sync Wave Chart (Theme-aware)
      function HepanTimeline30ySvg({ timeline30y = [], nameA = '甲方', nameB = '乙方', isDark = true }) {
        if (timeline30y.length < 2) return null;
        const pal = getPalette(isDark);
        const w = 380;
        const hBox = 190;
        const padL = 24;
        const padR = 16;
        const padT = 26;
        const padB = 30;
        const innerW = w - padL - padR;
        const innerH = hBox - padT - padB;

        const xAt = i => padL + (i / (timeline30y.length - 1)) * innerW;
        const yAt = sc => padT + innerH - ((Math.max(40, Math.min(100, sc)) - 40) / 60) * innerH;
        const pathFor = key => timeline30y.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i).toFixed(1)} ${yAt(pt[key]).toFixed(1)}`).join(' ');

        return h('svg', {
          viewBox: `0 0 ${w} ${hBox}`,
          width: '100%',
          role: 'img',
          'aria-label': '未来30年双人大运同步共振曲线',
          style: { display: 'block', width: '100%', height: 'auto' },
        },
          ...[50, 70, 90].map(v => h('line', {
            key: `g-${v}`,
            x1: padL, y1: yAt(v), x2: w - padR, y2: yAt(v),
            stroke: pal.goldFaint, strokeWidth: 1, strokeDasharray: '3 3',
          })),
          ...timeline30y.map((pt, i) => pt.phase === '双星共旺黄金期' ? h('rect', {
            key: `gold-${pt.year}`,
            x: xAt(i) - 14, y: padT, width: 28, height: innerH, rx: 5,
            fill: pal.goldSoft,
          }) : null),
          h('path', { d: pathFor('scoreA'), fill: 'none', stroke: pal.blue, strokeWidth: 2.6, strokeLinejoin: 'round' }),
          h('path', { d: pathFor('scoreB'), fill: 'none', stroke: pal.pink, strokeWidth: 2.6, strokeLinejoin: 'round' }),
          ...timeline30y.map((pt, i) => h('g', { key: pt.year },
            h('circle', { cx: xAt(i), cy: yAt(pt.scoreA), r: 3.4, fill: pal.blue }),
            h('circle', { cx: xAt(i), cy: yAt(pt.scoreB), r: 3.4, fill: pal.pink }),
            i % 2 === 0 || i === timeline30y.length - 1 ? h('text', {
              x: xAt(i), y: hBox - 9,
              textAnchor: 'middle', fill: pal.inkMuted, fontSize: 9.5, fontWeight: 600,
            }, String(pt.year)) : null,
          )),
          h('circle', { cx: padL + 4, cy: 12, r: 3.5, fill: pal.blue }),
          h('text', { x: padL + 12, y: 15.5, fill: pal.inkSub, fontSize: 10, fontWeight: 700 }, nameA),
          h('circle', { cx: padL + 72, cy: 12, r: 3.5, fill: pal.pink }),
          h('text', { x: padL + 80, y: 15.5, fill: pal.inkSub, fontSize: 10, fontWeight: 700 }, nameB),
          h('rect', { x: w - 98, y: 7, width: 12, height: 9, rx: 2, fill: pal.goldSoft, stroke: pal.gold, strokeWidth: 0.8 }),
          h('text', { x: w - 82, y: 15.5, fill: pal.gold, fontSize: 10, fontWeight: 700 }, '双星共旺期'),
        );
      }

      // =========================================================================
      // 7. XUANKONG NINE FLYING STARS OCTAGONAL LUOPAN ALTAR (420x420)
      // =========================================================================
      const FLYING_STAR_INFO = {
        1: { name: '一白贪狼', short: '一白', tag: '桃花贵人', luck: '吉', colorD: '#60a5fa', colorL: '#1d4ed8', tip: '主贵人、桃花与人际顺遂，宜保持明亮洁净，可配水培绿植或蓝色饰品。' },
        2: { name: '二黑巨门', short: '二黑', tag: '病符宜静', luck: '凶', colorD: '#fbbf24', colorL: '#b45309', tip: '主健康疲惫与脾胃提醒，忌堆放杂物与红黄燥色，宜安静整洁并用铜/金属器物泄土。' },
        3: { name: '三碧禄存', short: '三碧', tag: '防口舌', luck: '凶', colorD: '#34d399', colorL: '#047857', tip: '易生争执急躁，忌过度摆放绿植，宜用暖色台灯或红色点缀化木生火。' },
        4: { name: '四绿文曲', short: '四绿', tag: '文昌学业', luck: '大吉', colorD: '#10b981', colorL: '#059669', tip: '书房办公绝佳方位！极利考试学习、创意策划与文书升职，宜摆富贵竹或文具。' },
        5: { name: '五黄廉贞', short: '五黄', tag: '忌动土', luck: '忌动', colorD: '#fb7185', colorL: '#c81e3a', tip: '宜静不宜动，忌在此方装修敲打或摆红色/嘈杂电器，宜保持素净或放金属风铃/铜饰化解。' },
        6: { name: '六白武曲', short: '六白', tag: '偏财晋升', luck: '吉', colorD: '#fde047', colorL: '#9a6700', tip: '利偏财、出差远行与职场晋升，宜整洁敞亮，可用黄色或陶瓷摆件土生金旺财。' },
        7: { name: '七赤破军', short: '七赤', tag: '防破耗', luck: '慎', colorD: '#cbd5e1', colorL: '#475569', tip: '留意言辞分寸与财务合同核对，宜保持平和收敛，可用清澈水景或蓝色饰物泄金。' },
        8: { name: '八白左辅', short: '八白', tag: '正财稳进', luck: '大吉', colorD: '#f59e0b', colorL: '#b45309', tip: '经典正财位！宜常开启灯光保持人气流通，摆陶瓷/黄水晶/暖灯最聚稳健财气。' },
        9: { name: '九紫右弼', short: '九紫', tag: '九运当旺', luck: '大吉', colorD: '#f472b6', colorL: '#be185d', tip: '下元九运（2024–2043）第一当旺大吉星！主大财、喜庆与爆红机遇，宜红紫暖光与生机绿植催旺。' },
      };

      function getFlyingStarsForYear(year) {
        const centerStar = (((2026 - year) % 9) + 9) % 9 + 1;
        const flyOrder = [5, 6, 7, 8, 9, 1, 2, 3, 4];
        const starByPalace = {};
        flyOrder.forEach((pNum, offset) => {
          starByPalace[pNum] = ((centerStar - 1 + offset) % 9) + 1;
        });
        const gridMeta = [
          [4, '东南', '巽', 0, 0], [9, '正南', '离', 0, 1], [2, '西南', '坤', 0, 2],
          [3, '正东', '震', 1, 0], [5, '中宫', '中', 1, 1], [7, '正西', '兑', 1, 2],
          [8, '东北', '艮', 2, 0], [1, '正北', '坎', 2, 1], [6, '西北', '乾', 2, 2],
        ];
        return gridMeta.map(([pNum, dir, tri, row, col]) => {
          const starNum = starByPalace[pNum];
          const info = FLYING_STAR_INFO[starNum];
          return { palaceNum: pNum, direction: dir, trigram: tri, row, col, starNum, ...info };
        });
      }

      function FlyingStarsAltarSvg({ flyingStars = [], year, isDark = true, selectedPalaceNum, onSelectPalace }) {
        const pal = getPalette(isDark);
        const cx = 210;
        const cy = 210;
        const cellSize = 68;
        const gap = 7;
        const gridW = cellSize * 3 + gap * 2;
        const origin = cx - gridW / 2;

        return h('svg', {
          viewBox: '0 0 420 420',
          width: '100%',
          role: 'img',
          'aria-label': `${year} 年玄空流年九宫飞星罗盘`,
          style: { display: 'block', width: '100%', height: 'auto', aspectRatio: '1 / 1' },
        },
          // Outer Rotating Celestial Ring
          h('g', { className: 'zm-spin-slow' },
            h('circle', { cx, cy, r: 202, fill: 'none', stroke: pal.goldLine, strokeWidth: 1.3 }),
            ...Array.from({ length: 48 }, (_, i) => {
              const rad = (i * 7.5 * Math.PI) / 180;
              const maj = i % 6 === 0;
              return h('line', {
                key: `fs-${i}`,
                x1: (cx + Math.cos(rad) * (maj ? 193 : 197)).toFixed(1),
                y1: (cy + Math.sin(rad) * (maj ? 193 : 197)).toFixed(1),
                x2: (cx + Math.cos(rad) * 202).toFixed(1),
                y2: (cy + Math.sin(rad) * 202).toFixed(1),
                stroke: maj ? pal.goldBright : pal.goldFaint,
                strokeWidth: maj ? 1.6 : 0.85,
              });
            }),
          ),
          // Engraved Octagonal Frame (apothem ~162.6 cleanly encloses grid corner ~154.1) + 8 Outer Vector Trigrams
          h('polygon', {
            points: Array.from({ length: 8 }, (_, i) => {
              const rad = ((i * 45 + 22.5) * Math.PI) / 180;
              return `${(cx + Math.cos(rad) * 176).toFixed(1)},${(cy + Math.sin(rad) * 176).toFixed(1)}`;
            }).join(' '),
            fill: 'none',
            stroke: pal.goldLine,
            strokeWidth: 1.2,
          }),
          ...Object.entries(DIR_TRIGRAM).map(([dir, tri]) => {
            const deg = COMPASS_ANGLES[dir] ?? 0;
            const rad = (deg * Math.PI) / 180;
            return h(VectorTrigram, {
              key: `fstri-${dir}`,
              name: tri,
              x: cx + Math.cos(rad) * 182,
              y: cy + Math.sin(rad) * 182,
              width: 16, thickness: 2, gap: 2, angleDeg: deg + 90,
              color: pal.gold,
            });
          }),

          // 3x3 Luminous Geometric Flying-Star Chambers
          ...flyingStars.map(cell => {
            const x = origin + cell.col * (cellSize + gap);
            const y = origin + cell.row * (cellSize + gap);
            const isSel = selectedPalaceNum === cell.palaceNum;
            const isBigGood = cell.luck === '大吉';
            const stCol = isDark ? cell.colorD : cell.colorL;
            return h('g', {
              key: cell.palaceNum,
              role: 'button',
              tabIndex: 0,
              'aria-label': `${cell.direction} ${cell.name} ${cell.tag}`,
              style: { cursor: 'pointer' },
              onClick: () => onSelectPalace && onSelectPalace(cell.palaceNum),
              onKeyDown: e => { if ((e.key === 'Enter' || e.key === ' ') && onSelectPalace) { e.preventDefault(); onSelectPalace(cell.palaceNum); } },
            },
              h('rect', {
                x, y, width: cellSize, height: cellSize, rx: 11,
                fill: isSel ? pal.selFill : isBigGood ? pal.goodFill : pal.wedgeIdle,
                stroke: isSel ? pal.selStroke : isBigGood ? pal.goodStroke : pal.wedgeBorder,
                strokeWidth: isSel ? 2.4 : isBigGood ? 1.6 : 1.1,
              }),
              h('text', { x: x + cellSize / 2, y: y + 16, textAnchor: 'middle', fill: pal.inkMuted, fontSize: 9, fontWeight: 700 }, cell.direction),
              h('text', { x: x + cellSize / 2, y: y + 39, textAnchor: 'middle', fill: stCol, fontSize: 18, fontWeight: 800 }, cell.short),
              h('text', { x: x + cellSize / 2, y: y + 56, textAnchor: 'middle', fill: pal.inkSub, fontSize: 9, fontWeight: 700 }, cell.tag),
            );
          }),
        );
      }

      return {
        getPalette,
        CelestialBackdropSvg,
        BaziOrrerySvg,
        BaZhaiCompassSvg,
        QimenArmillarySvg,
        MeihuaResonatorSvg,
        ZiweiStarWheelSvg,
        HepanOrrerySvg,
        HepanTimeline30ySvg,
        FlyingStarsAltarSvg,
        getFlyingStarsForYear,
      };
    }

    // --- src/client/views-bazi.js ---
    function createBaziView(React, Visuals) {
      const h = React.createElement;
      const { CelestialBackdropSvg, BaziOrrerySvg, BaZhaiCompassSvg } = Visuals;

      return function BaziView({ chart, isDark, beginnerMode, busy, onCast, onDemo, onAskDeepSeek, t }) {
        const [formOpen, setFormOpen] = React.useState(!chart);
        const [stageMode, setStageMode] = React.useState('orrery'); // 'orrery' | 'compass'
        const [name, setName] = React.useState('');
        const [date, setDate] = React.useState('1995-05-18');
        const [lunarYear, setLunarYear] = React.useState('1995');
        const [lunarMonth, setLunarMonth] = React.useState('4');
        const [lunarDay, setLunarDay] = React.useState('19');
        const [isLeapMonth, setIsLeapMonth] = React.useState(false);
        const [time, setTime] = React.useState('08:30');
        const [gender, setGender] = React.useState('male');
        const [calendar, setCalendar] = React.useState('solar');
        const [longitude, setLongitude] = React.useState('');
        const [question, setQuestion] = React.useState('');
        const [selectedPillarIdx, setSelectedPillarIdx] = React.useState(2);
        const [selectedDaYunIdx, setSelectedDaYunIdx] = React.useState(0);
        const [selectedWuXing, setSelectedWuXing] = React.useState(null);
        const [selectedDir, setSelectedDir] = React.useState(null);

        React.useEffect(() => {
          if (chart) {
            setFormOpen(false);
            setSelectedDir(chart.mingGua?.bestWealthDir || '东南');
          } else {
            setFormOpen(true);
          }
        }, [chart?.id]);

        const submit = e => {
          e.preventDefault();
          const params = { system: 'bazi', name, time, gender, calendar, question };
          if (calendar === 'lunar') {
            params.year = Number(lunarYear) || 1995;
            params.month = Number(lunarMonth) || 1;
            params.day = Number(lunarDay) || 1;
            params.isLeapMonth = isLeapMonth;
          } else {
            params.date = date;
          }
          if (longitude !== '' && Number.isFinite(Number(longitude))) {
            params.longitude = Number(longitude);
          }
          onCast(params);
        };

        const selectedPillar = chart?.pillars?.[selectedPillarIdx] || chart?.pillars?.[2];
        const selectedDaYun = chart?.daYun?.[selectedDaYunIdx] || chart?.daYun?.[0];
        const selectedDirObj = chart?.mingGua?.directions?.find(d => d.direction === selectedDir) || chart?.mingGua?.directions?.[0];

        return h('div', { className: 'zm-animate', style: { display: 'flex', flexDirection: 'column', gap: 11 } },
          // 1. MONUMENTAL PURE-GRAPHIC SHOWCASE CANVAS (Zero text clutter!)
          h('div', { className: 'zm-canvas' },
            h(CelestialBackdropSvg, { isDark }),
            h('div', { className: 'zm-canvas-bar' },
              h('div', { className: 'zm-stage-tabs', role: 'tablist' },
                h('button', {
                  type: 'button', role: 'tab', 'aria-selected': stageMode === 'orrery',
                  className: `zm-stage-tab ${stageMode === 'orrery' ? 'zm-on' : ''}`,
                  onClick: () => setStageMode('orrery'),
                }, '五行天象仪'),
                h('button', {
                  type: 'button', role: 'tab', 'aria-selected': stageMode === 'compass',
                  className: `zm-stage-tab ${stageMode === 'compass' ? 'zm-on' : ''}`,
                  onClick: () => setStageMode('compass'),
                }, '八宅罗盘'),
              ),
              h('div', { style: { display: 'flex', gap: 5, alignItems: 'center' } },
                chart ? h('button', {
                  type: 'button', className: 'zm-btn zm-btn-sm',
                  onClick: () => setFormOpen(v => !v),
                }, formOpen ? '收起参数' : '修改参数') : null,
                chart ? h('button', {
                  type: 'button', className: 'zm-btn zm-btn-gold zm-btn-sm',
                  onClick: () => onAskDeepSeek(`请调用 zhiming_read 读取我的四柱八字盘（盘面ID: ${chart.id}，${chart.title}，四柱：${chart.pillars.map(p => p.ganZhi).join(' ')}），用新手易懂的白话为我深度解读日主性格、格局、五行喜用神、八宅吉位与家居风水建议。`),
                }, `✦ ${t('dock.ask')}`) : h('button', {
                  type: 'button', className: 'zm-btn zm-btn-gold zm-btn-sm', disabled: busy,
                  onClick: () => onDemo('bazi'),
                }, `✦ ${t('action.demo')}`),
              ),
            ),

            // Full-Scale 420x420 Interactive Graphical Instrument
            h('div', { className: 'zm-canvas-artwork' },
              stageMode === 'orrery'
                ? h(BaziOrrerySvg, {
                  chart,
                  isDark,
                  selectedPillarIdx,
                  selectedWuXing,
                  onSelectPillar: idx => { setSelectedPillarIdx(idx); setSelectedWuXing(null); },
                  onSelectWuXing: el => setSelectedWuXing(prev => (prev === el ? null : el)),
                })
                : h(BaZhaiCompassSvg, {
                  mingGua: chart?.mingGua,
                  isDark,
                  selectedDir,
                  onSelectDir: setSelectedDir,
                }),
            ),

            // Minimal Single-Row Glass Readout Footer
            chart ? h('div', { className: 'zm-canvas-footer' },
              h('span', { className: 'zm-glass-pill' }, chart.pillars.map(p => p.ganZhi).join(' · ')),
              chart.pattern ? h('span', { className: 'zm-glass-pill', style: { color: 'var(--zm-gold)' } }, chart.pattern.name) : null,
              h('span', { className: 'zm-glass-pill', style: { color: 'var(--zm-green)' } }, `喜 ${chart.wuxing.favorable.join('·')}`),
              chart.mingGua ? h('span', { className: 'zm-glass-pill' }, `${chart.mingGua.name}·${chart.mingGua.group}`) : null,
            ) : null,
          ),

          // Compact Beginner Hint (only when toggled ON)
          beginnerMode ? h('div', { className: 'zm-tip-banner' },
            h('strong', null, '看图提示：'),
            stageMode === 'orrery'
              ? '中心为日主（你自己），四角星印为年月日时四柱，外圈五角星显示五行强弱，虚线为合冲能量；点击任意星印或五行珠查看详解。'
              : '绿色扇区为个人四大吉位（生气财位/天医健康/延年人脉/伏位文昌），中央指针直指你的生气大财位，点击方位看布置建议。',
          ) : null,

          // 2. Interactive Focus Inspector (Single concise card for whatever node user clicked)
          chart && stageMode === 'compass' && selectedDirObj ? h('div', { className: 'zm-card' },
            h('div', { className: 'zm-card-title', style: { marginBottom: 4 } },
              h('span', { style: { color: selectedDirObj.luck === '吉' ? 'var(--zm-green)' : 'var(--zm-red)' } },
                `${selectedDirObj.direction} · ${selectedDirObj.star}（${selectedDirObj.luck}位）`,
              ),
              h('button', {
                type: 'button', className: 'zm-btn zm-btn-sm',
                onClick: () => onAskDeepSeek(`请调用 zhiming_read 读取我的八字盘（盘面ID: ${chart.id}），结合我的八宅命卦（${chart.mingGua.name}·${chart.mingGua.group}）与喜用神，告诉我家里「${selectedDirObj.direction}（${selectedDirObj.star}位）」具体该怎么布置？`),
              }, '问布置'),
            ),
            h('div', { style: { fontSize: 12, color: 'var(--zm-text-sub)' } }, selectedDirObj.desc),
          ) : null,

          chart && stageMode === 'orrery' && selectedWuXing ? h('div', { className: 'zm-card' },
            h('div', { className: 'zm-card-title', style: { marginBottom: 4 } },
              h('span', { style: { color: WUXING_STYLE[selectedWuXing].color } },
                `${WUXING_STYLE[selectedWuXing].label} · ${chart.wuxing.percentages[selectedWuXing]}%（${WUXING_STYLE[selectedWuXing].dir}）`,
              ),
              h('span', { className: 'zm-chip' }, chart.wuxing.favorable.includes(selectedWuXing) ? '★ 喜用神' : '平衡元素'),
            ),
            h('div', { style: { fontSize: 12, color: 'var(--zm-text-sub)' } }, `${WUXING_STYLE[selectedWuXing].trait}。${chart.wuxing.strengthAdvice}`),
          ) : null,

          chart && stageMode === 'orrery' && !selectedWuXing && selectedPillar ? h('div', { className: 'zm-card' },
            h('div', { className: 'zm-card-title', style: { marginBottom: 5 } },
              h('span', null, `${selectedPillar.label}【${selectedPillar.ganZhi}】· ${selectedPillar.shiShenGan} · ${selectedPillar.naYin}`),
              h('button', {
                type: 'button', className: 'zm-btn zm-btn-sm',
                onClick: () => onAskDeepSeek(`请调用 zhiming_read 读取我的八字盘（盘面ID: ${chart.id}），重点解读「${selectedPillar.label} ${selectedPillar.ganZhi}」（天干${selectedPillar.shiShenGan}、纳音${selectedPillar.naYin}）对我的具体影响。`),
              }, t('action.askFocus')),
            ),
            h('div', { style: { fontSize: 12, color: 'var(--zm-text-sub)', marginBottom: 6 } }, selectedPillar.shiShenDesc || chart.dayMaster.desc),
            h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 5 } },
              ...selectedPillar.hiddenDetails.map((hd, i) => h('span', { key: i, className: 'zm-chip' }, `藏${hd.gan}·${hd.shiShen}`)),
              h('span', { className: 'zm-chip' }, `地势:${selectedPillar.diShi}`),
              h('span', { className: 'zm-chip' }, `空亡:${selectedPillar.xunKong}`),
            ),
          ) : null,

          // 3. Input Form (Shown cleanly below artwork when idle or when user clicks "修改参数")
          formOpen ? h('div', { className: 'zm-card' },
            h('form', { onSubmit: submit },
              h('div', { className: 'zm-form-grid' },
                h('div', { className: 'zm-field' },
                  h('label', null, t('form.calendar')),
                  h('select', { className: 'zm-select', value: calendar, onChange: e => setCalendar(e.target.value) },
                    h('option', { value: 'solar' }, t('form.solar')),
                    h('option', { value: 'lunar' }, t('form.lunar')),
                  ),
                ),
                h('div', { className: 'zm-field' },
                  h('label', null, t('form.gender')),
                  h('select', { className: 'zm-select', value: gender, onChange: e => setGender(e.target.value) },
                    h('option', { value: 'male' }, t('form.male')),
                    h('option', { value: 'female' }, t('form.female')),
                  ),
                ),
                calendar === 'solar' ? h('div', { className: 'zm-field' },
                  h('label', null, t('form.birthDate')),
                  h('input', { className: 'zm-input', type: 'date', value: date, onChange: e => setDate(e.target.value), required: true }),
                ) : h('div', { className: 'zm-lunar-row' },
                  h('div', { className: 'zm-field' }, h('label', null, t('form.lunarYear')), h('input', { className: 'zm-input', type: 'number', min: 1901, max: 2099, value: lunarYear, onChange: e => setLunarYear(e.target.value), required: true })),
                  h('div', { className: 'zm-field' }, h('label', null, t('form.lunarMonth')), h('input', { className: 'zm-input', type: 'number', min: 1, max: 12, value: lunarMonth, onChange: e => setLunarMonth(e.target.value), required: true })),
                  h('div', { className: 'zm-field' }, h('label', null, t('form.lunarDay')), h('input', { className: 'zm-input', type: 'number', min: 1, max: 30, value: lunarDay, onChange: e => setLunarDay(e.target.value), required: true })),
                  h('label', { className: 'zm-check-label' }, h('input', { type: 'checkbox', checked: isLeapMonth, onChange: e => setIsLeapMonth(e.target.checked) }), t('form.leapMonth')),
                ),
                h('div', { className: 'zm-field' },
                  h('label', null, t('form.birthTime')),
                  h('input', { className: 'zm-input', type: 'time', value: time, onChange: e => setTime(e.target.value), required: true }),
                ),
                h('div', { className: 'zm-field' },
                  h('label', null, t('form.name')),
                  h('input', { className: 'zm-input', placeholder: '称呼（可选）', value: name, onChange: e => setName(e.target.value) }),
                ),
                h('div', { className: 'zm-field' },
                  h('label', null, t('form.advancedTst')),
                  h('select', { className: 'zm-select', value: longitude, onChange: e => setLongitude(e.target.value) },
                    ...CITY_LONGITUDES.map(c => h('option', { key: c.value || 'off', value: c.value }, c.value === '' ? t('form.longitudeOff') : c.label)),
                  ),
                ),
              ),
              h('div', { className: 'zm-form-footer' },
                h('button', { type: 'button', className: 'zm-btn zm-btn-sm', disabled: busy, onClick: () => onDemo('bazi') }, t('action.demo')),
                h('button', { type: 'submit', className: 'zm-btn zm-btn-gold', disabled: busy }, busy ? t('status.casting') : t('action.cast')),
              ),
            ),
          ) : null,

          // 4. Collapsible Deep Details Drawer (Keeps visual top crystal clean!)
          chart ? h('details', { className: 'zm-details' },
            h('summary', null,
              h('span', null, `五行详表 · ${chart.currentYear?.year || ''}流年 · 大运神煞`),
              h('span', { className: 'zm-muted' }, '展开详览 ▾'),
            ),
            h('div', { className: 'zm-details-body' },
              chart.currentYear ? h('div', { className: 'zm-tip-banner' },
                h('strong', null, `${chart.currentYear.year} ${chart.currentYear.ganZhi}流年简评：`),
                chart.currentYear.note,
              ) : null,
              h('div', { style: { display: 'flex', flexDirection: 'column', gap: 5 } },
                ...['木', '火', '土', '金', '水'].map(el => {
                  const st = WUXING_STYLE[el];
                  const pct = chart.wuxing.percentages[el] || 0;
                  return h('div', { key: el, className: 'zm-bar-row', style: { cursor: 'default' } },
                    h('span', { style: { fontWeight: 700, color: st.color } }, `${el}${chart.wuxing.favorable.includes(el) ? '★' : ''}`),
                    h('div', { className: 'zm-bar-track' }, h('div', { className: 'zm-bar-fill', style: { width: `${Math.max(4, pct)}%`, background: st.color } })),
                    h('span', { className: 'zm-muted', style: { textAlign: 'right' } }, `${pct}%`),
                  );
                }),
              ),
              chart.interactions?.length ? h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 5 } },
                ...chart.interactions.map((it, i) => h('span', {
                  key: i, className: 'zm-chip',
                  style: { color: it.polarity === 'good' ? 'var(--zm-green)' : 'var(--zm-red)' },
                }, `${it.type}：${it.label}`)),
              ) : null,
              chart.shenSha?.length ? h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 5 } },
                ...chart.shenSha.map((s, i) => h('span', { key: i, className: 'zm-chip', style: { color: 'var(--zm-gold)' } }, `${s.name}·${s.nature}`)),
              ) : null,
              chart.daYun?.length ? h('div', null,
                h('div', { className: 'zm-muted', style: { marginBottom: 6 } }, `大运排布（${chart.meta.startYunDesc}）`),
                h('div', { className: 'zm-dayun-strip' },
                  ...chart.daYun.map((dy, idx) => h('button', {
                    key: dy.index, type: 'button',
                    className: `zm-dayun-pill ${selectedDaYunIdx === idx ? 'zm-selected' : ''}`,
                    onClick: () => setSelectedDaYunIdx(idx),
                  },
                    h('div', { className: 'zm-muted', style: { fontSize: 10 } }, `${dy.startAge}-${dy.endAge}岁`),
                    h('div', { style: { fontSize: 14, fontWeight: 800, color: WUXING_STYLE[dy.ganElement]?.color } }, dy.ganZhi),
                    h('div', { className: 'zm-muted', style: { fontSize: 10 } }, dy.shiShenGan),
                  )),
                ),
                selectedDaYun?.liuNian?.length ? h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 4, marginTop: 6 } },
                  ...selectedDaYun.liuNian.map(ln => h('div', {
                    key: ln.year,
                    style: { padding: '4px 3px', borderRadius: 6, border: '1px solid var(--zm-border)', textAlign: 'center', fontSize: 10.5 },
                  },
                    h('div', { className: 'zm-muted', style: { fontSize: 9.5 } }, String(ln.year)),
                    h('div', { style: { fontWeight: 700 } }, ln.ganZhi),
                  )),
                ) : null,
              ) : null,
            ),
          ) : null,
        );
      };
    }

    // --- src/client/views-qimen.js ---
    function createQimenView(React, Visuals) {
      const h = React.createElement;
      const { CelestialBackdropSvg, QimenArmillarySvg } = Visuals;

      return function QimenView({ chart, isDark, beginnerMode, busy, onCast, onDemo, onAskDeepSeek, t }) {
        const now = new Date();
        const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        const [formOpen, setFormOpen] = React.useState(!chart);
        const [stageMode, setStageMode] = React.useState('compass'); // 'compass' | 'grid'
        const [radarKey, setRadarKey] = React.useState('all');
        const [date, setDate] = React.useState(todayStr);
        const [time, setTime] = React.useState(timeStr);
        const [question, setQuestion] = React.useState('');
        const [selectedPalaceNum, setSelectedPalaceNum] = React.useState(null);

        React.useEffect(() => {
          if (chart) {
            setFormOpen(false);
            setRadarKey('all');
            const zf = chart.palaces?.find(p => p.isZhiFu);
            setSelectedPalaceNum(zf ? zf.num : 9);
          } else {
            setFormOpen(true);
          }
        }, [chart?.id]);

        const submit = e => {
          e.preventDefault();
          onCast({ system: 'qimen', date, time, question });
        };

        const castNow = () => {
          const d = new Date();
          const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          const ts = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
          setDate(ds);
          setTime(ts);
          onCast({ system: 'qimen', date: ds, time: ts, question });
        };

        const selectedPalace = chart?.palaces?.find(p => p.num === selectedPalaceNum) || chart?.palaces?.[0];
        const activeRadar = chart?.yongshenGuides?.[radarKey] || null;
        const radarHitSet = new Set(activeRadar?.palaceNums || []);

        return h('div', { className: 'zm-animate', style: { display: 'flex', flexDirection: 'column', gap: 11 } },
          // 1. MONUMENTAL 360° QIMEN ARMILLARY SPHERE CANVAS
          h('div', { className: 'zm-canvas' },
            h(CelestialBackdropSvg, { isDark }),
            h('div', { className: 'zm-canvas-bar' },
              h('div', { className: 'zm-stage-tabs', role: 'tablist' },
                h('button', {
                  type: 'button', role: 'tab', 'aria-selected': stageMode === 'compass',
                  className: `zm-stage-tab ${stageMode === 'compass' ? 'zm-on' : ''}`,
                  onClick: () => setStageMode('compass'),
                }, '360° 浑天仪'),
                h('button', {
                  type: 'button', role: 'tab', 'aria-selected': stageMode === 'grid',
                  className: `zm-stage-tab ${stageMode === 'grid' ? 'zm-on' : ''}`,
                  onClick: () => setStageMode('grid'),
                }, '洛书九宫'),
              ),
              h('div', { style: { display: 'flex', gap: 5, alignItems: 'center' } },
                h('button', { type: 'button', className: 'zm-btn zm-btn-sm', disabled: busy, onClick: castNow }, t('action.castNow')),
                chart ? h('button', { type: 'button', className: 'zm-btn zm-btn-sm', onClick: () => setFormOpen(v => !v) }, formOpen ? '收起' : '排盘') : null,
                chart ? h('button', {
                  type: 'button', className: 'zm-btn zm-btn-gold zm-btn-sm',
                  onClick: () => onAskDeepSeek(`请调用 zhiming_read 读取我的奇门遁甲局（盘面ID: ${chart.id}，${chart.meta.juTitle}，四柱${chart.meta.fourPillars}${chart.question ? `，问：${chart.question}` : ''}），用新手白话为我分析整体走势、奇门格局、三吉门方位和行动建议。`),
                }, `✦ ${t('dock.ask')}`) : h('button', {
                  type: 'button', className: 'zm-btn zm-btn-gold zm-btn-sm', disabled: busy,
                  onClick: () => onDemo('qimen'),
                }, `✦ ${t('action.demo')}`),
              ),
            ),

            // Full-Scale Graphic Centerpiece
            stageMode === 'compass'
              ? h('div', { className: 'zm-canvas-artwork' },
                h(QimenArmillarySvg, {
                  chart,
                  isDark,
                  selectedPalaceNum,
                  radarHits: activeRadar?.palaceNums || [],
                  onSelectPalace: setSelectedPalaceNum,
                }),
              )
              : (chart ? h('div', { className: 'zm-qimen-grid', style: { position: 'relative', zIndex: 2 } },
                ...chart.palaces.map(p => {
                  const isSel = selectedPalaceNum === p.num;
                  const isHit = radarHitSet.has(p.num);
                  if (p.isCenter) {
                    return h('button', {
                      key: p.num, type: 'button', 'aria-pressed': isSel,
                      className: `zm-qimen-cell zm-center ${isSel ? 'zm-selected' : ''}`,
                      onClick: () => setSelectedPalaceNum(p.num),
                    },
                      h('span', { className: 'zm-muted', style: { fontSize: 10 } }, '中五宫'),
                      h('div', { style: { textAlign: 'center', fontSize: 22, fontWeight: 800, color: 'var(--zm-gold)' } }, p.earthStem),
                      h('span', { className: 'zm-muted', style: { fontSize: 10, textAlign: 'center' } }, chart.meta.juTitle),
                    );
                  }
                  const isGoodGate = ['开门', '休门', '生门'].includes(p.gate);
                  const isToughGate = ['死门', '惊门', '伤门'].includes(p.gate);
                  return h('button', {
                    key: p.num, type: 'button', 'aria-pressed': isSel,
                    className: `zm-qimen-cell ${isSel ? 'zm-selected' : ''} ${isHit ? 'zm-radar-hit' : ''}`,
                    onClick: () => setSelectedPalaceNum(p.num),
                  },
                    h('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: 10.5 } },
                      h('span', { style: { fontWeight: 700, color: p.isZhiFu ? 'var(--zm-gold)' : 'var(--zm-indigo)' } }, p.deity),
                      h('span', { style: { fontWeight: 800, color: 'var(--zm-gold)' } }, `${p.heavenStem}/${p.earthStem}`),
                    ),
                    h('div', { style: { textAlign: 'center', margin: '3px 0' } },
                      h('div', { style: { fontSize: 13.5, fontWeight: 800, color: isGoodGate ? 'var(--zm-green)' : isToughGate ? 'var(--zm-red)' : 'var(--zm-text)' } }, p.gate),
                      h('div', { className: 'zm-muted', style: { fontSize: 10 } }, p.star),
                    ),
                    h('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: 10 } },
                      h('span', { className: 'zm-muted' }, p.direction),
                      h('span', { style: { color: p.isKong ? 'var(--zm-red)' : 'var(--zm-text-muted)', fontWeight: 700 } }, p.isKong ? '空' : p.auspiciousness),
                    ),
                  );
                }),
              ) : h('div', { className: 'zm-canvas-artwork' }, h(QimenArmillarySvg, { chart: null, isDark }))),

            // YongShen Radar Minimal Pill Switcher (inside canvas bottom)
            chart?.yongshenGuides ? h('div', { className: 'zm-canvas-footer' },
              h('div', { className: 'zm-stage-tabs', role: 'group', 'aria-label': '用神雷达' },
                ...Object.entries(chart.yongshenGuides).map(([key, g]) => h('button', {
                  key, type: 'button',
                  className: `zm-stage-tab ${radarKey === key ? 'zm-on' : ''}`,
                  onClick: () => {
                    setRadarKey(key);
                    if (g.palaceNums?.[0]) setSelectedPalaceNum(g.palaceNums[0]);
                  },
                }, g.label.slice(0, 2))),
              ),
            ) : null,
          ),

          beginnerMode && activeRadar ? h('div', { className: 'zm-tip-banner' },
            h('strong', null, `用神雷达 · ${activeRadar.label}：`),
            activeRadar.tip,
          ) : null,

          // 2. Concise Clicked Palace Inspector
          chart && selectedPalace ? h('div', { className: 'zm-card' },
            h('div', { className: 'zm-card-title', style: { marginBottom: 5 } },
              h('span', null, `${selectedPalace.symbol} ${selectedPalace.name}（${selectedPalace.direction}）${selectedPalace.isCenter ? '' : ` · ${selectedPalace.gate} / ${selectedPalace.star} / ${selectedPalace.deity}`}`),
              h('button', {
                type: 'button', className: 'zm-btn zm-btn-sm',
                onClick: () => onAskDeepSeek(`请调用 zhiming_read 读取我的奇门遁甲局（盘面ID: ${chart.id}），详细解读「${selectedPalace.name}（${selectedPalace.direction}）」的白话含义与行动建议。`),
              }, t('action.askFocus')),
            ),
            selectedPalace.isCenter
              ? h('div', { style: { fontSize: 12, color: 'var(--zm-text-sub)' } }, selectedPalace.note)
              : h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: 'var(--zm-text-sub)' } },
                h('div', null, h('strong', null, `${selectedPalace.gate}：`), selectedPalace.gateInfo?.summary || ''),
                h('div', null, h('strong', null, `${selectedPalace.star} · ${selectedPalace.deity}：`), `${selectedPalace.starInfo?.summary || ''} ${selectedPalace.deityInfo?.summary || ''}`),
                selectedPalace.alerts?.length ? h('div', { style: { color: 'var(--zm-red)' } }, selectedPalace.alerts.map(a => `⚠ ${a.tag}：${a.desc}`).join(' ')) : null,
              ),
          ) : null,

          // 3. Input Form
          formOpen ? h('div', { className: 'zm-card' },
            h('form', { onSubmit: submit },
              h('div', { className: 'zm-form-grid' },
                h('div', { className: 'zm-field' }, h('label', null, t('form.qimenDate')), h('input', { className: 'zm-input', type: 'date', value: date, onChange: e => setDate(e.target.value), required: true })),
                h('div', { className: 'zm-field' }, h('label', null, t('form.qimenTime')), h('input', { className: 'zm-input', type: 'time', value: time, onChange: e => setTime(e.target.value), required: true })),
                h('div', { className: 'zm-field', style: { gridColumn: '1 / -1' } },
                  h('label', null, t('form.qimenQuestion')),
                  h('input', { className: 'zm-input', placeholder: '所问之事（如：谈合作、出差方位）', value: question, onChange: e => setQuestion(e.target.value) }),
                ),
              ),
              h('div', { className: 'zm-form-footer' },
                h('button', { type: 'button', className: 'zm-btn zm-btn-sm', disabled: busy, onClick: castNow }, t('action.castNow')),
                h('button', { type: 'submit', className: 'zm-btn zm-btn-gold', disabled: busy }, busy ? t('status.casting') : t('action.cast')),
              ),
            ),
          ) : null,

          // 4. Collapsible Formations & Auspicious Gates Drawer
          chart ? h('details', { className: 'zm-details' },
            h('summary', null,
              h('span', null, `三吉门方位 · 奇门格局${chart.formations?.length ? ` (${chart.formations.length})` : ''}`),
              h('span', { className: 'zm-muted' }, '展开详览 ▾'),
            ),
            h('div', { className: 'zm-details-body' },
              chart.formations?.length ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: 5 } },
                ...chart.formations.map((f, i) => h('div', { key: i, style: { fontSize: 12 } },
                  h('strong', { style: { color: (f.nature === '大吉' || f.nature === '吉') ? 'var(--zm-green)' : 'var(--zm-red)' } }, `${f.name}（${f.nature}）：`),
                  f.desc,
                )),
              ) : null,
              chart.goodDirections?.length ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: 5 } },
                ...chart.goodDirections.map((gd, i) => h('div', { key: i, style: { fontSize: 12, color: 'var(--zm-text-sub)' } },
                  h('strong', { style: { color: gd.clean ? 'var(--zm-green)' : 'var(--zm-amber)' } }, `${gd.direction} · ${gd.gate}：`),
                  gd.tip,
                )),
              ) : null,
            ),
          ) : null,
        );
      };
    }

    // --- src/client/views-meihua.js ---
    function createMeihuaView(React, Visuals) {
      const h = React.createElement;
      const { CelestialBackdropSvg, MeihuaResonatorSvg, HexagramLinesSvg } = Visuals;

      return function MeihuaView({ chart, isDark, beginnerMode, busy, onCast, onDemo, onAskDeepSeek, t }) {
        const [formOpen, setFormOpen] = React.useState(!chart);
        const [method, setMethod] = React.useState('numbers');
        const [num1, setNum1] = React.useState('3');
        const [num2, setNum2] = React.useState('7');
        const [num3, setNum3] = React.useState('');
        const [textSeed, setTextSeed] = React.useState('');
        const [question, setQuestion] = React.useState('');
        const [activeStage, setActiveStage] = React.useState('main');

        React.useEffect(() => {
          if (chart) {
            setFormOpen(false);
            setActiveStage('main');
          } else {
            setFormOpen(true);
          }
        }, [chart?.id]);

        const submit = e => {
          e.preventDefault();
          const params = { system: 'meihua', method, question };
          if (method === 'numbers') {
            params.num1 = Number(num1) || 3;
            params.num2 = Number(num2) || 7;
            if (num3.trim() !== '') params.num3 = Number(num3);
          } else if (method === 'text') {
            params.text = textSeed || question || '知命';
          }
          onCast(params);
        };

        const activeHex = chart?.hexagrams?.[activeStage] || chart?.hexagrams?.main;
        const stageShort = [['main', '本卦'], ['mutual', '互卦'], ['changed', '变卦'], ['opposite', '错卦'], ['inverted', '综卦']];

        return h('div', { className: 'zm-animate', style: { display: 'flex', flexDirection: 'column', gap: 11 } },
          // 1. MONUMENTAL XIANTIAN BAGUA & 6-YAO RESONATOR CANVAS
          h('div', { className: 'zm-canvas' },
            h(CelestialBackdropSvg, { isDark }),
            h('div', { className: 'zm-canvas-bar' },
              chart ? h('div', { className: 'zm-stage-tabs', role: 'tablist' },
                ...stageShort.map(([k, label]) => h('button', {
                  key: k, type: 'button', role: 'tab', 'aria-selected': activeStage === k,
                  className: `zm-stage-tab ${activeStage === k ? 'zm-on' : ''}`,
                  onClick: () => setActiveStage(k),
                }, label)),
              ) : h('span', { className: 'zm-glass-pill', style: { color: 'var(--zm-gold)' } }, '先天八卦星轮'),
              h('div', { style: { display: 'flex', gap: 5, alignItems: 'center' } },
                h('button', { type: 'button', className: 'zm-btn zm-btn-sm', disabled: busy, onClick: () => onCast({ system: 'meihua', method: 'random', question }) }, '灵感一卦'),
                chart ? h('button', { type: 'button', className: 'zm-btn zm-btn-sm', onClick: () => setFormOpen(v => !v) }, formOpen ? '收起' : '起卦') : null,
                chart ? h('button', {
                  type: 'button', className: 'zm-btn zm-btn-gold zm-btn-sm',
                  onClick: () => onAskDeepSeek(`请调用 zhiming_read 读取我的梅花易数卦象（盘面ID: ${chart.id}，本卦${chart.hexagrams.main.fullName}、互卦${chart.hexagrams.mutual.fullName}、变卦${chart.hexagrams.changed.fullName}，第${chart.meta.movingLine}爻动${chart.question ? `，问：${chart.question}` : ''}），结合体用生克、月令旺衰、应期和万物类象给我白话建议。`),
                }, `✦ ${t('dock.ask')}`) : h('button', {
                  type: 'button', className: 'zm-btn zm-btn-gold zm-btn-sm', disabled: busy,
                  onClick: () => onDemo('meihua'),
                }, `✦ ${t('action.demo')}`),
              ),
            ),

            h('div', { className: 'zm-canvas-artwork' },
              h(MeihuaResonatorSvg, { chart, isDark, activeStage }),
            ),

            chart ? h('div', { className: 'zm-canvas-footer' },
              h('span', { className: 'zm-glass-pill', style: { color: 'var(--zm-gold)' } }, `体 ${chart.tiYong.tiTrigram.name}(${chart.tiYong.tiTrigram.element})`),
              h('span', { className: 'zm-glass-pill', style: { color: 'var(--zm-purple)' } }, `用 ${chart.tiYong.yongTrigram.name}(${chart.tiYong.yongTrigram.element})`),
              chart.timing ? h('span', { className: 'zm-glass-pill' }, `先天应数 ${chart.timing.responseNumber}`) : null,
            ) : null,
          ),

          beginnerMode ? h('div', { className: 'zm-tip-banner' },
            h('strong', null, '看图提示：'),
            '外圈金色双环为「体卦（自己）」，紫色环为「用卦（事情）」，流动光束表示生克方向（绿/金大吉、红需谨慎）；切换顶部本/互/变看起承转合。',
          ) : null,

          // 2. Concise Active Hexagram Inspector
          chart && activeHex ? h('div', { className: 'zm-card' },
            h('div', { className: 'zm-card-title', style: { marginBottom: 5 } },
              h('span', null, `${activeHex.symbol} 第${activeHex.number}卦 ${activeHex.fullName} · ${activeHex.luck}`),
              h('button', {
                type: 'button', className: 'zm-btn zm-btn-sm',
                onClick: () => onAskDeepSeek(`请调用 zhiming_read 读取我的梅花易数卦局（盘面ID: ${chart.id}），专门帮我解释「${activeHex.fullName}」的象意与现实启发。`),
              }, t('action.askFocus')),
            ),
            h('div', { style: { fontSize: 12, color: 'var(--zm-text-sub)', marginBottom: 6 } }, activeHex.summary),
            h('div', { className: 'zm-muted' }, `卦辞：${activeHex.judgment}`),
          ) : null,

          // 3. Input Form
          formOpen ? h('div', { className: 'zm-card' },
            h('form', { onSubmit: submit },
              h('div', { style: { display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 8 } },
                ...[['numbers', '报数起卦'], ['time', '时间起卦'], ['text', '文字起卦'], ['random', '随机触机']].map(([m, label]) =>
                  h('button', {
                    key: m, type: 'button', 'aria-pressed': method === m,
                    className: `zm-nav-pill ${method === m ? 'zm-active' : ''}`,
                    style: { '--zm-accent': 'var(--zm-red)' },
                    onClick: () => setMethod(m),
                  }, label),
                ),
              ),
              h('div', { className: 'zm-form-grid' },
                method === 'numbers' ? h(React.Fragment, null,
                  h('div', { className: 'zm-field' }, h('label', null, '第一数（上卦）'), h('input', { className: 'zm-input', type: 'number', value: num1, onChange: e => setNum1(e.target.value), required: true })),
                  h('div', { className: 'zm-field' }, h('label', null, '第二数（下卦）'), h('input', { className: 'zm-input', type: 'number', value: num2, onChange: e => setNum2(e.target.value), required: true })),
                  h('div', { className: 'zm-field' }, h('label', null, '第三数（可空）'), h('input', { className: 'zm-input', type: 'number', placeholder: '留空自动加时辰', value: num3, onChange: e => setNum3(e.target.value) })),
                ) : null,
                method === 'text' ? h('div', { className: 'zm-field', style: { gridColumn: '1 / -1' } },
                  h('label', null, '灵感关键词'),
                  h('input', { className: 'zm-input', placeholder: '如：春风得意 / 签约', value: textSeed, onChange: e => setTextSeed(e.target.value), required: true }),
                ) : null,
                h('div', { className: 'zm-field', style: { gridColumn: '1 / -1' } },
                  h('label', null, t('form.question')),
                  h('input', { className: 'zm-input', placeholder: '所问之事（可选）', value: question, onChange: e => setQuestion(e.target.value) }),
                ),
              ),
              h('div', { className: 'zm-form-footer' },
                h('button', { type: 'button', className: 'zm-btn zm-btn-sm', disabled: busy, onClick: () => onDemo('meihua') }, t('action.demo')),
                h('button', { type: 'submit', className: 'zm-btn zm-btn-gold', disabled: busy }, busy ? t('status.casting') : t('action.castHex')),
              ),
            ),
          ) : null,

          // 4. Collapsible Timing, Imagery & 3-Stage Evolution Drawer
          chart ? h('details', { className: 'zm-details' },
            h('summary', null,
              h('span', null, '起承转合三卦 · 应期推算 · 体用万物类象速查'),
              h('span', { className: 'zm-muted' }, '展开详览 ▾'),
            ),
            h('div', { className: 'zm-details-body' },
              h('div', { className: 'zm-hex-stage' },
                ...[['main', '本卦', chart.meta.movingLine], ['mutual', '互卦', 0], ['changed', '变卦', chart.meta.movingLine]].map(([key, tag, mov]) => {
                  const hx = chart.hexagrams[key];
                  return h('button', {
                    key, type: 'button',
                    className: `zm-hex-card ${activeStage === key ? 'zm-selected' : ''}`,
                    onClick: () => setActiveStage(key),
                  },
                    h('span', { className: 'zm-muted' }, tag),
                    h(HexagramLinesSvg, { lines: hx.lines, movingLine: mov, tiPosition: key === 'mutual' ? '' : chart.tiYong.tiPosition, compact: true }),
                    h('strong', { style: { fontSize: 12 } }, hx.fullName),
                  );
                }),
              ),
              chart.timing ? h('div', { className: 'zm-tip-banner' },
                h('strong', null, '应期参考：'),
                `${chart.timing.shortRange} · ${chart.timing.favorableMonths}。${chart.timing.desc}`,
              ) : null,
              chart.imagery ? h('div', { style: { fontSize: 12, color: 'var(--zm-text-sub)', display: 'flex', flexDirection: 'column', gap: 4 } },
                h('div', null, h('strong', { style: { color: 'var(--zm-gold)' } }, `体卦 ${chart.imagery.ti.name}：`), `${chart.imagery.ti.direction} · ${chart.imagery.ti.color} · ${chart.imagery.ti.role}`),
                h('div', null, h('strong', { style: { color: 'var(--zm-purple)' } }, `用卦 ${chart.imagery.yong.name}：`), `${chart.imagery.yong.direction} · ${chart.imagery.yong.color} · ${chart.imagery.yong.role}`),
              ) : null,
            ),
          ) : null,
        );
      };
    }

    // --- src/client/views-ziwei.js ---
    function createZiweiView(React, Visuals) {
      const h = React.createElement;
      const { CelestialBackdropSvg, ZiweiStarWheelSvg, ZiweiTriAspectSvg } = Visuals;

      return function ZiweiView({ chart, isDark, beginnerMode, busy, onCast, onDemo, onAskDeepSeek, t }) {
        const [formOpen, setFormOpen] = React.useState(!chart);
        const [stageMode, setStageMode] = React.useState('wheel'); // 'wheel' | 'square'
        const [name, setName] = React.useState('');
        const [date, setDate] = React.useState('1998-03-12');
        const [lunarYear, setLunarYear] = React.useState('1998');
        const [lunarMonth, setLunarMonth] = React.useState('2');
        const [lunarDay, setLunarDay] = React.useState('14');
        const [isLeapMonth, setIsLeapMonth] = React.useState(false);
        const [time, setTime] = React.useState('21:30');
        const [gender, setGender] = React.useState('female');
        const [calendar, setCalendar] = React.useState('solar');
        const [longitude, setLongitude] = React.useState('');
        const [question, setQuestion] = React.useState('');
        const [selectedPalaceIdx, setSelectedPalaceIdx] = React.useState(0);
        const [activeYear, setActiveYear] = React.useState('natal');

        React.useEffect(() => {
          if (chart) {
            setFormOpen(false);
            setSelectedPalaceIdx(chart.meta?.soulPalaceIndex ?? 0);
            setActiveYear('natal');
          } else {
            setFormOpen(true);
          }
        }, [chart?.id]);

        const submit = e => {
          e.preventDefault();
          const params = { system: 'ziwei', name, time, gender, calendar, question };
          if (calendar === 'lunar') {
            params.year = Number(lunarYear) || 1998;
            params.month = Number(lunarMonth) || 1;
            params.day = Number(lunarDay) || 1;
            params.isLeapMonth = isLeapMonth;
          } else {
            params.date = date;
          }
          if (longitude !== '' && Number.isFinite(Number(longitude))) {
            params.longitude = Number(longitude);
          }
          onCast(params);
        };

        const selectedPalace = chart?.palaces?.[selectedPalaceIdx] || chart?.palaces?.[0];
        const triSet = new Set(selectedPalace ? [selectedPalace.oppositeIndex, ...(selectedPalace.trineIndices || [])] : []);
        const yearlyObj = activeYear !== 'natal'
          ? (chart?.yearlyHoroscopes || []).find(y => y.year === activeYear) || null
          : null;

        const yearlyMutagenByStar = {};
        if (yearlyObj?.mutagens) {
          for (const m of yearlyObj.mutagens) yearlyMutagenByStar[m.star] = m.mutagen;
        }

        const palaceByPos = {};
        if (chart?.palaces) {
          for (const p of chart.palaces) palaceByPos[`${p.gridRow}-${p.gridCol}`] = p;
        }

        const renderSquareCells = () => {
          const cells = [];
          for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
              if (r === 1 && c === 1) {
                cells.push(h('div', { key: 'center', className: 'zm-zw-center' },
                  h(ZiweiTriAspectSvg, { selectedPalace }),
                  h('div', { className: 'zm-zw-center-scrim' },
                    h('div', { style: { fontSize: 13, fontWeight: 800, color: 'var(--zm-gold)' } }, chart.meta.fiveElementsClass),
                    h('div', { style: { fontSize: 11, fontWeight: 700 } }, `${chart.meta.gender}命 · ${chart.meta.zodiac}`),
                    yearlyObj
                      ? h('div', { style: { fontSize: 10, fontWeight: 700, color: '#38bdf8' } }, `${yearlyObj.year}流命:${yearlyObj.palaceName}`)
                      : h('div', { className: 'zm-muted', style: { fontSize: 10 } }, `命主 ${chart.meta.soulStar}`),
                  ),
                ));
                continue;
              }
              if ((r === 1 && c === 2) || (r === 2 && c === 1) || (r === 2 && c === 2)) continue;
              const p = palaceByPos[`${r}-${c}`];
              if (!p) continue;
              const isSelf = p.index === selectedPalaceIdx;
              const isTrine = !isSelf && triSet.has(p.index);
              const isYearlyLife = yearlyObj && yearlyObj.palaceIndex === p.index;

              cells.push(h('button', {
                key: p.index, type: 'button', 'aria-pressed': isSelf,
                className: `zm-zw-cell ${isSelf ? 'zm-zw-self' : isTrine ? 'zm-zw-trine' : ''} ${isYearlyLife ? 'zm-zw-yearly' : ''}`,
                onClick: () => setSelectedPalaceIdx(p.index),
              },
                h('div', { style: { display: 'flex', flexDirection: 'column', gap: 1.5 } },
                  p.majorStars.length === 0
                    ? h('span', { className: 'zm-muted', style: { fontSize: 10 } }, '空宫')
                    : p.majorStars.map((s, si) => {
                      const mut = s.mutagen ? MUTAGEN_COLOR[s.mutagen] : null;
                      const yMut = yearlyMutagenByStar[s.name];
                      return h('div', { key: si, style: { display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', lineHeight: 1.2 } },
                        h('span', { style: { fontSize: 11, fontWeight: 800, color: 'var(--zm-purple)' } }, s.name),
                        mut ? h('span', { style: { fontSize: 8.5, fontWeight: 800, padding: '0 3px', borderRadius: 3, background: mut.bg, color: mut.fg } }, s.mutagen) : null,
                        yMut ? h('span', { style: { fontSize: 8, fontWeight: 800, padding: '0 3px', borderRadius: 3, background: 'rgba(56,189,248,0.2)', color: '#0284c7' } }, `流${yMut}`) : null,
                      );
                    }),
                ),
                h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 } },
                  h('span', { className: 'zm-muted', style: { fontSize: 9.5 } }, p.stemBranch),
                  h('span', { style: { fontSize: 10.5, fontWeight: 800, color: p.isSoulPalace ? 'var(--zm-gold)' : isYearlyLife ? '#38bdf8' : 'var(--zm-text)' } },
                    `${isYearlyLife ? '流命·' : ''}${p.name}`,
                  ),
                ),
              ));
            }
          }
          return cells;
        };

        return h('div', { className: 'zm-animate', style: { display: 'flex', flexDirection: 'column', gap: 11 } },
          // 1. MONUMENTAL ZIWEI STAR-CHART WHEEL / SQUARE GRID CANVAS
          h('div', { className: 'zm-canvas' },
            h(CelestialBackdropSvg, { isDark }),
            h('div', { className: 'zm-canvas-bar' },
              h('div', { className: 'zm-stage-tabs', role: 'tablist' },
                h('button', {
                  type: 'button', role: 'tab', 'aria-selected': stageMode === 'wheel',
                  className: `zm-stage-tab ${stageMode === 'wheel' ? 'zm-on' : ''}`,
                  onClick: () => setStageMode('wheel'),
                }, '星图轮盘'),
                h('button', {
                  type: 'button', role: 'tab', 'aria-selected': stageMode === 'square',
                  className: `zm-stage-tab ${stageMode === 'square' ? 'zm-on' : ''}`,
                  onClick: () => setStageMode('square'),
                }, '传统方盘'),
              ),
              h('div', { style: { display: 'flex', gap: 5, alignItems: 'center' } },
                chart ? h('button', { type: 'button', className: 'zm-btn zm-btn-sm', onClick: () => setFormOpen(v => !v) }, formOpen ? '收起' : '排盘') : null,
                chart ? h('button', {
                  type: 'button', className: 'zm-btn zm-btn-gold zm-btn-sm',
                  onClick: () => onAskDeepSeek(`请调用 zhiming_read 读取我的紫微斗数命盘（盘面ID: ${chart.id}，${chart.title}，${chart.meta.fiveElementsClass}${yearlyObj ? `，重点叠加 ${yearlyObj.year} ${yearlyObj.stemBranch}流年` : ''}），用新手白话为我深度解读命宫、身宫、官禄宫、财帛宫、紫微格局与四化布局。`),
                }, `✦ ${t('dock.ask')}`) : h('button', {
                  type: 'button', className: 'zm-btn zm-btn-gold zm-btn-sm', disabled: busy,
                  onClick: () => onDemo('ziwei'),
                }, `✦ ${t('action.demo')}`),
              ),
            ),

            stageMode === 'wheel' || !chart
              ? h('div', { className: 'zm-canvas-artwork' },
                h(ZiweiStarWheelSvg, {
                  chart,
                  isDark,
                  selectedPalaceIdx,
                  yearlyObj,
                  onSelectPalace: setSelectedPalaceIdx,
                }),
              )
              : h('div', { className: 'zm-ziwei-scroll', style: { position: 'relative', zIndex: 2 } },
                h('div', { className: 'zm-ziwei-grid' }, ...renderSquareCells()),
              ),

            // Minimal Yearly Horoscope Switcher Bar
            chart?.yearlyHoroscopes?.length ? h('div', { className: 'zm-canvas-footer' },
              h('div', { className: 'zm-stage-tabs', role: 'tablist' },
                h('button', {
                  type: 'button', role: 'tab', 'aria-selected': activeYear === 'natal',
                  className: `zm-stage-tab ${activeYear === 'natal' ? 'zm-on' : ''}`,
                  onClick: () => setActiveYear('natal'),
                }, '本命'),
                ...chart.yearlyHoroscopes.map(yh => h('button', {
                  key: yh.year, type: 'button', role: 'tab', 'aria-selected': activeYear === yh.year,
                  className: `zm-stage-tab ${activeYear === yh.year ? 'zm-on' : ''}`,
                  onClick: () => { setActiveYear(yh.year); setSelectedPalaceIdx(yh.palaceIndex); },
                }, `${yh.year}流年`)),
              ),
            ) : null,
          ),

          beginnerMode ? h('div', { className: 'zm-tip-banner' },
            h('strong', null, '看图提示：'),
            '点击星图任意一宫，中心会亮起金色对宫线与紫色三合三角（三方四正）；点底部流年按钮可查看流年命宫与青色流年四化星点。',
          ) : null,

          // 2. Concise Selected Palace Inspector
          chart && selectedPalace ? h('div', { className: 'zm-card' },
            h('div', { className: 'zm-card-title', style: { marginBottom: 5 } },
              h('span', null, `${selectedPalace.name}（${selectedPalace.stemBranch} · ${selectedPalace.decadalRange[0]}-${selectedPalace.decadalRange[1]}岁）`),
              h('button', {
                type: 'button', className: 'zm-btn zm-btn-sm',
                onClick: () => onAskDeepSeek(`请调用 zhiming_read 读取我的紫微斗数命盘（盘面ID: ${chart.id}），结合三方四正重点帮我解读「${selectedPalace.name}」的星曜组合与现实指引。`),
              }, t('action.askFocus')),
            ),
            selectedPalace.majorStars.length
              ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: 'var(--zm-text-sub)' } },
                ...selectedPalace.majorStars.map((s, i) => h('div', { key: i },
                  h('strong', { style: { color: 'var(--zm-purple)' } }, `${s.name}${s.brightness ? `(${s.brightness})` : ''}${s.mutagen ? `[化${s.mutagen}]` : ''}：`),
                  s.glossary || '核心主星',
                )),
              )
              : h('div', { style: { fontSize: 12, color: 'var(--zm-text-sub)' } }, `空宫借对宫「${chart.palaces[selectedPalace.oppositeIndex]?.name}」主星参看，弹性与适应力极强。`),
          ) : null,

          // 3. Input Form
          formOpen ? h('div', { className: 'zm-card' },
            h('form', { onSubmit: submit },
              h('div', { className: 'zm-form-grid' },
                h('div', { className: 'zm-field' },
                  h('label', null, t('form.calendar')),
                  h('select', { className: 'zm-select', value: calendar, onChange: e => setCalendar(e.target.value) },
                    h('option', { value: 'solar' }, t('form.solar')),
                    h('option', { value: 'lunar' }, t('form.lunar')),
                  ),
                ),
                h('div', { className: 'zm-field' },
                  h('label', null, t('form.gender')),
                  h('select', { className: 'zm-select', value: gender, onChange: e => setGender(e.target.value) },
                    h('option', { value: 'female' }, t('form.female')),
                    h('option', { value: 'male' }, t('form.male')),
                  ),
                ),
                calendar === 'solar' ? h('div', { className: 'zm-field' },
                  h('label', null, t('form.birthDate')),
                  h('input', { className: 'zm-input', type: 'date', value: date, onChange: e => setDate(e.target.value), required: true }),
                ) : h('div', { className: 'zm-lunar-row' },
                  h('div', { className: 'zm-field' }, h('label', null, t('form.lunarYear')), h('input', { className: 'zm-input', type: 'number', min: 1901, max: 2099, value: lunarYear, onChange: e => setLunarYear(e.target.value), required: true })),
                  h('div', { className: 'zm-field' }, h('label', null, t('form.lunarMonth')), h('input', { className: 'zm-input', type: 'number', min: 1, max: 12, value: lunarMonth, onChange: e => setLunarMonth(e.target.value), required: true })),
                  h('div', { className: 'zm-field' }, h('label', null, t('form.lunarDay')), h('input', { className: 'zm-input', type: 'number', min: 1, max: 30, value: lunarDay, onChange: e => setLunarDay(e.target.value), required: true })),
                  h('label', { className: 'zm-check-label' }, h('input', { type: 'checkbox', checked: isLeapMonth, onChange: e => setIsLeapMonth(e.target.checked) }), t('form.leapMonth')),
                ),
                h('div', { className: 'zm-field' },
                  h('label', null, t('form.birthTime')),
                  h('input', { className: 'zm-input', type: 'time', value: time, onChange: e => setTime(e.target.value), required: true }),
                ),
                h('div', { className: 'zm-field' },
                  h('label', null, t('form.name')),
                  h('input', { className: 'zm-input', placeholder: '称呼（可选）', value: name, onChange: e => setName(e.target.value) }),
                ),
                h('div', { className: 'zm-field' },
                  h('label', null, t('form.advancedTst')),
                  h('select', { className: 'zm-select', value: longitude, onChange: e => setLongitude(e.target.value) },
                    ...CITY_LONGITUDES.map(c => h('option', { key: c.value || 'off', value: c.value }, c.value === '' ? t('form.longitudeOff') : c.label)),
                  ),
                ),
              ),
              h('div', { className: 'zm-form-footer' },
                h('button', { type: 'button', className: 'zm-btn zm-btn-sm', disabled: busy, onClick: () => onDemo('ziwei') }, t('action.demo')),
                h('button', { type: 'submit', className: 'zm-btn zm-btn-gold', disabled: busy }, busy ? t('status.casting') : t('action.cast')),
              ),
            ),
          ) : null,

          // 4. Collapsible Patterns & Four Mutagens Drawer
          chart ? h('details', { className: 'zm-details' },
            h('summary', null,
              h('span', null, `紫微经典格局识别 (${chart.patterns?.length || 0}) · 生年四化`),
              h('span', { className: 'zm-muted' }, '展开详览 ▾'),
            ),
            h('div', { className: 'zm-details-body' },
              h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 5 } },
                ...(chart.mutagens || []).map((m, i) => {
                  const mc = MUTAGEN_COLOR[m.mutagen] || MUTAGEN_COLOR['禄'];
                  return h('button', {
                    key: i, type: 'button', className: 'zm-chip',
                    style: { cursor: 'pointer', background: mc.bg, color: mc.fg, borderColor: mc.border },
                    onClick: () => setSelectedPalaceIdx(m.palaceIndex),
                  }, `${m.star}化${m.mutagen}→${m.palace}`);
                }),
              ),
              ...(chart.patterns || []).map((pt, i) => h('div', { key: i, style: { fontSize: 12, color: 'var(--zm-text-sub)' } },
                h('strong', { style: { color: 'var(--zm-purple)' } }, `${pt.name}（${pt.nature}）：`),
                pt.desc,
              )),
            ),
          ) : null,
        );
      };
    }

    // --- src/client/views-hepan.js ---
    function createHepanView(React, Visuals) {
      const h = React.createElement;
      const { CelestialBackdropSvg, HepanOrrerySvg, HepanTimeline30ySvg, RadarChartSvg } = Visuals;

      return function HepanView({ chart, isDark, beginnerMode, busy, onCast, onDemo, onAskDeepSeek, t }) {
        const [formOpen, setFormOpen] = React.useState(!chart);
        const [stageMode, setStageMode] = React.useState('orrery'); // 'orrery' | 'radar' | 'wave'
        const [relation, setRelation] = React.useState('love');
        const [nameA, setNameA] = React.useState('甲方');
        const [calA, setCalA] = React.useState('solar');
        const [dateA, setDateA] = React.useState('1995-05-18');
        const [timeA, setTimeA] = React.useState('08:30');
        const [genderA, setGenderA] = React.useState('male');
        const [nameB, setNameB] = React.useState('乙方');
        const [calB, setCalB] = React.useState('solar');
        const [dateB, setDateB] = React.useState('1998-03-12');
        const [timeB, setTimeB] = React.useState('21:30');
        const [genderB, setGenderB] = React.useState('female');
        const [question, setQuestion] = React.useState('');

        React.useEffect(() => {
          if (chart) setFormOpen(false);
          else setFormOpen(true);
        }, [chart?.id]);

        const submit = e => {
          e.preventDefault();
          onCast({
            system: 'hepan',
            relation,
            question,
            personA: { name: nameA || '甲方', date: dateA, time: timeA, gender: genderA, calendar: calA },
            personB: { name: nameB || '乙方', date: dateB, time: timeB, gender: genderB, calendar: calB },
          });
        };

        const scoreTone = s => (s >= 80 ? 'var(--zm-green)' : s >= 65 ? 'var(--zm-gold)' : 'var(--zm-red)');

        return h('div', { className: 'zm-animate', style: { display: 'flex', flexDirection: 'column', gap: 11 } },
          // 1. MONUMENTAL BINARY-STAR GRAVITATIONAL ORRERY CANVAS
          h('div', { className: 'zm-canvas' },
            h(CelestialBackdropSvg, { isDark }),
            h('div', { className: 'zm-canvas-bar' },
              h('div', { className: 'zm-stage-tabs', role: 'tablist' },
                h('button', {
                  type: 'button', role: 'tab', 'aria-selected': stageMode === 'orrery',
                  className: `zm-stage-tab ${stageMode === 'orrery' ? 'zm-on' : ''}`,
                  onClick: () => setStageMode('orrery'),
                }, '双星引力'),
                chart ? h('button', {
                  type: 'button', role: 'tab', 'aria-selected': stageMode === 'radar',
                  className: `zm-stage-tab ${stageMode === 'radar' ? 'zm-on' : ''}`,
                  onClick: () => setStageMode('radar'),
                }, '六维星芒') : null,
                chart?.timeline30y?.length ? h('button', {
                  type: 'button', role: 'tab', 'aria-selected': stageMode === 'wave',
                  className: `zm-stage-tab ${stageMode === 'wave' ? 'zm-on' : ''}`,
                  onClick: () => setStageMode('wave'),
                }, '30年共振波') : null,
              ),
              h('div', { style: { display: 'flex', gap: 5, alignItems: 'center' } },
                chart ? h('button', { type: 'button', className: 'zm-btn zm-btn-sm', onClick: () => setFormOpen(v => !v) }, formOpen ? '收起' : '合盘') : null,
                chart ? h('button', {
                  type: 'button', className: 'zm-btn zm-btn-gold zm-btn-sm',
                  onClick: () => onAskDeepSeek(`请调用 zhiming_read 读取我的双人合盘数据（盘面ID: ${chart.id}，${chart.title}，综合${chart.overallScore}分·${chart.grade}），用温暖且务实的白话为我们分析六维优势、30年大运同步节奏、潜在磨合点和相处/家居调和建议。`),
                }, `✦ ${t('dock.ask')}`) : h('button', {
                  type: 'button', className: 'zm-btn zm-btn-gold zm-btn-sm', disabled: busy,
                  onClick: () => onDemo('hepan'),
                }, `✦ ${t('action.demo')}`),
              ),
            ),

            h('div', { className: 'zm-canvas-artwork' },
              stageMode === 'radar' && chart
                ? h(RadarChartSvg, { dimensions: chart.dimensions })
                : stageMode === 'wave' && chart?.timeline30y?.length
                  ? h(HepanTimeline30ySvg, { timeline30y: chart.timeline30y, nameA: chart.personA.name, nameB: chart.personB.name, isDark })
                  : h(HepanOrrerySvg, { chart, isDark }),
            ),

            chart ? h('div', { className: 'zm-canvas-footer' },
              h('span', { className: 'zm-glass-pill', style: { color: 'var(--zm-blue)' } }, `${chart.personA.name} · ${chart.personA.dayMaster} · 喜${chart.personA.favorable.join('')}`),
              h('span', { className: 'zm-glass-pill', style: { color: 'var(--zm-pink)' } }, `${chart.personB.name} · ${chart.personB.dayMaster} · 喜${chart.personB.favorable.join('')}`),
            ) : null,
          ),

          beginnerMode ? h('div', { className: 'zm-tip-banner' },
            h('strong', null, '看图提示：'),
            '左右两颗主星周围的 5 颗卫星大小代表各自五行能量，中央光环与六瓣星芒展示综合缘分分；可切换顶部看六维雷达与未来 30 年大运共振波。',
          ) : null,

          // 2. Concise Highlight Card
          chart ? h('div', { className: 'zm-card' },
            h('div', { className: 'zm-card-title', style: { marginBottom: 5 } },
              h('span', null, `${chart.title} · ${chart.overallScore}分`),
              h('span', { className: 'zm-chip', style: { color: 'var(--zm-pink)' } }, chart.grade),
            ),
            h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12 } },
              chart.highlights[0] ? h('div', { style: { color: 'var(--zm-green)' } }, `✓ ${chart.highlights[0]}`) : null,
              chart.cautions[0] ? h('div', { style: { color: 'var(--zm-amber)' } }, `△ ${chart.cautions[0]}`) : null,
            ),
          ) : null,

          // 3. Input Form
          formOpen ? h('div', { className: 'zm-card' },
            h('form', { onSubmit: submit },
              h('div', { style: { display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 8 } },
                ...[['love', '恋爱婚姻'], ['business', '事业合伙'], ['family', '挚友亲子']].map(([r, label]) =>
                  h('button', {
                    key: r, type: 'button', 'aria-pressed': relation === r,
                    className: `zm-nav-pill ${relation === r ? 'zm-active' : ''}`,
                    style: { '--zm-accent': 'var(--zm-pink)' },
                    onClick: () => setRelation(r),
                  }, label),
                ),
              ),
              h('div', { className: 'zm-two-col' },
                h('div', { style: { padding: 8, borderRadius: 9, border: '1px solid var(--zm-border)' } },
                  h('div', { style: { fontWeight: 700, fontSize: 11.5, marginBottom: 6, color: 'var(--zm-blue)' } }, t('form.hepanPersonA')),
                  h('div', { className: 'zm-form-grid' },
                    h('div', { className: 'zm-field' }, h('label', null, t('form.name')), h('input', { className: 'zm-input', value: nameA, onChange: e => setNameA(e.target.value) })),
                    h('div', { className: 'zm-field' }, h('label', null, t('form.gender')), h('select', { className: 'zm-select', value: genderA, onChange: e => setGenderA(e.target.value) }, h('option', { value: 'male' }, t('form.male')), h('option', { value: 'female' }, t('form.female')))),
                    h('div', { className: 'zm-field' }, h('label', null, t('form.calendar')), h('select', { className: 'zm-select', value: calA, onChange: e => setCalA(e.target.value) }, h('option', { value: 'solar' }, t('form.solar')), h('option', { value: 'lunar' }, t('form.lunar')))),
                    h('div', { className: 'zm-field' }, h('label', null, t('form.birthDate')), calA === 'solar'
                      ? h('input', { className: 'zm-input', type: 'date', value: dateA, onChange: e => setDateA(e.target.value), required: true })
                      : h('input', { className: 'zm-input', placeholder: 'YYYY-MM-DD', value: dateA, onChange: e => setDateA(e.target.value), required: true })),
                    h('div', { className: 'zm-field' }, h('label', null, t('form.birthTime')), h('input', { className: 'zm-input', type: 'time', value: timeA, onChange: e => setTimeA(e.target.value), required: true })),
                  ),
                ),
                h('div', { style: { padding: 8, borderRadius: 9, border: '1px solid var(--zm-border)' } },
                  h('div', { style: { fontWeight: 700, fontSize: 11.5, marginBottom: 6, color: 'var(--zm-pink)' } }, t('form.hepanPersonB')),
                  h('div', { className: 'zm-form-grid' },
                    h('div', { className: 'zm-field' }, h('label', null, t('form.name')), h('input', { className: 'zm-input', value: nameB, onChange: e => setNameB(e.target.value) })),
                    h('div', { className: 'zm-field' }, h('label', null, t('form.gender')), h('select', { className: 'zm-select', value: genderB, onChange: e => setGenderB(e.target.value) }, h('option', { value: 'female' }, t('form.female')), h('option', { value: 'male' }, t('form.male')))),
                    h('div', { className: 'zm-field' }, h('label', null, t('form.calendar')), h('select', { className: 'zm-select', value: calB, onChange: e => setCalB(e.target.value) }, h('option', { value: 'solar' }, t('form.solar')), h('option', { value: 'lunar' }, t('form.lunar')))),
                    h('div', { className: 'zm-field' }, h('label', null, t('form.birthDate')), calB === 'solar'
                      ? h('input', { className: 'zm-input', type: 'date', value: dateB, onChange: e => setDateB(e.target.value), required: true })
                      : h('input', { className: 'zm-input', placeholder: 'YYYY-MM-DD', value: dateB, onChange: e => setDateB(e.target.value), required: true })),
                    h('div', { className: 'zm-field' }, h('label', null, t('form.birthTime')), h('input', { className: 'zm-input', type: 'time', value: timeB, onChange: e => setTimeB(e.target.value), required: true })),
                  ),
                ),
              ),
              h('div', { className: 'zm-form-footer' },
                h('button', { type: 'button', className: 'zm-btn zm-btn-sm', disabled: busy, onClick: () => onDemo('hepan') }, t('action.demo')),
                h('button', { type: 'submit', className: 'zm-btn zm-btn-gold', disabled: busy }, busy ? t('status.casting') : t('action.castHepan')),
              ),
            ),
          ) : null,

          // 4. Collapsible Detailed Breakdown & Five-Element Synergy Matrix
          chart ? h('details', { className: 'zm-details' },
            h('summary', null,
              h('span', null, '双方五行互补对比 · 六大维度拆解 · 调和建议'),
              h('span', { className: 'zm-muted' }, '展开详览 ▾'),
            ),
            h('div', { className: 'zm-details-body' },
              chart.elementSynergy?.length ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: 7 } },
                ...chart.elementSynergy.map(row => h('div', { key: row.element, style: { fontSize: 11.5 } },
                  h('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: 3 } },
                    h('span', { style: { color: 'var(--zm-blue)', fontWeight: 600 } }, `${chart.personA.name} ${row.pctA}%${row.aNeeds ? '★' : ''}`),
                    h('strong', { style: { color: WUXING_STYLE[row.element].color } }, row.element),
                    h('span', { style: { color: 'var(--zm-pink)', fontWeight: 600 } }, `${row.bNeeds ? '★' : ''}${row.pctB}% ${chart.personB.name}`),
                  ),
                  h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 } },
                    h('div', { className: 'zm-bar-track', style: { display: 'flex', justifyContent: 'flex-end' } }, h('div', { className: 'zm-bar-fill', style: { width: `${Math.min(100, row.pctA * 2)}%`, background: 'var(--zm-blue)' } })),
                    h('div', { className: 'zm-bar-track' }, h('div', { className: 'zm-bar-fill', style: { width: `${Math.min(100, row.pctB * 2)}%`, background: 'var(--zm-pink)' } })),
                  ),
                )),
              ) : null,
              h('div', { className: 'zm-sep' }),
              ...chart.dimensions.map(d => h('div', { key: d.key },
                h('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 2 } },
                  h('strong', null, d.label),
                  h('span', { style: { fontWeight: 700, color: scoreTone(d.score) } }, `${d.score} 分`),
                ),
                h('div', { className: 'zm-bar-track', style: { marginBottom: 2 } }, h('div', { className: 'zm-bar-fill', style: { width: `${d.score}%`, background: scoreTone(d.score) } })),
                h('div', { className: 'zm-muted' }, d.summary),
              )),
              ...chart.advice.map((x, i) => h('div', { key: `adv-${i}`, style: { fontSize: 12, color: 'var(--zm-text-sub)' } }, `✦ ${x}`)),
            ),
          ) : null,
        );
      };
    }

    // --- src/client/views-tutorial.js ---
    function createTutorialView(React, Visuals) {
      const h = React.createElement;
      const { WuXingPentagonSvg, CelestialBackdropSvg, FlyingStarsAltarSvg, getFlyingStarsForYear } = Visuals;

      return function TutorialView({ isDark, busy, onSelectTab, onDemo, onAskDeepSeek, t }) {
        const [activeSection, setActiveSection] = React.useState('flyingstars');
        const [selectedEl, setSelectedEl] = React.useState('木');
        const [searchTerm, setSearchTerm] = React.useState('');
        const currentYear = new Date().getFullYear();
        const [fsYear, setFsYear] = React.useState(currentYear);
        const [selectedFsPalace, setSelectedFsPalace] = React.useState(4);

        const trimmedQuery = searchTerm.trim();
        const filteredGlossary = CLIENT_TUTORIAL_DATA.glossary.filter(([term, desc]) => {
          if (!trimmedQuery) return true;
          return term.includes(trimmedQuery) || desc.includes(trimmedQuery);
        });

        const flyingStars = React.useMemo(() => getFlyingStarsForYear(fsYear), [fsYear]);
        const activeFsCell = flyingStars.find(f => f.palaceNum === selectedFsPalace) || flyingStars[0];

        return h('div', { className: 'zm-animate', style: { display: 'flex', flexDirection: 'column', gap: 11 } },
          // Sleek Section Switcher
          h('div', { style: { display: 'flex', justifyContent: 'center' } },
            h('div', { className: 'zm-stage-tabs', role: 'tablist', style: { flexWrap: 'wrap', justifyContent: 'center' } },
              ...[
                ['flyingstars', '九宫飞星罗盘'],
                ['quickstart', '快速体验'],
                ['systems', '五大术数'],
                ['basics', '五行时辰'],
                ['glossary', '白话词典'],
              ].map(([id, label]) => h('button', {
                key: id, type: 'button', role: 'tab', 'aria-selected': activeSection === id,
                className: `zm-stage-tab ${activeSection === id ? 'zm-on' : ''}`,
                onClick: () => setActiveSection(id),
              }, label)),
            ),
          ),

          // Section 1: Monumental XuanKong Annual Nine Flying Stars Octagonal Altar
          activeSection === 'flyingstars' ? h(React.Fragment, null,
            h('div', { className: 'zm-canvas' },
              h(CelestialBackdropSvg, { isDark }),
              h('div', { className: 'zm-canvas-bar' },
                h('span', { className: 'zm-glass-pill', style: { color: 'var(--zm-gold)' } }, `${fsYear} 玄空流年九宫飞星`),
                h('div', { className: 'zm-stage-tabs', role: 'tablist' },
                  ...[currentYear - 1, currentYear, currentYear + 1].map(y => h('button', {
                    key: y, type: 'button', role: 'tab', 'aria-selected': fsYear === y,
                    className: `zm-stage-tab ${fsYear === y ? 'zm-on' : ''}`,
                    onClick: () => setFsYear(y),
                  }, `${y}年`)),
                ),
              ),
              h('div', { className: 'zm-canvas-artwork' },
                h(FlyingStarsAltarSvg, {
                  flyingStars,
                  year: fsYear,
                  isDark,
                  selectedPalaceNum: selectedFsPalace,
                  onSelectPalace: setSelectedFsPalace,
                }),
              ),
            ),
            activeFsCell ? h('div', { className: 'zm-card' },
              h('div', { className: 'zm-card-title', style: { marginBottom: 4 } },
                h('span', null, `${fsYear}年 · ${activeFsCell.direction} · ${activeFsCell.name}（${activeFsCell.tag}）`),
                h('button', {
                  type: 'button', className: 'zm-btn zm-btn-gold zm-btn-sm',
                  onClick: () => onAskDeepSeek(`请结合 ${fsYear} 年流年九宫飞星中「${activeFsCell.direction}方飞临${activeFsCell.name}（${activeFsCell.tag}）」，用新手易操作的白话告诉我客厅、卧室或办公桌在这个方位具体怎么布置最加分？`),
                }, '✦ 问 DeepSeek'),
              ),
              h('div', { style: { fontSize: 12, color: 'var(--zm-text-sub)' } }, activeFsCell.tip),
            ) : null,
          ) : null,

          // Section 2: One-Click DeepSeek & Demo Prompts
          activeSection === 'quickstart' ? h('div', { className: 'zm-card' },
            h('div', { className: 'zm-card-title' }, h('span', null, '一键体验五大星台或对话 DeepSeek 排盘')),
            h('div', { style: { display: 'flex', flexDirection: 'column', gap: 7 } },
              ...CLIENT_TUTORIAL_DATA.quickPrompts.map((item, i) => h('div', {
                key: i,
                style: {
                  padding: '8px 10px', borderRadius: 9, border: '1px solid var(--zm-border)',
                  background: 'var(--zm-bg)', display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', gap: 8, flexWrap: 'wrap',
                },
              },
                h('div', { style: { flex: 1, minWidth: 160 } },
                  h('div', { style: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 } },
                    h('span', { className: 'zm-chip', style: { color: 'var(--zm-gold)' } }, item.tag),
                    h('strong', { style: { fontSize: 12 } }, item.title),
                  ),
                  h('div', { className: 'zm-muted' }, `“${item.prompt}”`),
                ),
                h('div', { style: { display: 'flex', gap: 5 } },
                  h('button', { type: 'button', className: 'zm-btn zm-btn-sm', disabled: busy, onClick: () => onDemo(item.system) }, t('action.demo')),
                  h('button', { type: 'button', className: 'zm-btn zm-btn-gold zm-btn-sm', onClick: () => onAskDeepSeek(item.prompt) }, t('action.tryPrompt')),
                ),
              )),
            ),
          ) : null,

          // Section 3: 5 Systems Guide
          activeSection === 'systems' ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
            ...CLIENT_TUTORIAL_DATA.systemGuide.map(sys => h('div', { key: sys.id, className: 'zm-card' },
              h('div', { className: 'zm-card-title', style: { marginBottom: 5 } },
                h('span', null, sys.name),
                h('div', { style: { display: 'flex', gap: 5 } },
                  h('button', { type: 'button', className: 'zm-btn zm-btn-sm', onClick: () => onSelectTab(sys.id) }, '进入'),
                  h('button', { type: 'button', className: 'zm-btn zm-btn-gold zm-btn-sm', disabled: busy, onClick: () => onDemo(sys.id) }, t('action.demo')),
                ),
              ),
              h('div', { style: { fontSize: 12, color: 'var(--zm-text-sub)', marginBottom: 3 } }, `${sys.scene}（准备：${sys.need}）`),
              h('div', { className: 'zm-muted' }, sys.keyTip),
            )),
          ) : null,

          // Section 4: Interactive Five Elements & 12 Shichen
          activeSection === 'basics' ? h(React.Fragment, null,
            h('div', { className: 'zm-card' },
              h('div', { className: 'zm-card-title' }, h('span', null, '五行生克图解')),
              h('div', { className: 'zm-wuxing-grid' },
                h(WuXingPentagonSvg, {
                  percentages: { 木: 24, 火: 24, 土: 24, 金: 24, 水: 24 },
                  selectedElement: selectedEl,
                  onSelectElement: el => setSelectedEl(el),
                }),
                h('div', { style: { display: 'flex', flexDirection: 'column', gap: 5, fontSize: 12, color: 'var(--zm-text-sub)' } },
                  h('strong', { style: { color: WUXING_STYLE[selectedEl].color } }, `${WUXING_STYLE[selectedEl].label}（${WUXING_STYLE[selectedEl].dir}）`),
                  h('div', null, WUXING_STYLE[selectedEl].trait),
                  h('div', { className: 'zm-muted' }, '相生：木→火→土→金→水→木'),
                  h('div', { className: 'zm-muted' }, '相克：木→土→水→火→金→木'),
                ),
              ),
            ),
            h('div', { className: 'zm-card' },
              h('div', { className: 'zm-card-title' }, h('span', null, '十二时辰对照表')),
              h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 5 } },
                ...CLIENT_TUTORIAL_DATA.shichenTable.map(([name, range, el, zodiac]) => h('div', {
                  key: name,
                  style: { padding: '5px 7px', borderRadius: 8, border: '1px solid var(--zm-border)', background: 'var(--zm-bg)', fontSize: 11 },
                },
                  h('div', { style: { display: 'flex', justifyContent: 'space-between', fontWeight: 700 } },
                    h('span', null, `${name}·${zodiac}`),
                    h('span', { style: { color: WUXING_STYLE[el].color } }, el),
                  ),
                  h('div', { className: 'zm-muted', style: { fontSize: 10 } }, range),
                )),
              ),
            ),
          ) : null,

          // Section 5: Searchable Glossary
          activeSection === 'glossary' ? h('div', { className: 'zm-card' },
            h('div', { className: 'zm-card-title' },
              h('span', null, '玄学术语白话词典'),
              h('input', {
                className: 'zm-input',
                style: { width: 145, padding: '4px 8px' },
                placeholder: t('form.searchGlossary'),
                value: searchTerm,
                onChange: e => setSearchTerm(e.target.value),
              }),
            ),
            filteredGlossary.length === 0 ? h('div', { className: 'zm-tip-banner', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' } },
              h('span', null, `${t('glossary.empty')}「${trimmedQuery}」`),
              h('button', {
                type: 'button', className: 'zm-btn zm-btn-gold zm-btn-sm',
                onClick: () => onAskDeepSeek(`请用生活中通俗易懂的比喻，给我详细讲讲风水命理中的「${trimmedQuery}」是什么意思？`),
              }, t('dock.ask')),
            ) : h('div', { style: { display: 'flex', flexDirection: 'column', gap: 6 } },
              ...filteredGlossary.map(([term, desc]) => h('div', {
                key: term,
                style: {
                  padding: '7px 9px', borderRadius: 8, border: '1px solid var(--zm-border)',
                  background: 'var(--zm-bg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8,
                },
              },
                h('div', { style: { fontSize: 12, color: 'var(--zm-text-sub)' } },
                  h('strong', { style: { color: 'var(--zm-gold)' } }, `${term}：`),
                  desc,
                ),
                h('button', {
                  type: 'button', className: 'zm-btn zm-btn-sm',
                  onClick: () => onAskDeepSeek(`请用生活中通俗易懂的比喻，给我详细讲讲风水命理中的「${term}」是什么意思？`),
                }, t('dock.ask')),
              )),
            ),
          ) : null,
        );
      };
    }

    // --- src/client/studio.js ---
    function createStudioComponent(React, Visuals, Views) {
      const h = React.createElement;
      const { ZhimingErrorBoundary, LuopanEmblem } = Visuals;
      const { BaziView, QimenView, MeihuaView, ZiweiView, HepanView, TutorialView } = Views;

      const EMPTY_PROJECTION = {
        version: 1,
        activeChartId: null,
        activeSystem: 'tutorial',
        focusedPart: null,
        charts: [],
      };

      function detectHostTheme() {
        try {
          if (typeof document !== 'undefined') {
            const rootEl = document.documentElement;
            const bodyEl = document.body;
            const attr = rootEl?.getAttribute?.('data-theme') || bodyEl?.getAttribute?.('data-theme') || '';
            if (attr.toLowerCase().includes('dark')) return 'dark';
            if (attr.toLowerCase().includes('light')) return 'light';
            if (rootEl?.classList?.contains('dark') || bodyEl?.classList?.contains('dark')) return 'dark';
            if (typeof getComputedStyle === 'function' && rootEl) {
              const bg = getComputedStyle(rootEl).getPropertyValue('--dsw-alias-bg-base')?.trim() || '';
              const rgb = bg.match(/\d+/g);
              if (rgb && rgb.length >= 3) {
                const lum = (0.299 * Number(rgb[0]) + 0.587 * Number(rgb[1]) + 0.114 * Number(rgb[2])) / 255;
                return lum < 0.5 ? 'dark' : 'light';
              }
              if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(bg)) {
                const hex = bg.length === 4 ? bg.slice(1).split('').map(c => c + c).join('') : bg.slice(1);
                const r = parseInt(hex.slice(0, 2), 16);
                const g = parseInt(hex.slice(2, 4), 16);
                const b = parseInt(hex.slice(4, 6), 16);
                const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                return lum < 0.5 ? 'dark' : 'light';
              }
            }
          }
          if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          }
        } catch {
          // ignore detection errors in non-DOM test runtimes
        }
        return 'light';
      }

      function readSavedTheme() {
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            const v = window.localStorage.getItem('dsh-zhiming-theme');
            if (v === 'dark' || v === 'light') return v;
          }
        } catch {
          // ignore storage errors
        }
        return null;
      }

      function saveTheme(val) {
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.setItem('dsh-zhiming-theme', val);
          }
        } catch {
          // ignore storage errors
        }
      }

      function useObservableFace(face) {
        const subscribe = React.useCallback(
          cb => (face && typeof face.subscribe === 'function' ? face.subscribe(cb) : () => {}),
          [face],
        );
        const getSnapshot = React.useCallback(
          () => (face && typeof face.getSnapshot === 'function' ? face.getSnapshot() : undefined),
          [face],
        );
        return React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
      }

      function useZhimingState(useProjectionProp, fallbackFace) {
        const fromStandard = typeof useProjectionProp === 'function' ? useProjectionProp('zhiming') : undefined;
        const fromFallback = useObservableFace(fallbackFace);
        return fromStandard ?? fromFallback ?? EMPTY_PROJECTION;
      }

      return function ZhimingStudio(props) {
        const t = props.t || (k => ZH_DICT[k] || k);
        const projection = useZhimingState(props.useProjection, props.projectionFace);
        const uiNav = useObservableFace(props.uiNavFace);

        const [activeTab, setActiveTab] = React.useState(() => {
          if (uiNav?.tab) return uiNav.tab;
          if (projection.activeChartId) {
            const active = projection.charts.find(c => c.id === projection.activeChartId);
            if (active?.system) return active.system;
          }
          return projection.activeSystem || 'tutorial';
        });
        const [selectedChartId, setSelectedChartId] = React.useState(projection.activeChartId);
        const [themeOverride, setThemeOverride] = React.useState(() => readSavedTheme());
        const [hostTheme, setHostTheme] = React.useState(() => detectHostTheme());
        const [beginnerMode, setBeginnerMode] = React.useState(false);
        const [busy, setBusy] = React.useState(false);
        const [confirmClear, setConfirmClear] = React.useState(false);
        const [toast, setToast] = React.useState(null);
        const lastActiveRef = React.useRef(projection.activeChartId);
        const lastNavSeqRef = React.useRef(uiNav?.seq || 0);
        const toastTimerRef = React.useRef(null);

        const resolvedTheme = themeOverride || hostTheme;
        const isDark = resolvedTheme === 'dark';

        const setTheme = next => {
          setThemeOverride(next);
          saveTheme(next);
        };

        React.useEffect(() => {
          const cleanups = [];
          try {
            if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
              const mq = window.matchMedia('(prefers-color-scheme: dark)');
              const onChange = () => setHostTheme(detectHostTheme());
              if (mq.addEventListener) {
                mq.addEventListener('change', onChange);
                cleanups.push(() => mq.removeEventListener('change', onChange));
              }
            }
            if (typeof MutationObserver === 'function' && typeof document !== 'undefined' && document.documentElement) {
              const obs = new MutationObserver(() => setHostTheme(detectHostTheme()));
              obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme', 'style'] });
              cleanups.push(() => obs.disconnect());
            }
          } catch {
            // ignore in headless runtimes
          }
          return () => {
            cleanups.forEach(fn => fn());
            if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
          };
        }, []);

        // Auto-switch tab whenever a new chart arrives from DeepSeek or UI casting
        React.useEffect(() => {
          if (projection.activeChartId && projection.activeChartId !== lastActiveRef.current) {
            lastActiveRef.current = projection.activeChartId;
            setSelectedChartId(projection.activeChartId);
            const found = projection.charts.find(c => c.id === projection.activeChartId);
            if (found?.system) setActiveTab(found.system);
          }
        }, [projection.activeChartId, projection.charts]);

        // Respond to explicit "Open in Studio" click from inline Chat cards
        React.useEffect(() => {
          if (uiNav?.seq && uiNav.seq !== lastNavSeqRef.current) {
            lastNavSeqRef.current = uiNav.seq;
            if (uiNav.chartId) setSelectedChartId(uiNav.chartId);
            if (uiNav.tab) setActiveTab(uiNav.tab);
          }
        }, [uiNav?.seq, uiNav?.chartId, uiNav?.tab]);

        const showToast = React.useCallback((msg, isError = false) => {
          if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
          setToast({ msg, isError });
          toastTimerRef.current = setTimeout(() => {
            setToast(null);
            toastTimerRef.current = null;
          }, 3600);
        }, []);

        const handleCast = React.useCallback(async params => {
          if (busy) return;
          setBusy(true);
          try {
            const res = await props.executeZhiming({ op: 'cast', params });
            if (!res.ok) {
              showToast(res.error || t('status.syncError'), true);
            }
          } catch (err) {
            showToast(err?.message || t('status.syncError'), true);
          } finally {
            setBusy(false);
          }
        }, [busy, props.executeZhiming, showToast, t]);

        const handleDemo = React.useCallback(async system => {
          if (busy) return;
          setBusy(true);
          setActiveTab(system);
          try {
            const res = await props.executeZhiming({ op: 'demo', system });
            if (!res.ok) {
              showToast(res.error || t('status.syncError'), true);
            }
          } catch (err) {
            showToast(err?.message || t('status.syncError'), true);
          } finally {
            setBusy(false);
          }
        }, [busy, props.executeZhiming, showToast, t]);

        const handleClearHistory = React.useCallback(async () => {
          if (!confirmClear) {
            setConfirmClear(true);
            return;
          }
          setConfirmClear(false);
          setBusy(true);
          try {
            const res = await props.executeZhiming({ op: 'clear' });
            if (!res.ok) {
              showToast(res.error || t('status.syncError'), true);
            } else {
              setSelectedChartId(null);
              showToast(t('cmd.cleared'), false);
            }
          } catch (err) {
            showToast(err?.message || t('status.syncError'), true);
          } finally {
            setBusy(false);
          }
        }, [confirmClear, props.executeZhiming, showToast, t]);

        const handleAskDeepSeek = React.useCallback(async promptText => {
          try {
            const res = await props.sendPrompt(promptText);
            if (res?.ok === false) {
              showToast(res.error || t('status.syncError'), true);
            } else {
              showToast(t('status.sentPrompt'), false);
            }
          } catch (err) {
            showToast(err?.message || t('status.syncError'), true);
          }
        }, [props.sendPrompt, showToast, t]);

        const chartForTab = React.useMemo(() => {
          if (activeTab === 'tutorial') return null;
          const picked = projection.charts.find(c => c.id === selectedChartId && c.system === activeTab);
          if (picked) return picked;
          return projection.charts.find(c => c.system === activeTab) || null;
        }, [activeTab, selectedChartId, projection.charts]);

        const renderBody = () => {
          const commonProps = {
            chart: chartForTab,
            isDark,
            beginnerMode,
            busy,
            onCast: handleCast,
            onDemo: handleDemo,
            onAskDeepSeek: handleAskDeepSeek,
            t,
          };
          switch (activeTab) {
            case 'bazi':
              return h(BaziView, commonProps);
            case 'qimen':
              return h(QimenView, commonProps);
            case 'meihua':
              return h(MeihuaView, commonProps);
            case 'ziwei':
              return h(ZiweiView, commonProps);
            case 'hepan':
              return h(HepanView, commonProps);
            default:
              return h(TutorialView, {
                isDark,
                busy,
                onSelectTab: setActiveTab,
                onDemo: handleDemo,
                onAskDeepSeek: handleAskDeepSeek,
                t,
              });
          }
        };

        return h(ZhimingErrorBoundary, { fallbackText: t('error.boundary'), resetText: t('error.reset') },
          h('div', { className: 'zm-root', 'data-zm-theme': resolvedTheme },
            // Sleek Dual-Theme Header + Navigation Bar
            h('div', { className: 'zm-hero-bar' },
              h('div', { className: 'zm-hero-top' },
                h('div', { className: 'zm-brand-wrap' },
                  h(LuopanEmblem, { size: 28, spin: true }),
                  h('div', { className: 'zm-brand-title' }, t('brand.short')),
                ),
                h('div', { className: 'zm-hero-actions' },
                  // Dedicated Light / Dark Theme Segmented Switch
                  h('div', { className: 'zm-theme-seg', role: 'group', 'aria-label': '主题切换' },
                    h('button', {
                      type: 'button',
                      className: !isDark ? 'zm-on' : '',
                      'aria-pressed': !isDark,
                      onClick: () => setTheme('light'),
                    }, `☀ ${t('action.themeLight')}`),
                    h('button', {
                      type: 'button',
                      className: isDark ? 'zm-on' : '',
                      'aria-pressed': isDark,
                      onClick: () => setTheme('dark'),
                    }, `☾ ${t('action.themeDark')}`),
                  ),
                  h('button', {
                    type: 'button',
                    className: `zm-btn zm-btn-sm ${beginnerMode ? 'zm-btn-primary' : ''}`,
                    role: 'switch',
                    'aria-checked': beginnerMode,
                    onClick: () => setBeginnerMode(v => !v),
                  }, beginnerMode ? '白话提示' : '白话'),
                  projection.charts.length > 0 ? h(React.Fragment, null,
                    h('select', {
                      className: 'zm-select',
                      style: { width: 'auto', maxWidth: 124, padding: '3px 7px', fontSize: 11 },
                      'aria-label': t('action.history'),
                      value: chartForTab?.id || '',
                      onChange: e => {
                        const id = e.target.value;
                        const found = projection.charts.find(c => c.id === id);
                        if (found) {
                          setSelectedChartId(found.id);
                          setActiveTab(found.system);
                        }
                      },
                    },
                      h('option', { value: '' }, `${t('action.history')} (${projection.charts.length})`),
                      ...projection.charts.map(c => h('option', { key: c.id, value: c.id }, c.title)),
                    ),
                    h('button', {
                      type: 'button',
                      className: 'zm-btn zm-btn-sm',
                      disabled: busy,
                      style: confirmClear ? { color: 'var(--zm-red)', borderColor: 'rgba(239,68,68,0.5)' } : undefined,
                      onClick: handleClearHistory,
                      onBlur: () => setConfirmClear(false),
                    }, confirmClear ? t('action.confirmClear') : t('action.clearHistory')),
                  ) : null,
                ),
              ),
              // 6 Navigation Pills
              h('div', { className: 'zm-nav', role: 'tablist' },
                ...SYSTEM_TABS.map(tab => {
                  const hasChart = tab.id !== 'tutorial' && projection.charts.some(c => c.system === tab.id);
                  return h('button', {
                    key: tab.id,
                    type: 'button',
                    role: 'tab',
                    'aria-selected': activeTab === tab.id,
                    className: `zm-nav-pill ${activeTab === tab.id ? 'zm-active' : ''}`,
                    style: { '--zm-accent': tab.accent },
                    onClick: () => setActiveTab(tab.id),
                  },
                    h('span', { className: 'zm-nav-glyph' }, tab.icon),
                    h('span', null, t(tab.labelKey)),
                    hasChart ? h('span', {
                      style: { width: 5, height: 5, borderRadius: '50%', background: tab.accent },
                    }) : null,
                  );
                }),
              ),
            ),

            // Scrollable View Body
            h('div', { className: 'zm-body' },
              renderBody(),
              toast ? h('div', {
                className: 'zm-toast',
                role: 'status',
                'aria-live': 'polite',
                style: toast.isError ? { background: '#991b1b', color: '#fff', borderColor: '#dc2626' } : undefined,
              },
                h('span', null, toast.msg),
                h('button', {
                  type: 'button',
                  'aria-label': 'Close',
                  style: { background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 12 },
                  onClick: () => setToast(null),
                }, '✕'),
              ) : null,
            ),
          ),
        );
      };
    }

    // --- src/client/cards.js ---
    function createCompanionCards(React, Visuals) {
      const h = React.createElement;
      const { ZhimingErrorBoundary, LuopanEmblem } = Visuals;

      function useProjectionState(useProjectionProp, fallbackFace) {
        const fromStandard = typeof useProjectionProp === 'function' ? useProjectionProp('zhiming') : undefined;
        const subscribe = React.useCallback(
          cb => (fallbackFace && typeof fallbackFace.subscribe === 'function' ? fallbackFace.subscribe(cb) : () => {}),
          [fallbackFace],
        );
        const getSnapshot = React.useCallback(
          () => (fallbackFace && typeof fallbackFace.getSnapshot === 'function' ? fallbackFace.getSnapshot() : undefined),
          [fallbackFace],
        );
        const fromFallback = React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
        return fromStandard !== undefined ? fromStandard : fromFallback;
      }

      function extractErrorText(block, fallback) {
        if (block?.error?.reason) return block.error.reason;
        if (Array.isArray(block?.content)) {
          const txt = block.content.map(c => (c && c.type === 'text' ? c.text : '')).join(' ').trim();
          if (txt) return txt;
        }
        return fallback;
      }

      function renderMiniStrip(chart) {
        if (!chart) return null;
        if (chart.system === 'bazi' && Array.isArray(chart.pillars)) {
          return h('div', { className: 'zm-chat-mini-strip' },
            ...chart.pillars.map(p => {
              const st = WUXING_STYLE[p.ganElement] || WUXING_STYLE['土'];
              return h('span', {
                key: p.key,
                className: 'zm-chip',
                style: { background: st.soft, color: st.color, borderColor: st.border },
              }, `${p.label} ${p.ganZhi}`);
            }),
            chart.wuxing?.favorable?.length
              ? h('span', { className: 'zm-chip' }, `喜用：${chart.wuxing.favorable.join('、')}`)
              : null,
          );
        }
        if (chart.system === 'qimen' && chart.meta) {
          return h('div', { className: 'zm-chat-mini-strip' },
            h('span', { className: 'zm-chip', style: { color: 'var(--zm-indigo)', borderColor: 'rgba(99,102,241,0.45)' } }, chart.meta.juTitle),
            h('span', { className: 'zm-chip' }, `值符 ${chart.meta.zhiFuStar} → ${chart.meta.zhiFuPalace}`),
            h('span', { className: 'zm-chip' }, `值使 ${chart.meta.zhiShiGate} → ${chart.meta.zhiShiPalace}`),
          );
        }
        if (chart.system === 'meihua' && chart.hexagrams) {
          return h('div', { className: 'zm-chat-mini-strip' },
            h('span', { className: 'zm-chip', style: { color: 'var(--zm-red)', borderColor: 'rgba(239,68,68,0.45)' } }, `本：${chart.hexagrams.main.symbol} ${chart.hexagrams.main.fullName}`),
            h('span', { className: 'zm-chip' }, `互：${chart.hexagrams.mutual.fullName}`),
            h('span', { className: 'zm-chip', style: { color: 'var(--zm-gold)', borderColor: 'rgba(201,151,59,0.45)' } }, `变：${chart.hexagrams.changed.symbol} ${chart.hexagrams.changed.fullName}`),
            h('span', { className: 'zm-chip' }, `${chart.tiYong?.overallVerdict || ''} (${chart.tiYong?.overallScore || ''})`),
          );
        }
        if (chart.system === 'ziwei' && chart.meta) {
          return h('div', { className: 'zm-chat-mini-strip' },
            h('span', { className: 'zm-chip', style: { color: 'var(--zm-purple)', borderColor: 'rgba(168,85,247,0.45)' } }, chart.meta.fiveElementsClass),
            h('span', { className: 'zm-chip' }, `命宫：${chart.keyHighlights?.soul?.stars || ''}`),
            ...(chart.mutagens || []).slice(0, 4).map((m, i) => h('span', { key: i, className: 'zm-chip' }, `${m.star}化${m.mutagen}`)),
          );
        }
        if (chart.system === 'hepan') {
          return h('div', { className: 'zm-chat-mini-strip' },
            h('span', { className: 'zm-chip', style: { color: 'var(--zm-pink)', borderColor: 'rgba(236,72,153,0.45)' } }, `${chart.overallScore}分 · ${chart.grade}`),
            ...(chart.dimensions || []).slice(0, 3).map(d => h('span', { key: d.key, className: 'zm-chip' }, `${d.label} ${d.score}`)),
          );
        }
        return null;
      }

      // 1. Composer Dock Pill (calm idle emblem; async ask feedback)
      function ZhimingComposerDock(props) {
        const t = props.t || (k => ZH_DICT[k] || k);
        const projection = useProjectionState(props.useProjection, props.projectionFace);
        const activeChart = projection?.charts?.find(c => c.id === projection.activeChartId) || projection?.charts?.[0] || null;
        const [sending, setSending] = React.useState(false);
        const [errMsg, setErrMsg] = React.useState('');

        const askCurrent = async () => {
          if (!activeChart || sending) return;
          setSending(true);
          setErrMsg('');
          try {
            const res = await props.sendPrompt(`请读取我当前知命罗盘中的「${activeChart.title}」（盘面ID: ${activeChart.id}），用新手白话为我解读它的核心含义和实用建议。`);
            if (res?.ok === false) setErrMsg(res.error || t('status.syncError'));
          } catch (e) {
            setErrMsg(e?.message || t('status.syncError'));
          } finally {
            setSending(false);
          }
        };

        return h(ZhimingErrorBoundary, { fallbackText: t('error.boundary'), resetText: t('error.reset') },
          h('div', { className: 'zm-dock-wrap' },
            h('button', {
              type: 'button',
              className: 'zm-dock-main',
              onClick: () => props.openStudio(activeChart?.system, activeChart?.id),
            },
              h(LuopanEmblem, { size: 18, spin: false }),
              h('span', { className: 'zm-dock-text' }, errMsg || (activeChart ? `${t('brand.short')} · ${activeChart.title}` : t('dock.empty'))),
            ),
            activeChart ? h('button', {
              type: 'button',
              className: 'zm-btn zm-btn-gold zm-btn-sm',
              style: { padding: '2px 8px', fontSize: 11 },
              disabled: sending,
              onClick: askCurrent,
            }, sending ? t('status.sending') : t('dock.ask')) : h('button', {
              type: 'button',
              className: 'zm-btn zm-btn-sm',
              style: { padding: '2px 8px', fontSize: 11 },
              onClick: () => props.openStudio('tutorial', null),
            }, t('dock.open')),
          ),
        );
      }

      // 2. Inline Chat Tool Card (`tool.call.toolview` for `zhiming_chart`)
      function ZhimingChartToolCard(props) {
        const t = props.t || (k => ZH_DICT[k] || k);
        const isResult = props.phase === 'result';
        const isError = isResult && (props.block?.isError === true || !props.block?.meta?.chart);
        const chart = isResult && !isError ? props.block.meta.chart : null;

        // Auto-open studio once when a brand-new live chart arrives (never on replay or missing timestamp)
        const openedRef = React.useRef(null);
        React.useEffect(() => {
          const ts = props.block?.time;
          const ageMs = typeof ts === 'number' && ts > 0 ? Math.abs(Date.now() - ts) : Infinity;
          if (chart?.id && ageMs < 15000 && openedRef.current !== chart.id && props.autoOpenOnNew) {
            openedRef.current = chart.id;
            props.autoOpenOnNew(chart.system, chart.id);
          }
        }, [chart?.id, props.block?.time]);

        if (isError) {
          return h(ZhimingErrorBoundary, { fallbackText: t('error.boundary'), resetText: t('error.reset') },
            h('div', { className: 'zm-chat-card', style: { borderColor: 'rgba(239,68,68,0.48)' } },
              h('div', { style: { color: 'var(--zm-red)', fontWeight: 700, marginBottom: 3 } }, t('tool.chartError')),
              h('div', { className: 'zm-muted' }, extractErrorText(props.block, t('status.syncError'))),
            ),
          );
        }

        return h(ZhimingErrorBoundary, { fallbackText: t('error.boundary'), resetText: t('error.reset') },
          h('div', { className: 'zm-chat-card' },
            h('div', { className: 'zm-chat-card-head' },
              h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 } },
                h(LuopanEmblem, { size: 22, spin: !isResult }),
                h('div', { style: { minWidth: 0 } },
                  h('div', { style: { fontWeight: 700, fontSize: 13 } }, chart ? chart.title : t('tool.charting')),
                  chart ? h('div', { className: 'zm-muted' }, chart.subtitle) : null,
                ),
              ),
              chart ? h('button', {
                type: 'button',
                className: 'zm-btn zm-btn-gold zm-btn-sm',
                onClick: () => props.openStudio(chart.system, chart.id),
              }, `${t('action.openStudio')} →`) : null,
            ),
            chart ? renderMiniStrip(chart) : null,
          ),
        );
      }

      // 3. Inline Chat Tool Card (`tool.call.toolview` for `zhiming_read`)
      function ZhimingReadToolCard(props) {
        const t = props.t || (k => ZH_DICT[k] || k);
        const done = props.phase === 'result';
        const isError = done && props.block?.isError === true;
        return h(ZhimingErrorBoundary, { fallbackText: t('error.boundary'), resetText: t('error.reset') },
          h('div', { className: 'zm-chat-card', style: { padding: '7px 10px', borderColor: isError ? 'rgba(239,68,68,0.48)' : undefined } },
            h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 } },
              h('div', { style: { display: 'flex', alignItems: 'center', gap: 7 } },
                h(LuopanEmblem, { size: 18, spin: !done }),
                h('span', { style: { fontSize: 12, fontWeight: 600, color: isError ? 'var(--zm-red)' : undefined } },
                  isError ? t('tool.readError') : (done ? t('tool.readDone') : t('tool.reading')),
                ),
              ),
              h('button', {
                type: 'button',
                className: 'zm-btn zm-btn-sm',
                onClick: () => props.openStudio(null, null),
              }, t('dock.open')),
            ),
          ),
        );
      }

      // 4. Inline Chat Command Card (`conversation.chat.commandview` for `/zhiming`)
      function ZhimingCommandCard(props) {
        const t = props.t || (k => ZH_DICT[k] || k);
        const [sending, setSending] = React.useState(false);
        const [errMsg, setErrMsg] = React.useState('');
        const outcome = props.node?.outcome;
        let envelope = null;
        let isPlainHelp = false;

        if (outcome?.kind === 'success' && typeof outcome.text === 'string') {
          if (outcome.text.startsWith('ZHIMING_STATE:')) {
            try {
              envelope = JSON.parse(outcome.text.slice('ZHIMING_STATE:'.length));
            } catch {
              envelope = null;
            }
          } else if (outcome.text.trim()) {
            isPlainHelp = true;
          }
        }
        const chart = envelope?.op === 'chart' ? envelope.chart : null;

        if (outcome?.kind === 'error') {
          return h('div', { className: 'zm-chat-card', style: { borderColor: 'rgba(239,68,68,0.48)' } },
            h('div', { style: { color: 'var(--zm-red)', fontWeight: 600 } }, outcome.text || t('status.syncError')),
          );
        }

        if (isPlainHelp) {
          return h(ZhimingErrorBoundary, { fallbackText: t('error.boundary'), resetText: t('error.reset') },
            h('div', { className: 'zm-chat-card' },
              h('div', { style: { fontWeight: 700, marginBottom: 4 } }, t('cmd.help')),
              h('div', { style: { whiteSpace: 'pre-wrap', fontSize: 12, color: 'var(--dsw-alias-label-secondary)' } }, outcome.text),
            ),
          );
        }

        const askFromCard = async () => {
          if (!chart || sending) return;
          setSending(true);
          setErrMsg('');
          try {
            const res = await props.sendPrompt(`请读取我在知命罗盘刚排好的「${chart.title}」（盘面ID: ${chart.id}），用新手白话为我解读它的风水含义与建议。`);
            if (res?.ok === false) setErrMsg(res.error || t('status.syncError'));
          } catch (e) {
            setErrMsg(e?.message || t('status.syncError'));
          } finally {
            setSending(false);
          }
        };

        const headingText = chart
          ? chart.title
          : envelope?.op === 'clear'
            ? t('cmd.cleared')
            : envelope?.op === 'focus'
              ? t('cmd.focused')
              : t('cmd.synced');

        return h(ZhimingErrorBoundary, { fallbackText: t('error.boundary'), resetText: t('error.reset') },
          h('div', { className: 'zm-chat-card' },
            h('div', { className: 'zm-chat-card-head' },
              h('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
                h(LuopanEmblem, { size: 20, spin: !outcome }),
                h('div', null,
                  h('div', { style: { fontWeight: 700, fontSize: 12.5 } }, headingText),
                  chart ? h('div', { className: 'zm-muted' }, chart.subtitle) : null,
                ),
              ),
              chart ? h('div', { style: { display: 'flex', gap: 5 } },
                h('button', {
                  type: 'button',
                  className: 'zm-btn zm-btn-sm',
                  onClick: () => props.openStudio(chart.system, chart.id),
                }, t('dock.open')),
                h('button', {
                  type: 'button',
                  className: 'zm-btn zm-btn-gold zm-btn-sm',
                  disabled: sending,
                  onClick: askFromCard,
                }, sending ? t('status.sending') : t('dock.ask')),
              ) : null,
            ),
            chart ? renderMiniStrip(chart) : null,
            errMsg ? h('div', { style: { marginTop: 6, color: 'var(--zm-red)', fontSize: 11 } }, errMsg) : null,
          ),
        );
      }

      // 5. Right Sidebar Dynamic Tab Title
      function ZhimingTabTitle(props) {
        const t = props.t || (k => ZH_DICT[k] || k);
        const projection = useProjectionState(props.useProjection, props.projectionFace);
        const activeChart = projection?.charts?.find(c => c.id === projection.activeChartId) || projection?.charts?.[0] || null;
        return h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 5 } },
          h(LuopanEmblem, { size: 14, spin: false }),
          h('span', null, activeChart ? `${t('tab.title')} · ${activeChart.title.split(' · ')[0]}` : t('tab.title')),
        );
      }

      return {
        ZhimingComposerDock,
        ZhimingChartToolCard,
        ZhimingReadToolCard,
        ZhimingCommandCard,
        ZhimingTabTitle,
      };
    }

    // --- src/client/entry.js ---
    function createPluginEntry(React) {
      const Visuals = { ...createVisuals(React), ...createStageVisuals(React) };
      const Views = {
        BaziView: createBaziView(React, Visuals),
        QimenView: createQimenView(React, Visuals),
        MeihuaView: createMeihuaView(React, Visuals),
        ZiweiView: createZiweiView(React, Visuals),
        HepanView: createHepanView(React, Visuals),
        TutorialView: createTutorialView(React, Visuals),
      };
      const ZhimingStudio = createStudioComponent(React, Visuals, Views);
      const Cards = createCompanionCards(React, Visuals);

      const PLUGIN_ID = '@local/dsh-zhiming';
      const TAB_KIND = 'zhiming';
      const NS = 'zhiming';

      function createLocalNavObservable() {
        let snapshot = { seq: 0, tab: null, chartId: null };
        const listeners = new Set();
        return {
          face: {
            getSnapshot: () => snapshot,
            subscribe: fn => {
              listeners.add(fn);
              return () => listeners.delete(fn);
            },
          },
          navigate(tab, chartId) {
            snapshot = { seq: snapshot.seq + 1, tab: tab || null, chartId: chartId || null };
            for (const fn of listeners) fn();
          },
        };
      }

      return {
        inject: ['slots', 'locale', 'sessions', 'remote', 'remote.commands'],
        apply(ctx) {
          ctx.effect(() => ctx.locale.register(NS, { zh: ZH_DICT, en: EN_DICT }));
          const t = ctx.locale.bind(NS);

          // Mount one shared stylesheet for the lifetime of this plugin (cleanly removed on unload)
          ctx.effect(() => {
            if (typeof document === 'undefined' || !document.head) return undefined;
            const styleEl = document.createElement('style');
            styleEl.setAttribute('data-zhiming-style', '1');
            styleEl.textContent = ZHIMING_CSS;
            document.head.appendChild(styleEl);
            return () => {
              styleEl.remove();
            };
          });

          const navBySession = new Map();
          const autoOpenedChartIds = new Set();
          ctx.effect(() => () => {
            navBySession.clear();
            autoOpenedChartIds.clear();
          });

          const navFor = sessionId => {
            const key = String(sessionId || 'default');
            let item = navBySession.get(key);
            if (!item) {
              item = createLocalNavObservable();
              navBySession.set(key, item);
            }
            return item;
          };

          const makeSessionHelpers = sessionId => {
            const sessions = ctx.sessions;
            const remote = ctx.remote;
            const nav = navFor(sessionId);

            const getCurrentBinding = () => (
              sessions && typeof sessions.binding === 'function' ? sessions.binding(sessionId) : undefined
            );

            const openStudio = (tab, chartId) => {
              if (tab || chartId) nav.navigate(tab, chartId);
              try {
                const sidebarRight = ctx.get ? ctx.get('sidebarRight') : ctx.sidebarRight;
                if (sidebarRight && typeof sidebarRight.openTab === 'function') {
                  sidebarRight.openTab(TAB_KIND);
                  return true;
                }
              } catch {
                return false;
              }
              return false;
            };

            const autoOpenOnNew = (tab, chartId) => {
              if (!chartId || autoOpenedChartIds.has(chartId)) return;
              if (openStudio(tab, chartId)) {
                autoOpenedChartIds.add(chartId);
              }
            };

            const executeZhiming = async payload => {
              const line = `/zhiming ${JSON.stringify(payload)}`;
              try {
                const remoteCommands = (ctx.get && ctx.get('remote.commands')) || remote?.commands;
                if (remoteCommands && typeof remoteCommands.execute === 'function') {
                  const res = await remoteCommands.execute(sessionId, line, []);
                  if (!res || res.ok === false) {
                    return { ok: false, error: res?.error?.message || t('status.syncError') };
                  }
                  if (res.value === undefined) {
                    return { ok: false, error: t('status.cmdMissing') };
                  }
                  if (res.value?.result?.kind === 'error') {
                    return { ok: false, error: res.value.result.text || t('status.syncError') };
                  }
                  return { ok: true };
                }
                const binding = getCurrentBinding();
                if (binding?.session && typeof binding.session.command === 'function') {
                  const res = await binding.session.command(line);
                  if (!res || res.ok === false) {
                    return { ok: false, error: res?.error?.message || t('status.syncError') };
                  }
                  if (res.value?.matched === false) {
                    return { ok: false, error: t('status.cmdMissing') };
                  }
                  return { ok: true };
                }
                return { ok: false, error: t('status.noCommandChannel') };
              } catch (err) {
                return { ok: false, error: err?.message || String(err) };
              }
            };

            const sendPrompt = async text => {
              const binding = getCurrentBinding();
              if (binding?.session && typeof binding.session.prompt === 'function') {
                const res = await binding.session.prompt([{ type: 'text', text }], 'queue');
                if (!res || res.ok === false) {
                  return { ok: false, error: res?.error?.message || t('status.syncError') };
                }
                return { ok: true };
              }
              return { ok: false, error: t('status.noPromptChannel') };
            };

            return {
              get projectionFace() {
                return getCurrentBinding()?.session?.projections?.faceOf?.('zhiming');
              },
              uiNavFace: nav.face,
              openStudio,
              autoOpenOnNew,
              executeZhiming,
              sendPrompt,
            };
          };

          // 1. Register Right Sidebar Tab Type + Body + Live Title
          ctx.inject(['sidebarRight', 'sidebarRightTabs'], scope => {
            scope.effect(() => scope.sidebarRightTabs.register({
              id: PLUGIN_ID,
              kind: TAB_KIND,
              multiple: false,
              priority: 'extension',
              title: () => t('tab.title'),
              guide: [{
                id: 'studio',
                order: 42,
                title: () => t('guide.title'),
                description: () => t('guide.description'),
                icon: Visuals.GuideArtworkSvg,
              }],
            }));

            scope.effect(() => scope.slots.inject('sidebar.right.pane.tab', () => scope.slots.register({
              name: 'sidebar.right.pane.tab',
              key: PLUGIN_ID,
              locale: NS,
              inject: sessionId => makeSessionHelpers(sessionId),
            }, ZhimingStudio)));

            scope.effect(() => scope.slots.inject('sidebar.right.pane.tab.title', () => scope.slots.register({
              name: 'sidebar.right.pane.tab.title',
              key: PLUGIN_ID,
              locale: NS,
              inject: sessionId => {
                const helpers = makeSessionHelpers(sessionId);
                return {
                  get projectionFace() { return helpers.projectionFace; },
                };
              },
            }, Cards.ZhimingTabTitle)));
          });

          // 2. Register Composer Dock Pill
          ctx.effect(() => ctx.slots.inject('conversation.composer.dock', () => ctx.slots.register({
            name: 'conversation.composer.dock',
            id: 'dsh-zhiming-dock',
            order: 8,
            locale: NS,
            inject: sessionId => makeSessionHelpers(sessionId),
          }, Cards.ZhimingComposerDock)));

          // 3. Register Custom Inline Chat Tool Views (`zhiming_chart` & `zhiming_read`)
          ctx.effect(() => ctx.slots.inject('tool.call.toolview', () => ctx.slots.register({
            name: 'tool.call.toolview',
            key: 'zhiming_chart',
            locale: NS,
            inject: sessionId => makeSessionHelpers(sessionId),
          }, Cards.ZhimingChartToolCard)));

          ctx.effect(() => ctx.slots.inject('tool.call.toolview', () => ctx.slots.register({
            name: 'tool.call.toolview',
            key: 'zhiming_read',
            locale: NS,
            inject: sessionId => makeSessionHelpers(sessionId),
          }, Cards.ZhimingReadToolCard)));

          // 4. Register Custom Inline Chat Command View (`/zhiming`)
          ctx.effect(() => ctx.slots.inject('conversation.chat.commandview', () => ctx.slots.register({
            name: 'conversation.chat.commandview',
            key: 'zhiming',
            locale: NS,
            inject: sessionId => makeSessionHelpers(sessionId),
          }, Cards.ZhimingCommandCard)));
        },
      };
    }

    return createPluginEntry(React);
  },
});
