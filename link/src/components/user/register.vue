<template>
  <div>
    register<br/>
    <input type="text" v-model="form.username" placeholder="用户名"><br/>
    <input type="password" v-model="form.password" placeholder="密码"><br/>
    <button @click="register()">注册</button>
  </div>
</template>
<script>
export default {
  data(){
      return{
        form:{
          username: '',
          password: ''
        }
      }
    },
  methods:{
    register(){
      this.$axios.post('/api/Handler/AdminLogin?action=register',{
        body:{
          username: this.form.username,
          password: this.form.password
        }
      }).then(res => {
        console.log(res)
      })
    }
  }
}
</script>
<style scoped>

</style>
