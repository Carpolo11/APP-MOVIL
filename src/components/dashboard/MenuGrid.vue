<template>
  <div class="menu-grid">
    <div
      v-for="item in menuItems"
      :key="item.label"
      class="menu-item"
      :class="{ disabled: item.disabled }"
      @click="!item.disabled && $emit('navigate', item.route)"
    >
      <div class="icon-wrapper" :style="{ background: item.color + '20' }">
        <ion-icon :name="item.icon" :style="{ color: item.color }"></ion-icon>
      </div>
      <span>{{ item.label }}</span>
      <ion-badge v-if="item.disabled" color="warning" class="status-badge">Pronto</ion-badge>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonIcon, IonBadge } from '@ionic/vue';

defineEmits<{ navigate: [route: string] }>();

const menuItems = [
  { label: 'Categorías', icon: 'pricetag', route: '/categoria', color: '#6a0dad', disabled: false },
  { label: 'Entradas', icon: 'trending-up', route: '/crear-entrada', color: '#4caf50', disabled: false },
  { label: 'Gastos', icon: 'wallet', route: '/gasto', color: '#f57c00', disabled: false },
  { label: 'Metas', icon: 'flag', route: '/metas', color: '#00bcd4', disabled: false },
  { label: 'Recurrentes', icon: 'repeat', route: '/recurrentes', color: '#e91e63', disabled: false },
  { label: 'Reportes', icon: 'bar-chart', route: '/reportes', color: '#2196f3', disabled: false },
  { label: 'Ahorros', icon: 'gift', route: '/ahorros', color: '#ffc107', disabled: false },
  { label: 'Deudas', icon: 'card', route: '/deudas', color: '#d32f2f', disabled: false },
];
</script>

<style scoped>
.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
}

.menu-item {
  background: white;
  padding: 20px 10px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
  position: relative;
  border: 1px solid #eee; /* Borde sutil */
}

.menu-item:not(.disabled):hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  background: #f9f9f9;
}

.menu-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #f1f1f1;
}

.icon-wrapper {
  padding: 12px;
  border-radius: 50%;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-item ion-icon {
  font-size: 28px;
}

.menu-item span {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  text-align: center;
  white-space: nowrap; 
}

.status-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 10px;
  padding: 3px 6px;
}

/* Responsividad */
@media (max-width: 600px) {
  .menu-grid {
    grid-template-columns: repeat(3, 1fr); 
    gap: 15px;
  }
  .menu-item {
    padding: 15px 5px;
  }
  .menu-item ion-icon {
    font-size: 24px;
  }
  .menu-item span {
    font-size: 12px;
  }
}
</style>