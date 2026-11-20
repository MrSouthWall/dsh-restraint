# dsh-zhiming

Zhiming 的 DeepSeek Harness（DSH）插件项目。当前是可直接安装的最小骨架，尚未实现具体功能。

## 结构

| 文件 | 作用 |
| --- | --- |
| `package.json` | bundle 清单：`dsh.bundle.patch` 声明 patch，`exports`/`files` 导出运行文件、locale 和图标 |
| `cordis.patch.yml` | 向 Loader 插入一条插件记录，`id: dsh-zhiming` |
| `index.js` | Host 入口，导出 `apply(ctx, config)`；目前为空实现 |
| `locale/en.json`、`locale/zh.json` | 插件管理器里显示的名称与说明 |
| `icon.svg` | 插件列表/详情页图标 |

## 安装

在 DSH 的 **Plugins** 页面选择 **Add plugin**，选中本目录即可。也可以让 Agent 用 `plugin_manager` 的 `install_bundle` 以本目录的绝对路径完成安装。

## 继续开发

- **Host 能力**：在 `index.js` 的 `apply` 内用 `ctx.effect` / `ctx.on` 注册资源并返回清理函数；需要服务时声明 `export const inject = [...]`，需要配置时声明 `export const Config`。
- **Web 界面**：新增 `client.js`，在 `package.json` 中补上 `"./client": "./client.js"` 导出与 `dsh.client` 清单，再在模块内通过 `ctx.slots.register` 注册到目标插槽。
- **详情页配图（可选）**：增加 `docs/DETAIL.md`（只能包含一张图片）并在各 locale 的 `meta.detail` 中声明；没有实际功能前保持省略。
