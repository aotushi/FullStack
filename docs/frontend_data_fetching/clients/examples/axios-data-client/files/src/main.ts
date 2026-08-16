import { loadUser } from "./http";
import "./style.css";

const user = await loadUser();
const app = document.querySelector<HTMLDivElement>("#app");

if (app) {
  app.innerHTML = `
    <main>
      <p class="eyebrow">GET /api/users/1 · Promise&lt;User&gt;</p>
      <h1>await 直接得到 User</h1>
      <section>
        <div>
          <h2>loadUser() 的返回值</h2>
          <p>AxiosResponse 和响应信封都留在 HttpClient 内部。</p>
        </div>
        <pre>${JSON.stringify(user, null, 2)}</pre>
      </section>
    </main>
  `;
}
