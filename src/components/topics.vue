<template>
  <v-list two-line>
    <template v-for="(item, index) in items">
      <v-list-tile avatar ripple :key="index" :to="{name: 'detail', params: {id: item.id}}">
        <v-list-tile-avatar>
          <img :src="item.author.avatar_url">
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          <v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title>
          <v-list-tile-sub-title>{{ item.create_at|timeAgo }}</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-divider v-if="index + 1 < items.length" :key="`divider-${index}`" :inset="true"></v-divider>
    </template>
  </v-list>
</template>

<script>
export default {
  name: 'c-topics',
  props: {
    items: { type: Array, required: true }
  }
}
</script>
