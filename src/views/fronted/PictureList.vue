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
          <el-button @click="addPic()" type="primary">添加</el-button>
        </el-col>
      </el-row>

      <el-table :data="picList" stripe border style="width: 100%">
        <el-table-column prop="type" label="模块" width="180"></el-table-column>
        <el-table-column prop="images" label="图片" width="180">
          <template slot-scope="scope">
            <el-image
              :src="scope.row.metavalue"
              :preview-src-list="srcList"
              style="width:100px;height:50px;"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTimeStr" label="创建时间" width="180"></el-table-column>
        <el-table-column prop="del" label="状态" width="180">
          <template slot-scope="scope">
            <el-switch
              @change="changeStatus(scope.row.id, !scope.row.del)"
              v-model="scope.row.del==0"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
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

    <!-- 添加 - 对话框 -->
    <el-dialog
      v-bind="$attrs"
      v-on="$listeners"
      :visible.sync="addPicDialog"
      @close="addPicDialogClose"
      title="添加照片"
      custom-class="role-mask"
    >
      <el-row :gutter="15">
        <el-form
          :model="pic"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="类型" prop="picType">
            <el-col :span="12">
              <el-select v-model="pic.picType" placeholder="请选择">
                <el-option
                  v-for="item in picOptions"
                  :key="item.id"
                  :label="item.picType"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-col>
          </el-form-item>

          <el-form-item label="图片" prop="picUrl">
            <el-col :span="12">
              <el-button @click="uploadDialog = true" type="primary">上传图片</el-button>
            </el-col>
          </el-form-item>
        </el-form>
      </el-row>

      <div slot="footer">
        <el-button @click="closePic">取消</el-button>
        <el-button type="primary" @click="addPicHandle">确定</el-button>
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
import { addPic } from "@/utils/api";
import { getPicList } from "@/utils/api";

export default {
  data() {
    return {
      queryInfo: {
        queryName: "",
        pageSize: 5,
        pageNum: 1
      },
      addPicDialog: false,
      uploadDialog: false,
      fileList: [],
      total: 0,
      pic: {
        picType: "",
        picUrl: ""
      },
      rules: {
        picType: [{ required: true, message: "请选择类型", trigger: "blur" }],

        picUrl: [{ required: true, message: "请上传图片", trigger: "blur" }]
      },
      // input:'123'
      picList: [],
      srcList: [
        "http://picture1.yidianchina.com/assets/upload/auctionsite/e52f4b1ad685d0d63fdaa613e0e14b43.jpg",
        "https://backend-frontend.oss-cn-beijing.aliyuncs.com/01856e5fdf788411013ee04d5fd0df.jpg@2o.jpg"
      ],
      picOptions: [
        {
          picType: "轮播",
          id: "1"
        },
        {
          picType: "首页列表",
          id: "2"
        }
      ]
    };
  },
  created() {
    this.getPicListData();
  },
  methods: {
    getPicListData() {
      getPicList(this.queryInfo).then(res => {
        if (res.success) {
          this.picList = res.data.records;
          this.total = res.data.total;
          this.pageSize = 1;
        }
      });
    },
    closePic() {
      this.$refs["ruleForm"].resetFields();
      this.addPicDialog = false;
    },
    addPicHandle() {
      this.$refs.ruleForm.validate(valid => {
        console.log(this.pic);
        //return;
        if (valid) {
          addPic(this.pic).then(res => {
            if (res.success) {
              this.$message.success("编辑成功");
              this.addPicDialog = false;
              this.getUserListData();
            } else {
              this.$message.error("编辑失败");
            }
          });
        } else {
          //未通过验证
          this.$message.error("验证失败");
        }
      });
    },

    addPicDialogClose() {
      this.$refs["ruleForm"].resetFields();
      this.addPicDialog = false;
    },
    addPic() {
      this.addPicDialog = true;
    },
    uploadDialogClose() {
      this.uploadDialog = false;
    },
    UploadUrl: function() {
      return "/pic/upload";
    },

    handleAvatarSuccess(res, file) {
      this.pic.picUrl = res.data;
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