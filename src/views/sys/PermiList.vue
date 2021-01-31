<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <div class="block">
        <el-tree
          class="treeitems"
          :data="permiTreesData"
          node-key="id"
          default-expand-all
          :props="defaultProps"
          :expand-on-click-node="false"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <el-button type="text" size="mini" @click="() => append(data)">增加</el-button>
              <el-button
                v-if="data.id !== 0"
                type="text"
                size="mini"
                @click="() => removeTree(node, data)"
              >删除</el-button>

              <el-button
                v-if="data.id !== 0"
                type="text"
                size="mini"
                @click="() => editTree(node, data)"
              >编辑</el-button>
            </span>
          </span>
        </el-tree>
      </div>
    </el-card>

    <!-- 添加 - 对话框 -->

    <el-dialog
      v-bind="$attrs"
      v-on="$listeners"
      :visible.sync="addDialog"
      @close="addDialogClose"
      title="添加权限名"
    >
      <el-row :gutter="15">
        <el-form
          :model="role"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="权限名" prop="roleName">
            <el-col :span="12">
              <el-input v-model="role.roleName"></el-input>
            </el-col>
          </el-form-item>
        </el-form>
      </el-row>
      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="addRole">确定</el-button>
      </div>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog
      title="修改权限"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="updateDialogClose"
    >
      <span>
        <el-form :model="editForm" :rules="rules" ref="editFormRef" label-width="80px">
          <el-row>
            <el-col :span="10">
              <div class="grid-content bg-purple">
                <el-form-item label="权限名" prop="roleName" required>
                  <el-input v-model="editForm.roleName" :disabled="false"></el-input>
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
        </el-form>
      </span>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateRole" :loading="btnLoading">确 定</el-button>
      </span>
    </el-dialog>

    <!--新增子权限对话框-->
    <el-dialog
      title="新增子权限"
      :visible.sync="addTreeDialogVisible"
      width="30%"
      custom-class="role-mask"
    >
      <span>
        <el-form ref="form" :model="addTreeForm" label-width="80px">
          <el-form-item label="权限名称">
            <el-input v-model="addTreeForm.name"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addTreeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addPermiHandler">确 定</el-button>
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

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>

<script>
import { getSysPermiList } from "@/utils/api";
import { addSysRole } from "@/utils/api";
import { deleteSysRole } from "@/utils/api";
import { updateSysRoleStatus } from "@/utils/api";
import { getRoles } from "@/utils/api";
import { getMenuList } from "@/utils/api";
import { addPermi } from "@/utils/api";

let id = 1000;
export default {
  name: "Permi",

  data() {
    return {
      // 转换权限树显示的名字对应接口返回权限的名字
      defaultProps: {
        label: "permissionName",
        id: "id"
      },
      // 权限树数据
      permiTreesData: [],
      //选择的权限
      selectedTreeData: {},

      btnLoading: false,
      permiList: [],
      editDialogVisible: false,
      addTreeDialogVisible: false,
      addTreeForm: {
        name: ""
      },
      addDialog: false,
      role: {
        roleName: ""
      },
      editForm: {}, // 更新表单
      rules: {
        roleName: [{ required: true, message: "请输入权限名", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getSysPermiTree();
  },
  methods: {
    // 加载权限树
    getSysPermiTree() {
      getMenuList({ ignoreRole: true })
        .then(res => {
          this.permiTreesData = this.arraytotree(res.data);
        })
        .catch(res => {});
    },

    //数组转化为树
    arraytotree(arr) {
      var globalTree = [],
        top = {};
      top.id = 0;
      top.permissionName = "根菜单";
      top.children = arr;
      globalTree.push(top);
      return globalTree;
    },

    append(data) {
      this.selectedTreeData = data;
      // const newChild = { id: id++, permissionName: "testtest", children: [] };
      // if (!data.children) {
      //   this.$set(data, "children", []);
      // }
      // data.children.push(newChild);
      this.addTreeDialogVisible = true;
    },

    addPermiHandler() {
      const newChild = {
        id: "",
        permissionName: this.addTreeForm.name,
        children: [],
        parentId: this.selectedTreeData.id == 0 ? "" : this.selectedTreeData.id
      };
      if (!this.selectedTreeData.children) {
        this.$set(this.selectedTreeData, "children", []);
      }
      this.selectedTreeData.children.push(newChild);
      console.log(this.selectedTreeData);
      // TODO 更新数据库

      addPermi(newChild).then(res => {
        if (res.success) {
          this.$message.success("编辑成功");
          this.addTreeDialogVisible = false;
          // 刷新页面
          this.getSysPermiTree();
        } else {
          this.$message.error("编辑失败");
        }
      });
    },

    removeTree(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },

    editTree(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },

    getSysPermiList() {
      // 获取角色 => permiTreesData
      getRoles().then(res => {
        if (res.success) {
          this.roleOptions = res.data;
        }
      });
    },
    getPermiListData() {
      getSysPermiList(this.queryInfo).then(res => {
        if (res.success) {
          this.permiList = res.data.records;
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
      this.getPermiListData();
    },
    handleCurrentChange(val) {
      this.queryInfo.pageNum = val;
      this.getPermiListData();
    },

    close() {
      this.$refs["ruleForm"].resetFields();
      this.addDialog = false;
    },
    changeStatus(id, del) {
      updateSysRoleStatus({
        id: id,
        del: del
      }).then(res => {
        if (res.success) {
          this.$message({
            type: "success",
            message: "修改成功!"
          });
          this.getPermiListData();
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
    addRole() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          addSysRole(this.role).then(res => {
            if (res.success) {
              this.$message.success("编辑成功");
              this.addDialog = false;
              this.getPermiListData();
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
    updateRole() {
      this.loading = true;
      this.$refs.editFormRef.validate(valid => {
        if (valid) {
          addSysRole(this.editForm).then(res => {
            this.loading = false;
            if (res.success) {
              this.$message.success("编辑成功");
              this.editDialogVisible = false;
              this.getPermiListData();
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
          deleteSysRole({ id: id }).then(res => {
            if (res.success) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getPermiListData();
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