<template>
  <div id="subject-view">
    <a-layout>
      <a-layout-header><div class="title"></div></a-layout-header>
      <a-layout-content>
        <a-spin :spinning="waitting">
          <a-card class="form">
            <a-form-model
              :layout="vertical"
              :model="form"
              v-bind="formItemLayout"
            >
              <a-form-model-item label="サブジェクト">
                <a-tag>{{ subjectData.title }}</a-tag>
              </a-form-model-item>
              <a-form-model-item label="名前">
                <a-input
                  v-model="form.name"
                  placeholder="名前を入力してください"
                />
              </a-form-model-item>
              <a-form-model-item label="パスワード">
                <a-input
                  type="password"
                  v-model="form.password"
                  placeholder="サブジェクトのパスワードを入力してください"
                />
              </a-form-model-item>
              <a-form-model-item>
                <a-button type="primary" @click="jionSubject"> 参加 </a-button>
              </a-form-model-item>
            </a-form-model>
          </a-card>
        </a-spin>
      </a-layout-content>
      <a-layout-footer>iClass.buzz</a-layout-footer>
    </a-layout>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: "",
        password: "",
      },
      waitting: false,
      subjectId: null,
    };
  },
  mounted() {
    this.subjectId = this.$nuxt.$route.params.subjectId;
  },
  async asyncData({ params, $axios }) {
    const { data } = await $axios.get(
      `http://localhost:3000/client/subject/${params.subjectId}`
    );
    return { subjectData: data };
  },
  methods: {
    jionSubject() {
      this.waitting = true;
    },
  },
};
</script>

<style>
#subject-view > .ant-layout {
  height: 100vh;
}
#subject-view .title {
  width: 120px;
  height: 31px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px 24px 16px 0;
  float: left;
  color: #fff;
}

#subject-view .form {
  width: 60vw;
  margin: 5rem auto;
}
</style>