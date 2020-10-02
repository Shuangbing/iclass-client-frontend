<template>
  <div>
    <a-row :gutter="[16, 8]">
      <a-col :span="8">
        <div class="video-chat-view">
          <video
            ref="video"
            id="video"
            width="100%"
            height="100%"
            autoplay
            object-fit="contain"
          ></video>
          <a-tag>何双兵</a-tag>
        </div>
      </a-col>
      <a-col :span="8">
        <div class="video-chat-view">
          <video
            ref="video1"
            id="video"
            width="300"
            height="300"
            autoplay
          ></video>
        </div>
      </a-col>
      <a-col :span="8">
        <div class="video-chat-view">
          <video
            ref="video2"
            id="video"
            width="300"
            height="300"
            autoplay
          ></video>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      video: {},
    };
  },
  mounted() {
    this.video = this.$refs.video;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        this.video.srcObject = stream;
        this.video.play();
      });
    }
  },
};
</script>

<style>
.video-chat-view {
  min-height: 20vh;
  
}
.video-chat-view video {
  object-fit: cover;
  margin-bottom: 0.2rem;
}
</style>