<template>
  <div>
    <div v-show="isShareing">
      <video
        ref="screenshare"
        id="screenshare"
        width="100%"
        height="100%"
        autoplay
        object-fit="contain"
      ></video>
      <a-button type="danger" @click="stopShare" icon="pause-circle">
        画面共有停止
      </a-button>
    </div>
    <div v-show="!isShareing">
      <a-button type="primary" @click="startShare" icon="desktop">
        画面共有開始
      </a-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShareing: false,
      screenShare: {},
      screenStream: {},
    };
  },
  mounted() {
    this.screenShare = this.$refs.screenshare;
  },
  methods: {
    startShare() {
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices
          .getDisplayMedia({ video: true })
          .then((stream) => {
            this.screenStream = stream;
            this.screenShare.srcObject = this.screenStream;
            this.screenShare.play();
            this.isShareing = true;
          });
      }
    },
    stopShare() {
      this.screenStream.getTracks().forEach((track) => {
        track.stop();
        this.screenShare.pause();
        this.screenShare.srcObject = null;
        this.isShareing = false;
      });
    },
  },
};
</script>

<style>
</style>