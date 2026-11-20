#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build the DSH plugin-authoring guide as DOCX and Markdown from one source."""

import os
import re
import sys

from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

CJK = "PingFang SC"
MONO = "Menlo"
NAVY = RGBColor(0x14, 0x3A, 0x5C)
H1C = RGBColor(0x1F, 0x4E, 0x79)
H2C = RGBColor(0x2A, 0x5C, 0x8A)
H3C = RGBColor(0x3A, 0x6B, 0x99)
GRAY = RGBColor(0x55, 0x5F, 0x6B)
CODE_C = RGBColor(0x9F, 0x37, 0x50)

TITLE = "DeepSeek Harness 插件制作说明"
SUBTITLE = "从最小 bundle 到可交付插件：清单、patch、Host / Client 代码、展示资源与验证"
META = [
    "适用版本：DSH 0.2.2-rc.5（Desktop 版，profile: desktop）",
    "整理日期：2026-11-20",
    "内容依据：DSH 内置 dsh-doc 技能的插件开发参考（原文英文，已按主题归并翻译）",
]

TOC = [
    "1. 总览",
    "2. 第一个插件：最小骨架",
    "3. 清单与 patch 语法",
    "4. Host 插件",
    "5. 保存配置与凭据",
    "6. Web UI 插件",
    "7. 展示元数据：locale、图标、详情页",
    "8. 接入 MCP 服务器",
    "9. Agent 预设",
    "10. 用户操作与 Agent 工具",
    "11. 开发实践",
    "12. 验证与交付",
    "13. 常见问题",
    "14. 附：参考文件与模板",
]

