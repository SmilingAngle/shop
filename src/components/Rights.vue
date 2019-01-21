<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <my-bread leaval1="权限管理" leaval2="权限列表"></my-bread>
    <!-- 表格 -->
    <el-table height="500px" :data="roles" stripe style="width: 100%">
      <el-table-column type="index" label="#" width="250"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="250"></el-table-column>
      <el-table-column prop="path" label="路径" width="250"></el-table-column>
      <el-table-column  label="层级" width="250">
          <template slot-scope="scope">
              <span v-if="scope.row.level==='0'">一级</span>
              <span v-if="scope.row.level==='1'">二级</span>
              <span v-if="scope.row.level==='2'">三级</span>
          </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      roles: []
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      const res = await this.$http.get(`rights/list`);
      // console.log(res);
      this.roles = res.data.data;
    }
  }
};
</script>

<style>
.card {
  height: 100%;
}
</style>
