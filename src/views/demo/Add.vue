<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品添加</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="queryInfo.query"
            class="input-with-select"
            clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
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
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="date" label="日期" width="180"></el-table-column>
        <el-table-column prop="name" label="姓名" width="180"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-switch
              @change="changeStatus(scope.row)"
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
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
        :current-page="queryInfo.pageNum"
        :page-sizes="[1, 2, 5, 100]"
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
    <el-dialog title="添加用户" :visible.sync="addDialog" width="50%" @close="addDialogClose">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        label-position="left"
        status-icon
      >
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>

        <el-form-item label="活动类型" prop="type">
          <el-input v-model="ruleForm.type"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
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

export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pageNum: 1,
        pageSize: 2
      },
      userList: [],
      total: 0,
      deleteDialog: false,
      addDialog: false,
      ruleForm: {
        name: "",
        type: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        type: [
          { required: true, message: "请输入活动类型", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    getUserList() {
      getUserList(this.queryInfo).then(res => {
        console.log("------" + this.queryInfo.pageSize);
        this.userList = res.tableData;
        this.total = res.total;
      });
    },

    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.queryInfo.pageSize = val;
      this.getUserList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.queryInfo.pageSize = val;
      this.getUserList();
    },
    changeStatus(userInfo) {
      console.log(`userInfo:`, userInfo);
      this.$message.success("这是一条消息提示");
    },
    addDialogClose() {
      this.$refs.ruleForm.resetFields();
    },
    addUser() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$message.success("添加成功");
          this.addDialog = false;
          this.getUserList;
        } else {
          //未通过验证
          this.$message.error("添加失败");
        }
      });
    }
  }
};
</script>