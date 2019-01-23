<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <my-bread leaval1="商品管理" leaval2="分类参数"></my-bread>
    <!-- 提示条 -->
    <el-alert title="添加商品信息" type="info" show-icon :closable="false" class="alert"></el-alert>
    <!-- 选择三级分类 -->
    <el-form :model="form" label-position="left" class="form">
      <el-form-item label="商品分类">
        <el-cascader
          clearable
          :options="options"
          :show-all-levels="false"
          v-model="selectedOptions"
          :props="defaultProp"
          @change="changeSelected()"
        ></el-cascader>
      </el-form-item>
    </el-form>
    <!-- tab栏 -->
    <el-tabs v-model="active" type="card" @tab-click="handleClick">
      <el-tab-pane label="动态参数" name="1">
        <el-button type="primary" :disabled="this.selectedOptions.length === 0">设置动态参数</el-button>
        <el-table :data="arrDy" stripe style="width: 100%" height="300px">
          <el-table-column type="expand" width="80">
            <template slot-scope="scope">
              <el-tag
                :key="item.attr_id"
                v-for="(item,i) in scope.row.attr_vals"
                closable
                :disable-transitions="false"
                @close="handleClose(scope.row,item)"
              >{{item}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>

          <el-table-column type="index" label="#" width="300"></el-table-column>
          <el-table-column prop="attr_name" label="属性名称" width="300"></el-table-column>
          <el-table-column label="操作" width="300">
            <template slot-scope="scope">
              <el-button plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
              <el-button plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="2">
        <el-button type="primary" :disabled="this.selectedOptions.length === 0">设置静态参数</el-button>
        <el-table :data="arrSataic" stripe style="width: 100%" height="300px">
          <el-table-column type="index" label="#" width="300"></el-table-column>
          <el-table-column prop="attr_name" label="属性名称" width="300"></el-table-column>
          <el-table-column prop="attr_vals" label="属性值" width="300"></el-table-column>
          <el-table-column label="操作" width="300">
            <template slot-scope="scope">
              <el-button plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
              <el-button plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      form: {},
      options: [],
      selectedOptions: [],
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      active: "1",
      arrDy: [],
      arrSataic: [],
      //动态参数设置数据
      //   dynamicTags: ["标签一", "标签二", "标签三"],
      inputVisible: false,
      inputValue: ""
    };
  },
  created() {
    this.getcategories();
  },
  methods: {
    //   设置动态参数数据
    async handleClose(attr, item) {
      // 从数组中删除该元素
      attr.attr_vals.splice(attr.attr_vals.indexOf(item), 1);
      //   发送请求，删除数据
      const putData = {
        attr_name: attr.attr_name,
        attr_sel: attr.attr_sel,
        attr_vals: attr.attr_vals.join(",")
      };
      const res = await this.$http.put(
        `categories/${this.selectedOptions[2]}/attributes/${attr.attr_id}`,
        putData
      );
      console.log(res);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm(attr) {
      let inputValue = this.inputValue;
      if (inputValue) {
        attr.attr_vals.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    //点击tab时触发的方法
    handleClick() {
      // 当先点击静态参数，再点击动态，如果符合条件，也查询数据
      if (this.selectedOptions.length === 3 && this.active === "1") {
        this.getParms();
      }
      //   获取静态参数
      if (this.selectedOptions.length === 3 && this.active === "2") {
        this.getStacicParms();
      }
    },
    //级联选择器发生改变时
    async changeSelected() {
      // 判断有没有三级分类  和  是否点中动态参数
      if (this.selectedOptions.length === 3 && this.active === "1") {
        this.getParms();
      }
      if (this.selectedOptions.length === 3 && this.active === "2") {
        this.getStacicParms();
      }
    },
    // 获取静态参数
    async getStacicParms() {
      const res = await this.$http.get(
        `categories/${this.selectedOptions[2]}/attributes?sel=only`
      );
      this.arrSataic = res.data.data;
      console.log(res)
    },
    // 获取第三级分类数据
    async getParms() {
      const res = await this.$http.get(
        `categories/${this.selectedOptions[2]}/attributes?sel=many`
      );
      this.arrDy = res.data.data;
      // 将商品参数的字符串转成数组
      this.arrDy.forEach(item => {
        // 去除前后空格，如果为空，返回空数组
        item.attr_vals =
          item.attr_vals.trim().length === 0
            ? []
            : item.attr_vals.trim().split(",");
        // console.log(this.arrDy);
      });
    },
    //   获取三级分类
    async getcategories() {
      const res = await this.$http.get(`categories?type=3`);
      this.options = res.data.data;
    }
  }
};
</script>

<style>
.card {
  height: 100%;
}

.alert {
  margin-top: 20px;
  margin-bottom: 20px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
