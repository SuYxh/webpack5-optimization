class BuildTimePlugin {
  constructor() {
    this.startTime = 0;
    this.endTime = 0;
  }

  apply(compiler) {
    // 当编译(compilation)创建开始时，记录开始时间
    compiler.hooks.compile.tap('BuildTimePlugin', (compilation) => {
      this.startTime = Date.now();
      console.log('Build started...');
    });

    // 完成编译时，记录结束时间并输出总时间
    compiler.hooks.done.tap('BuildTimePlugin', (stats) => {
      this.endTime = Date.now();
      console.log('Build finished...');
      console.log(`Build Time: ${(this.endTime - this.startTime) / 1000} seconds`);
    });
  }
}

module.exports = BuildTimePlugin;
