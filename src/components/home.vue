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
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="user">
              <i class="el-icon-location"></i>
              用户列表
            </el-menu-item>
          </el-submenu>
          <!-- 2 -->
            <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="1-1">
              <i class="el-icon-location"></i>
              角色列表
            </el-menu-item>
            <el-menu-item index="1-1">
              <i class="el-icon-location"></i>
              权限列表
            </el-menu-item>
          </el-submenu>
          <!-- 3 -->
            <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item index="">
              <i class="el-icon-location"></i>
              商品列表
            </el-menu-item>
            <el-menu-item index="">
              <i class="el-icon-location"></i>
              分类参数
            </el-menu-item>
            <el-menu-item index="">
              <i class="el-icon-location"></i>
              商品分类
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
    if (!localStorage.getItem('token')) {
      this.$message.warning('请先登录')
      this.$router.push({
        name: 'login'
      })
    }
  },
  methods: {
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
