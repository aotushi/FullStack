# 浏览器内运行时(in-browser runtime)实现方案调研

> **最后更新**: 2026-06-30　**状态**: 调研中(未决策)
> **服务于**: `docs/frontend_css/responsive_design/case-mobile-h5.md` →「纯 vw:活动页/海报」→「方案一:组件库 + vw 手写开发」的**在线可编辑 + 实时预览**能力
> **本文范围**: 让代码在**浏览器里真实跑起来并预览**的各类实现路径;附带后端方案、已排除方案作为对照

---

## 一、背景与目标

目标页要给在线访客一个 **可编辑代码(左) + 实时预览(右)** 的交互区,演示**真实**的 `postcss-px-to-viewport` px→vw 转换,且是**双基准**:

- Vant 组件按 **375** 设计稿基准转 vw
- 自写页面按 **750** 设计稿基准转 vw
- 核心配置(纯函数式):

```js
// postcss.config.js
"postcss-px-to-viewport-8-plugin": {
  viewportUnit: "vw",
  viewportWidth: (file) => (/[\\/]node_modules[\\/]vant[\\/]/.test(file) ? 375 : 750),
  // …
}
```

**现状**:`CodeMirror 6` 编辑器 + **本地** `scripts/lab-server.mjs`(端口 4180,真实 `npm install` + `vite dev`)。
**问题根源**:线上是 Cloudflare Workers Static Assets(纯静态,**无 node 后端**)→ 组件 `checkLocalServer()` 请求 `/api/health` 失败 → `localAvailable=false` → **预览区空白**。

> 一句话:编辑器那半边没问题,**坏的是"预览"这半边在线上没有能跑它的环境**。

---

## 二、约束与评估维度

| 约束                     | 说明                                                                                      |
| ------------------------ | ----------------------------------------------------------------------------------------- |
| **在线可用**             | Cloudflare Workers 静态部署下也要能预览(当前痛点)                                         |
| **中国访问快/稳**        | 用户最在意的硬约束之一;海外域名(stackblitz/codesandbox/github)普遍慢且不稳                |
| **真实双基准**           | 必须能跑**真**插件、且能传**函数式** `viewportWidth: (file)=>…`(很多现成服务只接受字面量) |
| **SFC 支持**             | 要能处理 `.vue` 单文件组件(含 `<style>` 走 PostCSS)                                       |
| **不破坏文档站**         | 文档站有 Google Ads / 图床等跨域资源,不能因隔离要求被掐断                                 |
| **第三方依赖/配额/EULA** | 尽量少依赖外部服务的可用性、账号配额、商用授权                                            |
| **通用性(关键)**         | 不只解决这一个 px→vw 案例,要扛得住**未来各种案例**(Sass、复杂 PostCSS 链、SSR、真实依赖…) |

**关键认识**:`px→vw` 是纯 JS 确定性函数(`px ÷ baseline × 100`),`postcss` + 该插件都是**纯 JavaScript**,运行时**不需要** `npm install` / `vite` / 子进程 —— 这决定了它既能在浏览器跑、也能在 Worker 跑。但**通用性来自"真实运行环境"**,而非某个聪明的单点实现:逐案例手搓不可扩展。

---

## 三、浏览器内运行时方案列表

### 总览对比

| #   | 方案                            | 类型           | 通用性             | 中国可达 | 可自托管   | 需后端       | 函数式双基准     | 结论           |
| --- | ------------------------------- | -------------- | ------------------ | -------- | ---------- | ------------ | ---------------- | -------------- |
| 1   | **自做浏览器内 px→vw**          | 轻量·自研      | 低(逐案例)         | ✅       | ✅(纯前端) | ❌           | ✅完全可控       | **主力候选**   |
| 2   | **Vue SFC Playground 模式**     | 轻量·参考      | 中(Vue 范围)       | ✅       | ✅         | ❌           | 需自己加         | 方案1的模板    |
| 3   | WebContainer · 自建             | 真 node        | 强                 | ❌       | ❌         | ✅           | ❌破坏文档站     | 排除           |
| 4   | WebContainer · StackBlitz embed | 真 node        | 强                 | ❌       | ❌         | ✅           | ⚠️第三方+中国    | 备选(中国卡)   |
| 5   | Nodebox(CodeSandbox)            | 真 node        | 强                 | ❌       | ❌         | ✅(已验证)   | ⚠️EULA+冷启+中国 | 排除           |
| 6   | **Sandpack classic bundler**    | 浏览器内打包器 | 中(打包器非真node) | ✅       | ✅(Docker) | ❌           | ❓**未验证**     | **待验证候选** |
| 7   | CodePen                         | 第三方在线     | 低                 | ❌       | ❌         | ❌字面量限制 | 排除             |

