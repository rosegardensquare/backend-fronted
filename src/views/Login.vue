<template>
  <div>
    <el-form ref="loginForm" :model="form" :rules="rules" label-width="80px" class="login-box">
      <h3 class="login-title">欢迎登录</h3>
      <el-form-item label="账号" prop="userName">
        <el-input type="text" placeholder="请输入账号" v-model="form.userName" />
      </el-form-item>
      <el-form-item label="密码" prop="passWord">
        <el-input type="passWord" placeholder="请输入密码" v-model="form.passWord" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-on:click="onSubmit()">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login } from "@/utils/api";

export default {
  data() {
    return {
      form: {
        userName: "",
        passWord: ""
      },
      rules: {
        userName: [
          { required: true, message: "账号不可为空", trigger: "blur" }
        ],
        passWord: [{ required: true, message: "密码不可为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    onSubmit() {
      // 为表单绑定验证功能
      this.$refs.loginForm.validate(valid => {
        this.$store.commit("ADD_COUNT", this.form.userName);
        //this.$router.push({ path: "/main" }); // 页面跳转

        if (valid) {
          console.log("输入框的 userName : " + this.form.userName);
          //通过验证
          login(this.form).then(res => {
            console.log("------" + res.data);

            var json = res.status;
            this.$store.commit("ADD_COUNT", json);
            this.$router.push({ path: "/main" }); // 页面跳转
          });
        } else {
          //未通过验证
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.login-box {
  border: 1px solid #dcdfe6;
  width: 350px;
  margin: 180px auto;
  padding: 35px 35px 15px 35px;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  box-shadow: 0 0 25px #909399;
}

.login-title {
  text-align: center;
  margin: 0 auto 40px auto;
  color: #303133;
}
</style>