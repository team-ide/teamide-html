import { createApp } from 'vue'
import { router } from './router'
import App from './App.vue'

import util from "util"

import style from '@/components/style/index.js';

if (window && window.document) {
    style.init();

}

import '@mdi/font/scss/materialdesignicons.scss'

import { Icon, IconFont } from './components'

const app = createApp(App, {})
app.component("Icon", Icon)
app.component("IconFont", IconFont)
app.use(router)
app.use(util)
app.mount('#app')
