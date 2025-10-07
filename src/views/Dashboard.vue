<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>💰 FinanceApp</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="logout">
            <ion-icon name="log-out-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
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
const saldoTotal = computed(() => entradas.value.reduce((sum, e) => sum + e.monto, 0));

function navigate(route: string) {
  router.push(route);
}

function logout() {
  router.push('/home');
}
</script>

<style scoped>
ion-toolbar {
  --background: linear-gradient(135deg, #667eea, #764ba2);
  --color: white;
}

ion-title {
  font-weight: 700;
  font-size: 20px;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 15px 0;
}

@media (max-width: 600px) {
  .container {
    padding: 15px;
  }
}
</style>