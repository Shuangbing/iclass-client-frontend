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
                  type="primary"
                  shape="circle"
                  icon="sound"
                  @click="micphoneOnOrOff"
                />
              </div>
            </a-card-meta>
          </a-card>
        </div>
      </a-col>
      <a-col
        :span="8"
        id="remote-streams"
        v-for="remoteStream in remoteStreams"
        :ref="remoteStream.peerId"
        :key="remoteStream.peerId"
      >
        <div class="video-chat-view">
          <a-card hoverable>
            <video
              slot="cover"
              :ref="`video-remote-${remoteStream.peerId}`"
              width="100%"
              height="100%"
              autoplay
              object-fit="contain"
              :srcObject.prop="remoteStream"
            ></video>
            <a-card-meta :title="remoteStream.peerId">
              <div slot="description">
                <a-button
                  :type="
                    remoteStreamsMute[remoteStream.peerId]
                      ? 'danger'
                      : 'primary'
                  "
                  shape="circle"
                  icon="sound"
                  @click="micphoneRemote(remoteStream.peerId)"
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
import Peer, { SfuRoom } from "skyway-js";

export default {
  props: {
    groupData: Object,
  },
  data() {
    return {
      peer: "GroupChat",
      cameraOn: true,
      micphoneOn: true,
      video: {},
      videoStream: {},
      room: null,
      localStream: undefined,
      remoteStreams: [],
      remoteStreamsMute: {},
    };
  },
  async mounted() {
    this.video = this.$refs.video;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      await navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(async (stream) => {
          this.videoStream = stream;
          this.video.srcObject = this.videoStream;
          await this.video.play();
        });
    }

    this.peer = await new Peer(this.groupData.user.userId, {
      key: process.env.SKYWAY_API_KEY,
    });
    this.peer.on("open", this.connect);
  },
  async beforeDestroy() {
    this.room.close();
  },
  methods: {
    connect() {
      if (!this.peer || !this.peer.open) {
        return;
      }

      this.room = this.peer.joinRoom(this.groupData.group.groupCode, {
        mode: "sfu",
        stream: this.videoStream,
      });

      if (this.room) {
        this.room.on("stream", (stream) => {
          this.remoteStreamsMute[stream.peerId] = false;
          this.remoteStreams.push(stream);
        });

        this.room.on("peerLeave", (peerId) => {
          this.remoteStreams = this.remoteStreams.filter(
            (stream) => stream.peerId != peerId
          );
          const audio = document.getElementById(peerId);
          if (audio) {
            audio.remove();
          }
        });
      }
    },
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
    micphoneRemote(peerId) {
      const remoteVideoMute = this.$refs[`video-remote-${peerId}`][0];
      if (remoteVideoMute.muted) {
        remoteVideoMute.muted = false;
      } else {
        remoteVideoMute.muted = true;
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

  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg);
  -moz-transform: rotateY(180deg);
}
.video-chat-view .user-icon {
  font-size: 7rem;
}
</style>