<template>
  <a-avatar
    :style="`backgroundColor:` + hashColorFromName(name || 'none')"
    icon="user"
  />
</template>

<script>
export default {
  props: {
    name: String,
  },
  methods: {
    hashColorFromName(name) {
      var hash = 0;
      if (name.length === 0) return hash;
      for (var i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
      }
      var color = "#";
      for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 255;
        color += ("00" + value.toString(16)).substr(-2);
      }
      return color;
    },
  },
};
</script>

<style>
</style>