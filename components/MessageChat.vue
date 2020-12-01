<template>
  <div id="chat">
    <a-spin :spinning="connecting">
      <a-list
        class="chat-history"
        :bordered="true"
        :data-source="comments"
        :header="`${comments.length} メッセージ`"
        item-layout="horizontal"
        :locale="locale"
      >
        <template v-slot:renderItem="item">
          <a-list-item>
            <a-comment
              :author="item.author"
              :content="item.content"
              :datetime="moment(item.datetime).fromNow()"
            >
              <UserAvatar slot="avatar" :name="item.author" />
            </a-comment>
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
    </a-spin>
  </div>
</template>

<script>
import moment from "moment";
import UserAvatar from "@/components/UserAvatar.vue";

export default {
  props: {
    socket: Object,
    groupId: String,
  },
  components: {
    UserAvatar,
  },
  data() {
    return {
      comments: [],
      submitting: false,
      connecting: false,
      value: "",
      moment,
      locale: {
        emptyText: "メッセージがありません",
      },
    };
  },
  mounted() {
    this.socket.on("recive:message", (data) => {
      this.comments = [data, ...this.comments];
      sessionStorage.chatHistory = JSON.stringify(this.comments);
    });
    moment.locale("ja");
    this.comments = JSON.parse(sessionStorage.chatHistory ?? "[]");
  },
  methods: {
    handleSubmit() {
      const messageText = this.value;
      this.value = "";
      if (!messageText || !messageText.match(/\S/g)) {
        return;
      }
      this.submitting = true;
      const sendMessage = {
        content: messageText,
        groupId: this.groupId,
      };
      setTimeout(() => {
        this.submitting = false;
        this.socket.emit("send:message", sendMessage, (data) => {
          const { status, message } = data;
          if (status) {
            messageText = "";
          } else {
            this.$message.info(message);
          }
        });
      }, 100);
    },
  },
};
</script>

<style>
#chat {
  min-width: 250px;
  max-width: 500px;
  margin: 2rem auto 0 1rem;
}
#chat .chat-history {
  height: 600px;
  overflow-y: scroll;
  overflow-wrap: break-word;
}
#chat .chat-send {
  height: 20%;
  margin-top: 2rem;
}
</style>