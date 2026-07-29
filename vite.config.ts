import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {
    printWidth: 100,
    tabWidth: 2,
    useTabs: false,
    semi: true,
    singleQuote: false,
    trailingComma: "all",
    endOfLine: "lf",
    insertFinalNewline: true,
    proseWrap: "preserve",
    sortPackageJson: false,
    ignorePatterns: [
      "node_modules/**",
      "docs/.vitepress/cache/**",
      "docs/.vitepress/dist/**",
      "docs/**/legacy/**",
      "docs/archive/**",
      "docs/projects/axios-http/**",
      "docs/**/examples/**/files/node_modules/**",
      "docs/**/examples/**/files/dist/**",
    ],
  },
  staged: {
    "*.{js,mjs,cjs,ts,mts,cts,vue,json,jsonc,md,mdx,yml,yaml,css,scss,html}": "vp fmt --write",
  },
});
