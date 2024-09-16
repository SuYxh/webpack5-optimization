
// 公共的 webpack 配置

const { relative, resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const webpack = require("webpack");
const MinicssExtractPlugin = require("mini-css-extract-plugin");
const setCssRules = require("./setCssRules");
const setModuleCssRule = require("./setModuleCssRule");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// 读取 node_env 环境变量的值

let nodeEnv = process.env.NODE_ENV;

if (!nodeEnv) {
  nodeEnv = "development";
}

const isProd = nodeEnv === "production";

const envVars = [
  ".env",
  `.env.${nodeEnv}`,
  `.env.${nodeEnv}.local`,
  ".env.local",
].filter(Boolean);

// 读取当前构建环境对应的环境变量文件的所有内容，将其注入到环境变量中

envVars.forEach((envVar) => {
  const envFilePath = resolve(__dirname, "..", envVar);
  const envFileExists = require("fs").existsSync(envFilePath);
  if (envFileExists) {
    require("dotenv").config({
      path: envFilePath,
    });
  }
});

/**
 * @type {import('webpack').Configuration}
 */

module.exports = {
  // 配置入口
  entry: resolve(__dirname, "..", "src", "main.ts"),
  optimization: {
    // 暂时不要压缩代码
    minimize: true,
  },
  // 配置打包出口
  output: {
    path: resolve(__dirname, "..", "dist"),
    // 使用文件指纹
    filename: "js/[name].[contenthash:6].js",
    // 从 webpack5 开始，只要开启这个开关，那么每一次构建会自动清理输出目录
    clean: true,
    // 打包后访问的资源前缀
    publicPath: "/",
  },
  // 配置路径别名
  resolve: {
    alias: {
      "@": resolve(__dirname, "..", "src"),
      vue$: "vue/dist/vue.runtime.esm-bundler.js",
    },
    // 配置模块的访问路径
    extensions: [".js", ".ts", ".tsx", ".vue", ".json"],
  },
  // 配置插件
  plugins: [
    new HtmlWebpackPlugin({
      // 指定 html 模板的路径
      template: resolve(__dirname, "..", "public", "index.html"),
      // 该配置会注入到 html 文件的模板语法中
      title: process.env.VUE_APP_TITLE,
    }),
    // 加载 vue-loader 插件
    new VueLoaderPlugin(),
    // 在编译时候全局替换静态值
    new webpack.DefinePlugin({
      // 定义全局变量
      "process.env": {
        VUE_APP_API_URI: JSON.stringify(process.env.VUE_APP_API_URI),
      },
      // 决定 vue3 是否启用 options api
      __VUE_OPTIONS_API__: true,
      // Vue Devtools 在生产环境中不可用
      __VUE_PROD_DEVTOOLS__: false,
    }),
    new MinicssExtractPlugin({
      filename: "css/[name].[contenthash:6].css",
      // chunkFilename: "css/[name].[contenthash:6].css",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: resolve(__dirname, "..", "public"),
          to: resolve(__dirname, "..", "dist"),
          toType: "dir",
          globOptions: {
            ignore: ["**/index.html", "**/.DS_Store"],
          },
          info: {
            minimized: true, // 注意：minimize 应该是 minimized，根据CopyWebpackPlugin的文档进行修正
          },
          noErrorOnMissing: true, // 添加此行
        },
      ],
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'server',
      analyzerHost: '127.0.0.1',
      analyzerPort: 8888,
      openAnalyzer: true,
      generateStatsFile: false,
      statsOptions: null,
      logLevel: 'info'
    })
  ],
  module: {
    // 配置 leader
    rules: [
      // 配置 js loader
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        // 配置 .vue 文件
        test: /\.vue$/,
        use: "vue-loader",
      },
      // 匹配 .ts(x)
      {
        test: /\.tsx?$/,
        // 先暴力排除 node_modules 目录
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
            options: {
              // 在编译 ts 的时候关闭类型检查，只进行代码转换
              transpileOnly: true,
              // .vue 文件在编译过程中添加 .ts 后缀
              appendTsSuffixTo: [/\.vue$/],
            },
          },
          // 在 ts 处理完成之后，将内容交给 babel-loader 处理
          {
            loader: "babel-loader",
            // options: {
            //   // 添加 babel 预设
            //   presets: [
            //     [
            //       "@babel/preset-typescript",
            //       {
            //         // 尝试转换任意类型文件中的 ts 代码
            //         allExtensions: true,
            //       },
            //     ],
            //   ],
            // },
          },
        ],
      },
      {
        oneOf: [
          // 处理 css 相关的内容
          {
            test: /\.css$/,
            // 过滤掉 node_modules 以及以 .module.css 结尾的文件
            exclude: [/\.module\.css$/],
            use: setCssRules("css", isProd),
          },
          // 处理 scss 相关的内容
          {
            test: /\.s[ac]ss$/i,
            // 过滤掉 node_modules 以及以 .module.scss 结尾的文件
            exclude: [/\.module\.s[ac]ss$/],
            use: setCssRules("scss", isProd),
          },
          //  处理 .module.css 结尾的文件
          {
            test: /\.module\.css$/,
            exclude: /node_modules/,
            use: setModuleCssRule("css", isProd),
          },
          // 处理 .module.scss 结尾的文件
          {
            test: /\.module\.s[ac]ss$/,
            exclude: /node_modules/,
            use: setModuleCssRule("scss", isProd),
          },
        ],
      },
      // webpack5处理图片相关的静态资源
      {
        test: /\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/,
        // 使用 webpack5 覅人新特性，不再需要使用loader去进行处理
        // 而且 assets 是 webpack5 通用的资源处理类型
        // 默认情况下 8kb 以下的资源会被转化为 base64 编码
        type: "asset",
        parser: {
          dataUrlCondition: {
            // 自定义 10 kb 以下的资源会被转化为 base 64 位编码
            maxSize: 10 * 1024,
          },
        },
        generator: {
          // 输出图片的目录
          // outputPath: "images",
          // 输出图片的名称
          filename: "images/[name].[contenthash:6].[ext]",
        },
      },
      // svg 类型的静态资源期望转为为 asset/resource 类型进行处理
      {
        test: /\.(svg)(\?.*)?$/,
        // 默认会将构建结果导出单独的配置文件
        type: "asset/resource",
        generator: {
          // 输出 svg 的目录
          // outputPath: "images",
          // 输出 svg 的名称
          filename: "svgs/[name].[contenthash:6].[ext]",
        },
      },
    ],
  },
};


