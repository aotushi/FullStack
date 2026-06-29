// postcss.config.js —— 脚手架已替你预置好的 vw 适配（无需自己写）
// 逻辑同方案一：node_modules/vant 按 375、自有页面按 750，各自转出正确 vw。
export default {
  plugins: {
    "postcss-px-to-viewport-8-plugin": {
      viewportUnit: "vw",
      viewportWidth: (file) => (/[\\/]node_modules[\\/]vant[\\/]/.test(file) ? 375 : 750),
      propList: ["*"],
      minPixelValue: 1,
      unitPrecision: 3,
      mediaQuery: false,
    },
  },
};
