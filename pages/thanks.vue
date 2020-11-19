<template>
  <a-result title="ご利用ありがとうございました">
    <template #icon>
      <a-icon type="smile" theme="twoTone" />
    </template>
    <template #extra>
      <a-button type="primary" @click="redirectToAsk"> アンケート </a-button>
    </template>
  </a-result>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    redirectToAsk() {
      location.href = "https://forms.gle/msN7VFSt5J947eNw9";
    },
  },
};
</script>
