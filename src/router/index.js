import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'
import Home from '@/components/home'
import User from '@/components/User'
import Rights from '@/components/Rights'
import Roles from '@/components/Roles'
import Goodlist from "@/components/goodslist"
import GoodsAdd from "@/components/goodsAdd"
import params from "@/components/params"
import goodscate from "@/components/goodscate"
 
import { Message } from 'element-ui';

Vue.use(Router)

const router =  new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login

    },

    {
      name: 'home',
      path: '/',
      component: Home,
      children: [{
        name: 'users',
        path: '/users',
        component: User
      },
      {
        name: 'rights',
        path: '/rights',
        component: Rights

      },
      {
        name: 'roles',
        path: '/roles',
        component: Roles

      },
      {
        name: 'goods',
        path: '/goods',
        component: Goodlist

      },{
        name: 'goodsadd',
        path: '/goodsadd',
        component: GoodsAdd

      },{
        name: 'params',
        path: '/params',
        component: params

      },{
        name: 'categories',
        path: '/categories',
        component: goodscate

      },
    ]
    }
  ]
})

// if (!localStorage.getItem('token')) {
//   this.$message.warning('请先登录')
//   this.$router.push({
//     name: 'login'
//   })
// }

router.beforeEach((to, from, next) => {
  // 如果去登录页，就继续
  if(to.name === 'login'){
    next()
  }else {
    // 如果不是登录页，判断有没有token，
    // 如果没有token，去登录页，如果有，就继续
    if(!localStorage.getItem('token')){
      Message.warning('请先登录')
      router.push({
        name:'login'
      })
    }else {
      next()
    }
  }
})
export default router