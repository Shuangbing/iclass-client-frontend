<template>
  <a-layout id="group-view">
    <Header />
    <a-layout-content class="group-content">
      <a-alert
        :style="{ margin: '16px 0' }"
        message="グループのデータは保存期限が72時間です。期限がすぎるとアクセスできなくなります。"
        banner
      />
      <div :style="{ background: '#fff', padding: '24px', minHeight: '70vh' }">
        <Nuxt />
      </div>
    </a-layout-content>
    <a-layout-footer :style="{ textAlign: 'center' }">
      iClass.buzz ©2020
    </a-layout-footer>
  </a-layout>
</template>


<script>
import Header from "@/components/Header.vue";
export default {
  components: {
    Header,
  },
};
</script>
<style>
#group-view {
  height: auto;

}
#group-view .group-content {
  width: 1280px;
  margin: 64px auto;
  min-height: 720px;
}


body {
  background-color: #f0f2f5;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}
</style>
