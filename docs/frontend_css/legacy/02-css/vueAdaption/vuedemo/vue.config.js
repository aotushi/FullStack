const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
	transpileDependencies: true,
	css: {
		loaderOptions: {
			postcss: {
				postcssOptions: {
					plugins: [
            require('autoprefixer'),
            require('postcss-url'),
						require("postcss-aspect-ratio-mini"),
						require("postcss-write-svg")({
							utf8: false,
						}),

						//postcss-px-to-viewport是将其他单位转化成vw的
						require("postcss-px-to-viewport")({
							viewportWidth: 750, // (Number) The width of the viewport.
							viewportHeight: 1334, // (Number) The height of the viewport.
							unitPrecision: 3, // (Number) The decimal numbers to allow the REM units to grow to.
							viewportUnit: "vw", // (String) Expected units.
							selectorBlackList: [".ignore", ".hairlines"], // (Array) The selectors to ignore and leave as px.
							minPixelValue: 1, // (Number) Set the minimum pixel value to replace.
							mediaQuery: false, // (Boolean) Allow px to be converted in media queries.
						}),

            require('cssnano')({
              preset: 'advanced',
              autoprefixer: false,
              'postcss-zindex': false
            })
					],
				},
			},
		},
	},
});