BLOCKS = [
    ("h1", "1. 总览"),
    ("p", "DeepSeek Harness（下称 DSH）通过「bundle（插件包）」扩展能力。一个 bundle 就是一个普通 npm 包：在 `package.json` 里用 `dsh.bundle.patch` 指向一份 YAML patch，Loader 在启动时按这份 patch 把插件记录插入当前 profile 的插件列表。插件代码运行在 Host 进程或浏览器端，与 DSH 自带插件共享同一套 Cordis 上下文、服务与事件。"),
    ("p", "因此，插件不是「给某个会话加功能」，而是**对整个 profile 生效**：安装后所有会话共享，重启后依然存在，直到被禁用或卸载。"),
    ("note", "不要手写 profile 的 `package.json` 或 `cordis.patch.yml`，也不要在 profile 目录里运行 pnpm。这些步骤由 `plugin_manager` 的 `install_bundle`（或 Plugins → Add plugin）完成；手工改动 profile 文件需要逐次审批，而且容易破坏用户已有的 patch 内容。"),

    ("h2", "1.1 一个 bundle 由什么组成"),
    ("p", "典型 bundle 的文件集合如下；Web UI 插件在 Host 骨架之外增加 `client.js`。"),
    ("table", ["文件", "作用", "何时需要"],
     [
         ["package.json", "清单：`exports`、`files`、`dsh.bundle.patch`、`dsh.client`", "必需"],
         ["cordis.patch.yml", "Loader patch：插入或覆盖插件行", "必需"],
         ["index.js", "Host 入口，导出 `apply(ctx, config)` 或 Service 类", "Host 插件"],
         ["client.js", "浏览器端模块，向插槽注册 React 组件", "Web UI 插件"],
         ["locale/en.json 等", "插件管理器显示的标题、描述、详情页路径", "展示"],
         ["icon.svg", "插件行与详情页的图标", "展示"],
         ["docs/DETAIL.md", "可选：只含一张功能图的详情页文档", "可选"],
     ]),

    ("h2", "1.2 扩展方式一览"),
    ("table", ["形态", "安装内容", "典型用途"],
     [
         ["Host 插件", "Host 代码", "注册工具、提示词、事件监听、会话投影、服务"],
         ["Web UI 插件", "Host + Client", "在 Web 界面插槽中渲染组件或页面"],
         ["仅配置 bundle", "只有 patch", "接入 MCP 服务器、覆盖出厂插件行"],
         ["Agent 预设", "patch 里的预设声明", "新增或修改 Agent 预设（persona、工具集）"],
     ]),

    ("h1", "2. 第一个插件：最小骨架"),
    ("p", "只做 Host 能力的 bundle 不需要依赖、构建脚本或打包工具。下面几个文件即可安装。"),

    ("h2", "2.1 目录结构"),
    ("code", "text", """my-plugin/
├── package.json
├── cordis.patch.yml
├── index.js
├── icon.svg
└── locale/
    ├── en.json
    └── zh.json"""),

    ("h2", "2.2 package.json"),
    ("code", "json", """{
  "name": "@local/my-plugin",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "exports": { ".": "./index.js" },
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } }
}"""),
    ("p", "`name` 必须与 patch 中的 `name` 一致；`exports` 至少导出 Host 入口；`files` 要覆盖运行时文件、patch、locale 与图标。`dsh.bundle.patch` 是唯一必需的 DSH 字段。"),

    ("h2", "2.3 cordis.patch.yml"),
    ("code", "yaml", """- insert:
    - id: my-plugin
      name: '@local/my-plugin'
      config: {}"""),
    ("p", "patch 中的每一条 `insert` 行都会在 Loader 里生成一个插件入口。`id` 在 profile 内唯一，`name` 指向包名（或相对 patch 文件的路径）。"),

    ("h2", "2.4 index.js"),
    ("code", "js", """export function apply(ctx, config) {
  // 在 apply 内用 ctx.effect / ctx.on 注册资源，并返回清理函数
}"""),
    ("p", "`apply` 只做注册；真正的副作用应与 `ctx.effect` 返回的清理函数成对管理——插件卸载、agent 销毁、插槽收起时，框架会调用清理。"),

    ("h2", "2.5 安装"),
    ("bullets", [
        "图形界面：打开 **Plugins** 页，选择 **Add plugin**，选中 bundle 目录（绝对路径）。",
        "Agent：让 `plugin_manager` 执行 `action: install_bundle`，`target` 传绝对目录。安装会执行插件代码，需要 Full access 或用户审批；`approvedBuilds` 只能在该包确实有构建脚本、且用户明确同意之后传入。",
        "当前环境没有 `plugin_manager` 时：把工作区里的 bundle 写完，告诉用户目录，由用户在 Plugins → Add plugin 中安装；不要为了获得工具去改预设。",
    ]),
    ("note", "安装新 bundle 可以经 HMR 立即生效；**替换**已安装的包需要重启 DSH，才能加载新的 JavaScript 模块代。"),

    ("h2", "2.6 确认安装结果"),
    ("p", "安装返回结果里的 `application` 与 `warnings` 决定变更是否已经生效——不要用日志、进程列表或页面启动数据来判断："),
    ("table", ["状态", "含义与处理"],
     [
         ["`applied`", "已生效。"],
         ["`overridden`", "更高优先级的层胜出；检查是否存在同名行覆盖。"],
         ["`restart-required`", "尚未生效，需要重启 DSH。"],
         ["`failed`", "激活失败；按诊断修同一个 bundle 后重装。"],
     ]),
    ("p", "新会话里验证实际能力；已有会话及其子会话继续使用启动时的插件版本。"),

    ("h1", "3. 清单与 patch 语法"),

    ("h2", "3.1 package.json 字段"),
    ("table", ["字段", "说明"],
     [
         ["`name`", "包名，建议 `@local/<名字>`；patch 的 `name` 必须与之一致"],
         ["`version`", "语义化版本"],
         ["`type`", "模板统一使用 `\"module\"`（ESM）"],
         ["`exports`", "`\".\"` 指向 Host 入口；UI 插件加 `\"./client\"`；展示资源导出 `\"./locale/*.json\"` 与 `\"./icon\"`"],
         ["`files`", "打包白名单：运行文件、patch、locale、docs、图标；新增模块或资源时同步更新"],
         ["`dsh.bundle.patch`", "patch 文件路径"],
         ["`dsh.client`", "UI 插件：`platform`、`immediately`、`inject`、`external`"],
     ]),
    ("p", "包根插件也可以在 `package.json` 顶层直接声明 `icon`（优先级高于 `./icon`）。子路径插件（如 `my-plugins/search`）不是包，不读取 `package.json`，改导出 `./search/locale/*.json` 与 `./search/icon`。"),

    ("h2", "3.2 patch 行与插入"),
    ("code", "yaml", """- insert:
    - id: my-plugin
      name: '@local/my-plugin'
      config: {}"""),
    ("bullets", [
        "`insert: [...]` 追加行；若 `id` 指向已有的 `group: true` 行，则追加到该组的 `config` 列表里。",
        "行的字段：`id`、`name`、`config`，以及可选的 `disabled`、`inject`、`intercept`、`isolate`。",
    ]),

    ("h2", "3.3 覆盖已存在的行"),
    ("p", "不带 `insert`、只写 `id` 的 patch 会定位同 id 的行：提供的字段替换原字段，而 `config` 是**整体替换、不做深合并**，所以必须把这一行需要的字段全部重述。`name` 为真值时表示断言已有插件名，而不是改名。"),
    ("code", "yaml", """- id: preset-standard
  name: '@deepseek-ai/dsh-agent-preset'
  config:
    id: standard
    order: 1
    plugins: []   # 重述完整列表"""),
    ("note", "没有 `id` 的非 insert 补丁，以及目标不存在的补丁，会被警告并跳过。"),

    ("h2", "3.4 分组、include、disabled、!!js、isolate"),
    ("bullets", [
        "`group: true` 配合 `name: cordis:group`，让 `config` 成为嵌套入口列表，其他 patch 可按 id 插入其中。",
        "`cordis:include` 从 `config.path` 加载字面量 YAML 或 JSON 入口列表。",
        "`disabled` 接受布尔、null 或 `!!js` 表达式，在每次挂载决策时求值；被禁用的行除非 `group: true` 强制激活，否则不需要 `config`。",
        "`!!js` 是 Loader 表达式（不是 `!js`）。写在 `config` 内时，它在该行声明的依赖激活之后、针对该插件的上下文求值，因此可以使用 `ctx.<service>`，例如 `!!js dshHomePath('sessions')`、`!!js \"!ctx.get('profileContext')\"`；行上的其他元数据保持字面量。",
        "`isolate` 把服务名映射到 `true` 或 realm 标签：提供服务的预设插件，要把 provider 与所有消费者隔离在同一 realm。",
    ]),

    ("h2", "3.5 启用出厂但默认禁用的插件"),
    ("p", "有些随 DSH 发布的插件已解析成行但被置为 `disabled`。做法是写一个工作区 bundle，用 patch 覆盖该行（`disabled: false`），并插入它依赖的 Host 行。随 dsh 发布的包从安装目录解析，bundle 无须声明这些依赖；源检出场景可参考 `apps/cli/config/examples/<feature>/cordis.yml` 中的完整行列表。"),

    ("h1", "4. Host 插件"),

    ("h2", "4.1 导出形式"),
    ("p", "`index.js` 导出以下两种形式之一，不要混用："),
    ("bullets", [
        "`export function apply(ctx, config) {}`，可选 `export const inject = ['tools']` 与 `export const Config`；",
        "默认导出一个 Service 类。",
    ]),

    ("h2", "4.2 注册资源与清理"),
    ("code", "js", """export const inject = ['tools']

export function apply(ctx, config) {
  ctx.effect(() => {
    const dispose = ctx.tools.register(/* ... */)
    return dispose
  })
}"""),
    ("p", "规则是「注册即 effect」：所有资源都在 `apply` 内通过 `ctx.effect` 或 `ctx.on` 注册，并返回清理。注册在别的上下文（例如 `agent.ctx`）上时，要把它的 disposer 也在插件自己的 effect 里留一份，确保任一侧销毁都能移除。"),

    ("h2", "4.3 声明服务依赖"),
    ("bullets", [
        "必需服务写在 `inject`；可选服务放进 `inject` 或 `ctx.inject([...])`，这样在缺少该服务的 profile 里插件保持不激活，而不是抛错。",
        "声明 `Config` 的插件会在激活时校验行的 `config`。写已安装插件的配置前，先通过 inspect 的 `Config.listConfigs` 读 schema（跟进 `$defs` 引用），或读所属包的 README 与源码。",
    ]),

    ("h2", "4.4 常用扩展点"),
    ("table", ["目标", "方式", "要点"],
     [
         ["添加提示词", "`ctx.systemPrompt.section()`", "不要用 `system-prompt/assemble` 增删工具或文本"],
         ["注入每 agent 上下文", "`agent.inject()`", "调用时记为 `agent/inbox/spliced`，进入下一个已准入的 step"],
         ["每 agent 行为", "`agent/created` 中取 `agent.ctx`，用 `agent.ctx.effect()` 包裹", "卸载插件不会自动销毁 `agent.ctx` 上的注册"],
         ["移除工具", "`ctx.tools.restrict()`", "只能移除"],
         ["强制拒绝", "`ctx.tools.guard()`", "只能拒绝，且同步"],
         ["执行前拦截", "`tools/pre-execute`", "需要等待（如询问用户）时返回 `ask`"],
         ["变换结果", "`tools/post-execute`", "只用于变换结果"],
         ["观察结果", "`tools/result`", "最终结果"],
         ["会话派生状态", "`ctx.sessionProjections` 单元", "`apply(state, event)` 纯同步，忽略的事件返回同一引用"],
         ["实时 token", "`agent/assistant-stream`", "稳定状态等 `turn/end`、`assistant/message`、`tool/result` 等持久事件"],
     ]),

    ("h2", "4.5 稳定性规则"),
    ("bullets", [
        "waterfall 监听器（`agent/pre-step`、`agent/request`、`llm/stream`、`tools/pre-execute`、`tools/execute`、`tools/post-execute`）在自身不拥有决策时必须返回 `next()`。",
        "改写 `agent/pre-step` 的决策要展开（`{ ...decision, messages }`），保住 `startsRequestSeries` 这类字段。",
        "不要在 `system-prompt/assemble` 里增删工具或文本。",
        "不要用新 type 追加会话事件：读取方只接受带 `ignorable: true` 的未知事件，而 `Session.append()` 无法设置该标记，会导致会话无法重新打开；`appendPluginRecord()` 写入的 `plugin:` 记录仅限 DSH 实验包使用。",
        "可调参数放进插件的 `Config`，让用户在自己的 patch 层调整，升级时也能保留。",
        "隐藏某个 agent 的工具用该 agent 上下文上的 `ctx.tools.restrict()`，它能让 schema 展示、查找和执行保持一致。",
    ]),

    ("h2", "4.6 性能要点"),
    ("bullets", [
        "每会话状态用 `ctx.sessionProjections` 派生，不要订阅 `session/event` 重扫 `session.events`；用 `stateOf()` 读取，`view()` 不变时返回同一引用以抑制发布。",
        "投影状态保持纯 JSON；字段或 fold 语义变化时提升 `stateVersion`，缓存会按版本丢弃旧检查点。",
        "不要轮询 `agent/status`；`whenIdle()` 不代表一次后续已完成——多个输入可能共享同一个运行区间。",
        "定时器触发工作时用 `agent.followup()` 唤醒 agent；`agent.inject()` 不会唤醒它，注入的上下文可能滞留在 inbox。定时器在所属 effect 中清理。",
    ]),

    ("h1", "5. 保存配置与凭据"),

    ("h2", "5.1 用 configEditor 写入"),
    ("p", "插件代码永远不要通过读取、过滤、重写 profile 的 `cordis.patch.yml` 来保存配置，也不要从包目录向上查找该文件——它属于用户，其他插件的 `insert` 行、注释和 `!!js` 表达式都在里面。`apply` 返回后要改自己的配置时，用配置编辑器："),
    ("code", "js", """const entry = ctx.fiber.entry
const editor = ctx.get('configEditor')
if (entry === undefined || editor === undefined) {
  throw new Error('Configuration cannot be saved in this profile')
}
await editor.edit(entry, current => ({ ...current, field: value }))"""),
    ("p", "editor 会保留文件其余内容、校验候选值、与其他 profile 变更串行写入，并拒绝被更高层覆盖的值。被拒绝或缺少 editor 时，如实告诉用户，不要声称已保存。"),

    ("h2", "5.2 普通字段与 volatile 字段"),
    ("bullets", [
        "编辑普通字段会重启插件，让 `apply` 重建状态。",
        "声明为 `.volatile()` 的字段原位更新，用 `config.field.get()` 读取。",
    ]),

    ("h2", "5.3 凭据"),
    ("bullets", [
        "密钥（应用内登录、绑定流程拿到的 token 等）用 `ctx.credentials.modifyRecord()` 存成凭据记录，不要写进配置。",
        "在 `inject` 里声明 `credentials`，或用 `ctx.get('credentials')` 获取。",
    ]),

    ("h1", "6. Web UI 插件"),
    ("p", "UI 插件在 Host 骨架之外增加一个浏览器端模块。先读模板 `templates/decoration/`，把文件写进 bundle 目录。"),

    ("h2", "6.1 清单与 client 配置"),
    ("p", "`package.json`（节选）："),
    ("code", "json", """{
  "exports": {
    ".": "./index.js",
    "./client": "./client.js",
    "./locale/*.json": "./locale/*.json",
    "./icon": "./icon.svg"
  },
  "dsh": {
    "bundle": { "patch": "./cordis.patch.yml" },
    "client": {
      "platform": "web",
      "immediately": true,
      "inject": ["@deepseek-ai/dsh-client-ui-conversation"]
    }
  }
}"""),
    ("p", "`dsh.client.platform` 为 `\"web\"`；`immediately: true` 表示页面加载即激活；`inject` 中的条目只用于排序激活顺序（不会注入模块）。非基线运行时导入在 `dsh.client.external` 中声明。"),

    ("h2", "6.2 client.js 结构"),
    ("code", "js", """window.__ModuleLoader__.load({
  id: '@local/my-decoration',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    function Decoration() {
      return h('svg', {
        viewBox: '0 0 64 64', width: 48, height: 48,
        'aria-hidden': true,
        style: { display: 'block', pointerEvents: 'none' },
      }, h('circle', { cx: 32, cy: 32, r: 24, fill: '#247bbf' }))
    }
    return {
      inject: ['slots'],
      apply(ctx) {
        ctx.slots.inject('conversation.composer.dock', () => ctx.slots.register({
          name: 'conversation.composer.dock', id: 'my-decoration', order: 5,
        }, Decoration))
      },
    }
  },
})"""),
    ("bullets", [
        "`__ModuleLoader__.load` 注册的惰性工厂，其 id 必须等于包名。",
        "React 从浏览器模块表获取（`require('react')`），不要重复安装 React、引用 CDN 或寻找 UMD。",
        "工厂函数保持无副作用；样式、定时器、监听器都放在 `apply` 内用 `ctx.effect` / `ctx.on` 注册并返回清理。",
        "组件内样式可以渲染成 React 元素，卸载时随之移除。",
    ]),

    ("h2", "6.3 插槽与主题"),
    ("bullets", [
        "用 `ctx.slots.inject(ownerKey, () => ctx.slots.register(...))`：拥有该声明的组件收起时，注册会被清理；回来时重新安装。",
        "优先选择已经分配好空间的插槽，例如 `conversation.composer.dock`；`shell.overlay` 只在确实需要覆盖层且位置已知时使用。",
        "通过插槽 props 的选择器钩子读取会话数据，只订阅最小的切片。",
        "容器与控件继承宿主主题 token（`--dsw-alias-*`）；字面颜色只用于插画。",
        "不要读写其他插件的 DOM、样式表或源码来估算位置。",
    ]),

    ("h2", "6.4 页面、Chat 行与被禁止的做法"),
    ("bullets", [
        "页面或面板渲染为插槽中的 React 组件；不要把 Host 的 HTML 页面塞进 iframe——iframe 拿不到主题 token、明暗切换和 `ctx.locale`。",
        "不要 `require('@deepseek-ai/dsh-client-ui-primitives')` 或其他 Harness Client 包：它们随时会变，组件抛错会让整个插槽条目崩溃（控制台出现 `slot entry crashed in '<slot>'`）。需要控件时，从原语或宿主控件的 `src/*.tsx`、`*.module.css` 复制标记、CSS 与行为，类名改成自己插件的前缀，只保留 `--dsw-alias-*` token。",
        "Chat 行：用 `ctx.uiConversation.events.register()` 注册事件定义，再在 `conversation.chat.node` 槽里按定义的 `kind` 注册视图；分页、Turn/Step 归位和增量拼装由 Conversation 层负责。",
        "Client 需要由会话派生的值时，在 Host 投影上声明 `wire.view`，值到达 Client 时已算好，Client 不再自己折叠会话事件。",
    ]),

    ("h2", "6.5 文案语言"),
    ("p", "所有可见 UI 文案走 Client 的 locale 服务，不要在组件里硬编码中文或英文。"),

    ("h1", "7. 展示元数据：locale、图标、详情页"),
    ("p", "Plugin Manager 与设置页会读取导出的 locale JSON 里的 `meta.title`、`meta.description`，以及导出的图标——这些展示资源在插件未被激活时就能读取。安装前完成本节清单。"),

    ("h2", "7.1 locale"),
    ("code", "json", """{
  "meta": {
    "title": "My decoration",
    "description": "Draws a badge under the composer.",
    "detail": "docs/DETAIL.md"
  }
}"""),
    ("bullets", [
        "为英文和用户语言各写一份（如 `locale/zh.json`），不要留下与插件无关的模板文案。",
        "英文标题与其他 UI 标签用句首大写（sentence case）：只有第一个词和专有名词大写，例如 `Git worktrees`。",
        "`meta.description` 里写清功能、用法（给出准确的 UI 标签）和关键限制（新增的模型请求、读取或外发的数据、风险、关闭插件后的变化）。",
        "页面会忽略原始 HTML，相对链接按纯文本渲染。",
    ]),

    ("h2", "7.2 图标"),
    ("bullets", [
        "用 `width=\"36\" height=\"36\" viewBox=\"0 0 36 36\"`，主体居中、留出边距，视觉尺寸以 18–22 单位为起点；不要在 SVG 里画底板，也不要把工具栏字形放大来填满。",
        "一个主导元素；相关能力共享主体，用比例、轮廓或配色区分，而不是堆面板、符号或徽章。",
        "配色克制，与相邻已安装图标一致；避免发光、投影、高光、emoji。",
        "图标里的字母转成路径，避免浏览器字体替换；镂空区域要做真透明（局部 mask 或切割），明暗两种主题下都检查。",
        "格式为 SVG、PNG、JPEG 或 WebP，不超过 256 KiB，必须在包内；绝对路径、URL、指向包外的符号链接会被拒绝。",
        "缺少字段时回退到 `package.json` 的 `name` / `description`，缺少图片时使用面板默认图；图标解码失败同样回退默认图，所以仅凭文件名不能证明能渲染。",
    ]),

    ("h2", "7.3 详情页"),
    ("bullets", [
        "`meta.detail` 只用于「只含一张功能图」的文档；功能与用法仍写在 `meta.description` 里。",
        "路径相对包根、用 `/`、以 `.md` 或 `.markdown` 结尾、必须留在包内；其他语言可省略（沿语言链回退英文），也可显式指向英文文档。",
        "文档内容就是一行图片：`![Feature result](preview.svg)`，替代文本要有意义。",
        "一个 bundle 最多一张功能图（语言变体算同一张，不是轮播）。",
        "图片用自包含 SVG，`width=\"640\" height=\"300\"`；只画一个主示例，重要内容距边缘约 32 单位；不要先做 mock 页面或截图工具。",
        "图片里不要用字体、远程资源、脚本、事件处理、动画、样式表、`text`、`foreignObject`；需要品牌素材时可以 base64 内嵌未经修改、许可可再分发的 PNG/JPEG/WebP。",
        "各语言变体合计建议不超过 1 MiB；单图上限由 `pluginManager.detailImageMaxBytes`（默认 5 MiB）约束。",
        "文档上限由 `pluginManager.detailMaxBytes` 控制（默认 1 MiB）；`meta.detail` 指向的文件缺失或超限时，详情区显示失败与 Retry，而不是回退 README。",
    ]),

    ("h2", "7.4 安装后的检查"),
    ("bullets", [
        "在 bundle 详情和插件行里，看中英文的标题、描述、详情文档是否按预期显示。",
        "确认图标在每一行都正确渲染：bundle 包与它插入的每一条插件行分别解析图标，子路径插件不会继承。",
        "检查是否有元数据诊断或意外回退；没有浏览器控制时，只检查安装后的资源，并说明「渲染未验证」。",
    ]),

    ("h1", "8. 接入 MCP 服务器"),
    ("p", "MCP 属于「仅配置」bundle：清单需要唯一的 `name`、`version` 和 `dsh.bundle.patch`，但不需要 Host / Client 入口文件。patch 插入已经安装好的 `@deepseek-ai/dsh-mcp-client`："),
    ("code", "yaml", """- insert:
    - id: mcp-demo
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: demo
        transport: streamable-http
        url: https://example.com/mcp
        failOnStartupError: true"""),
    ("p", "替换端点后安装，然后调用新出现的 `mcp__<serverName>__<tool>`（如 `mcp__demo__ping`）验证连接。stdio 传输用 `transport: stdio`、`command`，可选 `args`、`env`、`cwd`；完整客户端 schema 由 `@deepseek-ai/dsh-mcp-client` 的 README 或已安装行的 `Config` 给出。"),
    ("note", "环境里的凭据会被清理；需要凭据时用 Loader 的 `!!js` 引用已有凭据，不要把密钥抄进对话或 patch 文本。失败时修同一个 bundle，不要新建重复的。"),

    ("h1", "9. Agent 预设"),
    ("p", "预设是普通的 `@deepseek-ai/dsh-agent-preset` 声明，由 bundle patch 携带。没有「就地编辑」：创建或修改预设，都是安装一个声明（或覆盖）它的 bundle。"),

    ("h2", "9.1 声明格式"),
    ("p", "一条声明行的 `config` 字段："),
    ("bullets", [
        "`id`（必填，小写字母、数字和连字符）、`plugins`（必填，Cordis 入口列表）；",
        "可选 `name`、`description`、`order`（在预设列表中的位置）；",
        "Loader 行的 id 惯例是 `preset-<id>`。",
    ]),

    ("h2", "9.2 新建预设"),
    ("p", "工作区里写两个文件，然后安装。"),
    ("p", "`review-preset/package.json`："),
    ("code", "json", """{
  "name": "@local/dsh-review-preset",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } }
}"""),
    ("p", "`review-preset/cordis.patch.yml`："),
    ("code", "yaml", """- insert:
    - id: preset-review
      name: '@deepseek-ai/dsh-agent-preset'
      config:
        id: review
        name: Review
        description: Reviews changes with the shell only.
        order: 10
        plugins:
          - id: persona
            name: '@deepseek-ai/dsh-persona'
            config:
              prefix: You review software changes.
          - id: tool-bash
            name: '@deepseek-ai/dsh-tool-bash'"""),
    ("p", "使用自己的包名（示例是 `@local/dsh-review-preset`），保留 `dsh.bundle.patch`。安装同样走 `plugin_manager` 的 `install_bundle`。"),

    ("h2", "9.3 修改已发布的预设"),
    ("p", "按 Loader 行 id 覆盖，而不是 insert。覆盖会整体替换 `config`，所以要把 `id`、`plugins` 和其他字段全部重述："),
    ("code", "yaml", """- id: preset-standard
  name: '@deepseek-ai/dsh-agent-preset'
  config:
    id: standard
    order: 1
    plugins:
      # 出厂列表 + 你的改动，完整重述"""),

    ("h2", "9.4 迁移旧版目录"),
    ("p", "在声明式预设之前，用户预设是 `$DSH_HOME/.agent-presets/<id>/` 下的 `preset.yml`（name/description/order）和 `agent.cordis.yml`（插件入口列表）——该目录已不再被读取。迁移时按目录名取 `id`、按 `preset.yml` 取 `name`/`description`/`order`、按 `agent.cordis.yml` 原样取 `plugins` 写成声明；逐个核对插件名（改名过的包激活会失败），安装并验证后删除旧目录。"),

    ("h2", "9.5 Host 还是预设"),
    ("table", ["需求", "放置位置"],
     [
         ["共享服务：工具/提示注册表、Agent 循环、会话、持久化、设置、沙箱策略、模型路由、子代理后端", "Host 插件"],
         ["作用域内的工具、persona、提示段、策略", "预设插件"],
         ["服务型预设插件", "provider 与消费者隔离在同一 realm"],
     ]),
    ("p", "预设修订一旦被选用就只激活一次，被所有选择它的 Agent 共享；范围（scope）控制贡献与事件可见性，`isolate` 控制服务实例。"),

    ("h1", "10. 用户操作与 Agent 工具"),
    ("p", "插件 UI 对应用数据与配置的操作，也应对 Agent 开放；纯视图交互（切标签、展开详情）不需要工具。"),
    ("bullets", [
        "一个操作实现一次，作为 Host 服务方法：返回结果或明确状态，失败带原因。",
        "UI 动作通过 Client 可调用的 Host 入口调用它（例如 `ctx.remote.commands.execute()` 执行的会话命令），并展示失败。",
        "Agent 工具用相同参数和语义暴露同一方法，返回其结果作为工具结果；相关操作可共用一个带 `action` 参数的工具。",
        "授予或确认权限的动作（批准工具调用、回答 agent 提问、放宽策略）只能由用户执行；不要维护两套逻辑。",
    ]),

    ("h1", "11. 开发实践"),

    ("h2", "11.1 六条原则"),
    ("nums", [
        "**会话日志是唯一真相**：模型看到的一切必须能从已提交的会话事件重建；fork、resume、replay 都由日志派生。插件内存只是缓存。",
        "**注册是 context 拥有的 effect**：插件卸载、agent 销毁、插槽收起、profile patch 都会移除对应上下文上的注册。选好拥有者；注册在 `agent.ctx` 上时，自己也要保留 disposer。",
        "**框架驱动，插件计算**：会话投影、Conversation 组装、插槽渲染都替你订阅、缓存、发布；自己订阅、重扫或写 DOM 会绕过增量机制。",
        "**扩展点共享，用最弱机制**：从弱到强——`ctx.tools.restrict()` 只能移除工具；`ctx.tools.guard()` 只能拒绝；waterfall 监听器可改写且依赖注册顺序；`system-prompt/assemble` 替换整段装配。机制越强，越要保留其他插件的贡献。",
        "**其他插件和版本会读你的数据**：写出的数据要按 Harness 提供的 envelope 字段与版本声明兼容性。",
        "**插件 UI 属于 Harness UI**：用户看到的是一个应用，插件要用宿主 token、语言和布局模式；写视图前先选对渲染面。",
    ]),

    ("h2", "11.2 数据与事件补充"),
    ("bullets", [
        "投影状态保持纯 JSON，`apply` 纯同步；忽略的事件返回同一引用。",
        "稳定状态等持久事件；实时 token 读 `agent/assistant-stream`。",
        "不要在会话日志里创造新事件类型。",
        "可调参数放进 `Config`。",
    ]),

    ("h2", "11.3 UI 一致性"),
    ("bullets", [
        "样式只用 `--dsw-alias-*` token；复制同一类宿主页面的间距、字号与行模式（管理类列表参考 Plugin Manager 页）。",
        "复制骨架时保留用户依赖的行为：Modal 的焦点与 Esc、`role=\"switch\"` 与 `aria-checked`、Tooltip 位置。",
        "组件抛错会让插槽条目崩溃，先修组件，不要把错误留在页面上。",
    ]),

    ("h1", "12. 验证与交付"),
    ("p", "优先使用已经连上 Harness 的页面做验证；不要为了截图另起浏览器、改 HOME、翻个人浏览器配置、寻找认证 token 或动钥匙串。"),
    ("bullets", [
        "有浏览器控制时：看明暗主题、与同类宿主页面并排对比、确认样式只用主题 token、没有引入 Harness Client 包、控制台没有 `slot entry crash`。",
        "没有浏览器控制时：只做 JavaScript 语法、清单校验，以及（有 inspect 时）live Client 插槽检查，然后明确说明视觉未验证；不要找光栅化工具、Quick Look、mock React/DOM 或自写渲染器。",
        "新插件或 UI 变更：至少跑一次 UI/UX 专家评审（可用 subagent），给目标、位置和运行证据，检查可发现性、主流程、反馈、视觉一致性；如实报告评审受限的部分。",
        "测试用的子进程与临时资源放在自己独占的目录里，限时执行并等待清理；可选预览失败不要演变成修环境或阻塞安装。",
        "交付时说明：插件位置、验证状态、任何展示资源例外的原因；不要用「装上了」代替「验证过」。",
    ]),

    ("h1", "13. 常见问题"),
    ("table", ["现象", "可能原因与处理"],
     [
         ["`application` 不是 `applied`", "读 `warnings` 与错误信息，修同一个 bundle 后重装"],
         ["`overridden`", "更高优先级的 patch 层胜出；检查是否有同名行或用户 patch 覆盖"],
         ["`restart-required`", "需要重启 DSH；替换已安装包时尤其如此"],
         ["插件行可见但行为没有出现", "在新会话中验证；确认装的是预期的插件 id"],
         ["图标显示为默认图", "图标无法解码、超出 256 KiB 或路径在包外；换有效图片"],
         ["详情页显示失败与 Retry", "`meta.detail` 指向的文件缺失，或超过 `detailMaxBytes`（默认 1 MiB）"],
         ["控制台报 slot entry crashed", "组件抛错导致整个插槽条目崩溃；修复组件"],
         ["修改配置后没生效", "普通字段会重启插件；只有 `.volatile()` 字段原位更新"],
         ["升级 DSH 后插件异常", "按升级指南检查相关 surface：命令、profile 键、插件配置、导出、服务、事件、插槽、持久数据"],
     ]),

    ("h1", "14. 附：参考文件与模板"),
    ("p", "本文档整理自当前安装的 DSH（0.2.2-rc.5）内置 `dsh-doc` 技能的参考文档：原文为英文，这里按主题归并、翻译并补充了示例。需要查具体 API 时，以运行中的安装为准，并优先用 inspect 查询实时 schema。"),
    ("table", ["文件", "内容"],
     [
         ["references/plugin-development.md", "完整开发流程：交付顺序、安装、profile 事实"],
         ["references/host-plugin.md", "bundle 清单、patch、locale/图标/详情清单、Host 导出形式"],
         ["references/ui-plugin.md", "Web UI 插件与 Client 模块"],
         ["references/plugin-details.md", "详情页文档与功能图规则"],
         ["references/configuration.md", "配置持久化与凭据"],
         ["references/practices.md", "稳定性、性能、UI 实践"],
         ["references/verification.md", "验证与 UX 评审"],
         ["references/compositions.md", "Agent 预设"],
         ["references/composition-reference.md", "Loader patch 方言"],
         ["references/artwork.md", "图标绘制规则"],
         ["references/mcp-bundle.md", "MCP 接入"],
         ["references/packages.md", "可挂载插件包清单（生成文件）"],
         ["references/upgrading.md", "跨版本升级指南"],
         ["templates/decoration/", "UI 插件模板（Host + Client + locale + docs + icon）"],
         ["templates/mcp/", "仅配置 MCP bundle 模板"],
     ]),
    ("note", "DSH 安装目录下还有 `docs/user/index.md`（用户文档）与 `docs/upgrade-guide/`（升级说明），可配合查阅。"),
]


