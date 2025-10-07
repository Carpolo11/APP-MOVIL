<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title class="app-title">💰 FinanceApp</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="logout" class="logout-btn">
            <ion-icon name="log-out-outline" size="large"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding-top">
      <div class="container">
        <QuickInfo :userName="userName" />
        
        <StatsCard :categorias="totalCategorias" :entradas="totalEntradas" :saldo="saldoTotal" />
        
        <h2 class="section-title">Opciones Disponibles</h2>
        
        <MenuGrid @navigate="navigate" />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon } from '@ionic/vue';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import StatsCard from '@/components/dashboard/StatsCard.vue';
import MenuGrid from '@/components/dashboard/MenuGrid.vue';
import QuickInfo from '@/components/dashboard/QuickInfo.vue';

const router = useRouter();
const userName = ref('Usuario');
const categorias = ref<any[]>([]);
const entradas = ref<any[]>([]);

onMounted(() => {
  const usuario = localStorage.getItem('usuario');
  if (usuario) {
    userName.value = JSON.parse(usuario).nombre || 'Usuario';
  }
  const cats = localStorage.getItem('categorias');
  if (cats) categorias.value = JSON.parse(cats);
  const ents = localStorage.getItem('entradas');
  if (ents) entradas.value = JSON.parse(ents);
});

const totalCategorias = computed(() => categorias.value.length);
const totalEntradas = computed(() => entradas.value.length);
const saldoTotal = computed(() => entradas.value.reduce((sum, e) => sum + (e.monto || 0), 0));

function navigate(route: string) {
  router.push(route);
}

function logout() {
  router.push('/home');
}
</script>

<style scoped>
/* Colores y Tipografía */
:root {
  --primary-color: #6a0dad; 
  --secondary-color: #ffd700; 
  --background-light: #f4f5f8; 
  --text-dark: #1f2937;
}

/* 1. ESTILOS CLAVE PARA EL FONDO: ion-page y ion-content */
ion-page {

  background: var(--background-light); 
}

ion-content {
  --background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
}


/* FIN DE ESTILOS CLAVE */

ion-toolbar {
  --background: var(--primary-color);
  --color: white;
  padding: 0 10px;
}

.app-title {
  font-weight: 800;
  font-size: 22px;
}

.logout-btn {
  --color: white;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px 20px 20px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-dark);
  margin: 25px 0 15px 0;
  border-left: 4px solid var(--primary-color);
  padding-left: 10px;
}

/* Responsividad */
@media (max-width: 768px) {
  .container {
    padding: 0 15px 15px 15px;
  }
  .app-title {
    font-size: 20px;
  }
  .section-title {
    font-size: 18px;
    margin-top: 20px;
  }
}
</style>