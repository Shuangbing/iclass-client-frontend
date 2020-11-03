<template>
  <a-layout id="chat-view">
    <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
      <svg
        class="logo"
        viewBox="0 0 117 33"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <title>iClass</title>
        <g
          id="Page-1"
          stroke="none"
          stroke-width="1"
          fill="none"
          fill-rule="evenodd"
          font-family="Verdana"
          font-size="42"
          font-weight="normal"
        >
          <text id="iClass" fill="#FFFFFF">
            <tspan x="-3" y="32">iClass</tspan>
          </text>
        </g>
      </svg>
      <a-menu
        theme="dark"
        mode="horizontal"
        :default-selected-keys="['1']"
        :style="{ lineHeight: '64px' }"
      >
        <a-menu-item key="1"> グループ </a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout-content :style="{ padding: '0 50px', marginTop: '64px' }">
      <a-breadcrumb :style="{ margin: '16px 0' }">
        <a-breadcrumb-item>サブジェクト</a-breadcrumb-item>
        <a-breadcrumb-item>グループ</a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ background: '#fff', padding: '24px', minHeight: '60vh' }">
        <Nuxt />
      </div>
    </a-layout-content>
    <a-layout-footer :style="{ textAlign: 'center' }">
      iClass.buzz ©2020
    </a-layout-footer>
  </a-layout>
</template>
<style>
#chat-view {
  height: auto;
}
#chat-view .logo {
  width: 100px;
  height: 31px;
  margin: 16px 24px 16px 0;
  float: left;
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
  height: 100vh;
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
