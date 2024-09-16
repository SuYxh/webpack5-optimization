const baseConfig = require("./webpack.base.js");
const { merge } = require("webpack-merge");

/**
 * @type {import('webpack').Configuration}
 */

const prodConfig = {
  mode: "production",
  optimization: {
    // 用文件的名字作为chunk的名字
    chunkIds: "named",
    splitChunks: {
      // 任意模块都可以拆分
      chunks: "all",
      cacheGroups: {
        // 屁用 node_modules 模块：
        vendors: {
          name: "vendors",
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          // 不需要重复拆跟 chunk
          reuseExistingChunk: true,
        },

        // 拆跟 elemnt 模块：
        element: {
          name: "element",
          test: /[\\/]node_modules[\\/]element-plus(.*)/,
          // 注意优先级需要高于 vendors 的分包优先级
          priority: 10,
          // 不需要重复拆跟 chunk
          reuseExistingChunk: true,
        },

        customChunk: {
          test(module) {
            return (
              module.size() > 30000 &&
              module.nameForCondition() &&
              module.nameForCondition().includes("node_modules")
            );
          },
          name(module) {
            const packageNameMatch = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            );
            let packageName = packageNameMatch ? packageNameMatch[1] : "";

            // 处理作用域包名
            if (packageName.startsWith("@")) {
              const scopePackageNameMatch = module.context.match(
                /[\\/]node_modules[\\/]@([^\\/]+)[\\/]+([^\\/]+)([\\/]|$)/
              );
              if (scopePackageNameMatch) {
                packageName = `@${scopePackageNameMatch[1]}/${scopePackageNameMatch[2]}`;
              }
            }

            return `chunk-lib.${packageName.replace(/[\/@]/g, "_")}`;
          },
          priority: 20,
          minChunks: 1,
          reuseExistingChunk: true,
        },
      },
    },
    // minimize: false
  },
};

module.exports = merge(baseConfig, prodConfig);
