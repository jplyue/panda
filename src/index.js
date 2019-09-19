import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import axios from 'axios'
import ElementUI from 'element-ui'
import VueTimeago from 'vue-timeago'

import routerConfig from './routerConfig'   //路由文件
import store from './store'                 //vuex状态


require('vue-timeago/locales/zh-CN.json')
import '@/filters.js'                             //过滤器
import '../static/lib/china-area-element.json'         //省市区

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(ElementUI);
Vue.use(VueTimeago, {
  name: 'timeago', // component name, `timeago` by default
  locale: 'zh-CN',
  locales: {
    'zh-CN': require('vue-timeago/locales/zh-CN.json')
  }
})

//创建路由
const router = new VueRouter({
  history: true,
  hashbang: true,
  saveScrollPosition: false,
  routes: routerConfig
});

//添加模块路由
try {
  router.addRoutes(require('@/modules/systemManage/routerConfig.js').default)
} catch (err) { }

router.addRoutes([    //404
  {
    path: '/main',
    component: r => require.ensure([], () => r(require('./main.vue')), 'main'),
    children: [
      {
        path: '*',
        component: r => require.ensure([], () => r(require('@/components/nofount.vue')), 'main'),
      }
    ]
  }
])
function mountApp() {
  //挂载vue实例
  if (navigator.userAgent.indexOf('Chrome') === -1) {
    return;
  }
  const app = new Vue({
    router,
    store
  }).$mount('#app');
}
//添加一个请求拦截器
axios.interceptors.request.use(function (config) {
  return config;
}, function (err) {
  return Promise.reject(err);
});

//添加一个响应拦截器
axios.interceptors.response.use(function (res) {
    if (res.data.code === 'UnLogin') {
      router.replace('/login');
    }
  return res;
}, function (err) {
});
//路由拦截器
// 路由拦截器
router.beforeEach((to, from, next) => {
  if (to.path === '/' || to.path === '/login') {    //如果已经登陆过，重定向到主页 
    axios.get('/api/heart/saas/march/live/usr/ping').then((res)=>{
      if (res.data.data) {
        next('/main/homepage')
      } else {
        next();
      }
    });
    return;
  }
  next();
})


// var theme = localStorage.getItem('userTheme');
// theme = theme ? theme : 'theme1';
// switch (theme) {
//   case 'theme1':
//     require.ensure([], function (require) {
//       require('../static/themes/theme1/image/font/iconfont.css');
//       require('../static/themes/theme1/theme-chalk/index.css');
//       require('../static/themes/theme1/style/index.scss');
//       mountApp();
//     }, 'theme1');
//     break;
//   case 'theme2':
//     require.ensure([], function (require) {
//       require('../static/themes/theme2/theme-chalk/index.css');
//       require('../static/themes/theme2/style/index.scss');
//       mountApp();
//     }, 'theme2');
//     break;
//   case 'theme3':
//     require.ensure([], function (require) {
//         require('../static/themes/theme3/theme-chalk/index.css');
//       require('../static/themes/theme3/style/index.scss');
//       mountApp();
//     }, 'theme3');
//     break;
//   default:
//     break;
// }
require.ensure([], function (require) {
    require('../static/themes/theme1/image/font/iconfont.css');
    require('../static/themes/theme1/theme-chalk/index.css');
    require('../static/themes/theme1/style/index.scss');
    mountApp();
  }, 'theme1');