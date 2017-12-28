<template>
  <div class="hemo-wrapper">
    <v-container grid-list-xs text-xs-center>
      <c-down-refresh :refresh="refresh">
        <c-up-loadmore :loadMore="fetchData" :isAllLoaded="isAllLoaded">
          <c-topics :items="items"></c-topics>
        </c-up-loadmore>
      </c-down-refresh>
      <v-btn color="pink" fab dark primary fixed bottom right :to="{name: 'create'}">
        <v-icon>add</v-icon>
      </v-btn>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Topics from '@/components/Topics'
import downRefresh from '@/components/down-refresh'
import upLoadmore from '@/components/up-loadmore'
import asyncDataMixin from '@/util/async-data-mixin'

let namespace = 'topics'

export default {
  name: 'home',
  props: {},
  data() {
    return {
      topicsKey: '',
      titles: {
        all: 'Node.js专业中文社区',
        good: '精华',
        share: '分享',
        ask: '问答',
        job: '招聘',
        dev: '客户端测试'
      }
    }
  },
  computed: {
    ...mapGetters('topics', ['getItems', 'getIsData']),
    isAllLoaded() {
      return this.$store.state[namespace].paginates[this.topicsKey].isAllLoaded
    },
    page() {
      return this.$store.state[namespace].paginates[this.topicsKey].page
    },
    items() {
      return this.getItems(this.topicsKey)
    },
    isData() {
      return this.getIsData(this.topicsKey)
    }
  },
  mixins: [asyncDataMixin],
  asyncData({ store, route }) {
    let tab = route.params.tab || 'all'
    return store.dispatch(`${namespace}/fetchTopics`, {
      key: tab,
      page: 1
    })
  },
  created() {
    this.topicsKey = this.$route.params.tab || 'all'
  },
  activated() {
    this.setAppHeader({
      show: true,
      title: `CNode：${this.titles[this.topicsKey]}`,
      showMenu: true,
      showBack: false,
      showLogo: true
    })

    this.activateBottomNav('home')
  },
  methods: {
    ...mapActions('appShell/appHeader', ['setAppHeader']),
    ...mapActions('appShell/appBottomNavigator', [
      'showBottomNav',
      'activateBottomNav'
    ]),
    ...mapActions(namespace, ['fetchTopics']),
    fetchData(page) {
      return this.fetchTopics({
        key: this.topicsKey,
        page: page || this.page + 1
      })
    },
    refresh() {
      return this.fetchData(1)
    }
  },
  components: {
    [Topics.name]: Topics,
    [downRefresh.name]: downRefresh,
    [upLoadmore.name]: upLoadmore
  }
}
</script>

<style lang="stylus" scoped>
$text-color ?= rgba($material-theme.text-color, $material-theme.primary-text-percent);

.content {
  width: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  h2 {
    font-size: 46px;
    font-weight: 500;
  }

  h2, h4 {
    color: $text-color;
  }
}
</style>
