import { loadUser } from "./http";
import "./style.css";

const response = await loadUser();
const responseSummary = {
  status: response.status,
  statusText: response.statusText,
  config: {
    baseURL: response.config.baseURL,
    url: response.config.url,
    timeout: response.config.timeout,
  },
  data: response.data,
};
const user = response.data.data;

const app = document.querySelector<HTMLDivElement>("#app");

if (app) {
  app.innerHTML = `
    <main>
      <p class="eyebrow">GET /api/users/1 · ${response.status} ${response.statusText}</p>
      <h1>同一次请求的三层结构</h1>
      <section>
        <div>
          <h2>response</h2>
          <p>AxiosResponse：包含状态、配置、响应头和后端响应数据。</p>
        </div>
        <pre>${JSON.stringify(responseSummary, null, 2)}</pre>
      </section>
      <section>
        <div>
          <h2>response.data</h2>
          <p>ApiEnvelope&lt;User&gt;：后端统一响应信封。</p>
        </div>
        <pre>${JSON.stringify(response.data, null, 2)}</pre>
      </section>
      <section>
        <div>
          <h2>response.data.data</h2>
          <p>User：页面真正需要的业务数据。</p>
        </div>
        <pre>${JSON.stringify(user, null, 2)}</pre>
      </section>
    </main>
  `;
}
