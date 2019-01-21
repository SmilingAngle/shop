<template>
  <el-container>
    <el-header class="contain">
      <el-row>
        <el-col :span="3">
          <div class="grid-content bg-purple">
            <img src="@/assets/logo.png" alt>
          </div>
        </el-col>
        <el-col :span="18" class="title">
          <div class="grid-content bg-purple">
            <h2>电商后台管理系统</h2>
          </div>
        </el-col>
        <el-col :span="1">
          <div class="grid-content bg-purple">
            <a href class="logout" @click.prevent="logout">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside">
        <el-menu
        default-active="2"
        unique-opened
        class="el-menu-vertical-demo "
        router
        >
          <el-submenu :index="''+item1.order" v-for="(item1,i) in menus" :key="item1.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item1.authName}}</span>
            </template>
            <el-menu-item :index="item2.path" v-for="(item2,i) in item1.children" :key="item2.id">
              <i class="el-icon-location"></i>
              {{item2.authName}}
            </el-menu-item>
          </el-submenu>
         
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  // 判读有没有token
  beforeCreate () {
    // 如果没有，提示登录并跳转
   
  },
  created () {
    this.getMenus()
  },
  data () {
    return {
      menus:[]
    }
  },
  methods: {
    async getMenus(){
      const res = await this.$http.get(`menus`)
      // console.log(res)
      this.menus = res.data.data
    },
    // 退出登录
    // 清除troken
    logout () {
      localStorage.clear()
      // 跳转到登录页
      this.$router.push({
        name: 'login'
      })
      this.$message.success('退出成功')
    }
  }
}
</script>

<style>
.el-container {
  height: 100%;
}
.contain {
  background-color: cadetblue;
  line-height: 60px;
}
.title {
  text-align: center;
}
#app .aside {
    height: 100%;
    /* background-color:darkgrey; */
}
</style>
