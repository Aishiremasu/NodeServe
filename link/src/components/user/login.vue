<template>
  <div>login
    <div class="form">
      <input type="text" placeholder="用户名" v-model="form.username">
      <br>
      <input type="password" placeholder="密码" v-model="form.password">
      <br>
      验证码：{{ veri }}
      <br>
      <input
        type="text"
        maxlength="4"
        style="width:80px"
        placeholder="请输入验证码"
        v-model="form.checkveri"
      >
      <button @click="login()">登录</button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      veri: "",
      form: {
        username: "",
        password: "",
        checkveri: ""
      },
      checkveriresult: false
    };
  },
  created() {
    this.getVeri();
  },
  methods: {
    getVeri() {
      this.$axios
        .get("/api/Handler/AdminHandler", {
          params: {
            action: "veri"
          }
        })
        .then(res => {
          this.veri = res.data.success;
          // console.log(res)
        });
    },
    checkVeri() {
      this.$axios
        .get("/api/Handler/AdminHandler", {
          params: {
            action: "checkveri",
            veri: this.form.checkveri.toUpperCase()
          }
        })
        .then(res => {
          this.checkveriresult=res.data.data
          // res.data.data ? alert("验证成功") : alert("验证失败");
          // console.log(res)
        });
    },
    login() {
      this.checkVeri()
      this.$axios
        .post("/api/Handler/AdminLogin?action=login", {
          body: {
            // action: "login",
            username: this.form.username,
            password: this.form.password
          }
        })
        .then(res => {
          // console.log(this.checkVeri())
          if (this.checkveriresult) {
            console.log(res);
          } else {
            alert("验证码错误");
          }
        });
    }
  }
};
</script>
<style scoped>
</style>