> 对照(非浏览器内):**8 后端真实环境(CF Containers/独立 node)**、**现状 本地 lab-server**;见第四节。
> 已排除:**X1 GitHub 在线 VSCode + iframe**、**X2 服务器代理**;见第五节。

---

### 方案 1 — 自做浏览器内 px→vw(browser-internal self-made)　★主力候选

**原理**:保留 `CodeMirror`;在**浏览器内**跑 `postcss` + `postcss-px-to-viewport-8-plugin`(纯 JS,可直接传函数式双基准);`.vue` 用 `vue/compiler-sfc` 浏览器构建编译(同 play.vuejs.org);`import-map` 引 Vant 的 ESM;Vant 自身 CSS 可在**构建时预转**(375→vw)为静态资源。产物注入 `iframe` 渲染。

- **优**
  - 瞬时(无冷启动)、**零外部域、零中国访问风险、零配额/EULA**
  - 当前 Worker 静态部署**直接可用**(预览全在前端,后端不参与)
  - px→vw 结果与真实构建**完全一致**;**完全可控**,能传函数式双基准
  - CodePen 内置该插件(浏览器内运行)→ 反证"插件能在浏览器跑"
- **缺**
  - **不通用**:每个案例的构建行为要逐个在浏览器内复现;只对"纯 JS 可复现"的案例划算
  - Vant 等依赖要预处理(预转 CSS / import-map),有一次性工作量
- **结论**:对**当前这一个案例**保真度、成本、中国可达全满足,是落地最稳的一条。代价是"逐案例特判"。

---

### 方案 2 — Vue SFC Playground 模式(play.vuejs.org 同款)

**原理**:`CodeMirror` + 浏览器内 `vue/compiler-sfc` 编译 SFC + `import-map`(esm.sh)。是官方维护的成熟参考实现。

- **优**:成熟可抄;SFC 编译在浏览器完成;自托管、中国可达。
- **缺**:**只解决 Vue SFC 编译+运行,不含 px→vw**;要双基准还得自己叠 postcss → 本质就退回方案 1。
- **结论**:不是独立方案,是**方案 1 的实现模板/参考**。

---

### 方案 3 — WebContainer · 自建(`@webcontainer/api`)

**原理**:StackBlitz 的浏览器内真实 node 运行时,自己在页面里 boot。

- **优**:通用性强(真 node + 真 vite/npm)。
- **缺**:要求**整个页面链路** `COOP: same-origin` + `COEP: require-corp`(cross-origin isolated)→ **会掐断文档站的跨域资源**(Google Ads/图床/CDN);中国访问不稳;运行时不开源。
- **结论**:**排除**——破坏文档站这条是硬伤。

---

### 方案 4 — WebContainer · StackBlitz 官方 embed(含 GitHub-import)

**原理**:`stackblitz.com/github/<user>/<repo>?embed=1`,直接吃 GitHub 仓库,官方 `iframe` 嵌入,WebContainer 在它自己的域里跑真 node/vite 并预览。

- **优**
  - 通用性强(真 node);**官方支持 iframe 嵌入**
  - **修正先前判断**:用**官方 embed** 时,COOP/COEP 隔离跑在**它自己的 iframe 内**,父文档站**通常无需整站 cross-origin-isolated** →「破坏文档站」这个反对理由**对 embed 不成立**(只对方案 3 自建成立)
- **缺**:依赖第三方(可用性/隐私/可能的品牌与配额);**中国访问 stackblitz.com 慢且不稳**(致命);WebContainer **不可自托管**。
- **结论**:形态最接近"仓库 + iframe + 预览"的设想,但**卡在中国访问**。中国非硬指标时才考虑。

---

### 方案 5 — Nodebox(CodeSandbox / Sandpack 2.0)

**原理**:CodeSandbox 的浏览器内 node 运行时(`template:"node"`),**无需 COOP/COEP**。

- **优**:浏览器内真实 node;可编辑+预览+HMR;无跨源隔离要求;**本会话已实测能跑** vite + 双基准 px→vw(px→vw 数值精确、Vant 组件渲染正常)。
- **缺**
  - 依赖 `*.codesandbox.io`(**中国访问风险**);冷启动 **~30s**;**商用 EULA 限制**
  - 版本敏感:需精确 `vite@4.1.4` + `@vitejs/plugin-vue@^4.6.2` + `esbuild-wasm@0.16.17` 才能 boot(Vite5→Rollup4 原生二进制失败;Vite4.5→`base64url` Buffer 报错)
