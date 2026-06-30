import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import CodeLab from "./components/CodeLab.vue";
import "./styles/codelab.css";
import "./styles/my-fonts.css";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("CodeLab", CodeLab);
  },
} satisfies Theme;
