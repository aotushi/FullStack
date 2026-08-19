import { loadUser, readRequestEvents, resetRequestEvents } from "./http";
import { presentRequestError } from "./presenter";
import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) throw new Error("#app was not found");

app.innerHTML = `
  <main>
    <p class="eyebrow">execute() · try / catch / finally</p>
    <h1>观察一次请求如何完整收尾</h1>
    <div class="scenario-list" aria-label="请求场景">
      <button data-action="success">成功请求</button>
      <button data-action="failure">失败请求</button>
      <button data-action="concurrent">两个并发请求</button>
    </div>
    <section>
      <div>
        <h2>页面得到的结果</h2>
        <p>页面仍然只等待 loadUser()。</p>
      </div>
      <pre id="result">请选择一个场景</pre>
    </section>
    <section>
      <div>
        <h2>生命周期记录</h2>
        <p>成功、失败与并发最终都回到 Loading 关闭。</p>
      </div>
      <pre id="events">尚未发起请求</pre>
    </section>
  </main>
`;

const result = document.querySelector<HTMLPreElement>("#result");
const events = document.querySelector<HTMLPreElement>("#events");

async function run(action: "success" | "failure" | "concurrent") {
  if (!result || !events) return;

  resetRequestEvents();
  result.textContent = "请求中…";
  events.textContent = "Loading：打开";

  try {
    if (action === "concurrent") {
      const users = await Promise.all([loadUser("slow"), loadUser("fast")]);
      result.textContent = `resolve User[]\n${JSON.stringify(users, null, 2)}`;
    } else {
      const user = await loadUser(action === "failure" ? "failure" : "normal");
      result.textContent = `resolve User\n${JSON.stringify(user, null, 2)}`;
    }
  } catch (error) {
    const name = error instanceof Error ? error.name : "UnknownError";
    result.textContent = `reject ${name}\n页面提示：${presentRequestError(error)}`;
  }

  events.textContent = readRequestEvents().join("\n");
}

for (const button of document.querySelectorAll<HTMLButtonElement>("[data-action]")) {
  button.addEventListener("click", () => {
    const action = button.dataset.action as "success" | "failure" | "concurrent";
    void run(action);
  });
}

void run("success");
