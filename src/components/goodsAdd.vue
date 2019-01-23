<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <my-bread leaval1="商品管理" leaval2="商品列表"></my-bread>
    <!-- 提示条 -->
    <el-alert title="添加商品信息" type="info" center show-icon :closable="false" class="alert"></el-alert>
    <!-- 步骤条 -->
    <el-steps :active="1*active" align-center>
      <el-step title="步骤1"></el-step>
      <el-step title="步骤2"></el-step>
      <el-step title="步骤3"></el-step>
      <el-step title="步骤4"></el-step>
      <el-step title="步骤5"></el-step>
    </el-steps>
    <!-- tab栏 -->
    <el-form :model="form" class="form" label-position="top">
      <!-- v-model绑定的是每个选项的label值 -->
      <el-tabs tab-position="left" v-model="active" class="tabs" @tab-click="changeTab()">
        <el-tab-pane name="1" label="基本信息">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              clearable
              :options="options"
              v-model="selectedOptions"
              @change="handleChange"
              :props="defaultProp"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="2" label="商品参数">
          <el-form-item
            :label="item1.attr_name"
            v-for="(item1,i) in this.arrDy"
            :key="item1.attr_id"
          >
            <el-checkbox-group v-model="item1.attr_vals">
              <el-checkbox :label="item2" border v-for="(item2,i) in item1.attr_vals" :key="i"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="3" label="商品属性">
          <el-form-item :label="item1.attr_name" v-for="(item1,i) in this.arrStatic" :key="i">
            <el-input v-model="item1.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="4" label="商品图片">
          <el-upload
            action="http://localhost:8888/api/private/v1/upload"
            :on-remove="handleRemove"
            :headers="headers"
            :on-success="handleSuccess"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane name="5" label="商品内容">
          <el-form-item label>
            <!-- 添加商品按钮 -->
            <el-button type="primary" @click="addGoods()">添加商品</el-button>
            <!-- 富文本编辑器
            绑定表单数据，描述
            -->
            <quill-editor v-model="form.goods_introduce"></quill-editor>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>
<script>
// 引入富文本编辑器
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      active: "1",
      //goods_name	商品名称	不能为空
      //goods_price	价格	不能为空
      //goods_weight	重量	不能为空
      //goods_number	数量	不能为空
      //goods_cat	以为','分割的分类列表	不能为空
      //goods_introduce	介绍	可以为空
      //pics	上传的图片临时路径（对象）	可以为空
      //attrs	商品的参数（数组）	可以为空
      form: {
        goods_name: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        goods_cat: "",
        pics: [],

        attrs: ""
      },
      options: [],
      selectedOptions: [1, 3, 6],
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      // 动态参数数组
      arrDy: [],
      // 多选框数组
      checkList: [],
      // 静态参数数组
      arrStatic: [],
      // 设置上传图片请求头
      headers: {
        Authorization: localStorage.getItem("token")
      }
    };
  },
  created() {
    this.getcategories();
  },
  methods: {
    // 添加商品
    async addGoods() {
      // 以为','分割的分类列表
      this.form.goods_cat = this.selectedOptions.join(",");

      // 获取动态参数数组
      const arr1 = this.arrDy;
      // 遍历数组，将数组中的元素返回对象
      const arr1New = arr1.map(item => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });
      // 获取静态参数数组
      const arr2 = this.arrStatic;
      const arr2New = arr2.map(item => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });
      // 合并数组
      const arr = [...arr1New, ...arr2New];
      this.form.attrs = arr;
      console.log(this.form.attrs);

      const res = await this.$http.post(`goods`, this.form);
      console.log(res)
      this.$router.push({
        name:'goods'
      })

    },
    // 移除图片
    handleRemove(file) {
      // 移除图片后，从数组中移除临时路径
      const index = this.form.pics.findIndex(item => {
        // findIndex()方法将符合条件的元素索引自动返回
        return item.pic === file.response.data.tmp_path;
      });
      this.form.pics.splice(index, 1);
      // console.log(file.response.data.tmp_path)
      // console.log(this.form.pics)
    },
    // 图片上传成功
    handleSuccess(response) {
      // 上传成功后，将临时路径添加到表单元素中
      this.form.pics.push({
        pic: response.data.tmp_path
      });
      // console.log(response.data.tmp_path)
      // console.log(this.form.pics)
    },

    handleChange() {},
    async changeTab() {
      //   判断是否点中商品参数(二级分类)
      if (this.active === "2") {
        //   判断是否有三级联动
        if (this.selectedOptions.length === 3) {
          // 发送请求
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=many`
          );
          // console.log(res)
          this.arrDy = res.data.data;
          // 将商品参数的字符串转成数组
          this.arrDy.forEach(item => {
            // 去除前后空格，如果为空，返回空数组
            item.attr_vals =
              item.attr_vals.trim().length === 0
                ? []
                : item.attr_vals.trim().split(",");
            // console.log(item.attr_vals);
          });
        } else {
          this.$message.warning("请先选择商品的三级分类");
        }
      }
      //   判断是否点中商品属性(三级分类)
      if (this.active === "3") {
        if (this.selectedOptions.length === 3) {
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=only`
          );
          this.arrStatic = res.data.data;
          // console.log(this.arrStatic);
        } else {
          this.$message.warning("请先选择商品三级分类");
        }
      }
    },
    // 获取三级分类数据
    async getcategories() {
      const res = await this.$http.get(`categories?type=3`);
      // console.log(res);
      this.options = res.data.data;
      // console.log(this.options)
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
.tabs {
  margin-top: 20px;
}
.form {
  height: 400px;
  overflow: auto;
}
.ql-editor {
  min-height: 200px;
}
</style>
