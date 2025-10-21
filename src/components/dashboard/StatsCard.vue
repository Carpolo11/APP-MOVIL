<template>
  <div class="stats-grid">
    
    <div class="stat-item primary">
      <ion-icon name="wallet-outline"></ion-icon>
      <div class="stat-content">
        <p class="stat-label">Saldo Total</p>
        <h3 class="stat-value">{{ formatCurrency(saldo) }}</h3>
      </div>
    </div>
    
    <div class="stat-item success">
      <ion-icon name="trending-up-outline"></ion-icon>
      <div class="stat-content">
        <p class="stat-label">Total Entradas</p>
        <h3 class="stat-value">{{ entradas }}</h3>
      </div>
    </div>
    
    <div class="stat-item info">
      <ion-icon name="pricetags-outline"></ion-icon>
      <div class="stat-content">
        <p class="stat-label">Total Categorías</p>
        <h3 class="stat-value">{{ categorias }}</h3>
      </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';

import {getDocs, collection,getDoc} from "firebase/firestore"
import { db } from '@/firebase/firebaseConfig';

defineProps<{
  categorias: number;
  entradas: number;
  saldo: number;
}>();


const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CO', { 
    style: 'currency', 
    currency: 'COP', 
    minimumFractionDigits: 0 
  }).format(value);
};
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-item {
  padding: 20px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  color: white;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
}

.stat-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.stat-item ion-icon {
  font-size: 36px;
  flex-shrink: 0;
  border: 2px solid rgba(255, 255, 255, 0.5);
  padding: 10px;
  border-radius: 50%;
}

.stat-content {
  line-height: 1.2;
}

.stat-label {
  margin: 0;
  font-size: 14px;
  opacity: 0.8;
  font-weight: 500;
}

.stat-value {
  margin: 5px 0 0 0;
  font-size: 24px;
  font-weight: 700;
}

/* Paleta de Colores para las Tarjetas */
.primary {
  background: linear-gradient(45deg, #6a0dad, #9c27b0); /* Púrpura fuerte */
}

.success {
  background: linear-gradient(45deg, #4caf50, #81c784); /* Verde de éxito */
}

.info {
  background: linear-gradient(45deg, #2196f3, #64b5f6); /* Azul de información */
}

/* Responsividad */
@media (max-width: 600px) {
  .stats-grid {
    grid-template-columns: 1fr; /* Una columna en móvil */
  }
  .stat-value {
    font-size: 22px;
  }
}
</style>