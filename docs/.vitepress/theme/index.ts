import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import CodeLab from "./components/CodeLab.vue";
import ConceptNote from "./components/ConceptNote.vue";
import InlineTip from "./components/InlineTip.vue";
import VuePlayground from "./components/VuePlayground.vue";
import "./styles/codelab.css";
import "./styles/my-fonts.css";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("CodeLab", CodeLab);
    app.component("ConceptNote", ConceptNote);
    app.component("InlineTip", InlineTip);
    app.component("VuePlayground", VuePlayground);
  },
} satisfies Theme;
