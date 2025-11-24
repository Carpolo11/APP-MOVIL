<template>
  <div class="gasto-card">
    <div class="categoria-info">
      <h3>{{ gasto.titulo || 'Gasto sin descripción' }}</h3>
      <span class="gasto-icon">💸</span>
    </div>
    
    <div class="gasto-info">
      <div class="info-item">
        <span class="icon">💵</span>
        <div>
          <p class="label">Monto</p>
          <p class="value">${{ gasto.monto }}</p>
        </div>
      </div>
      
      <div class="info-item">
        <span class="icon">📖</span>
        <div>
          <p class="label">Descripción</p>
          <p class="value">{{ gasto.descripcion }}</p>
        </div>
      </div>
       
      <div class="info-item">
        <span class="icon">📋</span>
        <div>
          <p class="label">Categoria</p>
          <p class="value">{{ gasto.categoria }}</p>
        </div>
      </div>
    </div>

    <div class="acciones">
      <ion-button class="boton-edit" size="small" @click="$emit('editar', gasto)">
        Editar
      </ion-button>

      <ion-button class="boton-elim" size="small" @click="$emit('eliminar', gasto.id)">
        Eliminar
      </ion-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonButton } from "@ionic/vue";

// Props
defineProps<{
  gasto: any;
}>();

// Emits
defineEmits<{
  editar: [gasto: any];
  eliminar: [id: string];
}>();
</script>

<style scoped>
.gasto-card {
  background: linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b);
  padding: 1.2rem;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  margin-top: 20px;
}

.gasto-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 28px rgba(102, 126, 234, 0.4);
}

.categoria-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.8rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}

.categoria-info h3 {
  color: #ffffff;
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 767px) {
  .categoria-info h3 {
    font-size: 1.1rem;
  }
}

.gasto-info {
  display: grid;
  gap: 0.8rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 0.6rem 0.8rem;
  border-radius: 12px;
  transition: background 0.2s ease;
}

.info-item:hover {
  background: rgba(255, 255, 255, 0.25);
}

.info-item .icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.info-item .label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-weight: 500;
}

.info-item .value {
  font-size: 0.95rem;
  color: #ffffff;
  margin: 0;
  font-weight: 700;
}

.boton-elim {
  --background: linear-gradient(90deg, #c73154, #ff7a5f);
  --color: white;
  font-weight: 700;
  border-radius: 20px;
}

.boton-edit {
  --background: linear-gradient(90deg, #13c2ad, #32af19);
  --color: white;
  font-weight: 700;
  border-radius: 20px;
}

.acciones {
  display: flex;
  margin-top: 15px;
  justify-content: center;
  gap: 6px;
}

.gasto-icon {
  font-size: 1.8rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  flex-shrink: 0;
  margin-left: 0.5rem;
}

@media (max-width: 767px) {
  .gasto-icon {
    font-size: 1.5rem;
  }
}
</style>