import { defineConfig } from "vitepress";

const web = [
  { text: "Web Foundation", link: "/web_foundation/" },
  { text: "Web Security", link: "/web_security/" },
];

const frontend = [
  { text: "HTML", link: "/frontend_html/" },
  { text: "CSS", link: "/frontend_css/" },
  { text: "JavaScript", link: "/frontend_javascript/" },
  { text: "TypeScript", link: "/frontend_typescript/" },
  { text: "Browser", link: "/frontend_browser/" },
  { text: "UI", link: "/frontend_ui/" },
  {
    text: "Vue",
    collapsed: true,
    items: [
      { text: "Overview", link: "/frontend_vue/" },
      { text: "组件封装", link: "/frontend_vue/component-wrapper" },
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
  { text: "Mobile", link: "/client_mobile/" },
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
