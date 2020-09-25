<template>
  <a-list item-layout="horizontal" :data-source="msgList">
    <template>

    </template>
  </a-list>
</template>

<script>
export default {
  layout: 'chat-view',
  data () {
    return {
      msgList: []
    }
  }
}
</script>
