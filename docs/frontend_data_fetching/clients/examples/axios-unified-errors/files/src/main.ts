import {
  loadUser,
  readRequestEvents,
  resetRequestEvents,
  setDisplayCallbackShouldFail,
  type ErrorMode,
  type Scenario,
} from "./http";
import { presentRequestError } from "./presenter";
import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) throw new Error("#app was not found");

app.innerHTML = `
  <main>
    <p class="eyebrow">await loadUser() · Promise&lt;User&gt;</p>
    <h1>同一个调用，观察六种结果</h1>
    <div class="scenario-list" aria-label="Mock 场景">
      <button data-scenario="success">成功</button>
      <button data-scenario="forbidden">403</button>
      <button data-scenario="server">500</button>
      <button data-scenario="timeout">超时</button>
      <button data-scenario="protocol">格式错误</button>
      <button data-scenario="absolute">绝对地址</button>
    </div>
    <div class="toggle-list">
      <label class="behavior-toggle">
        <input id="silent" type="checkbox" />
        使用 errorMode: "silent"
      </label>
      <label class="behavior-toggle">
        <input id="callback-failure" type="checkbox" />
        模拟全局提示组件故障
      </label>
    </div>
    <section>
      <div>
        <h2>页面得到的结果</h2>
        <p>成功得到 User；失败始终得到原始 RequestError。</p>
      </div>
      <pre id="result">请选择一个场景</pre>
    </section>
    <section>
      <div>
        <h2>客户端动作</h2>
        <p>先上报，再按 errorMode 决定是否全局提示。</p>
      </div>
      <pre id="events">尚未发起请求</pre>
    </section>
  </main>
`;

const result = document.querySelector<HTMLPreElement>("#result");
const events = document.querySelector<HTMLPreElement>("#events");
const silent = document.querySelector<HTMLInputElement>("#silent");
const callbackFailure = document.querySelector<HTMLInputElement>("#callback-failure");

async function runScenario(scenario: Scenario) {
  if (!result || !events) return;

  resetRequestEvents();
  setDisplayCallbackShouldFail(callbackFailure?.checked ?? false);
  result.textContent = "请求中…";
  events.textContent = "等待客户端处理…";
  const errorMode: ErrorMode = silent?.checked ? "silent" : "global";

  try {
    const user = await loadUser(scenario, errorMode);
    result.textContent = `resolve User\n${JSON.stringify(user, null, 2)}`;
  } catch (error) {
    const name = error instanceof Error ? error.name : "UnknownError";
    result.textContent = `reject ${name}\n页面提示：${presentRequestError(error)}`;
  }

  const lines = readRequestEvents();
  events.textContent = lines.length > 0 ? lines.join("\n") : "无全局提示 · 无错误上报";
}

for (const button of document.querySelectorAll<HTMLButtonElement>("[data-scenario]")) {
  button.addEventListener("click", () => {
    const scenario = button.dataset.scenario as Scenario;
    void runScenario(scenario);
  });
}

void runScenario("success");
