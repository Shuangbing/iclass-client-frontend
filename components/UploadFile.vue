<template>
  <div>
    <a-table :columns="columns" :data-source="data" rowKey="filename" >
      <a slot="filename" slot-scope="text">{{ text }}</a>
    </a-table>
    <a-upload
      name="file"
      :multiple="true"
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      @change="uploadFile"
    >
      <a-button> <a-icon type="upload" /> ファイルを選択してアップロード </a-button>
    </a-upload>
  </div>
</template>
<script>
const columns = [
  {
    title: "ファイル名",
    dataIndex: "filename",
    key: "filename",
    width: 200,
    scopedSlots: { customRender: "filename" },
  },
  {
    title: "サイズ",
    dataIndex: "size",
    key: "size",
    width: 100,
  },
  {
    title: "所有者",
    dataIndex: "owner",
    key: "owner",
    ellipsis: true,
  },
  {
    title: "有効期限",
    dataIndex: "expried",
    key: "expried",
    ellipsis: true,
  },
];

const data = [
  {
    filename: "Document 1.pdf",
    size: "1.2MB",
    owner: "Shuangbing He",
    expried: "72時間後",
  },
];

export default {
  data() {
    return {
      data,
      columns,
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
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        this.$message.success(`${info.file.name} file uploaded successfully`);
        this.data.push({
          filename: info.file.name,
          size: this.bytesToSize(info.file.size),
          owner: "Shuangbing He",
          expried: "72時間後",
        });
      } else if (info.file.status === "error") {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    },
  },
};
</script>