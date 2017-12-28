import 'babel-polyfill'
import Vue from 'vue'
import { createApp } from './app'
import NProgress from 'nprogress'
import InfiniteScroll from '@/components/infinite-scroll'
import FastClick from 'fastclick'

// global progress bar
Vue.prototype.$NProgress = NProgress

Vue.use(InfiniteScroll)

FastClick.attach(document.body)

const { app, router, store } = createApp()

// prime the store with server-initialized state.
// the state is determined during SSR and inlined in the page markup.
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

// wait until router has resolved all async before hooks
// and async components...
router.onReady(() => {
  // Add router hook for handling asyncData.
  // Doing it after initial route is resolved so that we don't double-fetch
  // the data that we already have. Using router.beforeResolve() so that all
  // async components are resolved.
  router.beforeResolve((to, from, next) => {
    // 动态路由切换有问题，beforeRouteUpdate
    // const matched = router.getMatchedComponents(to)
    // const prevMatched = router.getMatchedComponents(from)

    // // 排除路由切换导致的数据获取，由 beforeRouteUpdate 钩子获取
    // let diffed = false
    // const activated = matched.filter((c, i) => {
    //   return diffed || (diffed = prevMatched[i] !== c)
    // })

    let activated = router.getMatchedComponents(to)

    const asyncDataHooks = activated
      .filter(
        a =>
          a.asyncData &&
          (!a.asyncDataFetched || a.asyncDataFetched[to.fullPath] !== true)
      )
      .map(c => c.asyncData)

    if (!asyncDataHooks.length) {
      return next()
    }

    NProgress.start()
    Promise.all(asyncDataHooks.map(hook => hook({ store, route: to })))
      .then(() => {
        NProgress.done()
        next()
      })
      .catch(next)
  })

  // actually mount to DOM
  app.$mount('#app')
})
