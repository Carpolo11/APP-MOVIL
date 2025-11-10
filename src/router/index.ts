import { createRouter, createWebHistory } from '@ionic/vue-router'
import { RouteRecordRaw } from 'vue-router'

// Importación de vistas principales
import LoginApp from '@/views/LoginApp.vue'
import Registro from '@/views/Registro.vue'
import CrearEntrada from '@/views/CrearEntrada.vue'
import Dashboard from '@/views/Dashboard.vue'
import Deudas from '@/views/Deudas.vue'
import Ahorros from '@/views/Ahorros.vue'
import Categorias from '@/views/Categorias.vue'
import Gastos from '@/views/Gastos.vue'
import Metas  from '@/views/Metas.vue'
import GastosRecurrentes from "@/views/GastosRecurrentes.vue";
import ReportesEstadisticas from "@/views/ReportesEstadisticas.vue";
import conversorModenas from "@/views/ConversorMonedas.vue"

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
  // Ruta para gestionar deudas
  {
    path: '/deudas',
    name: 'Deudas',
    component: Deudas
  },

  // Ruta para gestionar ahorros
  {
    path: '/ahorros',
    name: 'Ahorros',
    component: Ahorros
  },

  // Ruta por defecto para páginas no encontradas
  {
    path: '/:pathMatch(.*)*',
    redirect: '/home'
  },

  // Categorias
  {
    path: '/categoria',
    name: '/Categora',
    component: Categorias
  },

  // Gastos
  {
    path: '/gasto',
    name: '/Gastos',
    component: Gastos
  },

  //Metas
  {
    path: '/metas',
    name: 'Metas',
    component: Metas
  },

  //Gastos Recurrentes
  {
    path: '/recurrentes',
    name: 'GastosRecurrentes',
    component: GastosRecurrentes
  },

  // Reportes y Estadisticas
  {
    path: '/reportes',
    name: 'ReportesEstadisticas',
    component: ReportesEstadisticas
  },

  // Conversor de monedas
  {
    path: '/conversor',
    name: 'ConversorMonedas',
    component: conversorModenas
  },




]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