# ---------------------------------------------------------------- markdown

def render_markdown() -> str:
    out = []
    out.append(f"# {TITLE}\n")
    out.append(f"> {SUBTITLE}\n")
    for line in META:
        out.append(f"> {line}  ")
    out.append("")

    out.append("## 目录\n")
    for item in TOC:
        out.append(f"- {item}")
    out.append("")

    for block in BLOCKS:
        kind = block[0]
        if kind == "h1":
            out.append(f"\n## {block[1]}\n")
        elif kind == "h2":
            out.append(f"\n### {block[1]}\n")
        elif kind == "p":
            out.append(block[1] + "\n")
        elif kind == "note":
            out.append(f"> **注意**：{block[1]}\n")
        elif kind == "code":
            out.append(f"```{block[1]}\n{block[2]}\n```\n")
        elif kind == "bullets":
            for item in block[1]:
                out.append(f"- {item}")
            out.append("")
        elif kind == "nums":
            for i, item in enumerate(block[1], 1):
                out.append(f"{i}. {item}")
            out.append("")
        elif kind == "table":
            headers, rows = block[1], block[2]
            out.append("| " + " | ".join(headers) + " |")
            out.append("|" + "|".join([" --- "] * len(headers)) + "|")
            for row in rows:
                out.append("| " + " | ".join(row) + " |")
            out.append("")
        else:
            raise ValueError(f"unknown block {kind}")
    out.append("\n---\n")
    out.append("本文档由 DeepSeek Harness 依据其内置插件开发参考整理生成。")
    return "\n".join(out)


