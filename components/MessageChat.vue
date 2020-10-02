<template>
  <div id="chat">
    <a-spin :spinning="connecting">
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
              :datetime="moment(item.datetime).fromNow()"
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
    </a-spin>
  </div>
</template>

<script>
import moment from "moment";

export default {
  props: {
    socket: Object,
    groupId: String,
  },
  data() {
    return {
      comments: [],
      submitting: false,
      connecting: true,
      value: "",
      moment,
    };
  },
  mounted() {
    this.socket.on("connect", () => {
      if (this.groupId) {
        this.socket.emit(
          "jion",
          { groupId: this.$nuxt.$route.params.groupId },
          (data) => {
            const { status, message, groupData } = data;
            if (status) {
              this.$message.success(
                `${groupData.subject.title}[${groupData.title}]に参加しました`
              );
              this.connecting = false;
            } else {
              this.$message.error(message);
            }
          }
        );
      }
    });

    this.socket.on("recive:message", (data) => {
      this.comments = [data, ...this.comments];
      sessionStorage.chatHistory = JSON.stringify(this.comments);
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
      const sendMessage = {
        author: "Test User",
        avatar: "https://image.flaticon.com/icons/png/512/847/847969.png",
        content: this.value,
        datetime: new Date(),
        groupId: this.groupId,
      };
      setTimeout(() => {
        this.submitting = false;
        this.socket.emit("send:message", sendMessage, (data) => {
          const { status, message } = data;
          if (status) {
            this.value = "";
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
</style>