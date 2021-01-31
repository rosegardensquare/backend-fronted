<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>前台</el-breadcrumb-item>
      <el-breadcrumb-item>图片管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-button @click="uploadDialog = true" type="primary">上传图片</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!--上传图片对话框 -->

    <el-dialog
      v-bind="$attrs"
      v-on="$listeners"
      :visible.sync="uploadDialog"
      @close="uploadDialogClose"
    >
      <el-upload
        :on-error="handleError"
        class="upload-demo"
        :file-list="fileList"
        drag
        :action="UploadUrl()"
        multiple
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
      <div slot="footer">
        <el-button @click="close">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
/* .el-upload-dragger {
  width: 719px;
} */

.el-dialog {
  width: 30%;
}
</style>

<script>
export default {
  data() {
    return {
      uploadDialog: false,
      fileList: []
    };
  },
  created() {},
  methods: {
    uploadDialogClose() {
      this.uploadDialog = false;
    },
    UploadUrl: function() {
      return "/pic/upload";
    },
    handleError(err, file, fileList) {
      this.$notify.error({
        title: "错误",
        message: `文件上传失败`
      });
    },
    close() {
      this.uploadDialog = false;
    }
  }
};
</script>