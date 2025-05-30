import Vue from 'vue'
import App from '@/App.vue'
import Router from 'vue-router'

//去除谷歌浏览器的scroll、wheel等事件警告
(function () {
  if (typeof EventTarget !== "undefined") {
    let func = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type, fn, capture) {
      this.func = func;
      if (typeof capture !== "boolean") {
        capture = capture || {};
        capture.passive = false;
      }
      this.func(type, fn, capture);
    };
  }
}());
// 引入echarts
import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts

Vue.config.productionTip = false

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

import 'github-markdown-css/github-markdown.css'

import { } from '@/component'

import tool from '@/tool'
import server from '@/server'

Vue.prototype.tool = tool
Vue.prototype.server = server
Vue.directive('remove-aria-hidden', {
  bind(el, binding) {
    let ariaEls = el.querySelectorAll('.el-radio__original');
    ariaEls.forEach((item) => {
      item.removeAttribute('aria-hidden');
    });
  }
});
import '@mdi/font/css/materialdesignicons.css'


import form from "@/form";

Vue.prototype.form = form;

Vue.use(Router)

let router = new Router({})

new Vue({
  router,
  render: h => h(App),
  created() {
    this.tool.$bvToast = this.$bvToast;
  },
  mounted() {
  }
}).$mount('#app')