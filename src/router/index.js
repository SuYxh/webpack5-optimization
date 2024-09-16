
// 生成vue-router的初始化配置代码

import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "HomeView" */ '@/views/Home.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "AboutView" */'@/views/About.vue')
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL || '/'),
  routes,
});

export default router;

