<template>
  <div>
    <a-row :gutter="[16, 8]" style="max-width: 800px">
      <a-col :span="8">
        <div class="video-chat-view">
          <a-card hoverable>
            <video
              v-show="cameraOn"
              slot="cover"
              ref="video"
              id="video"
              width="100%"
              height="auto"
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
            <a-card-meta>
              <div slot="title">
                <a-icon type="user" />
                {{ groupData.user.name }}
              </div>
              <div slot="description">
                <a-button
                  :disabled="!this.enableCamera"
                  :type="cameraOn ? 'primary' : 'danger'"
                  shape="circle"
                  icon="video-camera"
                  @click="cameraOnOrOff"
                />
                <a-button
                  :disabled="!this.enableCamera"
                  :type="micphoneMute ? 'primary' : 'danger'"
                  shape="circle"
                  icon="audio"
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
              :class="[
                remoteStreamsLoading[member.memberCode] ? 'loading' : '',
              ]"
              slot="cover"
              :ref="`video-remote-${member.memberCode}`"
              width="100%"
              height="auto"
              autoplay
              object-fit="contain"
              :srcObject.prop="remoteStreams[member.memberCode]"
              poster="data:image/gif,AAAA"
              :muted="remoteStreamsMute[member.memberCode]"
              @loadstart="onLoading(member.memberCode)"
            ></video>
            <img
              v-if="!remoteStreams[member.memberCode]"
              slot="cover"
              src="@/assets/video-view-user.png"
              :alt="member.memberCode"
            />
            <a-card-meta>
              <div slot="title">
                <a-icon type="team" />
                {{ member.name }}
                <a-icon
                  v-show="!remoteStreams[member.memberCode]"
                  type="disconnect"
                  style="color: red"
                />
              </div>
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
      enableCamera: false,
      cameraOn: false,
      micphoneMute: true,
      video: {},
      videoStream: {},
      room: null,
      remoteStreams: {},
      remoteStreamsMute: {},
      remoteStreamsLoading: {},
      members: {},
    };
  },
  async mounted() {
    this.members = this.groupData.group.members.filter(
      (member) => member.memberCode != this.groupData.user.userId
    );
    this.members.map((member) =>
      this.$set(this.remoteStreamsMute, member.memberCode, true)
    );
    this.startSelfVideoChat();
  },
  async beforeDestroy() {
    this.room.close();
  },
  methods: {
    async startSelfVideoChat() {
      this.video = this.$refs.video;
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        await navigator.mediaDevices
          .getUserMedia({ video: { width: 415, height: 335 }, audio: true })
          .then(async (stream) => {
            this.enableCamera = true;
            this.cameraOn = true;
            this.videoStream = stream;
            this.video.srcObject = this.videoStream;
            await this.video.play();
          })
          .catch((error) => {
            this.$message.error("カメラ/マイクのアクセス権限がありません");
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
        mode: "sfu",
        stream: this.videoStream,
      });

      if (this.room) {
        this.room.on("stream", (stream) => {
          this.$set(this.remoteStreams, stream.peerId, stream);
          this.$set(this.remoteStreamsMute, stream.peerId, false);
          this.jionedVideoChatNotify(stream.peerId);
        });

        this.room.on("peerLeave", (peerId) => {
          this.$delete(this.remoteStreams, peerId);
        });
      }
    },
    async cameraOnOrOff() {
      if (this.cameraOn) {
        this.videoStream.getVideoTracks()[0].enabled = false;
        this.cameraOn = false;
      } else {
        this.videoStream.getVideoTracks()[0].enabled = true;
        this.cameraOn = true;
      }
      this.statusNotify("camera", this.cameraOn);
    },
    micphoneOnOrOff() {
      if (this.micphoneMute) {
        this.videoStream.getAudioTracks()[0].enabled = false;
        this.micphoneMute = false;
      } else {
        this.videoStream.getAudioTracks()[0].enabled = true;
        this.micphoneMute = true;
      }
      this.statusNotify("micphone", !this.micphoneMute);
    },
    micphoneRemote(memberCode) {
      this.remoteStreamsMute[memberCode] == true
        ? this.$set(this.remoteStreamsMute, memberCode, false)
        : this.$set(this.remoteStreamsMute, memberCode, true);
    },
    statusNotify(device, status) {
      this.$notification.open({
        key: "deviceStatus",
        message: `デバイスの状態が変更されました`,
        description: `${device == "camera" ? "カメラ" : "マイクのミュート"}を${
          status ? "オン" : "オフ"
        }にしました`,
        placement: "topLeft",
      });
    },
    jionedVideoChatNotify(memberCode) {
      const memberName = this.members.find(
        (member) => member.memberCode == memberCode
      ).name;
      this.$notification.open({
        message: "通知",
        description: `メンバー[ ${memberName} ]がビデオチャットに参加しましたがビデオチャットに参加しました`,
        placement: "topRight",
      });
    },
    onLoading(memberCode) {
      this.$set(this.remoteStreamsLoading, memberCode, true);
    },
  },
};
</script>

<style>
.video-chat-view .ant-card {
  max-height: 300px;
  max-width: 250px;
  min-height: 150px;
  min-width: 125px;
}
.video-chat-view {
  min-height: 20vh;
  padding: 0;
}
.video-chat-view video {
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg);
  -moz-transform: rotateY(180deg);
}
.video-chat-view img {
  object-fit: contain;
  width: 100%;
  height: auto;
}
.video-chat-view video.loading {
  width: 100%;
  height: 200px;
  background: #fff url(~assets/video-loading.gif) center center no-repeat;
}
.video-chat-view .user-icon {
  font-size: 7rem;
}
</style>