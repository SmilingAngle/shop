<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 输入框 -->
    <el-row>
      <el-col>
        <el-input
          placeholder="请输入内容"
          v-model="query"
          class="input-with-select search"
          clearable
          @clear="getAllUser()"
        >
          <el-button slot="append" icon="el-icon-search" @click="searchUser()"></el-button>
        </el-input>
        <el-button type="primary" @click="showadd()">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- create_time: (...)
      email: (...)
      id: (...)
      mg_state: (...)
      mobile: (...)
      role_name: (...)
    username: (...)-->
    <el-table height="300px" :data="tableData" stripe style="width: 100%">
      <el-table-column prop="id" label="#" width="180"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>

      <el-table-column prop="create_time" label="创建日期">
        <!-- 处理日期格式, scope承上启下-->
        <template slot-scope="scope">
          <!-- 在这里要使用tabLedata的数据，里层使用外层 -->
          {{scope.row.create_time|fmtDate}}
        </template>
      </el-table-column>

      <el-table-column prop="mg_state" label="用户状态">
        <template slot-scope="scope">
          <!-- 此处使用外层数据 -->
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            plain
            size="mini"
            icon="el-icon-edit"
            circle
            @click="showEdit(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            plain
            size="mini"
            icon="el-icon-delete"
            circle
            @click="showdelete(scope.row)"
          ></el-button>
          <el-button
            type="success"
            plain
            size="mini"
            icon="el-icon-check"
            circle
            @click="showRole(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2,4,6,8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 编辑用户 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="EditUser()">确定</el-button>
      </div>
    </el-dialog>
    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确定</el-button>
      </div>
    </el-dialog>
    <!-- 角色 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
      <el-form>
        <el-form-item label="用户名" :label-width="formLabelWidth">
          {{currentUserName}}
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-select v-model="currentRoleid" placeholder="请选择活动区域">
            <el-option label="请选择" :value="-1" disabled></el-option>

            <el-option 
            v-for="(v,i) in roles" :key='i'
            :label="v.roleName" :value="v.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
        email: "",
        phone: ""
      },
      formLabelWidth: "100px",
      dialogFormVisibleEdit: false,
      dialogFormVisibleAdd: false,
      dialogFormVisibleRole:false,
      tableData: [],
      query: "",
      pagenum: 1,
      pagesize: 2,
      total: -1,
      roles:[],
      currentUserName:'',
      currentRoleid:-1,
      currentUserId:-1
    };
  },
  created() {
    this.getData();
  },
  methods: {
    // 设置角色
    async setRole(){
      // id：当前用户角色    roleid角色id
      const res = await this.$http.put(`users/${this.currentUserId}/role`,{rid:this.currentRoleid})
      this.dialogFormVisibleRole = false
    },
    // 显示角色框
    async showRole(user) {
      this.currentUserName = user.username
      // 获取当前角色id，设置时使用
      this.currentUserId  = user.id
      this.dialogFormVisibleRole  = true
      const res = await this.$http.get(`roles`)
      // console.log(res)
      const {meta:{msg,status},data} = res.data
      if(status === 200) {
        this.roles = data
      }

      // 根据id查询用户角色
      const res2 = await this.$http.get(`users/${user.id}`)
      // console.log(res2)
      this.currentRoleid = res2.data.data.rid
    },
    // 编辑用户
    async EditUser() {
      const res = await this.$http.put(`users/${this.form.id}`, this.form);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.dialogFormVisibleEdit = false;
        this.getData();
      } else {
        this.$message.warning(msg);
      }
    },
    // 显示编辑框
    async showEdit(user) {
      this.dialogFormVisibleEdit = true;
      const res = await this.$http.get(`users/${user.id}`);

      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        this.form = data;
      }
    },
    // 显示删除框
    showdelete(user) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(async () => {
          // 删除用户
          const res = await this.$http.delete(`users/${user.id}`);
          const {
            meta: { msg, status }
          } = res.data;
          if (status === 200) {
            this.$message.success("删除成功!");
            this.pagenum = 1;
            this.getData();
          } else {
            this.$message.success(msg);
          }
        })
        .catch(() => {
          this.$message.message("已取消删除");
        });
    },
    // 添加用户
    async addUser() {
      const res = await this.$http.post(`users`, this.form);
      // console.log(res)
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 201) {
        // 如果添加成功，关闭对话框，刷新表格
        this.dialogFormVisibleAdd = false;
        this.getData();
      } else {
        this.$message.warning(msg);
      }
    },

    // 显示添加框
    showadd() {
      this.form = {};
      this.dialogFormVisibleAdd = true;
    },
    // 清空输入框是触发
    getAllUser() {
      this.getData();
    },
    // 搜索用户
    searchUser() {
      this.pagenum = 1;
      this.getData();
    },

    // 分页
    // 每页条数改变
    handleSizeChange(val) {
      // 当每页条数改变时，将页码改为第一页
      this.pagenum = 1;
      this.pagesize = val;
      this.getData();
      console.log(`每页 ${val} 条`);
    },
    // 当前页码改变
    handleCurrentChange(val) {
      // val 是当前页码
      this.pagenum = val;
      this.getData();
      console.log(`当前页: ${val}`);
    },
    // 获取用户列表
    async getData() {
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      // console.log(res)
      const {
        meta: { status, msg },
        data: { users, total }
      } = res.data;
      if (status === 200) {
        this.tableData = users;
        this.total = total;
        this.$message.success(msg);
        // console.log(this.tableData)
      } else {
        this.$message.warning(msg);
      }
    }
  }
};
</script>

<style>
.card {
  height: 100%;
}
.search {
  margin-top: 20px;
  width: 400px;
}
</style>
