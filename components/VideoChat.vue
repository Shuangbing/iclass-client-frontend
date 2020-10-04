<template>
  <div>
    <a-row :gutter="[16, 8]">
      <a-col :span="8">
        <div class="video-chat-view">
          <a-card hoverable>
            <video
              slot="cover"
              ref="video"
              id="video"
              width="250px"
              autoplay
              muted
              object-fit="contain"
            ></video>
            <a-card-meta :title="groupData.user.name">
              <div slot="description">
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
            </a-card-meta>
          </a-card>
        </div>
      </a-col>
      <a-col :span="8">
        <div class="video-chat-view">
          <a-card hoverable>
            <video
              slot="cover"
              ref="video1"
              id="video1"
              width="100%"
              height="100%"
              autoplay
              muted
              object-fit="contain"
            ></video>
            <a-card-meta title="User2">
              <div slot="description">
                <a-button
                  :type="micphoneOn ? 'primary' : 'danger'"
                  shape="circle"
                  icon="sound"
                  @click="micphoneOnOrOff"
                />
              </div>
            </a-card-meta>
          </a-card>
        </div>
      </a-col>
      <a-col :span="8">
        <div class="video-chat-view">
          <a-card hoverable>
            <video
              slot="cover"
              ref="video2"
              id="video2"
              width="100%"
              height="100%"
              autoplay
              muted
              object-fit="contain"
            ></video>
            <a-card-meta title="User3">
              <div slot="description">
                <a-button
                  :type="micphoneOn ? 'primary' : 'danger'"
                  shape="circle"
                  icon="sound"
                  @click="micphoneOnOrOff"
                />
              </div>
            </a-card-meta>
          </a-card>
        </div>
      </a-col>
    </a-row>
    <a-row :gutter="[16, 8]">
      <a-col :span="8">
        <div class="video-chat-view">
          <a-card hoverable>
            <video
              slot="cover"
              ref="video2"
              id="video2"
              width="100%"
              height="100%"
              autoplay
              muted
              object-fit="contain"
            ></video>
            <a-card-meta title="User3">
              <div slot="description">
                <a-button
                  :type="micphoneOn ? 'primary' : 'danger'"
                  shape="circle"
                  icon="sound"
                  @click="micphoneOnOrOff"
                />
              </div>
            </a-card-meta>
          </a-card>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  props: {
    groupData: Object,
  },
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
.video-chat-view .ant-card {
}
.video-chat-view video {
  object-fit: cover;

  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg);
  -moz-transform: rotateY(180deg);
}
.video-chat-view .user-icon {
  font-size: 7rem;
}
</style>