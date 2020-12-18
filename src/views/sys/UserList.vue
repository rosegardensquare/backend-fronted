<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            placeholder="请输入用户名"
            clearable
            v-model="queryInfo.queryName"
            class="input-with-select"
            clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserListData"></el-button>
          </el-input>
        </el-col>

        <el-col :span="6">
          <el-button @click="addDialog = true" type="primary">添加</el-button>
        </el-col>
      </el-row>

      <el-table
        :data="userList"
        stripe
        border
        style="width: 100%"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      >
        <el-table-column prop="userName" label="用户名" align="center" width="70"></el-table-column>

        <el-table-column prop="del" label="可用状态" align="center" width="100">
          <template slot-scope="scope">
            <el-switch
              @change="changeStatus(scope.row.id, !scope.row.del)"
              v-model="scope.row.del==0"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="createTimeStr" label="创建时间" width="200"></el-table-column>
        <el-table-column align="center" prop="updateTimeStr" label="更新时间" width="200"></el-table-column>
        <el-table-column align="center" prop="passWord" label="密码"></el-table-column>

        <el-table-column align="center" fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>

            <el-tooltip effect="dark" content="删除" placement="top">
              <el-button size="mini" type="danger" @click="remove(scope.row.id)">删除</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="current"
        :page-sizes="[2, 5, 300, 400]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加 - 对话框 -->

    <el-dialog
      v-bind="$attrs"
      v-on="$listeners"
      :visible.sync="addDialog"
      @close="addDialogClose"
      title="添加用户"
    >
      <el-row :gutter="15">
        <el-form
          :model="user"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="姓名" prop="userName">
            <el-col :span="12">
              <el-input v-model="user.userName"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="密码" prop="passWord">
            <el-col :span="12">
              <el-input v-model="user.passWord"></el-input>
            </el-col>
          </el-form-item>
        </el-form>
      </el-row>
      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="addUser">确定</el-button>
      </div>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="updateDialogClose"
    >
      <span>
        <el-form
          :model="editForm"
          :label-position="labelPosition"
          :rules="rules"
          ref="editFormRef"
          label-width="80px"
        >
          <el-row>
            <el-col :span="10">
              <div class="grid-content bg-purple">
                <el-form-item label="用户名" prop="userName" required>
                  <el-input v-model="editForm.userName" :disabled="false"></el-input>
                  <el-input
                    type="hidden"
                    v-model="editForm.id"
                    :disabled="true"
                    style="display:none;"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <el-form-item label="密码" prop="passWord">
                  <el-input v-model="editForm.passWord"></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </span>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUser" :loading="btnLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>

<script>
import { getSysUserList } from "@/utils/api";
import { addSysUser } from "@/utils/api";
import { deleteUser } from "@/utils/api";
import { updateUserStatus } from "@/utils/api";

export default {
  data() {
    return {
      btnLoading: false,
      queryInfo: {
        queryName: "",
        pageSize: 5,
        pageNum: 1
      },
      current: 1,
      userList: [],
      total: 0,
      editDialogVisible: false,
      addDialog: false,
      user: {
        userName: "",
        tel: ""
      },
      editForm: {}, // 更新表单
      rules: {
        userName: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 2, max: 3, message: "长度在 2 到 3 个字符", trigger: "blur" }
        ],
        passWord: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 6, message: "长度在 6 位数字", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getUserListData();
  },
  methods: {
    getUserListData() {
      getSysUserList(this.queryInfo).then(res => {
        if (res.success) {
          this.userList = res.data.records;
          this.total = res.data.total;
          this.pageSize = 1;
        }
      });
    },

    handleEdit(index, row) {
      this.editDialogVisible = true;
      this.editForm = Object.assign({}, row);
    },

    handleSizeChange(val) {
      this.queryInfo.pageSize = val;
      this.queryInfo.pageNum = 1;
      this.getUserListData();
    },
    handleCurrentChange(val) {
      this.queryInfo.pageNum = val;
      this.getUserListData();
    },

    close() {
      this.$refs["ruleForm"].resetFields();
      this.addDialog = false;
    },
    changeStatus(id, del) {
      updateUserStatus({
        id: id,
        del: del
      }).then(res => {
        if (res.success) {
          this.$message({
            type: "success",
            message: "修改成功!"
          });
          this.getUserListData();
        } else {
          this.$message.error("修改失败");
        }
      });
    },
    addDialogClose() {
      this.$refs["ruleForm"].resetFields();
      this.addDialog = false;
    },
    updateDialogClose() {
      this.$refs["editFormRef"].resetFields();
      this.editDialogVisible = false;
    },
    addUser() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          addSysUser(this.user).then(res => {
            if (res.success) {
              this.$message.success("编辑成功");
              this.addDialog = false;
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
    updateUser() {
      this.loading = true;
      this.$refs.editFormRef.validate(valid => {
        if (valid) {
          addUser(this.editForm).then(res => {
            this.loading = false;
            if (res.success) {
              this.$message.success("编辑成功");
              this.editDialogVisible = false;
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

    remove(id) {
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteUser({ id: id }).then(res => {
            if (res.success) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getUserListData();
            } else {
              this.$message.error("删除失败");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>