# ---------------------------------------------------------------- docx helpers

def set_run_font(run, name, size, bold=False, italic=False, color=None):
    run.font.name = name
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.italic = italic
    if color is not None:
        run.font.color.rgb = color
    rpr = run._element.get_or_add_rPr()
    rfonts = rpr.find(qn("w:rFonts"))
    if rfonts is None:
        rfonts = OxmlElement("w:rFonts")
        rpr.append(rfonts)
    rfonts.set(qn("w:ascii"), name)
    rfonts.set(qn("w:hAnsi"), name)
    rfonts.set(qn("w:eastAsia"), name)


def set_style_font(style, size, bold=False, color=None, latin=CJK):
    style.font.name = latin
    style.font.size = Pt(size)
    style.font.bold = bold
    if color is not None:
        style.font.color.rgb = color
    rpr = style.element.get_or_add_rPr()
    rfonts = rpr.find(qn("w:rFonts"))
    if rfonts is None:
        rfonts = OxmlElement("w:rFonts")
        rpr.append(rfonts)
    rfonts.set(qn("w:ascii"), latin)
    rfonts.set(qn("w:hAnsi"), latin)
    rfonts.set(qn("w:eastAsia"), CJK)


def shade_paragraph(p, fill):
    ppr = p._p.get_or_add_pPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), fill)
    ppr.append(shd)


