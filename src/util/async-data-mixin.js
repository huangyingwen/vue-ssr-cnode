export default {
  beforeRouteUpdate(to, from, next) {
    let matched = this.$router
      .getMatchedComponents(to)
      .find(
        a =>
          a.name === this.$options.name &&
          a.asyncData &&
          a.asyncDataFetched &&
          !a.asyncDataFetched[to.fullPath]
      )

    if (!matched) return next()

    this.$NProgress.start()
    matched.asyncData
      .call(this, { store: this.$store, route: to })
      .then(() => {
        this.$NProgress.done()
        next()
      })
      .catch(next)
  },
  created() {
    this['ASYNC-DATA-KEY-FULL-PATH'] = this.$route
  },
  activated() {
    let activated = this.$router.getMatchedComponents(this.$route)
    activated.filter(a => a.asyncData).forEach(a => {
      if (!a.asyncDataFetched) return
      a.asyncDataFetched[this['ASYNC-DATA-KEY-FULL-PATH'].fullPath] = false
    })
  },
  deactivated() {
    let activated = this.$router.getMatchedComponents(
      this['ASYNC-DATA-KEY-FULL-PATH']
    )
    activated.filter(a => a.asyncData).forEach(a => {
      if (!a.asyncDataFetched) a.asyncDataFetched = {}
      a.asyncDataFetched[this['ASYNC-DATA-KEY-FULL-PATH'].fullPath] = true
    })
  }
}
