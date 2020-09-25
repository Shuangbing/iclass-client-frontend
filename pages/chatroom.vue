<template>
  <div>
    <a-row>
      <a-col :span="16">
        <div>
          <a-tabs default-active-key="1" @change="callback">
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
            <a-mentions
              v-model="value"
              @change="onChange"
              @select="onSelect"
              rows="5"
              @keyup.enter="handleSubmit"
            >
              <a-mentions-option value="afc163"> afc163 </a-mentions-option>
              <a-mentions-option value="zombieJ"> zombieJ </a-mentions-option>
              <a-mentions-option value="yesmeck"> yesmeck </a-mentions-option>
            </a-mentions>
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
export default {
  layout: "chat-view",
  data() {
    return {
      comments: [],
      submitting: false,
      value: "",
      moment,
    };
  },
  mounted() {
    moment.locale("ja");
  },
  methods: {
    handleSubmit() {
      if (!this.value) {
        return;
      }

      this.submitting = true;

      setTimeout(() => {
        this.submitting = false;
        this.comments = [
          {
            author: "Test User",
            avatar: "https://image.flaticon.com/icons/png/512/847/847969.png",
            content: this.value,
            datetime: moment().fromNow(),
          },
          ...this.comments,
        ];
        this.value = "";
      }, 500);
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
  overflow-x: hidden;
  overflow-y: scroll;
}
#chat .chat-send {
  margin-top: 1rem;
}
</style>