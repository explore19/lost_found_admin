import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    children: [
      {
        path: 'index',
        name: 'User',
        component: () => import('@/views/user/index'),
        meta: { title: '用户管理', icon: 'user' }
      }
    ]
  }, {
    path: '/post',
    component: Layout,
    redirect: '/post/index',
    meta: { title: '帖子管理', icon: 'form' },
    children: [{
      path: '/post/examine',
      name: 'NeedExamine',
      component: () => import('@/views/post/AuditPost'),
      meta: { title: '待审核帖子', icon: 'form' }
    },
    {
      path: 'index',
      name: 'Post',
      component: () => import('@/views/post/index'),
      meta: { title: '所有帖子', icon: 'form' }
    }
    ]
  }, {
    path: '/item_type',
    component: Layout,
    redirect: '/item_type/index',
    children: [
      {
        path: 'index',
        name: 'itemType',
        component: () => import('@/views/item-type/index'),
        meta: { title: '物品管理', icon: 'item' }
      }
    ]
  }, {
    path: '/rotation-chart',
    component: Layout,
    redirect: '/rotation-chart/index',
    children: [
      {
        path: 'index',
        name: 'RotationChart',
        component: () => import('@/views/rotation-chart/index'),
        meta: { title: '轮播图管理', icon: 'rotation-chart' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
