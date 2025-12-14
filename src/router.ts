import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalized,
} from 'vue-router';
import Consent from './components/Consent.vue';
import DayMovements from './forms/DayMovements.vue';

const routes = [
  {
    path: '/',
    name: 'day-movements',
    component: DayMovements,
  },
  {
    path: '/consent',
    name: 'consent',
    component: Consent,
  },
  {
    path: '/login',
    redirect: '/',
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

router.beforeEach((_to: RouteLocationNormalized, _from, next) => next());

export default router;
