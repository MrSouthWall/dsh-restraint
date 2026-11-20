# 知命 · 风水玄学罗盘（`@local/dsh-zhiming`）

面向 **DeepSeek Harness（DSH 0.2.2-rc.5+）** 的可视化中华传统术数与风水插件，一站式支持 **四柱八字、奇门遁甲、梅花易数、紫微斗数、双人合盘** 五大体系，内置零基础「新手学院」与 **DeepSeek 双向对话联动**。

---

## 核心特性

1. **五大权威体系，基于 GitHub 开源引擎本地精准排算**
   - **四柱八字（Bazi）**：基于 [`6tail/lunar-javascript`](https://github.com/6tail/lunar-javascript) 实现精确节气交节、公农历互转、可选真太阳时、四柱干支、十神、地支藏干、纳音、十二长生、神煞、五行权重五角星、喜用神与家居风水建议、大运及十年流年时间轴。
   - **奇门遁甲（Qimen Dunjia）**：严格按交节精确时刻排算 **拆补法转盘时家奇门**（参考 `qfdk/qimen`、`anthonylee1994/qimen`、`perfhelf/bigfishmarquis-qimen` 规范），洛书九宫可视化呈现八神、九星（含天禽寄坤二）、八门、天地盘奇仪、值符值使、空亡、驿马、门迫/击刑/入墓四害标注与三吉门有利方位。
   - **梅花易数（Meihua Yishu）**：遵循宋代邵雍心法，内置完整 **64 卦全集**，支持时间起卦、双/三数报数起卦、文字灵感起卦、随机触机起卦，动态展示 **本卦 → 互卦 → 变卦**（可切换错卦/综卦）、体用五行生克与月令旺相休囚死。
   - **紫微斗数（Ziwei Doushu）**：基于 [`SylarLong/iztro`](https://github.com/SylarLong/iztro) 构建传统 **4×4 十二宫星盘**，点击任意宫位时中宫实时绘制 **三方四正（对宫 + 三合）动态星线**，清晰标示十四主星、庙旺利陷、六吉六煞、生年四化（禄权科忌）与大限范围。
   - **双人合盘（Hepan）**：同步调用 **八字 + 紫微双引擎**，支持 **恋爱婚姻 / 事业合伙 / 挚友亲子** 三种模式，通过 6 维契合度雷达图（日柱契合、五行互补、地支互动、纳音生肖、十神分工、紫微星盘）给出相合亮点、磨合提醒与相处/家居调和建议。

2. **炫酷原生 DSH 可视化界面**
   - 自动适配 DSH 明暗双主题（遵循 `--dsw-alias-*` 宿主样式 token），支持右侧停靠栏与全屏大视野展开。
   - 四重原生入口：右侧边栏工作台（`sidebar.right.pane.tab`）、输入框下方「知命罗盘」快捷胶囊（`conversation.composer.dock`）、对话内工具排盘可视化卡片（`tool.call.toolview`）、对话内指令同步卡片（`conversation.chat.commandview`）。

3. **面向零基础新手的详尽引导**
   - 内置 **「新手指南」** 标签页：30 秒上手步骤、可直接点击发送给 DeepSeek 的对话示例、五大术数选型表、交互式五行生克五角星、十二时辰对照表与可搜索白话词典。
   - 全局 **「白话提示：开/关」** 开关（默认开启），每个盘面都带 3 步看盘引导，并提供 **一键新手演示案例**。

4. **DeepSeek 双向对话联动**
   - **DeepSeek → 插件 UI（对话排盘）**：在聊天框直接告诉 DeepSeek 你的生辰、数字或想问的事，DeepSeek 调用 `zhiming_chart` 工具，盘面会实时同步呈现在知命罗盘中（并在新排盘时自动展开工作台）。
   - **插件 UI → DeepSeek（读盘解读）**：在知命罗盘中手动排盘或点击某个宫位/柱位/卦象后，可点击 **「请 DeepSeek 深度解读」**，或直接在聊天框说「帮我解读插件里刚排好的盘」，DeepSeek 会调用 `zhiming_read` 读取当前会话中的真实盘面数据，为你提供针对性的白话风水与命理解读。

---

## 安装方式

1. 在 DSH Desktop 中打开左侧 **Plugins（插件）** 页面。
2. 点击 **Add plugin（添加插件）**，选择本目录的绝对路径：
   ```text
   /Users/wall/Developer/DSH Plugin/dsh-zhiming
   ```
3. 等待安装并启用（若替换已安装版本，按 DSH 提示重启应用生效），新建一个会话即可使用。

> 也可以在拥有 `plugin_manager` 权限的会话中让 Agent 执行 `install_bundle` 安装本目录。

---

## 新手快速上手

### 方式 1：直接和 DeepSeek 聊天排盘
在新会话中试试直接发送下面任意一句：
- `帮我排一下 1995年5月18日早上8点30分男命的四柱八字，用白话讲讲喜用神和家居五行建议。`
- `用奇门遁甲起一个现在的时家拆补局，看看今天去谈合作顺不顺利、哪个方位最有利？`
- `我心想数字 3 和 7，帮我用梅花易数起一卦，问下个月换工作是否顺利。`
- `帮我排一下 1998年3月12日21点30分女命的紫微斗数命盘，重点看命宫、官禄宫和四化。`
- `帮我做一份恋爱合盘：甲方 1995-05-18 08:30 男，乙方 1998-03-12 21:30 女。`

### 方式 2：在右侧「知命罗盘」交互排盘，再让 DeepSeek 解读
1. 点击输入框下方的 **「知命罗盘」** 胶囊（或点击右侧边栏 `+` 引导页中的 **「知命 · 风水玄学罗盘」** 卡片）。
2. 先逛一下 **「新手指南」**，或者直接点各标签页的 **「新手演示」** 体验真实盘面。
3. 排好盘后，点击任意一柱 / 九宫 / 卦象 / 十二宫查看白话详解，点击 **「请 DeepSeek 深度解读」** 即可一键发问。

### 方式 3：使用 `/zhiming` 快捷指令
```text
/zhiming demo bazi
/zhiming bazi 1995-05-18 08:30 男
/zhiming qimen
/zhiming meihua 3 7 近期换工作如何
/zhiming ziwei 1998-03-12 21:30 女
/zhiming demo hepan
```

---

## 目录结构

| 文件 / 目录 | 作用 |
| --- | --- |
| `package.json` | DSH bundle 清单（`dsh.bundle.patch`、`dsh.client`、依赖 `lunar-javascript` 与 `iztro`） |
| `cordis.patch.yml` | 向 Loader 插入 `id: dsh-zhiming` 的插件行 |
| `index.js` | Host 插件：注册 `zhiming` 会话投影、`zhiming_chart` / `zhiming_read` / `zhiming_tutorial` 工具、`/zhiming` 指令及系统提示段 |
| `client.js` | 浏览器端自包含模块（由 `src/client/*.js` 经 `scripts/build-client.mjs` 组装） |
| `lib/engine/` | 五大术数核心排盘引擎（`bazi.js`、`qimen.js`、`meihua.js`、`ziwei.js`、`hepan.js`、`index.js`） |
| `lib/data/` | 传统术数数据表、完整 64 卦库与新手白话教程（`constants.js`、`hexagrams.js`、`tutorials.js`） |
| `locale/zh.json`、`locale/en.json` | 插件管理器中英文展示元数据 |
| `icon.svg`、`docs/DETAIL*.md`、`docs/preview.svg` | 36×36 插件图标与 640×300 功能预览图 |
| `tests/engine.test.mjs` | 自动化验证测试（覆盖五大引擎、Host 双向同步、Client 渲染与清单校验） |

---

## 说明与边界

- 全部排盘计算均在本地完成，不向任何第三方接口上传个人生辰信息；仅在用户主动与 DeepSeek 对话或点击「请 DeepSeek 深度解读」时将当前盘面摘要用于本次会话交流。
- 传统易学、命理与风水知识属于中华传统文化与自我探索工具，结果仅供学习、决策启发与空间审美参考，请保持理性与积极心态。
