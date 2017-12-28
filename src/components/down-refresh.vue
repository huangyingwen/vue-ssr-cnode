<template>
  <mt-loadmore :top-method="topMethod" @top-status-change="handleTopChange" :top-distance="40" class="c-down-refresh" ref="loadmore">
    <div slot="top" class="c-down-refresh__top">
      <span v-show="this.topStatus !=='loading'" :class="{ 'is-rotate': this.topStatus==='drop' }">↓</span>
      <span v-show="this.topStatus==='loading'">
        <v-progress-circular indeterminate :size="30" :width="3" color="red"></v-progress-circular>
      </span>
    </div>
    <slot name="header"></slot>
    <slot></slot>
  </mt-loadmore>
</template>

<script>
import loadmore from './loadmore'
export default {
  name: 'c-down-refresh',
  props: {
    refresh: { type: Function, required: true }
  },
  data: () => {
    return {
      topStatus: ''
    }
  },
  methods: {
    handleTopChange(status) {
      this.topStatus = status
    },
    async topMethod() {
      await this.refresh()
      this.$refs.loadmore.onTopLoaded()
    }
  },
  components: {
    [loadmore.name]: loadmore
  }
}
</script>

<style lang="stylus" scoped>
.c-down-refresh {
  position: relative;
  min-height: 100%;

  &__top {
    position: absolute;
    top: -34px;
    width: 100%;
    text-align: center;
    height: 30px;
    line-height: 30px;

    // margin-top: -70px;
    span {
      display: inline-block;
      transition: 0.2s linear;
      vertical-align: middle;

      &.is-rotate {
        transform: rotate(180deg);
      }
    }
  }
}
</style>
