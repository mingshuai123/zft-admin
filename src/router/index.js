import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import { resolve } from 'q'
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
    name:'login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/cpreport',
  //   name:'personal',
  //   meta: { title: '工作台', icon: 'dashboard',roles:3},
  //   children: [
  //     {
  //       path: 'cpreport',
  //       name: 'cpreport',
  //       component: () => import('@/views/console/cpreport'),
  //       meta: { title: '商户概况', icon: 'dashboard'}
  //     },
  //   ]
  // },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'hash', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
export const dynamicRouter = [
  // 高级商户
  {
    path: '/',
    component: Layout,
    redirect: '/cpconsole',
    name:'shanghu',
    meta: { title: '工作台', icon: 'dashboard',roles:3},
    alwaysShow:true,
    children: [
      {
        path: 'cpconsole',
        name: 'cpconsole',
        component: () => import('@/views/console/cpconsole'),
        meta: { title: '控制台', icon: 'dashboard'}
      },
      {
        path: 'cpreport',
        name: 'cpreport',
        component: () => import('@/views/shanghu/report'),
        meta: { title: '商户概况', icon: 'dashboard'},
      },
      {
        path: 'orderSearch',
        name: 'orderSearch',
        component: () => import('@/views/search/order.vue'),
        meta: { title: '订单查询', icon: 'dashboard'},
      },
      {
        path: 'orderList',
        name: 'orderList',
        component: () => import('@/views/shanghu/order'),
        meta: { title: '订单列表', icon: 'dashboard'}
      },
      {
        path: 'cpdayreport',
        name: 'cpdayreport',
        component: () => import('@/views/console/cpdayreport'),
        meta: { title: '商户每日报表', icon: 'dashboard',activeMenu:'/cpreport'},
        hidden:true
      },
    ]
  },
  // 普通商户
  {
    path: '/',
    component: Layout,
    redirect: '/cpreport',
    name:'dingdan',
    meta: { title: '工作台', icon: 'dashboard',roles:2},
    children: [
      {
        path: 'cpreport',
        name: 'cpreport',
        component: () => import('@/views/shanghu/report'),
        meta: { title: '商户概况', icon: 'dashboard'}
      },
      {
        path: 'orderList',
        name: 'orderList',
        component: () => import('@/views/shanghu/order.vue'),
        meta: { title: '订单列表', icon: 'dashboard'}
      },
      {
        path: 'addorder',
        name: 'addorder',
        component: () => import('@/views/addorder/index'),
        meta: { title: '添加订单', icon: 'dashboard'}
      },
    ]
  },
  // 管理员
  {
    path: '/',
    component: Layout,
    redirect: '/console',
    name:'personal',
    meta: { title: '工作台', icon: 'dashboard',roles:1},
    children: [
      {
        path: 'console',
        name: 'console',
        component: () => import('@/views/console/index'),
        meta: { title: '控制台', icon: 'dashboard'}
      },
      {
        path: 'cpreport',
        name: 'cpreport',
        component: () => import('@/views/console/cpreport'),
        meta: { title: '商户概况', icon: 'dashboard'}
      },
      {
        path: 'cpdayreport',
        name: 'cpdayreport',
        component: () => import('@/views/console/cpdayreport'),
        meta: { title: '商户每日报表', icon: 'dashboard',activeMenu:'/cpreport'},
        hidden:true
      },
      {
        path: 'report',
        name: 'report',
        component: () => import('@/views/console/report'),
        meta: { title: '每日报表', icon: 'dashboard'}
      },
      // {
      //   path: 'iffyOrder',
      //   name: 'iffyOrder',
      //   component: () => import('@/views/console/iffyOrder'),
      //   meta: { title: '待处理订单', icon: 'dashboard'}
      // },
      {
        path: 'order',
        name: 'order',
        component: () => import('@/views/console/order'),
        meta: { title: '订单流水', icon: 'dashboard'}
      },
      {
        path: 'recharge',
        name: 'recharge',
        component: () => import('@/views/console/recharge'),
        meta: { title: '充值申请', icon: 'dashboard'}
      },
      {
        path: 'widthDraw',
        name: 'widthDraw',
        component: () => import('@/views/console/widthDraw'),
        meta: { title: '提现申请', icon: 'dashboard'}
      },
     
    ]
  },
  {
    path: '/search',
    component: Layout,
    // redirect: '/search/orderSearch',
    name:'search',
    meta: { title: '查询管理', icon: 'dashboard',roles:1},
    children: [
      {
        path: 'orderSearch',
        name: 'orderSearch',
        component: () => import('@/views/search/order'),
        meta: { title: '订单查询', icon: 'dashboard'},
      },
      {
        path: 'orderdetails',
        name: 'orderdetails',
        component:  resolve =>
        require(['@/views/detail/orderdetail'], resolve),
        meta: { title: '订单详情', icon: 'dashboard'},
        hidden:true,
      },
      {
        path: 'memberSearch',
        name: 'memberSearch',
        component: () => import('@/views/search/member'),
        meta: { title: '用户查询', icon: 'dashboard'},
      },
      {
        path: 'rechargeSearch',
        name: 'rechargeSearch',
        component: () => import('@/views/search/charge'),
        meta: { title: '充值查询', icon: 'dashboard'},
      },
      {
        path: 'withdrawSearch',
        name: 'withdrawSearch',
        component: () => import('@/views/search/withdraw'),
        meta: { title: '提现查询', icon: 'dashboard'},
      },
    ]
  },
  {
    path: '/detail',
    component: Layout,
    redirect: '/search/orderSearch',
    name:'detail',
    meta: { title: '查询管理', icon: 'dashboard',roles:1},
    hidden:true,
    children: [
      {
        path: 'orderdetail',
        name: 'orderdetail',
        component: () => import('@/views/detail/orderdetail'),
        meta: { title: '订单详情', icon: 'dashboard'},
      },
      {
        path: 'memberdetail',
        name: 'memberdetail',
        component: () => import('@/views/detail/memberdetail'),
        meta: { title: '用户详情', icon: 'dashboard'},
      },
      {
        path: 'chargedetail',
        name: 'chargedetail',
        component: () => import('@/views/detail/chargedetail'),
        meta: { title: '充值详情', icon: 'dashboard'},
      },
      {
        path: 'withdrawDetail',
        name: 'withdrawDetail',
        component: () => import('@/views/detail/withdrawDetail'),
        meta: { title: '提现详情', icon: 'dashboard'},
      },
    ]
  },
  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/adminsetting',
    name:'setting',
    meta: { title: '平台设置', icon: 'dashboard',roles:1},
    children: [
      {
        path: 'adminsetting',
        name: 'adminsetting',
        component: () => import('@/views/setting/index'),
        meta: { title: '平台设置', icon: 'dashboard'},
      },
      {
        path: 'levelratio',
        name: 'levelratio',
        component: () => import('@/views/setting/levelratio'),
        meta: { title: '红利设置', icon: 'dashboard'},
      },
      {
        path: 'official',
        name: 'official',
        component: () => import('@/views/setting/official'),
        meta: { title: '充值设置', icon: 'dashboard'},
      },
    ]
  },
  {
    path: '/cpsetting',
    component: Layout,
    redirect: '/cpsetting/cplist',
    name:'cpsetting',
    meta: { title: '商户管理', icon: 'dashboard',roles:1},
    alwaysShow:true,
    children: [
      {
        path: 'cplist',
        name: 'cplist',
        component: () => import('@/views/setting/cplist'),
        meta: { title: '商户列表', icon: 'dashboard'},
      },
     
    ]
  },
  {
    path: '/notice',
    component: Layout,
    redirect: '/notice/noticelist',
    name:'notice',
    meta: { title: '公告与资讯', icon: 'dashboard',roles:1},
    alwaysShow:true,
    children: [
      {
        path: 'noticelist',
        name: 'noticelist',
        component: () => import('@/views/setting/noticelist'),
        meta: { title: '公告列表', icon: 'dashboard'},
      },
     
    ]
  },
  { path: '*', redirect: '/404', hidden: true ,meta:{roles: 0}}
];

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
