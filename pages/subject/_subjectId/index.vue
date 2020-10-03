<template>
  <div id="subject-view">
    <a-layout>
      <a-layout-header><div class="title"></div></a-layout-header>
      <a-layout-content>
        <a-card class="form">
          <a-steps class="step" size="small" :current="step">
            <a-step title="参加" />
            <a-step title="グルーピング" />
            <a-step title="グループワーク" />
          </a-steps>
          <div v-if="step == 0">
            <a-form-model :model="form">
              <a-form-model-item label="サブジェクト">
                <a-page-header
                  :title="subjectData.title"
                  :sub-title="subjectData.description"
                />
              </a-form-model-item>
              <a-form-model-item label="名前">
                <a-input
                  v-model="form.name"
                  placeholder="名前を入力してください"
                />
              </a-form-model-item>
              <a-form-model-item label="パスワード" v-show="!hasPasswordquery">
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
          </div>
          <div v-if="step == 1">
            <a-list item-layout="horizontal" :data-source="waittingMember">
              <a-list-item slot="renderItem" slot-scope="item">
                <a-list-item-meta description="グルーピング待ち中">
                  <a-avatar
                    slot="avatar"
                    style="backgroundcolor: #87d068"
                    icon="user"
                  />
                  <a slot="title">{{ item.name }}</a>
                </a-list-item-meta>
                <div v-if="!item.isSelf">
                  <a slot="actions">招待</a>
                  <a slot="actions">ブロック</a>
                </div>
              </a-list-item>
            </a-list>
          </div>
          <div class="waitting" v-if="waitting">
            <a-spin />
          </div>
        </a-card>
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
      hasPasswordquery: false,
      step: 0,
      waittingMember: [
        {
          name: "都市大太郎",
          isSelf: false,
        },
      ],
    };
  },
  mounted() {
    this.subjectId = this.$nuxt.$route.params.subjectId;
    if (this.$nuxt.$route.query.p) {
      this.hasPasswordquery = true;
      this.form.password = this.$nuxt.$route.query.p;
    }
  },
  async asyncData({ params, $axios }) {
    const { data } = await $axios.get(
      `/client/subject/${params.subjectId}`
    );
    return { subjectData: data };
  },
  methods: {
    async jionSubject() {
      const jionSubjectData = {
        subjectCode: this.subjectId,
        password: this.form.password,
        name: this.form.name,
      };
      await this.$nuxt.$axios
        .post("/client/subject/jion", jionSubjectData)
        .then((data) => {
          this.step = 1;
          this.waitting = true;
          this.waittingMember.push({ name: this.form.name, isSelf: true });
          setTimeout(() => {
            this.waitting = false;
            this.$nuxt.$router.push(`/group/${data.data.data.groupId}`);
          }, 7000);
        })
        .catch((error) => {
          this.password = "";
        });
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
  min-width: 500px;
  max-width: 900px;
  width: 60vw;
  margin: 5rem auto;
}

#subject-view .step {
  margin-bottom: 1rem;
}

#subject-view .waitting {
  text-align: center;
}
</style>