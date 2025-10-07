<template>
  <div class="menu-grid">
    <div 
      v-for="item in menuItems" 
      :key="item.label"
      class="menu-item"
      :class="{ disabled: item.disabled }"
      @click="!item.disabled && $emit('navigate', item.route)"
    >
      <ion-icon :name="item.icon" :style="{ color: item.color }"></ion-icon>
      <span>{{ item.label }}</span>
      <ion-badge v-if="item.disabled" color="warning">Pronto</ion-badge>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonIcon, IonBadge } from '@ionic/vue';

defineEmits<{
  navigate: [route: string];
}>();

const menuItems = [
  { label: 'Categorías', icon: 'pricetag', route: '/crear-categoria', color: '#667eea', disabled: false },
  { label: 'Entradas', icon: 'trending-up', route: '/crear-entrada', color: '#43e97b', disabled: false },
  { label: 'Gastos', icon: 'wallet', route: '/crear-gasto', color: '#f093fb', disabled: true },
  { label: 'Metas', icon: 'flag', route: '/metas', color: '#ffc409', disabled: true },
  { label: 'Recurrentes', icon: 'repeat', route: '/recurrentes', color: '#ff6b6b', disabled: true },
  { label: 'Reportes', icon: 'bar-chart', route: '/reportes', color: '#4facfe', disabled: true },
  { label: 'Ahorros', icon: 'gift', route: '/ahorros', color: '#a8edea', disabled: true },
  { label: 'Deudas', icon: 'card', route: '/deudas', color: '#fa709a', disabled: true },
];
</script>

<style scoped>
.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 15px;
  margin-bottom: 25px;
}

.menu-item {
  background: white;
  padding: 25px 15px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  transition: transform 0.2s;
  position: relative;
}

.menu-item:not(.disabled):hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.15);
}

.menu-item.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.menu-item ion-icon {
  font-size: 36px;
}

.menu-item span {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
  text-align: center;
}

.menu-item ion-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 10px;
}

@media (max-width: 600px) {
  .menu-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>