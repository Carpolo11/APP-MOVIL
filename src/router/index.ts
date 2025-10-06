import { createRouter, createWebHistory } from '@ionic/vue-router'
import { RouteRecordRaw } from 'vue-router'

// Importación de vistas principales
import LoginApp from '@/views/LoginApp.vue'
import Registro from '@/views/Registro.vue'
import CrearEntrada from '@/views/CrearEntrada.vue'
import Dashboard from '@/views/Dashboard.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home' // redirige automáticamente a la pantalla de inicio (Login)
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
    path: '/crear-entrada',
    name: 'CrearEntrada',
    component: CrearEntrada
  },
  
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
