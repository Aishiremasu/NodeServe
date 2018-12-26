<template>
  <div class="hello">
    验证码：{{veri}}
    <br/>
    <input type="text" v-model="checkveri" maxlength="4">
    <button @click="checkVeri()">提交验证码</button>
    <audio style="width:500px;height:500px;" id="MusicObj" ref="bgMusic" src="http://hnwx2.hntele.com/huodong/Content/AnnualBill/images/20181218zd/music_01.mp3"  loop="loop" ></audio>
  </div>
</template>

<script>
export default {
  data () {
    return {
      veri:'',
      checkveri:''
    }
  },
  mounted(){
    this.$axios.get('/api/Handler/AdminHandler',{
      params:{
        action: 'veri'
      }
    }).then(res=>{
      this.veri = res.data.success
      // console.log(res)
    })
  },
  methods:{
    checkVeri(){
      this.$axios.get('/api/Handler/AdminHandler',{
        params:{
          action: 'checkveri',
          veri: this.checkveri.toUpperCase()
        }
      }).then(res => {
        res.data.data?alert('验证成功'):alert('验证失败')
        // console.log(res)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
