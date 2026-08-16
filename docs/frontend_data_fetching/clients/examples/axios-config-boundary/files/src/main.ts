import { loadUser } from "./http";
import "./style.css";

const user = await loadUser();
const app = document.querySelector<HTMLDivElement>("#app");

if (app) {
  app.innerHTML = `
    <main>
      <p class="eyebrow">GET /api/users/1 · Promise&lt;User&gt;</p>
      <h1>在阶段三上增加配置边界</h1>
      <section>
        <div>
          <h2>loadUser() 的返回值</h2>
          <p>响应适配器和 HttpClient 的返回规则与阶段三相同。</p>
        </div>
        <pre>${JSON.stringify(user, null, 2)}</pre>
      </section>
      <section>
        <div>
          <h2>配置边界</h2>
          <p>固定策略只在创建客户端时设置；页面只描述本次请求。</p>
        </div>
        <pre>固定：baseURL · Cookie 策略 · 默认 timeout
开放：params · headers · signal · 本次 timeout
拒绝：baseURL · adapter · transformResponse</pre>
      </section>
    </main>
  `;
}
