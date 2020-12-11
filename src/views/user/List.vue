<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            placeholder="请输入用户名或昵称"
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
        <el-table-column prop="name" label="用户名" align="center" width="70"></el-table-column>
        <el-table-column prop="nickname" align="center" label="昵称"></el-table-column>

        <el-table-column prop="del" label="状态" align="center" width="70">
          <template slot-scope="scope">
            <el-switch
              @change="changeStatus(scope.row)"
              v-model="scope.row.del==0"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="tel" label="手机号" align="center" width="155"></el-table-column>
        <el-table-column prop="birthdayStr" align="center" label="生日" width="130"></el-table-column>

        <el-table-column prop="sex" label="性别" align="center" width="60">
          <template slot-scope="scope">{{scope.row.sex==1?'男':(scope.row.sex==2?'女':'保密')}}</template>
        </el-table-column>

        <el-table-column align="center" prop="createTimeStr" label="创建时间" width="200"></el-table-column>
        <el-table-column align="center" prop="updateTimeStr" label="更新时间" width="200"></el-table-column>
        <el-table-column align="center" prop="password" label="密码"></el-table-column>

        <el-table-column align="center" fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>

            <el-tooltip effect="dark" content="删除" placement="top">
              <el-button size="mini" type="danger" @click="deleteDialog = true">删除</el-button>
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

    <!-- 删除 - 对话框 -->
    <el-dialog title="提示" :visible.sync="deleteDialog" width="30%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialog = false">取 消</el-button>
        <el-button type="primary" @click="deleteDialog = false">确 定</el-button>
      </span>
    </el-dialog>

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
          <el-form-item label="姓名" prop="name">
            <el-col :span="12">
              <el-input v-model="user.name"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="昵称" prop="nickname">
            <el-col :span="12">
              <el-input v-model="user.nickname"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="手机号" prop="tel" required>
            <el-col :span="12">
              <el-input v-model="user.tel"></el-input>
            </el-col>
          </el-form-item>

          <el-form-item label="性别" prop="sex" required>
            <el-radio-group v-model="user.sex">
              <el-radio label="1">男</el-radio>
              <el-radio label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="生日" required>
            <el-col :span="12">
              <el-form-item prop="birthday">
                <el-date-picker
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期"
                  v-model="user.birthday"
                  style="width: 100%;"
                ></el-date-picker>
              </el-form-item>
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
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editClose">
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
                <el-form-item label="用户名" prop="username" required>
                  <el-input v-model="editForm.name" :disabled="false"></el-input>
                  <el-input
                    type="hidden"
                    v-model="editForm.name"
                    :disabled="true"
                    style="display:none;"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <el-form-item label="密码" prop="username">
                  <el-input v-model="editForm.password" :disabled="true"></el-input>
                  <el-input
                    type="hidden"
                    v-model="editForm.id"
                    :disabled="true"
                    style="display:none;"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <div class="grid-content bg-purple">
                <el-form-item label="昵称" prop="nickname" required>
                  <el-input v-model="editForm.nickname"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <el-form-item label="性别" prop="sex">
                  <el-radio-group v-model="editForm.sex">
                    <el-radio :label="1">帅哥</el-radio>
                    <el-radio :label="0">美女</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
            </el-col>
          </el-row>

          <el-form-item label="手机号" prop="tel" required>
            <el-input v-model="editForm.tel"></el-input>
          </el-form-item>

          <el-form-item prop="birthday" label="生日">
            <el-col :span="11">
              <el-date-picker
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择出生日期"
                v-model="editForm.birthday"
                style="width: 100%;"
              ></el-date-picker>
            </el-col>
          </el-form-item>
        </el-form>
      </span>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="updateUser"
          :loading="btnLoading"
          :disabled="btnDisabled"
        >确 定</el-button>
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
import { getUserList } from "@/utils/api";
import { addUser } from "@/utils/api";

export default {
  data() {
    return {
      queryInfo: {
        queryName: "",
        pageSize: 5,
        pageNum: 1
      },
      current: 1,
      userList: [],
      total: 0,
      deleteDialog: false,
      editDialogVisible: false,
      addDialog: false,
      user: {
        name: "",
        birthday: "",
        nickname: "",
        tel: "",
        sex: ""
      },
      editForm: {}, // 更新表单
      rules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 2, max: 3, message: "长度在 2 到 3 个字符", trigger: "blur" }
        ],
        tel: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { min: 11, max: 11, message: "请输入11位手机号码", trigger: "blur" },
          {
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: "请输入正确的手机号码"
          }
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        birthday: [
          {
            type: "string",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ]
      }
    };
  },
  created() {
    this.getUserListData();
  },
  methods: {
    getUserListData() {
      getUserList(this.queryInfo).then(res => {
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
    changeStatus(userInfo) {
      this.$message.success("这是一条消息提示");
    },
    addDialogClose() {
      this.$refs["ruleForm"].resetFields();
      this.addDialog = false;
    },
    addUser() {
      this.$refs.ruleForm.validate(valid => {
        console.log("ruleForm: " + this.$refs.ruleForm);
        if (valid) {
          addUser(this.user).then(res => {
            this.$message.success("添加成功");
            this.addDialog = false;
            this.getUserListData();
          });
        } else {
          //未通过验证
          this.$message.error("添加失败");
        }
      });
    }
  }
};
</script>