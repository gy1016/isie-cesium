import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Layout from '@/layouts/index.vue';
import Navigation from '@/views/sys/navigation/index.vue';
import Login from '@/views/sys/login/index.vue';
import { isAuthenticated } from '@/utils/auth';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    redirect: { name: 'Navigation' },
    children: [
      {
        path: 'navigation',
        name: 'Navigation',
        component: Navigation,
      },
      {
        path: 'cesium',
        name: 'Cesium',
        component: () => import('@/views/cesium/index.vue'),
      },
      {
        path: 'leaft',
        name: 'Leaft',
        component: () => import('@/views/leaft/index.vue'),
      },
      {
        path: 'openlayers',
        name: 'Openlayers',
        component: () => import('@/views/openlayers/index.vue'),
      },
      {
        path: 'incident',
        name: 'Incident',
        component: () => import('@/views/incident/index.vue'),
      },
      {
        path: 'terrian',
        name: 'Terrian',
        component: () => import('@/views/terrian/index.vue'),
      },
      {
        path: 'gdal',
        name: 'Gdal',
        component: () => import('@/views/gdal/index.vue'),
      },
    ],
  },
  { path: '/login', name: 'Login', component: Login },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to, _from, next) => {
  if (to.name !== 'Login' && !(await isAuthenticated())) next({ name: 'Login' });
  else next();
});

export default router;
