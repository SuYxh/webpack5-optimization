const MiniCssExtractPlugin = require("mini-css-extract-plugin");

function setCssRules(type, isProd) {
  return [
    // 在生产环境中提取 CSS，否则使用 style-loader
    isProd ? MiniCssExtractPlugin.loader : "style-loader",
    {
      loader: "css-loader",
      options: {
        sourceMap: !isProd,
        importLoaders: type === "css" ? 1 : 2, // 如果是 SCSS，则需要多一个 loader
      },
    },
    {
      loader: "postcss-loader",
      options: {
        sourceMap: !isProd,
        postcssOptions: {
          plugins: [
            require("autoprefixer")(), // 自动添加浏览器前缀
          ],
        },
      },
    },
    // 如果是 SCSS 文件，添加 sass-loader
    ...(type === "scss"
      ? [
          {
            loader: "sass-loader",
            options: {
              sourceMap: !isProd,
            },
          },
        ]
      : []),
  ];
}

module.exports = setCssRules;
