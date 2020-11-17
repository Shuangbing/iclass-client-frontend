<template>
  <a-result status="404" title="404" sub-title="ページが見つかりません">
    <template #extra>
      <a-button type="primary" @click="$router.go(-1)"> 戻る </a-button>
    </template>
  </a-result>
</template>
<script>
export default {
  data() {
    return {};
  },
};
</script>
