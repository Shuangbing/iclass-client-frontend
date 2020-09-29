<template>
  <div>
    <a-row>
      <a-col :span="16">
        <div>
          <a-tabs default-active-key="1">
            <a-tab-pane key="1" tab="ビデオ通話"> ビデオ通話 </a-tab-pane>
            <a-tab-pane key="2" tab="画面共有" force-render>
              画面共有
            </a-tab-pane>
            <a-tab-pane key="3" tab="ファイル共有"> L </a-tab-pane>
          </a-tabs>
        </div>
      </a-col>
      <a-col :span="8">
        <div id="chat">
          <a-list
            class="chat-history"
            :bordered="true"
            :data-source="comments"
            :header="`${comments.length} メッセージ`"
            item-layout="horizontal"
          >
            <template v-slot:renderItem="item">
              <a-list-item>
                <a-comment
                  :author="item.author"
                  :avatar="item.avatar"
                  :content="item.content"
                  :datetime="item.datetime"
                />
              </a-list-item>
            </template>
          </a-list>
          <div class="chat-send">
            <a-spin :spinning="submitting">
              <a-textarea
                v-model="value"
                placeholder="Enterキーで送信する"
                rows="5"
                @keydown.enter.exact="handleSubmit"
              />
            </a-spin>
            <a-form-item>
              <a-button
                html-type="submit"
                :loading="submitting"
                type="primary"
                @click="handleSubmit"
              >
                送信
              </a-button>
            </a-form-item>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import moment from "moment";
import io from "socket.io-client";

export default {
  layout: "chat-view",
  data() {
    return {
      comments: [],
      submitting: false,
      value: "",
      moment,
      socket: "",
      groupId: null,
    };
  },
  mounted() {
    this.groupId = this.$nuxt.$route.params.groupId;

    this.socket = io("http://localhost:3000");
    this.socket.on("connect", () => {
      if (this.groupId) {
        this.socket.emit("jion", { groupId: this.$nuxt.$route.params.groupId });
      }
    });

    moment.locale("ja");
    this.comments = JSON.parse(sessionStorage.chatHistory ?? "[]");
  },
  methods: {
    handleSubmit() {
      if (!this.value) {
        return;
      }

      this.submitting = true;
      const message = {
        author: "Test User",
        avatar: "https://image.flaticon.com/icons/png/512/847/847969.png",
        content: this.value,
        datetime: moment().fromNow(),
      };
      setTimeout(() => {
        this.submitting = false;
        this.socket.emit("send:message", message);
        this.comments = [message, ...this.comments];
        sessionStorage.chatHistory = JSON.stringify(this.comments);
        this.value = "";
      }, 100);
    },
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
  height: 50vh;
  min-height: 50vh;

  overflow-y: scroll;
  overflow-wrap: break-word;
}
#chat .chat-send {
  margin-top: 1rem;
}
</style>