def paragraph_border(p, side, color, size=18, space=4):
    ppr = p._p.get_or_add_pPr()
    pbdr = ppr.find(qn("w:pBdr"))
    if pbdr is None:
        pbdr = OxmlElement("w:pBdr")
        ppr.append(pbdr)
    el = OxmlElement(f"w:{side}")
    el.set(qn("w:val"), "single")
    el.set(qn("w:sz"), str(size))
    el.set(qn("w:space"), str(space))
    el.set(qn("w:color"), color)
    pbdr.append(el)


def add_inline(paragraph, text, base_size=10.5, color=None):
    """Render **bold** and `code` spans."""
    pattern = re.compile(r"(\*\*.+?\*\*|`[^`]+`)")
    pos = 0
    for match in pattern.finditer(text):
        if match.start() > pos:
            run = paragraph.add_run(text[pos:match.start()])
            set_run_font(run, CJK, base_size, color=color)
        token = match.group(0)
        if token.startswith("**"):
            run = paragraph.add_run(token[2:-2])
            set_run_font(run, CJK, base_size, bold=True, color=color)
        else:
            run = paragraph.add_run(token[1:-1])
            set_run_font(run, MONO, base_size - 1.1, color=CODE_C)
        pos = match.end()
    if pos < len(text):
        run = paragraph.add_run(text[pos:])
        set_run_font(run, CJK, base_size, color=color)


