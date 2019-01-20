<template>
  <div class="box">
    <el-form label-position="top" label-width="80px" :model="formData" class="form">
      <h2>用户登录</h2>
      <el-form-item label="昵称">
        <el-input v-model="formData.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formData.password"></el-input>
      </el-form-item>
      <el-button type="primary" class="btn" @click="login">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formData: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async login () {
      const res = await this.$http.post('login', this.formData)
        console.log(res)
      const {
        data: {
          meta: { msg, status },
          data
        }
      } = res
      if (status === 200) {
        localStorage.setItem('token', data.token)
        this.$router.push({
          name: 'home'
        })
      } else {
        this.$message.warning(msg)
      }
    }
  }
}

</script>

<style>
.box {
  height: 100%;
  background-color: #324152;
  display: flex;
  justify-content: center;
  align-items: center;
}
.box .form {
  background-color: #fff;
  width: 400px;
  border-radius: 10px;
  padding: 30px;
}
.box .form .btn {
  width: 100%;
}
</style>
