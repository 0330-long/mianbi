<template>
   <div class="common-layout">
    <el-container>
      <el-aside class="img"></el-aside>
      <el-main>
        <div>
          <el-form  
          :model="form" 
          class="login-box" 
          label-width="auto" 
          :rules="rules"
          @keyup.enter="login"
          >
          <el-form-item>
            <h1 class="login-title">欢迎登录</h1>
          </el-form-item>
          <el-form-item label= "账号" prop="username" >
            <el-input type="text" 
            v-model="form.username"
            style="max-width:200px"
            autofocus 
            />
          </el-form-item>
          <el-form-item label= "密码" prop="password" >
          <el-input 
          type="password" 
          v-model="form.password"
          style="max-width:200px"
          />
          </el-form-item>
         <el-form-item>
            <el-button 
          class="btp"
          type="primary"
          :disabled="disable"
          @click="login"
          >登录</el-button>
         </el-form-item>
          </el-form>
        </div>
      </el-main>
    </el-container>
  </div>
</template>




<script>
export default{
  data(){
    return{
      form: {
        username:'',
        password:''
      },
      rules:{
        username: [
          {required: true, message:  "账号不可为空", trigger: 'blur'},
          { min: 3, max: 10, message: 'Length should be 3 to 10', trigger: 'blur' },     
        ],
        password: [
          {required: true, message:  "密码不可为空" , trigger: 'blur'},
          { min: 6, max: 15, message: 'Length should be 6 to 15', trigger: 'blur' },
        ],
      },
      // disable:true,
    }
  },
  computed: {
    disable() {
      return !(this.form.username && this.form.password)
    },
  },
  watch:{
    // 'form.username'() {
    //   this.disable = !(this.form.username && this.form.password)
    // },
    // 'form.password'() {
    //   this.disable = !(this.form.username && this.form.password)
    // },
  },
  methods:{
      login(){
          this.$router.replace('/base/page1')
      }
  }
}
</script>
<style  scoped>

.img{
  width:500px;
  height:500px;
  background-image: url('../public/122.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
</style>

