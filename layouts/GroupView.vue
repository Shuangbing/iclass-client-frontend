<template>
  <a-layout id="group-view">
    <Header />
    <a-layout-content :style="{ padding: '0 50px', marginTop: '64px' }">
      <a-alert
        :style="{ margin: '16px 0' }"
        message="グループのデータは保存期限が72時間です。期限がすぎるとアクセスできなくなります。"
        banner
      />
      <div :style="{ background: '#fff', padding: '24px', minHeight: '60vh' }">
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
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  min-height: 100%;
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