- **结论**:可行性已证,但**中国 + EULA + 冷启动**三点叠加,**排除**。

---

### 方案 6 — Sandpack classic in-browser bundler(开源,自托管)　★待验证候选

**原理**:CodeSandbox 开源的**浏览器内打包器**(1.x),**可 Docker 自托管**(镜像 `ghcr.io/librechat-ai/codesandbox-client/bundler:latest`),把 `bundlerURL` 指向自有域,用 `npmRegistries`/`customNpmRegistries` 配国内镜像。

- **优**:**可自托管 + 中国可达 + 无账号配额 + 免费商用**;不破坏文档站。
- **缺**
  - 是"浏览器内打包器"**非真 node**,复杂 vite 特性 / 完整 postcss 链支持有限
  - **能否跑 Vant + 函数式双基准 `postcss-px-to-viewport` = 未验证**(全场唯一决定性未知点)
  - 要自托管/运维一个 bundler 静态服务
- **结论**:是"浏览器内通用运行时 + 自托管 + 中国可达"里**唯一现成的候选**,但成立与否压在那个未验证点上 → **建议做 POC**。

---

### 方案 7 — CodePen(第三方在线)

**原理**:内置 `postcss-px-to-viewport`,经 `@use postcss-px-to-viewport(viewportUnit: vw, viewportWidth: 750)` 启用。

- **优**:内置该插件,证明插件可在浏览器内跑。
- **缺**:`@use` **只接受字面量** → 无法传函数式双基准 `(file)=>…`;**不处理 .vue SFC 的 `<style>`**;`codepen.io`/`cdpn.io` 海外慢/不稳。
- **结论**:仅适合**单基准纯 CSS**;对本场景**排除**。其价值是反证方案 1 可行。

---

## 四、对照方案(非浏览器内运行时)

### 方案 8 — 后端真实环境(Cloudflare Containers / 独立 node 服务)

**原理**:按需拉起容器跑真 `vite`/`npm`(即把 `lab-server.mjs` 逻辑搬上线)。**Cloudflare Containers**(Workers **Paid** 计划)已核实:按 `session-id` 拉起容器、有完整文件系统、可 `entrypoint:["node","server.js"]`、`sleepAfter` 空闲回收。

- **优**:**通用性满分**(任何案例原样真跑)、最高保真、零逐案例手搓。
- **缺**:付费;首次**冷启动**;**并发隔离**(多人改同一套文件 → 需 per-session workspace);跑用户任意代码的**安全沙箱**;中国访问走 CF 边缘/那台盒子。
- **结论**:**通用底座**的正解,但对一个文档演示偏重型。适合"分层 runner"里的少数重案例。

### 现状 — CodeMirror + 本地 `lab-server.mjs`

本地开发真跑 vite、通用;但依赖本地 node,**线上 Worker 静态无此服务 → 预览空白**(就是要解决的问题)。

---

## 五、已排除方案(记录原因,避免重复踩坑)

### X1 — GitHub 在线 VSCode(github.dev / vscode.dev / Codespaces)+ iframe　❌

三重死:

1. **协议层禁止嵌入**:实测(2026-06-30)`vscode.dev` 响应头 `Content-Security-Policy: frame-ancestors 'none'`;`github.dev` 直接 302 → `vscode.dev/github/`(同一个)。任何第三方页面 **iframe 嵌入被 CSP 挡死,无法绕过**。
2. **无运行时**:github.dev/vscode.dev 是纯 Web 编辑器,**无终端、跑不了 npm/vite,根本不能预览**。
3. **能预览的要登录+计费**:Codespaces 能 `vite dev`+端口转发,但要**每个访客自己登录 GitHub + 计费配额**,匿名读者用不了;预览 URL 私有鉴权;界面同禁 iframe。
4. 叠加中国访问 GitHub 系不稳。

### X2 — 服务器代理第三方运行时(代理 stackblitz/codesandbox 绕过网络限制)　❌

