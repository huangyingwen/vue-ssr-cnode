<template>
  <v-container grid-list-md text-xs-left>
    <v-layout row wrap>
      <v-flex xs12>
        <form class="form">
          <v-text-field label="标题字数 10 字以上" v-model="title" required single-line></v-text-field>
          <v-text-field name="input-7-1" v-model="content" label="内容" multi-line rows="16"></v-text-field>
          <v-btn @click="submit">submit</v-btn>
          <v-btn @click="clear">clear</v-btn>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'create',
  head: {
    title: '创建帖子',
    titleTemplate: '%s · CNode'
  },
  data() {
    return {
      title: '',
      content: ''
    }
  },
  async asyncData({ store, route }) {
    store.dispatch('appShell/appHeader/setAppHeader', {
      show: true,
      title: '发布帖子',
      showMenu: false,
      showBack: true,
      showLogo: false
    })
  },
  methods: {
    submit() {},
    clear() {}
  }
}
</script>
