<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <my-bread leaval1="权限列表" leaval2="角色列表"></my-bread>
    <!-- 添加按钮 -->
    <el-button type="primary" class="btn">添加角色</el-button>
    <!-- 表格 -->
    <el-table :data="rights" stripe style="width: 100%" height="600px">
      <el-table-column type="expand" width="80">
        <template slot-scope="scope">
          <el-row v-for="(item1,i) in scope.row.children" :key="i">
            <el-col :span="4">
              <el-tag
                type="success"
                closable
                @close="deleteRights(scope.row,item1)"
              >{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(item2,i) in item1.children" :key="i">
                <el-col :span="4">
                  <el-tag
                    type="info"
                    closable
                    @close="deleteRights(scope.row,item2)"
                  >{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    type="warning"
                    closable
                    @close="deleteRights(scope.row,item3)"
                    v-for="(item3,i) in item2.children"
                    :key="i"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length === 0">
            <el-col>
              <span>该用户未分配权限</span>
            </el-col>
          </el-row>
        </template>
      </el-table-column>

      <el-table-column type="index" label="#" width="180"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"></el-table-column>

      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" icon="el-icon-edit" circle></el-button>
          <el-button type="danger" plain size="mini" icon="el-icon-delete" circle></el-button>
          <el-button
            type="success"
            plain
            size="mini"
            icon="el-icon-check"
            circle
            @click="showRights(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="dialogVisible" width="50%">
      <!--   :default-expanded-keys="[2, 3]"
      :default-checked-keys="[5]"-->
      <!-- 树数据 treedata--> 
      <el-tree :data="treeData" ref="tree"
      :default-checked-keys="checkedArr"
      default-expand-all show-checkbox node-key="id" :props="defaultProps" ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRights()">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      rights: [],
      treeData: [],
      defaultProps:{label:'authName',children:'children'},
      checkedArr:[],
      currentRoleId:-1
    };
  },
  created() {
    // 获取角色列表
    this.getRoles();
  },
  methods: {
    // 分配权限
    // 权限ID->全选角色ID和半选角色id  
    async setRights(){
      // getCheckedKeys  getHalfCheckedKeys
      // 获取treeDOM元素

      // 获取全选的id数组
      const arr1 = this.$refs.tree.getCheckedKeys()
      // 获取半选的id数组
      const arr2 = this.$refs.tree.getHalfCheckedKeys()
      const arr  = [...arr1,...arr2]
      // console.log(arr)
      const res = await this.$http.post(`roles/${this.currentRoleId}/rights`,{
        rids:arr.join(',')
      })
      // 关闭对话框
      this.dialogVisible = false
      // 刷新表格
      this.getRoles()
    },
    // 分配权限，展示对话框
    async showRights(role) {
      const res =await  this.$http.get(`rights/tree`)
      this.treeData = res.data.data
      this.currentRoleId = role.id
      // 循环遍历获取所有选中的权限id
      const tempArr = [];
      role.children.forEach(item1 => {
        // tempArr.push(item1.id);
        item1.children.forEach(item2 =>{
          // tempArr.push(item2.id)
          item2.children.forEach(item3 => {
            // 内层选中的id，外层会自动选中
            tempArr.push(item3.id)
          })
        })
      });
      this.checkedArr = tempArr
      // console.log(tempArr)


      // 展示对话框
      this.dialogVisible = true;
    },
    // 删除权限
    async deleteRights(user, rights) {
      const res = await this.$http.delete(
        `roles/${user.id}/rights/${rights.id}`
      );
      // 取消权限后，更新当前角色的权限
      user.children = res.data.data;
      // this.getRoles()
    },
    async getRoles() {
      const res = await this.$http.get(`roles`);

      this.rights = res.data.data;
      // console.log(this.rights);
    }
  }
};
</script>

<style>
.card {
  height: 100%;
}
.btn {
  margin-top: 20px;
}
</style>
