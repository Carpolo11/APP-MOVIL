import { createRouter, createWebHistory } from '@ionic/vue-router'
import { RouteRecordRaw } from 'vue-router'

// Importación de vistas principales
import LoginApp from '@/views/LoginApp.vue'
import Registro from '@/views/Registro.vue'
import CrearEntrada from '@/views/CrearEntrada.vue'
import Dashboard from '@/views/Dashboard.vue'
import Deudas from '@/views/Deudas.vue'

const routes: Array<RouteRecordRaw> = [
  // Redirección inicial
  {
    path: '/',
    redirect: '/home'
  },

  // Página de inicio (login)
  {
    path: '/home',
    name: 'Home',
    component: LoginApp
  },

  // Página de registro de usuarios
  {
    path: '/registro',
    name: 'Registro',
    component: Registro
  },

  // Página principal del sistema (Dashboard)
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },

  // Página para crear nuevas entradas
  {
    path: '/crear-entrada',
    name: 'CrearEntrada',
    component: CrearEntrada
  },
  // Página para gestionar deudas
  {
    path: '/deudas',
    name: 'Deudas',
    component: Deudas
  },

  // Ruta por defecto para páginas no encontradas
  {
    path: '/:pathMatch(.*)*',
    redirect: '/home'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
