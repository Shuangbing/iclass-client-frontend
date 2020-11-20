<template>
  <div>
    <Editor :canvasWidth="600" :canvasHeight="500" ref="editor" />
  </div>
</template>

<script>
import Editor from "vue-image-markup";
export default {
  components: {
    Editor,
  },
  mounted() {
    this.$refs.editor.set("freeDrawing");
  },
  methods: {
    userSelect() {
    },
  },
};
</script>

<style>
</style>