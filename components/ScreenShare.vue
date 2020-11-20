<template>
  <div>
    <div v-show="recivingRemoteShare && isShareing == false">
      <video
        ref="remove_screenshare"
        id="remove_screenshare"
        width="100%"
        height="100%"
        autoplay
        object-fit="contain"
        :srcObject.prop="remoteScreenStream"
      ></video>
    </div>

    <div v-show="recivingRemoteShare && isShareing == true">
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

    <div
      v-show="!recivingRemoteShare && isShareing == false"
      id="screen-share-start"
    >
      <a-button size="large" type="primary" @click="startShare" icon="desktop">
        画面共有開始
      </a-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    videoRoom: Object,
    socket: Object,
    remoteScreenStream: MediaStream,
    recivingRemoteShare: Boolean,
  },
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
            this.socket.emit("send:startScreenShare");
            this.videoRoom.replaceStream(stream);
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
        this.socket.emit("send:stopScreenShare");
      });
    },
  },
};
</script>

<style>
#screen-share-start {
  width: 200px;
  margin: 10rem auto;
}
</style>