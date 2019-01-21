<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{leaval1}}</el-breadcrumb-item>
    <el-breadcrumb-item>{{leaval2}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
    name:"my-bread",
    data(){
        return {}
    },
    props: ['leaval1','leaval2']
};
</script>

<style>
</style>