def add_heading(doc, text, level):
    p = doc.add_paragraph(style=f"Heading {level}")
    run = p.add_run(text)
    if level == 1:
        set_run_font(run, CJK, 17, bold=True, color=H1C)
        paragraph_border(p, "bottom", "D6DEE8", size=6, space=6)
    elif level == 2:
        set_run_font(run, CJK, 13, bold=True, color=H2C)
    else:
        set_run_font(run, CJK, 11.5, bold=True, color=H3C)
    return p


def add_code(doc, lang, text):
    p = doc.add_paragraph()
    pf = p.paragraph_format
    pf.left_indent = Cm(0.35)
    pf.space_before = Pt(4)
    pf.space_after = Pt(10)
    pf.line_spacing = 1.15
    shade_paragraph(p, "F4F6F8")
    paragraph_border(p, "left", "9DB2CC", size=18, space=6)
    lines = text.split("\n")
    for i, line in enumerate(lines):
        run = p.add_run(line)
        set_run_font(run, MONO, 8.4, color=RGBColor(0x2B, 0x33, 0x3D))
        if i < len(lines) - 1:
            run.add_break()
    return p


def add_note(doc, text):
    p = doc.add_paragraph()
    pf = p.paragraph_format
    pf.left_indent = Cm(0.35)
    pf.space_before = Pt(6)
    pf.space_after = Pt(10)
    pf.line_spacing = 1.4
    shade_paragraph(p, "FFF8E1")
    paragraph_border(p, "left", "E0A800", size=18, space=6)
    run = p.add_run("注意：")
    set_run_font(run, CJK, 9.8, bold=True, color=RGBColor(0x8A, 0x5A, 0x00))
    add_inline(p, text, base_size=9.8, color=RGBColor(0x5A, 0x46, 0x1F))
    return p


