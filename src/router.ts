import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalized,
} from 'vue-router';
import Login from './components/Login.vue';
import Consent from './components/Consent.vue';
import DayMovements from './forms/DayMovements.vue';
import { useAuthStore } from './stores/authStore';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { guestOnly: true },
  },
  {
    path: '/',
    name: 'day-movements',
    component: DayMovements,
    meta: { requiresAuth: true },
  },
  {
    path: '/consent',
    name: 'consent',
    component: Consent,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to: RouteLocationNormalized, _from, next) => {
  const authStore = useAuthStore();

  if (!authStore.isAuthenticated) {
    // Попытка восстановления сессии при прямом переходе
    await authStore.checkAuth().catch(() => undefined);
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({
      name: 'login',
      query: { redirect: to.fullPath },
    });
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return next({ name: 'day-movements' });
  }

  return next();
});

export default router;
