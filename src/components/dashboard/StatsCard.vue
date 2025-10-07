<template>
  <div class="stats-grid">
    <div class="stat-card" v-for="stat in stats" :key="stat.label">
      <ion-icon :name="stat.icon" :style="{ color: stat.color }"></ion-icon>
      <div>
        <h3>{{ stat.value }}</h3>
        <p>{{ stat.label }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { computed } from 'vue';

const props = defineProps<{
  categorias: number;
  entradas: number;
  saldo: number;
}>();

const stats = computed(() => [
  { icon: 'file-tray-full', value: props.categorias, label: 'Categorías', color: '#667eea' },
  { icon: 'trending-up', value: props.entradas, label: 'Entradas', color: '#43e97b' },
  { icon: 'wallet', value: `$${props.saldo.toLocaleString()}`, label: 'Saldo', color: '#f093fb' },
]);
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 25px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}

.stat-card ion-icon {
  font-size: 32px;
}

.stat-card h3 {
  font-size: 24px;
  margin: 0;
  color: #2c3e50;
  font-weight: 700;
}

.stat-card p {
  font-size: 13px;
  margin: 0;
  color: #7f8c8d;
}

@media (max-width: 600px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>