TABLE_WIDTHS = {
    ("文件", "作用", "何时需要"): [3.4, 8.4, 4.2],
    ("形态", "安装内容", "典型用途"): [3.2, 4.2, 8.6],
    ("状态", "含义与处理"): [4.2, 11.8],
    ("字段", "说明"): [4.0, 12.0],
    ("目标", "方式", "要点"): [3.4, 5.8, 6.8],
    ("需求", "放置位置"): [9.8, 6.2],
    ("现象", "可能原因与处理"): [5.4, 10.6],
    ("文件", "内容"): [5.8, 10.2],
}


def set_table_widths(table, widths_cm):
    tbl = table._tbl
    tbl_pr = tbl.tblPr
    for tag in ("w:tblW", "w:tblLayout"):
        for old in tbl_pr.findall(qn(tag)):
            tbl_pr.remove(old)
    total_dxa = int(sum(widths_cm) / 2.54 * 1440)
    tbl_w = OxmlElement("w:tblW")
    tbl_w.set(qn("w:w"), str(total_dxa))
    tbl_w.set(qn("w:type"), "dxa")
    tbl_pr.append(tbl_w)
    layout = OxmlElement("w:tblLayout")
    layout.set(qn("w:type"), "fixed")
    tbl_pr.append(layout)

    grid = tbl.find(qn("w:tblGrid"))
    if grid is not None:
        for col, width in zip(grid.findall(qn("w:gridCol")), widths_cm):
            col.set(qn("w:w"), str(int(width / 2.54 * 1440)))
    for row in table.rows:
        for cell, width in zip(row.cells, widths_cm):
            tc_pr = cell._tc.get_or_add_tcPr()
            tc_w = tc_pr.find(qn("w:tcW"))
            if tc_w is None:
                tc_w = OxmlElement("w:tcW")
                tc_pr.append(tc_w)
            tc_w.set(qn("w:w"), str(int(width / 2.54 * 1440)))
            tc_w.set(qn("w:type"), "dxa")


def add_table(doc, headers, rows):
    table = doc.add_table(rows=1, cols=len(headers))
    table.style = "Table Grid"
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False

    hdr = table.rows[0]
    trpr = hdr._tr.get_or_add_trPr()
    tbl_header = OxmlElement("w:tblHeader")
    tbl_header.set(qn("w:val"), "true")
    trpr.append(tbl_header)
    for i, text in enumerate(headers):
        cell = hdr.cells[i]
        cell.text = ""
        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        run = p.add_run(text)
        set_run_font(run, CJK, 9.3, bold=True, color=RGBColor(0x1F, 0x3A, 0x54))
        shade_cell(cell, "EAF0F7")

    for row in rows:
        cells = table.add_row().cells
        for i, text in enumerate(row):
            cell = cells[i]
            cell.text = ""
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(2)
            add_inline(p, text, base_size=9.3)

    set_table_widths(table, TABLE_WIDTHS.get(tuple(headers), [16.0 / len(headers)] * len(headers)))
    doc.add_paragraph().paragraph_format.space_after = Pt(2)
    return table


def shade_cell(cell, fill):
    tcpr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), fill)
    tcpr.append(shd)


