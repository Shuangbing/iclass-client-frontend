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
              :content="item.content"
              :datetime="moment(item.datetime).fromNow()"
              ><a-avatar
                slot="avatar"
                :style="
                  `backgroundColor:` + hashColorFromName(item.author || 'none')
                "
                icon="user"
              />
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
    hashColorFromName(name) {
      var hash = 0;
      if (name.length === 0) return hash;
      for (var i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
      }
      var color = "#";
      for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 255;
        color += ("00" + value.toString(16)).substr(-2);
      }
      return color;
    },
    handleSubmit() {
      if (!this.value || !this.value.match(/\S/g)) {
        return;
      }
      this.submitting = true;
      const sendMessage = {
        content: this.value,
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