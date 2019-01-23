<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <my-bread leaval1="商品管理" leaval2="商品分类"></my-bread>
    <!-- 添加按钮 -->
    <el-button class="btn" type="primary" @click="showcategory()">添加分类</el-button>
    <!-- 表格 -->
    <el-table :data="goods" stripe style="width: 100%" height="500px">
      <!-- treeKey 每个节点的唯一标识 -->
      <!-- parentKey 	父节点数据的标识 -->
      <!-- levelKey 	自己层级标识 -->
      <!-- childKey 	子节点数据的key -->
      <el-tree-grid
        prop="cat_name"
        label="分类名称"
        width="180"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        childKey="children"
      ></el-tree-grid>
      <el-table-column label="级别" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level===0">一级</span>
          <span v-if="scope.row.cat_level===1">二级</span>
          <span v-if="scope.row.cat_level===2">三级</span>
        </template>
      </el-table-column>
      <el-table-column prop="cat_deleted" label="是否有效" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_deleted===false">有效</span>
          <span v-if="scope.row.cat_deleted===true">无效</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
          <el-button plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5,10,15,20]"
      :page-size="5"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 对话框 -->
    <el-dialog title="添加商品分类" :visible.sync="dialogVisible" width="30%">
      <el-form v-model="form">
        <el-form>
          <el-form-item label="分类名称" label-width="80px">
            <el-input v-model="form.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="分类" label-width="80px">
            <!-- 级联选择器 -->
            <el-cascader
              change-on-select
              clearable
              :options="caslist"
              v-model="selectedOptions"
              @change="handleChange"
              :props="defaultprops"
            ></el-cascader>
          </el-form-item>
        </el-form>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addcategory()">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
var ElTreeGrid = require("element-tree-grid");
export default {
  components: {
    ElTreeGrid
  },
  data() {
    return {
      goods: [],
      query: "",
      pagenum: 1,
      pagesize: 5,
      total: -1,
      dialogVisible: false,
      form: {
        cat_pid: -1,
        cat_name: "",
        cat_level: -1
      },
      selectedOptions: [],
      caslist: [],
      defaultprops: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      }
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    //   级联改变时
    handleChange() {},
    // 添加分类
    async addcategory() {
      // cat_pid	分类父 ID	不能为空
      // cat_name	分类名称	不能为空
      // cat_level	分类层级	不能为空
      // 如果添加一级分类
      if (this.selectedOptions.length === 0) {
        this.form.cat_pid = 0;
        this.form.cat_level = 0;
      }
      // 如果添加二级分类
      if (this.selectedOptions.length === 1) {
        this.form.cat_pid = this.selectedOptions[0];
        this.form.cat_level = 1;
      }
      // 如果添加三级分类
      if (this.selectedOptions.length === 2) {
        this.form.cat_pid = this.selectedOptions[1];
        this.form.cat_level = 2;
      }
      const res = await this.$http.post(`categories`, this.form);

      // 清空
      this.form = {};
      // 关闭对话框
      this.dialogVisible = false;
      // 刷新表格
      this.getGoodsList();
      console.log(res);
    },
    //展示分类对话框
    async showcategory() {
      // 获取两级分类的数据
      const res = await this.$http.get(`categories?type=2`);

      this.caslist = res.data.data;
      this.dialogVisible = true;
    },
    //   分页相关
    // 每页条数改变时
    handleSizeChange(val) {
      this.pagesize = val;
      this.pagenum = 1;
      this.getGoodsList();
      // console.log(`每页 ${val} 条`);
    },
    //   页码发生改变时
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getGoodsList();
      // console.log(`当前页: ${val}`);
    },
    async getGoodsList() {
      // query	查询参数	可以为空
      // pagenum	当前页码	不能为空
      // pagesize	每页显示条数	不能为空
      const res = await this.$http.get(
        `categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      //   console.log(res)
      const { data, meta } = res.data;
      this.goods = data.result;
      this.total = data.total;
    }
  }
};
</script>

<style>
.card {
  height: 100%;
}
.btn {
  margin: 20px 0;
}
</style>