- **不是"代理一个 URL"**:StackBlitz embed 是**跨多域**(`*.staticblitz.com`/`*.webcontainer.io`/npm 代理)+ **WebSocket** 的动态请求图;代理入口页后,内部运行时请求仍直连 → 没绕过。要绕需**镜像整张图**(重写所有子域 host、代理 WS、注入 COEP/CORP),极脆弱。
- **COOP/COEP**:反代后每个跨域子资源都要带正确 `CORP/CORS`,漏一个 boot 失败。
- **违反第三方 ToS**:镜像规避其访问控制违反服务条款,对方可按 `Origin`/流量封禁 → 地基不稳。
- **性能救不回来**:动态运行时请求缓存不住;代理只是把慢的一段挪位置(海外服务器仍慢;境内回源海外仍慢+备案)。

---

## 六、横切关键技术结论

- `px→vw` 与 `postcss-px-to-viewport` 都是**纯 JS**,运行时无需 npm/vite/子进程 → **既能浏览器内跑、也能 Worker 内跑**(Worker 是 V8 isolate,不能 spawn/无 fs/不能 npm install+vite dev,但**能跑纯 JS postcss**)。
- 对纯 JS 转换,**"放浏览器"与"放 Worker"跑的是同一份插件、结果一样**;后端只多一次网络往返、**不增保真** → 这种转换**不需要后端**。
- **COOP/COEP 区分**:自建 WebContainer 要**整站** cross-origin-isolated(破坏跨域资源);官方 **embed** 隔离在它自己 iframe 内,**父站通常免整站 COI**。
- **WebContainer 不可自托管**(运行时不开源、商用授权绑 StackBlitz);**Sandpack classic bundler 可自托管**。
- 通用性 = 真实运行环境;**逐案例手搓不可扩展**。破局是**分层 + 可插拔 runner**(见下)。

---

## 七、待验证未知点(决定性)

> **自托管 Sandpack classic bundler 能否真跑 `seckill-vant`(Vant + 函数式双基准 `postcss-px-to-viewport`)、正确出 vw、渲染 Vant 组件?**

- **能** → 方案 6 成立,即"成本最低 + 通用 + 自托管 + 中国可达"的底座,基本可拍板。
- **不能** → 浏览器内**通用**运行时对双基准场景整体出局,回到方案 1(手搓)+ 分层 runner。

---

## 八、决策建议

**架构思路:分层 + 可插拔 runner**(正面回应"未来各种案例的边界"):

```
CodeMirror 编辑器(不变,所有案例共用)
        │
   统一预览接口  preview(files) → renderable
        │
   ┌────┼─────────────────┬──────────────────┐
runner-postcss        runner-realenv        runner-local
(方案1,浏览器内,轻)  (方案6 或 方案8,通用)  (现有 lab-server,本地)
```

每个案例在 frontmatter 声明用哪种 runner;**现在先上最轻的 runner 解决 px→vw,留好真实环境 runner 的接缝**;未来真出现"必须真实构建"的案例,只给那个案例挂重 runner,不推翻全局。

**按约束选型**:

| 你的优先级                             | 推荐                                             |
| -------------------------------------- | ------------------------------------------------ |
| 中国访问硬指标 + 双基准真插件 + 最省   | **方案 1**(手搓浏览器内),最稳;或先验证**方案 6** |
| 要"通用底座、不再操心边界"、可接受投入 | **方案 8**(后端真实环境)                         |
| 中国访问**非**硬指标、想零自研         | **方案 4**(StackBlitz embed)                     |

**下一步**:跑**方案 6 的 POC** —— 把 `seckill-vant` 文件 + 双基准 postcss 配置喂进自托管 Sandpack classic bundler,验证第七节那个未知点。信息量最大、成本不高。

---

## 附录

### A. 实测/版本记录

- `vscode.dev` 响应头(2026-06-30):`Content-Security-Policy: frame-ancestors 'none'`;`github.dev` → 302 `vscode.dev/github/`。
- Nodebox 可 boot 的版本组合:`vite@4.1.4` + `@vitejs/plugin-vue@^4.6.2` + `esbuild-wasm@0.16.17`。
- Cloudflare Containers:Workers Paid;`getContainer(env, sessionId)` 按 session 拉起;`container.start({ entrypoint: ["node","server.js"] })`;`sleepAfter` 回收;首请冷启。

### B. 参考

- Vue SFC Playground: `play.vuejs.org`(浏览器内 SFC 编译参考)
- Sandpack classic bundler 自托管镜像: `ghcr.io/librechat-ai/codesandbox-client/bundler:latest`
- Cloudflare Containers 文档: `developers.cloudflare.com/containers/`
- 真实工程: `docs/frontend_css/examples/seckill-vant/`(`postcss.config.js` 为双基准核心)
