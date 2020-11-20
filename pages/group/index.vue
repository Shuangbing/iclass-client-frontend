<template>
  <div>
    <a-row>
      <a-col :span="16">
        <div>
          <a-page-header
            :title="groupData.group.subject.title"
            :sub-title="groupData.group.title"
          />

          <a-tabs default-active-key="video" v-model="tabKey">
            <a-tab-pane key="video">
              <span slot="tab">
                <a-icon type="video-camera" />
                ビデオ通話
              </span>
              <VideoChat
                :groupData="groupData"
                :videoRoom.sync="videoRoom"
                :socket="socket"
                @update:videoRoom="(val) => (videoRoom = val)"
                @update:tab="(val) => (tabKey = val)"
                @update:screenStream="
                  (val) => {
                    remoteScreenStream = val;
                    recivingRemoteShare = true;
                  }
                "
                @update:stopScreenStream="
                  (val) => {
                    remoteScreenStream = null;
                    recivingRemoteShare = false;
                  }
                "
              />
            </a-tab-pane>
            <a-tab-pane key="screen">
              <span slot="tab">
                <a-icon type="desktop" />
                画面共有
              </span>
              <ScreenShare
                :videoRoom.sync="videoRoom"
                :socket="socket"
                :recivingRemoteShare.sync="recivingRemoteShare"
                :remoteScreenStream.sync="remoteScreenStream"
              />
            </a-tab-pane>
            <a-tab-pane key="file">
              <span slot="tab">
                <a-icon type="folder-open" />
                ファイル共有
              </span>
              <UploadFile
                :groupId="groupId"
                :groupData="groupData"
                :socket="socket"
              />
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-col>
      <a-col :span="8">
        <a-row id="header-avatar">
          <a-col :span="18">
            <UserAvatar :name="groupData.user.name" />
            {{ groupData.user.name }}</a-col
          >
          <a-col :span="6">
            <a-button @click="logoutLogic">ログアウト</a-button>
          </a-col>
        </a-row>
        <MessageChat :groupId="groupId" :socket="socket" />
      </a-col>
    </a-row>
  </div>
</template>
<script>
import io from "socket.io-client";
import VideoChat from "@/components/VideoChat";
import ScreenShare from "@/components/ScreenShare";
import UploadFile from "@/components/UploadFile";
import MessageChat from "@/components/MessageChat";
import DrawPaint from "@/components/DrawPaint";
import UserAvatar from "@/components/UserAvatar.vue";

export default {
  layout: "GroupView",
  components: {
    VideoChat,
    ScreenShare,
    UploadFile,
    MessageChat,
    DrawPaint,
    UserAvatar,
  },
  async beforeDestroy() {
    await this.videoRoom.close();
  },
  mounted() {
    this.socket.on("connect", () => {
      if (this.groupData.group.groupCode) {
        this.socket.emit(
          "jion",
          { groupId: this.groupData.group.groupCode },
          (data) => {
            const { status, message, groupData } = data;
            if (status) {
              this.$message.success(
                `${this.groupData.group.subject.title}[${this.groupData.group.title}]に参加しました`
              );
            } else {
              this.$message.error(message);
            }
          }
        );
      }
    });

    this.socket.on("recive:uploadNotification", async (data) => {
      const { message } = data;
      await this.refreshGroupData();
      this.$notification.open({
        message: "通知",
        description: message,
        placement: "topRight",
      });
    });
  },
  data() {
    return {
      socket: io(process.env.baseUrl, {
        query: { token: this.$cookies.get("clientAccessToken") },
      }),
      groupId: this.$cookies.get("clientGroupCode"),
      videoRoom: {},
      remoteScreenStream: null,
      tabKey: "video",
      recivingRemoteShare: false,
    };
  },
  methods: {
    async refreshGroupData() {
      const { data } = await this.$nuxt.$axios
        .get(`/client/group`)
        .catch(() => {
          return redirect("/404");
        });
      this.groupData = data;
    },
    logoutLogic() {
      this.$confirm({
        title: "ログアウトしてよろしいでしょうか?",
        content: "このグループに再度アクセスができなくなります。",
        okText: "はい",
        cancelText: "いいえ",
        onOk: () => {
          this.$cookies.set("clientAccessToken", null);
          this.$cookies.set("groupId", null);
          this.$router.push("/thanks");
        },
      });
    },
  },
  async asyncData({ $axios, redirect }) {
    const { data } = await $axios.get(`/client/group`).catch(() => {
      return redirect("/404");
    });
    return { groupData: data };
  },
};
</script>

<style>
#header-avatar {
  margin: 0 4px 0 16px;
}
</style>