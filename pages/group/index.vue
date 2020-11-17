<template>
  <div>
    <a-row>
      <a-col :span="16">
        <div>
          <a-page-header
            :title="groupData.group.subject.title"
            :sub-title="groupData.group.title"
          />
          <a-tabs default-active-key="1">
            <a-tab-pane key="1" tab="ビデオ通話">
              <VideoChat :groupData="groupData" />
            </a-tab-pane>
            <a-tab-pane key="2" tab="画面共有" force-render>
              <ScreenShare />
            </a-tab-pane>
            <a-tab-pane key="3" tab="お絵かきボード">
              <DrawPaint />
            </a-tab-pane>
            <a-tab-pane key="4" tab="ファイル共有">
              <UploadFile :groupId="groupId" :groupData="groupData" />
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-col>
      <a-col :span="8">
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

export default {
  layout: "GroupView",
  components: {
    VideoChat,
    ScreenShare,
    UploadFile,
    MessageChat,
    DrawPaint,
  },
  data() {
    return {
      socket: io(process.env.baseUrl, {
        query: { token: this.$cookies.get("clientAccessToken") },
      }),
      groupId: this.$cookies.get("clientGroupCode"),
      groupData: {},
    };
  },
  async asyncData({ params, $axios }) {
    const { data } = await $axios.get(`/client/group`);
    return { groupData: data };
  },
};
</script>

<style>
#chat {
  margin-left: 1rem;
  height: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
}
#chat .chat-history {
  height: 80%;
  min-height: 50vh;
  max-height: 60vh;
  overflow-y: scroll;
  overflow-wrap: break-word;
}
#chat .chat-send {
  height: 20%;
  margin-top: 2rem;
}
</style>