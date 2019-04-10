import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'
/** note: sub-menu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']    will control the page roles (you can set multiple roles)
    title: 'title'               the name show in sub-menu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if true, the page will no be cached(default is false)
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
    affix: true                  if true, the tag will affix in the tags-view
  }
**/
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    // hidden: true, // 不在侧边栏线上
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true, affix: true }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/user', // 重定向地址，在面包屑中点击会重定向去的地址
    alwaysShow: true, // 一直显示根路由
    meta: {
      title: '组织管理',
      // roles: ['admin', 'editor'],
      icon: 'user' // 图标
    },
    // 你可以在根路由设置权限，这样它下面所以的子路由都继承了这个权限
    children: [
      {
        path: 'user',
        component: () => import('@/views/system/user'),
        name: 'user',
        meta: {
          title: '用户管理',
          noCache: true // 不会被 <keep-alive> 缓存
        }
      },
      {
        path: 'dept',
        component: () => import('@/views/system/dept'),
        name: 'dept',
        meta: {
          title: '部门管理',
          noCache: true // 不会被 <keep-alive> 缓存
        }
      },
      {
        path: 'menu',
        component: () => import('@/views/system/menu'),
        name: 'menu',
        meta: {
          title: '菜单管理',
          noCache: true // 不会被 <keep-alive> 缓存
        }
      }
    ]
  },
  {
    path: '/backend',
    component: Layout,
    redirect: '/backend/druid', // 重定向地址，在面包屑中点击会重定向去的地址
    alwaysShow: true, // 一直显示根路由
    meta: {
      title: '系统管理',
      // roles: ['admin', 'editor'],
      icon: 'druid' // 图标
    },
    // 你可以在根路由设置权限，这样它下面所以的子路由都继承了这个权限
    children: [
      {
        path: 'druid',
        component: () => import('@/views/backend/druid'),
        name: 'druid',
        meta: {
          title: '数据监控',
          noCache: true // 不会被 <keep-alive> 缓存
        }
      },
      {
        path: 'swagger',
        component: () => import('@/views/backend/swagger'),
        name: 'swagger',
        meta: {
          title: '接口文档',
          noCache: true // 不会被 <keep-alive> 缓存
        }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

export const asyncRoutes = [

]
