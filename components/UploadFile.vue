<template>
  <div>
    <a-alert
      message="サポートしているファイルのフォーマット10MB以内の[*.pdf, *.jpg, *.gif, *.png]"
      type="info"
      style="margin-bottom: 1rem"
      show-icon
    />
    <a-table
      :columns="columns"
      :data-source="groupData.group.files"
      rowKey="id"
      :locale="locale"
    >
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
      <a-button style="margin-top: 1rem">
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
    socket: Object,
    groupId: String,
    groupData: Object,
  },
  data() {
    return {
      columns,
      moment,
      locale: {
        emptyText: "ファイルがありません",
      },
    };
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
        this.groupData.group.files.push(info.file.response);
        this.uploadSuccess(info);
      } else if (info.file.status === "error") {
        this.$message.error(`${info.file.name} できませんでした`);
      }
    },
    uploadSuccess(info) {
      this.socket.emit("send:uploaded", { fileInfo: info.file });
    },
  },
};
</script>