# WebContainer 内嵌 vs 跳转:在线预览的最终决策

> **最后更新**: 2026-06-30　**状态**: ✅ 已决策并落地
> **服务于**: `docs/frontend_css/responsive_design/case-mobile-h5.md` →「纯 vw」→「方案一:组件库 + vw 手写开发」的在线访客预览能力
> **本文范围**: 在 `inbrowser-runtime-options.md`(7 方案调研)之后,记录**最终拍板的方案、定夺它的那条硬规则、对原调研一处判断的勘误,以及落地/部署中的坑**
> **与原调研的关系**: 本文是那份调研的**决策落定篇**;并**修正**其中「方案 4 / 第六节横切结论」对 StackBlitz 官方 embed 的判断(见第三节)

---

## 一、结论先行(TL;DR)

- **最终落地**:用 **StackBlitz 跳转按钮**(`@stackblitz/sdk` 的 `openProject`,新标签打开),**不在文档页内嵌**。
- **一句话理由**:**跨域隔离(COOP/COEP)是从顶层文档自上而下继承的**。任何形式的「内嵌 WebContainer」都要求**文档站(顶层)**自己开隔离,会波及 Google Ads 等跨域资源;而**跳转**让 StackBlitz 自己当顶层、自我隔离,**本站一行头都不用加**。
- 原调研里仍"未决策"的几条轻量路线(方案 1 手搓 / 方案 6 Sandpack POC)依然有效,只是这次没走;将来若要「站内不跳转」的体验,再回去看。

---

## 二、澄清:本地 lab-server 为什么能预览、线上为什么空白

- `scripts/lab-server.mjs` **不是"一些服务文件",是一个真正的 node 进程**,干三件操作系统级的事:`spawn` 子进程(真跑 `npm install` + `vite dev`)、读写文件系统(装 `node_modules`)、监听 TCP 端口(vite 听 5190,预览 `iframe` 连它)。
- 浏览器是沙箱,**这三样一样都没有** → 把 `lab-server.mjs`"下载到浏览器启动"在语言能力上就 fail(第一行 `import { spawn } from "node:child_process"` 就没这东西)。
- 线上是 Cloudflare Workers Static Assets(V8 isolate,无 node 后端、不能 spawn)→ 组件 `checkLocalServer()` 请求 `/api/health` 失败 → 预览区空白。
- **"在浏览器里跑 node"这件事确实存在,叫 WebContainer**(StackBlitz):用 WebAssembly 把 node 运行时、npm、虚拟文件系统、甚至一个用 Service Worker 假装的 localhost 服务器**全部在浏览器里重造一遍**。它**闭源、不可自托管**。

> 一句话:不能"搬运 node 服务到浏览器",只能"在浏览器里重造一个 node"——而那东西只有 StackBlitz 这类公司供得起。

---

## 三、⚠️ 勘误:官方 embed 并不能让父站免除整站 COI

原调研 `inbrowser-runtime-options.md` 的**方案 4** 与**第六节横切结论**写道(摘):

> 用官方 embed 时,COOP/COEP 隔离跑在它自己的 iframe 内,父文档站**通常无需整站 cross-origin-isolated**……「破坏文档站」对 embed 不成立。

**这条判断是错的,本次已证伪**:把 StackBlitz 官方 embed 内嵌进未隔离的文档页,**编辑器能加载,但 WebContainer 预览跑不起来**,报 `Unable to run … without proper isolation headers`。根因见第四节。

> 修正后的结论:**只要是"内嵌"(iframe 在文档页里),无论自建还是官方 embed,WebContainer 的预览都需要文档站这一侧开隔离。** embed 与自建的区别仅在"隔离要写多少",不在"要不要"。

---

## 四、硬规则:跨域隔离从顶层文档自上而下继承

- `crossOriginIsolated` / `SharedArrayBuffer` 的可用性是**整棵 frame 树**的属性,不是单个 iframe 自己能决定的。
- 一个子 iframe 拿到 `crossOriginIsolated = true`,**必须同时满足**:
  1. **它的顶层文档本身已经隔离**(顶层发了 `COOP: same-origin` + `COEP: require-corp` 或 `credentialless`);
  2. 整条祖先链都带 COEP,且跨源资源带 `CORP` 或父用 `credentialless`。
- **推论(致命的那条)**:**在一个没开隔离的顶层页面里,任何 iframe 都拿不到隔离 —— 哪怕这个 iframe 自己把 COOP/COEP 发满。** 隔离只能 top-down 授予,不能在子树里凭空产生。
- 所以「**新建一个只放 WebContainer 的独立站,iframe 进文档页**」的设想**不成立**:iframe 的顶层永远是文档主站,主站不隔离 → iframe 里的 WebContainer 起不来。`<iframe credentialless>`、嵌套发头都绕不过——决定权永远在**谁当顶层**。

---

