# 生命周期能力：取消、Loading、重试、文件传输

本页对应学习路径的阶段六。这四个能力互相独立，可以按需要挑着看；它们都挂在
[上一页](./request-and-errors.md)建立的「逻辑请求」生命周期上。

## 取消：两层都要管

```text
逻辑请求控制器（client.ts）
    ├─ 调用方传入的 signal
    └─ 客户端内部 controller
物理请求控制器（request-control.ts）
    └─ 每次 Axios 发送各建一个
```

`cancelAll()` **两层都要取消**：正在退避等待、还没发出下一次尝试的请求只存在于逻辑
层；已经在传输途中的请求只存在于物理层。只取消一层都会漏。

合并信号优先用原生 `AbortSignal.any()`，没有就手写。手写那半有两个坑：必须返回
`dispose`（否则监听器泄漏），必须先检查有没有**已经**中止的信号（晚注册的监听器收不到
早已发生的 abort）。

还有一处容易忽略：物理请求结束后要把 `config.signal` **换回原来那个**。config 对象会
被复用（401 重放就是拿同一个再发一次），留着上一轮那个已中止的合成信号，重放会在发出
瞬间就被判为取消。

## Loading：为什么是布尔回调而不是 Adapter

计数只在 0↔1 边界通知外部：

```text
第一个请求开始 → 计数 1 → onLoadingChange(true)
第二个请求开始 → 计数 2 → 不通知
第一个结束     → 计数 1 → 不通知
第二个结束     → 计数 0 → onLoadingChange(false)
```

项目端只提供 `onLoadingChange(active)` 一个布尔回调，**不为 Loading 定义 Adapter
接口**。Adapter 抽象的价值在于「项目端存在多种实现需要替换」，而 Loading 的项目端
实现永远只有显示和隐藏两个动作，加一层接口和一个文件只会多出导入路径。

## 重试：三个保守决定

重试是「一次逻辑请求产生多次物理尝试」的第一个来源（另一个是 401 重放，见
[下一页](./auth.md)）。

**决定一：写请求永不重试，即使调用方显式要求。**

```ts
const isSafeRead = ["get", "head", "options"].includes(method);
if (requestConfig.retry && isSafeRead) { ... }
```

传输层看不出一个失败的写请求到底有没有在服务端落库。重试就可能变成重复下单。要重试
的写操作应当由业务层带幂等键自己发起。

**决定二：次数上限之外还要有总时间预算。**

只有 `retries` 时，指数退避会让总耗时迅速放大——`retries: 5` 配 `baseDelayMs: 200`，
光退避总和就接近 6 秒，再加上每次请求自己的 `timeout`，用户看到的是一个长时间不动
的 Loading。每一次都没超时，加起来却久得离谱。

预算检查放在**准备退避之前**，所以它只决定「要不要再试一次」，从不打断已经发出的
尝试——那样会让一个其实就要成功的请求平白失败。

**决定三：退避要加抖动。**

```ts
const jitter = 0.75 + Math.random() * 0.5;
const delay = baseDelay * 2 ** attempt * jitter;
```

服务端刚恢复时，如果所有客户端都在同一毫秒发起第二次尝试，会立刻把它再打垮一次。

**接了 TanStack Query / SWR 之后重试归谁？**

归上层，HTTP 层的 `retry` 保持关闭。除了「上层 3 次 × HTTP 层 3 次 = 9 个物理请求」
这种次数相乘，更根本的原因是两层掌握的信息不同：上层持有查询身份，知道这次读取是否
仍被界面需要、是否已被新查询取代；HTTP 层只看得到一次孤立的传输。

HTTP 层的 `retry` 留给不经过数据请求层的调用——一次性读取、轮询、启动引导请求。
这也是它默认关闭的原因：接入数据请求层时不需要回头去关一个全局默认值。

## 文件传输：两条下载路径

|                          | 带得上 Authorization    | 能读文件名 | 能报进度 | 内存           |
| ------------------------ | ----------------------- | ---------- | -------- | -------------- |
| `fetchFile` + `saveFile` | 能                      | 能         | 能       | 整个文件进内存 |
| `downloadDirect`         | **不能**（靠 URL 签名） | 靠调用方给 | 不能     | 浏览器接管     |

`transfer.ts` 里有两处安全边界：

**文件名消毒。** 名字来自服务端的 `Content-Disposition`，是不可信输入，完全可能是
`../../../.bashrc`。控制字符和路径分隔符全部替换，开头的 `.` 也换掉（避免生成隐藏
文件）。

**直链协议白名单。** `downloadDirect` 会把 url 赋给 `<a href>` 然后点击，所以必须
先解析、只放行 `http:` 和 `https:`。放行 `javascript:` 等于给了一个 XSS 执行点。
校验必须在**创建 `<a>` 之前**。

顺带两个实践细节：上传 `FormData` 时**不要手写 `Content-Type`**，浏览器会自己填上
带 boundary 的值；`createObjectURL` 建立的引用必须 `revoke`，否则整个 Blob 一直钉在
内存里。

## 自己验证

`test/failure-budgets.test.ts` 的
「stops retrying a safe read once the budget cannot fit another attempt」：一个总是返回
503 的服务，配 `{ retries: 5, baseDelayMs: 40, totalTimeoutMs: 250 }`，断言实际发出的
请求数少于 6 次——没有预算时它会跑满 6 次、约 1.2 秒退避。

---

## 本页源码

构建时从 `docs/projects/axios-http/` 的真实文件直读，和测试跑的是同一份。每个文件头
注释是该文件的地图。

::: code-group

<<< @/projects/axios-http/src/api/http/request-control.ts [http/request-control.ts]

<<< @/projects/axios-http/src/api/http/retry.ts [http/retry.ts]

<<< @/projects/axios-http/src/api/http/transfer.ts [http/transfer.ts]

:::
