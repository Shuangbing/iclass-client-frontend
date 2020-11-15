<template>
  <div>
    <a-row :gutter="[16, 8]">
      <a-col :span="8">
        <div class="video-chat-view">
          <a-card hoverable>
            <video
              v-show="cameraOn"
              slot="cover"
              ref="video"
              id="video"
              width="250px"
              autoplay
              muted
              object-fit="contain"
            ></video>
            <img
              v-show="!cameraOn"
              slot="cover"
              src="@/assets/video-view-user.png"
              alt="self-video-view-user"
            />
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
        v-for="member in members"
        :ref="member.memberCode"
        :key="member.memberCode"
      >
        <div class="video-chat-view">
          <a-card hoverable>
            <video
              v-if="remoteStreams[member.memberCode]"
              slot="cover"
              :ref="`video-remote-${member.memberCode}`"
              width="100%"
              height="100%"
              autoplay
              muted
              object-fit="contain"
              :srcObject.prop="remoteStreams[member.memberCode]"
              poster="data:image/gif,AAAA"
            ></video>
            <img
              v-if="!remoteStreams[member.memberCode]"
              slot="cover"
              src="@/assets/video-view-user.png"
              :alt="member.memberCode"
            />
            <a-card-meta :title="member.name">
              <div slot="description">
                <a-button
                  :type="
                    remoteStreamsMute[member.memberCode] ? 'danger' : 'primary'
                  "
                  shape="circle"
                  icon="sound"
                  @click="micphoneRemote(member.memberCode)"
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
      cameraOn: false,
      micphoneOn: true,
      video: {},
      videoStream: {},
      room: null,
      localStream: undefined,
      remoteStreams: {},
      remoteStreamsMute: {},
      members: {},
    };
  },
  async mounted() {
    this.members = this.groupData.group.members.filter(
      (member) => member.memberCode != this.groupData.user.userId
    );
    this.startSelfVideoChat();
  },
  async beforeDestroy() {
    this.room.close();
  },
  methods: {
    async startSelfVideoChat() {
      this.cameraOn = true;
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
        key:
          process.env.SKYWAY_API_KEY || "5bee86ef-e251-42f7-a337-cd4c3e6eb6c7",
      });
      this.peer.on("open", this.connect);
    },
    connect() {
      if (!this.peer || !this.peer.open) {
        return;
      }

      this.room = this.peer.joinRoom(this.groupData.group.groupCode, {
        mode: "mesh",
        stream: this.videoStream,
      });

      if (this.room) {
        this.room.on("stream", (stream) => {
          this.$set(this.remoteStreams, stream.peerId, stream);
        });

        this.room.on("peerLeave", (peerId) => {
          this.$delete(this.remoteStreams, peerId);
          const audio = document.getElementById(peerId);
          if (audio) {
            audio.remove();
          }
        });
      }
    },
    async cameraOnOrOff() {
      if (this.cameraOn) {
        this.cameraOn = false;
      } else {
        this.cameraOn = true;
        await this.startSelfVideoChat();
      }
    },
    micphoneOnOrOff() {
      this.$set(members, "video", "123123");

      this.members.map((member) => {
        this.$set(members, "video", "123123");
      });
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
  padding: 0;
}
.video-chat-view video {
  object-fit: cover;
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg);
  -moz-transform: rotateY(180deg);
}
.video-chat-view video.loading {
  background: black url(~assets/video-loading.gif) center center no-repeat;
}
.video-chat-view .user-icon {
  font-size: 7rem;
}
</style>