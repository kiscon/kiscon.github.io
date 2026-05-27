import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/views/Layout.vue'),
    children: [
      {
        path: '',
        redirect: '/storage'
      },
      {
        path: 'storage',
        component: () => import('@/views/Storage.vue'),
        meta: { title: '稻谷入仓' }
      },
      {
        path: 'primary',
        component: () => import('@/views/PrimaryProcessing.vue'),
        meta: { title: '初加工' }
      },
      {
        path: 'refined',
        component: () => import('@/views/RefinedProcessing.vue'),
        meta: { title: '精加工' }
      },
      {
        path: 'bran',
        component: () => import('@/views/BranProcessing.vue'),
        meta: { title: '糠加工' }
      },
      {
        path: 'report',
        component: () => import('@/views/ProductionReport.vue'),
        meta: { title: '投入产出报表' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router