## 五、内嵌真要做,能缩小到什么程度

不是"全有或全无",COOP/COEP 是**按响应/按路由**设的:

- **可以只给"嵌这个 iframe 的那一个文档页"**发 COOP + COEP(顶层 = 这一页),范围从「整站」收到「一页」。
- **代价**:这一页上的其它跨域资源(Google Ads 等)受 COEP 约束;用 **`COEP: credentialless`** 能让它们仍加载,但以"无 cookie"方式(广告个性化/计费可能受损)。**若这一页本就不放广告,基本无痛。**
- **回旋镖**:那个"独立站"要跑 WebContainer,而 WebContainer **不可自托管** → 独立站本身还得嵌 StackBlitz embed。绕一圈又回到 StackBlitz,只是变成「**我们控制的这一页**开 credentialless COI + 内嵌 embed」。
- **VitePress 落地成本**:实测 `vite.server.headers` 对 VitePress **自渲染的 HTML 无效**(`coop/coep` 取到 `null`)→ dev 要写个 Vite 中间件按路由加头,prod 要在 Cloudflare Worker 按路由加响应头。能做,但要写代码。

---

## 六、三种放法对比

| 做法                                       | 文档站影响              | WebContainer 能跑?          |
| ------------------------------------------ | ----------------------- | --------------------------- |
| 主站不动,只让内嵌独立站 iframe 自隔离      | 无                      | ❌ 顶层没隔离,iframe 拿不到 |
| **只给 demo 这一页**开 COI(credentialless) | 仅这一页(广告无 cookie) | ✅                          |
| **跳转**到 StackBlitz(已落地)              | 零                      | ✅ StackBlitz 自己当顶层    |

「内嵌 vs 跳转」的本质代价差:**内嵌始终要"我们的某个页面"当顶层去发隔离头;跳转把"当顶层"这件事外包给了 StackBlitz。**

---

## 七、最终实现(已落地)

- 新增 `docs/frontend_css/responsive_design/components/SeckillStackblitz.vue`:
  - `import.meta.glob(".../examples/seckill-vant/files/**", { query:"?raw", eager:true })` 读**真实源码**(与左侧 CodeLab 同一套,不手抄走样),排除 `node_modules` / lock;
  - 点击 → `@stackblitz/sdk` 的 `openProject({ template:"node", files }, { newWindow:true })` 新标签打开,在 StackBlitz 云端 WebContainer 真跑 `npm install` + `vite dev`。
- 原 `<CodeLab>`(本地 lab-server 那套)**保留不动**。
- 删除了原"方案 1"实现:`SeckillPreview.vue` + `examples/seckill-vant/preview/` 预构建产物 + 依赖 `@codesandbox/sandpack-client`;改装 `@stackblitz/sdk`。
- 验证(dev):按钮渲染正常;点击触发组件 `import("@stackblitz/sdk")` → network 出现 `/.vitepress/cache/deps/@stackblitz_sdk.js → 200`;无失败请求、无 console 报错;`crossOriginIsolated` 保持 `false`(本站未被改隔离,广告零影响)。

---

## 八、踩坑记录

- **`preview_eval` 里手写的 `import('bare-specifier')` 是假阴性**:它是运行时注入、**不经 Vite 的 import 重写**,必报 `Failed to resolve module specifier`——连 `import('vue')` 都报。**别被它带去重启 dev server**。验证组件依赖是否真能加载,要**触发组件自身已被 Vite 转换的代码路径**(如 `btn.click()`),再看 network 是否出现 `/.vitepress/cache/deps/<dep>.js → 200`。
- **Cloudflare Workers Builds 的两个命令会重复部署**:`worker:deploy` 这个 npm script 本身 = `npm run docs:build && wrangler deploy`(**自带部署**)。若把它填进 **Build command**,再叠加默认 **Deploy command** `npx wrangler deploy`,会**部署两次**。正确填法:**Build command = `npm run docs:build`(只构建)**,**Deploy command = `npx wrangler deploy`(不变)**。
- **Git 自动部署(Workers Builds)与本地 `npm run worker:deploy` 是两条并行的部署路径**,别同时用;配了前者后,push 分支即自动 build+deploy,本地不必再手动部署。`Builds for non-production branches` 勾选会让 `docs/update`/`site/*` 等分支 push 也触发自动部署——配合 commit message 加 `[Skip CI]` 可在不想触发时跳过。

---

## 九、参考

- 原调研:`./inbrowser-runtime-options.md`(7 方案 + 对照 + 已排除 + 决策树)
- 隔离规则:`Window.crossOriginIsolated`、`COOP` / `COEP`(`require-corp` vs `credentialless`)—— 关键是"顶层必须先隔离"
- 实现:`docs/frontend_css/responsive_design/components/SeckillStackblitz.vue`、`docs/frontend_css/examples/seckill-vant/`
