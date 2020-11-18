<template>
  <div id="subject-view">
    <a-layout>
      <Header />
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
            <a-progress
              :percent="percent"
              status="active"
              :showInfo="false"
              :style="{ margin: '1rem 0' }"
            />
            <a-list-item>
              <a-list-item-meta>
                <a-avatar
                  slot="avatar"
                  style="backgroundcolor: #87d068"
                  icon="user"
                />
                <h2 slot="title">{{ this.form.name }}</h2>
              </a-list-item-meta>
            </a-list-item>
            <a-list-item v-if="memberSelf.prepGroupMember">
              <a-list-item-meta>
                <a-avatar
                  slot="avatar"
                  style="backgroundcolor: #87d068"
                  icon="user"
                />
                <h2 slot="title">{{ memberSelf.prepGroupMember.name }}</h2>
              </a-list-item-meta>
            </a-list-item>
            <a-divider dashed />
            <a-list
              item-layout="horizontal"
              :data-source="waittingMember"
              :split="false"
              :locale="locale"
            >
              <a-list-item slot-scope="item" slot="renderItem">
                <a-list-item-meta>
                  <a-avatar
                    slot="avatar"
                    style="backgroundcolor: #87d068"
                    icon="user"
                  />
                  <a slot="title">{{ item.name }}</a>
                </a-list-item-meta>
                <div v-if="!item.isSelf">
                  <div v-show="!item.prepGroupMember">
                    <a-button
                      type="primary"
                      @click="invitationMember(item.memberCode)"
                    >
                      招待
                    </a-button>
                  </div>
                  <div v-show="item.prepGroupMember">
                    <a-tag color="cyan"> 予備編成 </a-tag>
                  </div>
                </div>
              </a-list-item>
            </a-list>
          </div>
        </a-card>
      </a-layout-content>
    </a-layout>
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
export default {
  components: {
    Header,
  },
  data() {
    return {
      form: {
        name: "",
        password: "",
      },
      memberSelf: {},
      waitting: false,
      subjectId: null,
      hasPasswordquery: false,
      step: 0,
      waittingMember: [],
      waittingInterval: null,
      percent: 0,
      locale: {
        emptyText: "他のメンバーがいません",
      },
    };
  },
  mounted() {
    this.subjectId = this.$nuxt.$route.params.subjectId;
    if (this.$nuxt.$route.query.p) {
      this.hasPasswordquery = true;
      this.form.password = this.$nuxt.$route.query.p;
    }
    if (
      this.$cookies.get("clientAccessToken") &&
      this.subjectId ==
        this.getTokenPayload(this.$cookies.get("clientAccessToken")).subjectCode
    ) {
      this.$confirm({
        title: "すでに参加しているサブジェクトです。",
        content: "継続してこのサブジェクトに参加しますか？",
        okText: "はい",
        cancelText: "いいえ",
        onOk: () => {
          this.startWaitJionGroup();
        },
      });
    }
  },
  beforeDestroy() {
    clearInterval(this.waittingInterval);
  },
  async asyncData({ params, $axios, redirect }) {
    const { data } = await $axios
      .get(`/client/subject/${params.subjectId}`)
      .catch(() => {
        return redirect("/404");
      });
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
        .then((result) => {
          this.$cookies.set("clientAccessToken", result.data.access_token);
          this.$cookies.set("groupId", null);
          this.startWaitJionGroup();
        });
    },
    startWaitJionGroup() {
      this.step = 1;
      this.waitting = true;
      this.form.name = this.getTokenPayload(
        this.$cookies.get("clientAccessToken")
      ).name;
      this.waittingInterval = setInterval(async () => {
        this.percent >= 100
          ? await this.refreshWaittingMember()
          : (this.percent += 20);
      }, 1000);
    },
    async refreshWaittingMember() {
      this.percent = 0;
      const members = await this.$nuxt.$axios
        .get("/client/subject/waitting")
        .then(async (result) => {
          this.memberSelf = result.data.self;
          this.waittingMember = result.data.members.filter(
            (member) => member.memberCode != this.memberSelf.memberCode
          );
          if (this.memberSelf.prepGroupMember) {
            this.waittingMember = this.waittingMember.filter(
              (member) =>
                member.memberCode != this.memberSelf.prepGroupMember.memberCode
            );
          }
          if (this.memberSelf.group) {
            clearInterval(this.waittingInterval);
            await this.fetchNewGroupToken();
          }
        });
    },
    async fetchNewGroupToken() {
      await this.$nuxt.$axios.post("/client/group/token").then((result) => {
        this.step = 3;
        this.waitting = false;
        this.$cookies.set("clientAccessToken", result.data.access_token);
        this.$cookies.set("clientGroupCode", result.data.groupCode);
        this.$nuxt.$router.push("/group");
      });
    },
    async invitationMember(memberCode) {
      await this.$nuxt.$axios
        .post(`/client/member/prep/${memberCode}`)
        .then((result) => {
          this.memberSelf["prepGroupMember"] = this.waittingMember.find(
            (member) => member.memberCode == memberCode
          );
          this.waittingMember = this.waittingMember.filter(
            (member) => member.memberCode != memberCode
          );
        });
    },
    getTokenPayload(token) {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(decodeURIComponent(escape(window.atob(base64))));
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