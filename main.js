import App from './App'
import store from './store/index.js'
/* 时间戳转换为时间 */
Vue.filter('timestampToTime', function(value) {
  let date = new Date(value);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y = date.getFullYear() + '-';
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
  let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  return Y + M + D + h + m + s;
})
Vue.filter('toPrice',function(value){
  // let f=
  // var s = f.toString();
  //   var rs = s.indexOf('.');
  //   if (rs < 0) {
  //     rs = s.length;
  //     s += '.';
  //   }
  //   while (s.length <= rs + 2) {
  //     s += '0';
  //   }
    return (value/100).toFixed(2);
})
// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App,
    store,
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif