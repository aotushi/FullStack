// postcss.config.js
// Vant 组件按 375 设计稿写样式，本活动页设计稿是 750。
// postcss-px-to-viewport-8-plugin 的 viewportWidth 支持传函数，按文件路径切基准：
// node_modules/vant 用 375，自己的页面用 750，两边各自转出正确的 vw，整页 1:1 等比。
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
