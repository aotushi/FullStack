import { loadUser } from "./http";
import "./style.css";

const user = await loadUser();
const app = document.querySelector<HTMLDivElement>("#app");

if (app) {
  app.innerHTML = `
    <main>
      <p class="eyebrow">GET /api/users/1 · Promise&lt;User&gt;</p>
      <h1>返回值不变，协议已经独立</h1>
      <section>
        <div>
          <h2>loadUser() 的返回值</h2>
          <p>页面仍直接得到 User；信封格式只存在于 envelope.ts。</p>
        </div>
        <pre>${JSON.stringify(user, null, 2)}</pre>
      </section>
    </main>
  `;
}
