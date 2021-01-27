<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            placeholder="请输入角色名"
            clearable
            v-model="queryInfo.queryName"
            class="input-with-select"
            clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getRoleListData"></el-button>
          </el-input>
        </el-col>

        <el-col :span="6">
          <el-button @click="addDialog = true" type="primary">添加</el-button>
        </el-col>
      </el-row>

      <el-table :data="roleList" stripe border style="width: 100%">
        <el-table-column prop="roleName" label="角色名" align="center"></el-table-column>

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
      title="添加角色"
      custom-class="role-mask"
    >
      <el-row :gutter="15">
        <el-form
          :model="role"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="角色名" prop="roleName">
            <el-col :span="12">
              <el-input v-model="role.roleName"></el-input>
            </el-col>
          </el-form-item>
        </el-form>
      </el-row>
      <div slot="footer">
        <el-button type="danger" @click="close">取消</el-button>
        <el-button type="primary" @click="addRole">确定</el-button>
      </div>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog
      title="修改角色权限"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="updateDialogClose"
    >
      <span>
        <el-form :model="editForm" :rules="rules" ref="editFormRef" label-width="80px">
          <el-row>
            <el-col :span="10">
              <div class="grid-content bg-purple">
                <el-form-item label="角色名" prop="roleName" required>
                  <el-input v-model="editForm.roleName" :disabled="false"></el-input>
                  <el-input
                    type="hidden"
                    v-model="editForm.id"
                    :disabled="true"
                    style="display:none;"
                  ></el-input>
                </el-form-item>

                <el-form-item label="权限">
                  <el-tree
                    ref="tree"
                    :props="defaultProps"
                    :data="data"
                    :load="loadNode"
                    node-key="id"
                    lazy
                    show-checkbox
                    :default-expanded-keys="defaultCheckedKeys"
                    default-expand-all
                    @check-change="handleCheckChange"
                  >
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                      <span>
                        <i :class="data.icon"></i>
                        {{ node.label }}
                      </span>
                    </span>
                  </el-tree>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </span>

      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateRole" :loading="btnLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style >
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>

<script>
import { getSysRoleList } from "@/utils/api";
import { addSysRole } from "@/utils/api";
import { deleteSysRole } from "@/utils/api";
import { updateSysRoleStatus } from "@/utils/api";
import { getMenusByParentId } from "@/utils/api";
import { getMenuList } from "@/utils/api";

export default {
  data() {
    return {
      data: [],
      permisIdTemps: [],
      defaultCheckedKeys: [],
      defaultShowNodes: [], // 这里存放要默认展开的节点 id
      defaultProps: {
        label: "permissionName",
        id: "id"
      },
      btnLoading: false,
      queryInfo: {
        queryName: "",
        pageSize: 5,
        pageNum: 1
      },
      current: 1,
      roleList: [],
      total: 0,
      editDialogVisible: false,
      addDialog: false,
      role: {
        roleName: ""
      },
      editForm: {}, // 更新表单
      rules: {
        roleName: [{ required: true, message: "请输入角色名", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getRoleListData();
  },
  methods: {
    handleCheckChange(data, checked, indeterminate) {
      // this.editForm.permisIds();
      this.permisIdTemps.push(data.id);
      if (this.editForm.permisIds == null) {
        this.editForm.permisIds = [];
      }
      if (checked) {
        this.editForm.permisIds.push(data.id);
      } else {
        this.editForm.permisIds.splice(
          this.editForm.permisIds.indexOf(data.id.toString()),
          1
        );
      }
      console.log("Change,data", this.permisIdTemps);
    },
    getlist(permisIds) {
      getMenuList("1")
        .then(res => {
          this.data = this.arraytotree(res.data);
          this.data = res.data;
          //默认选中
          this.$refs.tree.setCheckedKeys(permisIds);
          // 默认展开
          this.defaultCheckedKeys = permisIds;
        })
        .catch(res => {});
    },
    handleNodeClick(data) {},

    //数组转化为树
    arraytotree(arr) {
      var top = [],
        sub = [],
        tempObj = {};

      arr.forEach(function(item) {
        if (item.parentId === null) {
          // 顶级分类
          top.push(item);
        } else {
          sub.push(item); // 其他分类
        }
        item.children = []; // 默然添加children属性
        tempObj[item.id] = item; // 用当前分类的id做key，存储在tempObj中
      });

      sub.forEach(function(item) {
        // 取父级
        var parent = tempObj[item.parentId] || { children: [] };
        // 把当前分类加入到父级的children中
        parent.children.push(item);
      });

      return top;
    },

    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([]);
      }
      // 判断是否含有下级
      var data = [];
      getMenusByParentId({ parentId: node.data.id })
        .then(res => {
          if (res.data.length > 0) {
            setTimeout(() => {
              for (var i = 0; i < res.data.length; i++) {
                var newObject = {};
                newObject.permissionName = res.data[i].permissionName;
                newObject.id = res.data[i].id;
                newObject.icon = res.data[i].icon;
                data.push(newObject);
              }
              resolve(data);
            }, 500);
          } else {
            data = [];
            resolve(data);
          }
        })
        .catch(res => {
          resolve([]);
        });
    },

    getRoleListData() {
      getSysRoleList(this.queryInfo).then(res => {
        if (res.success) {
          this.roleList = res.data.records;
          this.total = res.data.total;
          this.pageSize = 1;
        }
      });
    },

    handleEdit(index, row) {
      this.editDialogVisible = true;
      this.editForm = Object.assign({}, row);
      // 加载权限树
      this.getlist(this.editForm.permisIds);
    },

    handleSizeChange(val) {
      this.queryInfo.pageSize = val;
      this.queryInfo.pageNum = 1;
      this.getRoleListData();
    },
    handleCurrentChange(val) {
      this.queryInfo.pageNum = val;
      this.getRoleListData();
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
          this.getRoleListData();
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
              this.getRoleListData();
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
              this.getRoleListData();
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
              this.getRoleListData();
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