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

      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column prop="name" label="模块" width="180"></el-table-column>
        <el-table-column prop="images" label="图片" width="180">
          <template slot-scope="scope">
            <img :src="scope.row.src" style="width:100px;height:50px;" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="创建时间" width="180"></el-table-column>
        <el-table-column prop="number" label="状态" width="180"></el-table-column>
        <el-table-column prop="money" label="删除"></el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
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
        :on-success="handleAvatarSuccess"
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
      fileList: [],
      msg: "vue测试监听查询购物车数量以及金额变化",
      // input:'123'
      tableData: [
        {
          src:
            "https://backend-frontend.oss-cn-beijing.aliyuncs.com/01856e5fdf788411013ee04d5fd0df.jpg%402o.jpg",
          name: "苹果",
          number: 1
        },
        {
          src: "./static/images/车厘子.jpg",
          name: "车厘子",
          number: 2
        },
        {
          src: "./static/images/火龙果.jpg",
          name: "火龙果",
          number: 3
        },
        {
          src: "./static/images/百香果.jpg",
          name: "百香果",
          number: 4
        }
      ]
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

    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      //图片路径
      console.log("---");
      this.uploadDialog = false;
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