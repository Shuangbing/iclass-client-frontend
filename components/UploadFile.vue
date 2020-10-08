<template>
  <div>
    <a-table :columns="columns" :data-source="data" rowKey="id">
      <a target="_blank" slot="filename" slot-scope="file" :href="file.location"
        >{{ file.filename }}
      </a>
      <span slot="expiredAt" slot-scope="date">{{
        moment(date).fromNow()
      }}</span>
      <span slot="size" slot-scope="size">{{ bytesToSize(size) }}</span>
    </a-table>
    <a-upload
      name="file"
      :multiple="false"
      :headers="{
        Authorization: `Bearer ${$cookies.get('clientAccessToken')}`,
      }"
      :action="`${$axios.defaults.baseURL}/client/group/${groupId}/upload`"
      @change="uploadFile"
    >
      <a-button>
        <a-icon type="upload" /> ファイルを選択してアップロード
      </a-button>
    </a-upload>
  </div>
</template>
<script>
import moment from "moment";

const columns = [
  {
    title: "ファイル名",
    width: 200,
    scopedSlots: { customRender: "filename" },
  },
  {
    title: "サイズ",
    dataIndex: "size",
    key: "size",
    width: 100,
    scopedSlots: { customRender: "size" },
  },
  {
    title: "所有者",
    dataIndex: "memberName",
    key: "memberName",
    ellipsis: true,
  },
  {
    title: "有効期限",
    dataIndex: "expiredAt",
    key: "expiredAt",
    ellipsis: true,
    scopedSlots: { customRender: "expiredAt" },
  },
];

export default {
  props: {
    groupId: String,
    groupData: Object,
  },
  data() {
    return {
      data: [],
      columns,
      moment,
    };
  },
  mounted() {
    this.data = this.groupData.group.files;
  },
  methods: {
    bytesToSize(bytes) {
      var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
      if (bytes == 0) return "0 Byte";
      var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
    },
    uploadFile(info) {
      if (info.file.status === "done") {
        this.$message.success(`${info.file.name} アップロードしました`);
        this.data.push(info.file.response);
      } else if (info.file.status === "error") {
        this.$message.error(`${info.file.name} できませんでした`);
      }
    },
  },
};
</script>