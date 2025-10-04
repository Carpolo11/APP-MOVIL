import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

import LoginApp from '@/views/LoginApp.vue';
import Registro from '@/views/Registro.vue';
import CrearCategoria from '@/views/CrearCategoria.vue';
import Dashboard from '@/views/Dashboard.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: LoginApp
  },
  {
    path: '/registro',
    name: 'Registro',
    component: Registro
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/crear-categoria',
    name: 'CrearCategoria',
    component: CrearCategoria
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router