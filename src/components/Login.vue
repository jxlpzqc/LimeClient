<template>
  <div>
    <el-dialog
      title="登录到Lime"
      :visible.sync="showLogin"
      width="30%"
      v-loading="loginLoading"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-form label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="login">登录</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { LimeHttp } from "../ajax.js";

export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      loginLoading: false
    };
  },
  props: {
    isLogin: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    showLogin() {
      return !this.isLogin;
    }
  },
  methods: {
    login() {
      if (this.username == "") {
        this.$message("请输入用户名");
      } else if (this.password == "") {
        this.$message("请输入密码");
      } else {
        this.loginLoading = true;
        LimeHttp.post("/user/login", {
          username: this.username,
          password: this.password
        })
          .then(resp => {
            this.loginLoading = false;
            this.$message(resp.data.msg)
            //console.log(resp.data['status']);
            if (resp.data.code == 0) {
              //this.isLogin = true;
              this.$emit("login-succeed",resp.data.data);
            }else {
              this.$alert("用户名或密码错误，请重新登录！");
            }
          })
          .catch(() => {
            this.$message("服务器发生异常！！！");
            this.loginLoading = false;
          });
      }
    }
  }
};
</script>

<style scoped>
</style>