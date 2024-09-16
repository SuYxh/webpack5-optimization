const MiniCssExtractPlugin = require("mini-css-extract-plugin");

function setModuleCssRule(type, isProd) {
  return [
    isProd ? MiniCssExtractPlugin.loader : "style-loader",
    {
      loader: "css-loader",
      options: {
        sourceMap: !isProd,
        importLoaders: type === "css" ? 1 : 2,
        modules: {
          // 配置 CSS Modules 的命名规则
          localIdentName: "[name]__[local]___[hash:base64:5]",
        },
      },
    },
    {
      loader: "postcss-loader",
      options: {
        sourceMap: !isProd,
        postcssOptions: {
          plugins: [
            require("autoprefixer")(),
          ],
        },
      },
    },
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

module.exports = setModuleCssRule;
