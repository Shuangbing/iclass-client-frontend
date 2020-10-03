<template>
  <div>
    <a-row :gutter="[16, 8]">
      <a-col :span="8">
        <div class="video-chat-view">
          <a-card title="何双兵" hoverable>
            <div slot="extra">
              <a-button
                :type="cameraOn ? 'primary' : 'danger'"
                shape="circle"
                icon="video-camera"
                @click="cameraOnOrOff"
              />
              <a-button
                :type="micphoneOn ? 'primary' : 'danger'"
                shape="circle"
                icon="sound"
                @click="micphoneOnOrOff"
              />
            </div>
            <video
              ref="video"
              id="video"
              width="100%"
              height="100%"
              autoplay
              muted
              object-fit="contain"
            ></video>
          </a-card>
        </div>
      </a-col>
      <a-col :span="8">
        <div class="video-chat-view">
          <a-card title="User2" hoverable>
            <div slot="extra">
              <a-button
                :type="micphoneOn ? 'primary' : 'danger'"
                shape="circle"
                icon="sound"
                @click="micphoneOnOrOff"
              />
            </div>
            <video
              ref="video2"
              id="video2"
              width="100%"
              height="100%"
              autoplay
              muted
              object-fit="contain"
            ></video>
          </a-card>
        </div>
      </a-col>
      <a-col :span="8">
        <div class="video-chat-view">
          <a-card title="User3" hoverable>
            <div slot="extra">
              <a-button
                :type="micphoneOn ? 'primary' : 'danger'"
                shape="circle"
                icon="sound"
                @click="micphoneOnOrOff"
              />
            </div>
            <video
              ref="video3"
              id="video3"
              width="100%"
              height="100%"
              autoplay
              muted
              object-fit="contain"
            ></video>
          </a-card>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cameraOn: true,
      micphoneOn: true,
      video: {},
      videoStream: {},
    };
  },
  mounted() {
    this.video = this.$refs.video;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          this.videoStream = stream;
          this.video.srcObject = this.videoStream;
          this.video.play();
        });
    }
  },
  methods: {
    cameraOnOrOff() {
      if (this.cameraOn) {
        this.cameraOn = false;
      } else {
        this.cameraOn = true;
      }
    },
    micphoneOnOrOff() {
      if (this.micphoneOn) {
        this.micphoneOn = false;
      } else {
        this.micphoneOn = true;
      }
    },
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
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg);
  -moz-transform: rotateY(180deg);
}
</style>