def add_footer(section):
    footer = section.footer
    p = footer.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run("DeepSeek Harness 插件制作说明  ·  DSH 0.2.2-rc.5  ·  第 ")
    set_run_font(run, CJK, 8.5, color=GRAY)

    fld = OxmlElement("w:fldSimple")
    fld.set(qn("w:instr"), " PAGE ")
    inner = OxmlElement("w:r")
    t = OxmlElement("w:t")
    t.text = "1"
    inner.append(t)
    fld.append(inner)
    p._p.append(fld)

    run2 = p.add_run(" 页")
    set_run_font(run2, CJK, 8.5, color=GRAY)


def normalize_child_order(el, order):
    rank = {qn("w:" + tag): i for i, tag in enumerate(order)}
    children = list(el)
    children.sort(key=lambda c: rank.get(c.tag, len(order)))
    for child in children:
        el.remove(child)
    for child in children:
        el.append(child)


PPR_ORDER = [
    "pStyle", "keepNext", "keepLines", "pageBreakBefore", "framePr",
    "widowControl", "numPr", "suppressLineNumbers", "pBdr", "shd", "tabs",
    "suppressAutoHyphens", "kinsoku", "wordWrap", "overflowPunct",
    "topLinePunct", "autoSpaceDE", "autoSpaceDN", "bidi", "adjustRightInd",
    "snapToGrid", "spacing", "ind", "contextualSpacing", "mirrorIndents",
    "suppressOverlap", "jc", "textDirection", "textAlignment",
    "textboxTightWrap", "outlineLvl", "divId", "cnfStyle", "rPr", "sectPr",
    "pPrChange",
]

TBLPR_ORDER = [
    "tblStyle", "tblpPr", "tblOverlap", "bidiVisual", "tblStyleRowBandSize",
    "tblStyleColBandSize", "tblW", "jc", "tblCellSpacing", "tblInd",
    "tblBorders", "shd", "tblLayout", "tblCellMar", "tblLook", "tblCaption",
    "tblDescription", "tblPrChange",
]


def normalize_document(doc):
    body = doc.element.body
    for ppr in body.iter(qn("w:pPr")):
        normalize_child_order(ppr, PPR_ORDER)
    for tblpr in body.iter(qn("w:tblPr")):
        normalize_child_order(tblpr, TBLPR_ORDER)


def build_docx(path):
    doc = Document()

    sec = doc.sections[0]
    sec.page_width = Cm(21.0)
    sec.page_height = Cm(29.7)
    sec.top_margin = Cm(2.2)
    sec.bottom_margin = Cm(2.2)
    sec.left_margin = Cm(2.4)
    sec.right_margin = Cm(2.4)

    normal = doc.styles["Normal"]
    set_style_font(normal, 10.5, color=RGBColor(0x2A, 0x30, 0x36))
    normal.paragraph_format.line_spacing = 1.45
    normal.paragraph_format.space_after = Pt(5)

    for level, size, color in ((1, 17, H1C), (2, 13, H2C), (3, 11.5, H3C)):
        style = doc.styles[f"Heading {level}"]
        set_style_font(style, size, bold=True, color=color)
        style.paragraph_format.space_before = Pt(18 if level == 1 else 12)
        style.paragraph_format.space_after = Pt(7)
        style.paragraph_format.keep_with_next = True

    core = doc.core_properties
    core.title = TITLE
    core.subject = SUBTITLE
    core.author = "DeepSeek Harness"

    add_footer(sec)

    # ---- cover
    for _ in range(6):
        doc.add_paragraph()
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(10)
    run = p.add_run(TITLE)
    set_run_font(run, CJK, 27, bold=True, color=NAVY)

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(28)
    run = p.add_run(SUBTITLE)
    set_run_font(run, CJK, 12.5, color=RGBColor(0x3E, 0x5A, 0x72))

    paragraph_border(p, "bottom", "C9D5E3", size=8, space=16)

    for line in META:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(4)
        run = p.add_run(line)
        set_run_font(run, CJK, 10, color=GRAY)

    # ---- toc
    doc.add_paragraph().add_run().add_break(WD_BREAK.PAGE)
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(12)
    run = p.add_run("目录")
    set_run_font(run, CJK, 20, bold=True, color=NAVY)

    for item in TOC:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.left_indent = Cm(0.4)
        run = p.add_run(item)
        set_run_font(run, CJK, 10.5, color=RGBColor(0x2F, 0x3B, 0x47))

    doc.add_paragraph().add_run().add_break(WD_BREAK.PAGE)

    # ---- body
    for block in BLOCKS:
        kind = block[0]
        if kind == "h1":
            add_heading(doc, block[1], 1)
        elif kind == "h2":
            add_heading(doc, block[1], 2)
        elif kind == "p":
            p = doc.add_paragraph()
            add_inline(p, block[1])
        elif kind == "note":
            add_note(doc, block[1])
        elif kind == "code":
            add_code(doc, block[1], block[2])
        elif kind == "bullets":
            for item in block[1]:
                p = doc.add_paragraph(style="List Bullet")
                p.paragraph_format.space_after = Pt(3)
                p.paragraph_format.line_spacing = 1.4
                add_inline(p, item)
        elif kind == "nums":
            for i, item in enumerate(block[1], 1):
                p = doc.add_paragraph()
                p.paragraph_format.space_after = Pt(4)
                p.paragraph_format.left_indent = Cm(0.75)
                p.paragraph_format.first_line_indent = Cm(-0.55)
                p.paragraph_format.line_spacing = 1.4
                run = p.add_run(f"{i}. ")
                set_run_font(run, CJK, 10.5, bold=True, color=H1C)
                add_inline(p, item)
        elif kind == "table":
            add_table(doc, block[1], block[2])
        else:
            raise ValueError(kind)

    normalize_document(doc)
    doc.save(path)
    return path


def main():
    here = os.path.dirname(os.path.abspath(__file__))
    downloads = os.path.expanduser("~/Downloads")
    docx_path = os.path.join(downloads, "DSH 插件制作说明.docx")
    md_path = os.path.join(downloads, "DSH 插件制作说明.md")

    if os.path.exists(docx_path) or os.path.exists(md_path):
        if "--force" not in sys.argv:
            print("目标文件已存在，未覆盖：")
            for p in (docx_path, md_path):
                if os.path.exists(p):
                    print("  " + p)
            print("如需覆盖，请加 --force。")
            return 1

    os.makedirs(downloads, exist_ok=True)
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(render_markdown())
    build_docx(docx_path)
    print("已生成：")
    print("  " + docx_path)
    print("  " + md_path)
    return 0


if __name__ == "__main__":
    sys.exit(main())
