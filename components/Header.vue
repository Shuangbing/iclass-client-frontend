<template>
  <a-layout-header
    :style="{ position: 'fixed', zIndex: 1, width: '100%', zIndex: 100 }"
  >
    <img src="@/assets/logo.png" class="header-logo" alt="logo" />
  </a-layout-header>
</template>

<style>
.header-logo {
  width: 100px;
  height: 31px;
  margin: 16px 24px 16px 0;
  float: left;
}
</style>