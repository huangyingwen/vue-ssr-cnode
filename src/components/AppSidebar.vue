<template>
  <sidebar v-model="sidebarStatus" :enable="enableSidebar" :width="0.7">
    <!-- sidebar 内容部分 -->
    <div class="app-sidebar-content">

      <!-- 用户信息 -->
      <div v-if="user" class="app-sidebar-user">
        <v-layout row wrap>
          <v-flex xs4>
            <v-avatar class="ma-3">
              <img :src="user.avatar" />
            </v-avatar>
          </v-flex>
          <v-flex xs8></v-flex>
          <v-flex xs12 class="text-xs-left ml-3">{{user.name}}</v-flex>
          <v-flex xs12 class="text-xs-left ml-3 mb-1">{{user.email}}</v-flex>
        </v-layout>
      </div>

      <!-- 导航列表分区块 -->
      <div v-if="blocks" class="app-sidebar-blocks">
        <template v-for="(block, index) in blocks">
          <v-divider v-if="block.divider" :key="`divider-${index}`"></v-divider>
          <v-list :key="index">
            <v-list-tile v-for="item in block.list" :key="item.text" :to="item.route" exact ripple @click="closeAndGo">
              <v-list-tile-action>
                <v-icon :color="item.iconColor" v-if="item.text!=='消息'">{{item.icon}}</v-icon>
                <v-badge color="cyan" overlap v-else>
                  <span slot="badge">6</span>
                  <v-icon :color="item.iconColor">{{item.icon}}</v-icon>
                </v-badge>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{item.text}}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </template>
      </div>
    </div>
  </sidebar>
</template>

<script>
import { mapState } from 'vuex'
import Sidebar from './Sidebar'

export default {
  components: {
    Sidebar
  },
  computed: {
    ...mapState('appShell/appSidebar', ['show', 'title', 'user', 'blocks']),
    sidebarStatus: {
      get() {
        return this.show
      },
      set(val) {
        if (val) {
          this.$emit('show-sidebar')
        } else {
          this.$emit('hide-sidebar')
        }
      }
    },
    enableSidebar() {
      return (
        this.$store.state.appShell.appHeader.show &&
        this.$store.state.appShell.appHeader.showMenu
      )
    }
  },
  methods: {
    close() {
      this.sidebarStatus = false
    },
    closeAndGo(route) {
      //   this.$router.push(route)
      this.close()
    }
  }
}
</script>

<style lang="stylus" scoped>
// 左侧触发滑动宽度
$swipe-width = 20px;

ul, li {
  padding: 0;
  margin: 0;
  list-style: none;
}

a {
  text-decoration: none;
  color: #333;
}

.app-sidebar-content {
  &.app-sidebar-content-right {
    box-shadow: -3px 0 8px 1px rgba(0, 0, 0, 0.4);

    &.app-sidebar-title, &.app-sidebar-blocks {
      text-align: right;
    }
  }

  .app-sidebar-title-left-icon, .app-sidebar-block-left-icon {
    display: inline-block;
    width: ($app-sidebar-left-icon-size + 10) px;
    height: 100%;

    img {
      vertical-align: middle;
      width: $app-sidebar-left-icon-size px;
      height: $app-sidebar-left-icon-size px;
    }

    svg {
      position: relative;
      left: 0;
      top: 0;
      transform: none;
      vertical-align: middle;
      height: $app-sidebar-left-icon-size px;
      width: $app-sidebar-left-icon-size px;
    }

    .material-icons {
      font-size: $app-sidebar-left-icon-size px;
    }
  }

  .app-sidebar-block-text {
    display: inline-block;
    height: 100%;
    vertical-align: middle;
  }

  .app-sidebar-title-right-logo, .app-sidebar-block-right-logo {
    float: right;

    img {
      width: 20px;
      height: 20px;
      margin-right: 10px;
    }
  }

  .app-sidebar-title {
    color: #fff;
    padding: 0 10px;
    font-size: 16px;
    font-weight: bold;
    height: $app-sidebar-title-height;
    line-height: $app-sidebar-title-height;
    background: $theme.primary;
    text-align: left;
  }

  .app-sidebar-user {
    // padding: 0 10px;
    font-size: 16px;
    background-image: url('../assets/head-bg.png');

    .user-avatar {
      margin: 30px auto 0 auto;
      height: 100px;
      width: 100px;

      i {
        font-size: 100px;
        color: #666;
      }
    }

    .user-info {
      padding: 20px 0;
      text-align: center;
      border-bottom: 1px solid #e0e0e0;

      >div {
        margin: 5px 0;

        i {
          font-size: 18px;
          margin-right: 5px;
        }
      }
    }
  }

  .app-sidebar-blocks {
    text-align: left;

    .app-sidebar-block {
      padding: 10px 0;
      border-bottom: 1px solid #e0e0e0;
      color: #333;

      .sub-list-title {
        height: $app-sidebar-nav-height;
        line-height: $app-sidebar-nav-height;
        text-indent: $app-sidebar-left-icon-size px;
        font-weight: bold;
        color: #888;
      }

      li {
        padding-left: 15px;
        height: $app-sidebar-nav-height;
        line-height: $app-sidebar-nav-height;

        &:last-child {
          border: none;
        }
      }

      &:last-child {
        border-bottom: none;
      }
    }
  }
}
</style>
