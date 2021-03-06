import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './router'
import { createStore } from './store'
import { sync } from 'vuex-router-sync'
import * as filters from './util/filters'
import Meta from 'vue-meta'

import {
  Vuetify,
  VBtn,
  VApp,
  VList,
  VIcon,
  VProgressCircular,
  VDivider,
  VBottomNav,
  VGrid,
  VAvatar,
  VToolbar,
  VCard,
  VBadge,
  VForm,
  VTextField,
  VNavigationDrawer,
  VTooltip,
  VFooter
} from 'vuetify'

Vue.use(Vuetify, {
  components: {
    VApp,
    VBtn,
    VList,
    VIcon,
    VProgressCircular,
    VDivider,
    VBottomNav,
    VGrid,
    VAvatar,
    VToolbar,
    VCard,
    VBadge,
    VForm,
    VTextField,
    VNavigationDrawer,
    VTooltip,
    VFooter
  }
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.use(Meta, {
  keyName: 'head'
})

Vue.config.productionTip = false

// 导出一个工厂函数，用于创建新的
// 应用程序、router 和 store 实例
export function createApp() {
  const router = createRouter()
  const store = createStore()

  sync(store, router)

  const app = new Vue({
    router,
    store,
    // 根实例简单的渲染应用程序组件。
    render: h => h(App)
  })
  return { app, router, store }
}
