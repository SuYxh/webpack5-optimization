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
          // 测试函数，确定是否将模块包括在此chunk策略中
          test(module) {
            // 选择大于30KB且位于node_modules目录中的模块
            return (
              module.size() > 30000 &&
              module.nameForCondition() &&
              module.nameForCondition().includes("node_modules")
            );
          },
          // 定义生成的chunk的名称
          name(module) {
            // 从模块路径中提取包名
            const packageNameMatch = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            );
            let packageName = packageNameMatch ? packageNameMatch[1] : "";

            //  如果是作用域包（如@vue/cli），特别处理以获取完整的包名
            if (packageName.startsWith("@")) {
              const scopePackageNameMatch = module.context.match(
                /[\\/]node_modules[\\/]@([^\\/]+)[\\/]+([^\\/]+)([\\/]|$)/
              );
              if (scopePackageNameMatch) {
                packageName = `@${scopePackageNameMatch[1]}/${scopePackageNameMatch[2]}`;
              }
            }

            // 将包名中的斜线或@符号替换为下划线，确保名称有效
            return `chunk-lib.${packageName.replace(/[\/@]/g, "_")}`;
          },
          // 此chunk的优先级
          priority: 20,
          // 此chunk至少包含的模块数，此处设置为至少包含1个模块
          minChunks: 1,
          // 如果模块已被包含在另一个现成的chunk中，复用已存在的chunk
          reuseExistingChunk: true,
        },
      },
    },
    // minimize: false
  },
};

module.exports = merge(baseConfig, prodConfig);
