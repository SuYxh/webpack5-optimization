
<template>
  <div class="app">
    <el-button @click="$router.push('/')" type="primary">前往首页</el-button>
    <el-button @click="$router.push('/about')" type="primary">关于</el-button>
    <router-view></router-view>
  </div>
</template>

<script lang="ts" setup>

import { onBeforeMount, ref } from 'vue'
// 以后一定要仔细阅读 webpack 的编译日志信息
import * as moduleCss from './styles/app.module.scss'

console.log('moduleCss', moduleCss)

const count = ref(0)
 
console.log('工程运行模式', process.env.NODE_ENV)
console.log('前台请求的base_url', process.env.VUE_APP_API_URI)

onBeforeMount(() => {
  console.log('app组件开始渲染')
})

</script>


