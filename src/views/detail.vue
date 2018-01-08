<template>
  <div class="detail-wrapper">
    <v-container grid-list-md text-xs-left>
      <v-layout row wrap>
        <v-flex xs12>
          <article class="detail-content text-xs-left">
            <header class="text-xs-left">
              <h1 class="detail-title">{{item.title}}</h1>
            </header>
            <main v-html="item.content" class="markdown-body">
            </main>
          </article>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'detail',
  head() {
    return {
      title: this.item.title,
      titleTemplate: '%s · CNode'
    }
  },
  computed: {
    ...mapGetters('topics', {
      item: 'getByRouteId'
    })
  },

  async asyncData({ store, route }) {
    const json = await store.dispatch(`topics/fetchTopicById`, route.params.id)

    store.dispatch('appShell/appHeader/setAppHeader', {
      show: true,
      title: json.data.title,
      showMenu: false,
      showBack: true,
      showLogo: false
    })
  }
}
</script>

<style lang="stylus" scoped>
.detail-content {
  font-size: 16px;
  margin-top: 10px;

  .detail-title {
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
