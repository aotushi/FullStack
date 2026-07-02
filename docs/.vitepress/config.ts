import { defineConfig } from "vitepress";

const workerPort = Number(process.env.WORKER_PORT || 8787);

const web = [
  {
    text: "Web Foundation",
    collapsed: true,
    items: [
      { text: "Overview", link: "/web_foundation/" },
      {
        text: "浏览器输入 URL 后发生了什么",
        link: "/web_foundation/browser-url-lifecycle",
      },
    ],
  },
  { text: "Web Security", link: "/web_security/" },
];

const frontend = [
  { text: "HTML", link: "/frontend_html/" },
  {
    text: "CSS",
    collapsed: true,
    items: [
      { text: "Overview", link: "/frontend_css/" },
      {
        text: "Responsive Design",
        collapsed: false,
        items: [
          { text: "Overview", link: "/frontend_css/responsive_design/" },
          {
            text: "单位与等比还原",
            link: "/frontend_css/responsive_design/units-and-scaling",
          },
          {
            text: "通用响应式方案",
            link: "/frontend_css/responsive_design/general-responsive",
          },
          {
            text: "桌面网站与后台",
            link: "/frontend_css/responsive_design/case-desktop",
          },
          {
            text: "移动端适配",
            collapsed: false,
            items: [
              {
                text: "背景：像素与视口",
                link: "/frontend_css/responsive_design/pixels-and-viewport",
              },
              {
                text: "案例：适配实战",
                link: "/frontend_css/responsive_design/case-mobile-h5",
              },
            ],
          },
          {
            text: "大屏看板",
            link: "/frontend_css/responsive_design/case-dashboard",
          },
        ],
      },
    ],
  },
  { text: "JavaScript", link: "/frontend_javascript/" },
  { text: "TypeScript", link: "/frontend_typescript/" },
  { text: "Browser", link: "/frontend_browser/" },
  {
    text: "Data Fetching",
    collapsed: true,
    items: [
      { text: "Overview", link: "/frontend_data_fetching/" },
      { text: "Fundamentals", link: "/frontend_data_fetching/fundamentals" },
      { text: "Clients", link: "/frontend_data_fetching/clients" },
      {
        text: "Design Guidelines",
        link: "/frontend_data_fetching/design-guidelines",
      },
    ],
  },
  { text: "UI", link: "/frontend_ui/" },
  {
    text: "Vue",
    collapsed: true,
    items: [
      { text: "Overview", link: "/frontend_vue/" },
      { text: "01 Core Model", link: "/frontend_vue/01_core_model/" },
      {
        text: "02 Components",
        collapsed: true,
        items: [
          { text: "Overview", link: "/frontend_vue/02_components/" },
          { text: "组件封装", link: "/frontend_vue/02_components/component-wrapper" },
        ],
      },
      { text: "03 Client State", link: "/frontend_vue/03_client_state/" },
      { text: "04 Server State", link: "/frontend_vue/04_server_state/" },
      { text: "05 Routing", link: "/frontend_vue/05_routing/" },
      { text: "06 Auth Permission", link: "/frontend_vue/06_auth_permission/" },
      { text: "07 UI System", link: "/frontend_vue/07_ui_system/" },
      { text: "08 Engineering", link: "/frontend_vue/08_engineering/" },
      { text: "09 Quality", link: "/frontend_vue/09_quality/" },
      { text: "10 Maintenance", link: "/frontend_vue/10_maintenance/" },
    ],
  },
  { text: "React", link: "/frontend_react/" },
  { text: "Rendering", link: "/frontend_rendering/" },
  { text: "Build", link: "/frontend_build/" },
  { text: "Testing", link: "/frontend_testing/" },
  { text: "Performance", link: "/frontend_performance/" },
  { text: "Accessibility", link: "/frontend_accessibility/" },
];

const backend = [
  { text: "Runtime", link: "/backend_runtime/" },
  { text: "API", link: "/backend_api/" },
  { text: "Web Server", link: "/backend_web_server/" },
  { text: "Database", link: "/backend_database/" },
  { text: "Cache", link: "/backend_cache/" },
  { text: "Search", link: "/backend_search/" },
  { text: "Realtime", link: "/backend_realtime/" },
  { text: "Message Queue", link: "/backend_message_queue/" },
  { text: "Auth", link: "/backend_auth/" },
  { text: "Testing", link: "/backend_testing/" },
  { text: "Architecture", link: "/backend_architecture/" },
  { text: "Observability", link: "/backend_observability/" },
  { text: "Scalability", link: "/backend_scalability/" },
];

const client = [
  {
    text: "Mobile",
    collapsed: true,
    items: [
      { text: "Overview", link: "/client_mobile/" },
      {
        text: "触摸事件与真机调试",
        link: "/client_mobile/touch-events-and-debugging",
      },
    ],
  },
  { text: "Desktop", link: "/client_desktop/" },
];

const devops = [
  { text: "Git", link: "/devops_git/" },
  { text: "Linux", link: "/devops_linux/" },
  { text: "Docker", link: "/devops_docker/" },
  { text: "Deploy", link: "/devops_deploy/" },
];

export default defineConfig({
  title: "FullStack",
  description: "Personal full-stack development knowledge base",
  cleanUrls: true,
  ignoreDeadLinks: true,
  srcExclude: ["**/legacy/**"],
  markdown: {
    math: true,
  },
  vite: {
    optimizeDeps: {
      exclude: ["@vue/repl"],
    },
    server: {
      proxy: {
        "/api": {
          target: `http://127.0.0.1:${workerPort}`,
          changeOrigin: true,
        },
      },
    },
  },
  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Frontend", link: "/frontend_javascript/" },
      { text: "Backend", link: "/backend_runtime/" },
      { text: "Projects", link: "/projects/" },
    ],
    sidebar: [
      { text: "Web", items: web },
      { text: "Frontend", items: frontend },
      { text: "Backend", items: backend },
      { text: "Client", items: client },
      { text: "DevOps", items: devops },
      {
        text: "Practice",
        items: [
          { text: "Projects", link: "/projects/" },
          { text: "Archive", link: "/archive/" },
        ],
      },
    ],
    search: {
      provider: "local",
    },
    outline: {
      level: [2, 3],
    },
  },
});
