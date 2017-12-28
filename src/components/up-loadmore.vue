<template>
  <div v-infinite-scroll="handleLoadMore" :infinite-scroll-distance="200" infinite-scroll-immediate-check="false" infinite-scroll-disabled="isAllLoaded" class="infinite-scroll" ref="infiniteScroll">
    <slot></slot>
    <div class="infinite-scroll__spinner" v-show="isFetching">
      <span>
        <v-progress-circular indeterminate :size="30" :width="3" color="red"></v-progress-circular>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'c-up-loadmore',
  props: {
    loadMore: { type: Function, required: true },
    isAllLoaded: { type: Boolean, required: true }
  },
  data() {
    return {
      isFetching: false
    }
  },
  mounted() {
    // this.$refs.infiniteScroll.attributes
  },
  methods: {
    async handleLoadMore() {
      if (this.isFetching) return
      this.isFetching = true
      await this.loadMore()
      this.isFetching = false
    }
  }
}
</script>

<style lang="stylus" scoped>
.infinite-scroll {
  &__spinner {
    text-align: center;
  }

  span {
    display: inline-block;
    margin: 5px 0;
  }
}
</style>
