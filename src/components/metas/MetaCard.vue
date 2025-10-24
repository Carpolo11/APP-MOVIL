<template>
  <div class="meta-card">
    <div class="card-header">
      <h3>{{ meta.nombre }}</h3>
      <span class="meta-icon">🎯</span>
    </div>
    
    <div class="meta-info">
      <div class="info-item">
        <span class="icon">💰</span>
        <div>
          <p class="label">Monto Objetivo</p>
          <p class="value">${{ formatNumber(meta.monto) }}</p>
        </div>
      </div>
      
      <div class="info-item">
        <span class="icon">📅</span>
        <div>
          <p class="label">Plazo</p>
          <p class="value">{{ formatFecha(meta.plazo) }}</p>
        </div>
      </div>
      
      <div class="info-item">
        <span class="icon">📊</span>
        <div>
          <p class="label">% Asignado</p>
          <p class="value">{{ meta.porcentajeAsignado }}%</p>
        </div>
      </div>
    </div>
    
    <div class="progress-section">
      <div class="progress-header">
        <span class="progress-label">Progreso</span>
        <span class="progress-percentage">{{ progreso.toFixed(1) }}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progreso + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ meta: any }>();
const progreso = (props.meta.acumulado / props.meta.monto) * 100 || 0;

const formatFecha = (fecha: string) => {
  return new Date(fecha).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};

const formatNumber = (num: number) => {
  return num.toLocaleString("es-CO");
};
</script>

<style scoped>
.meta-card {
background: linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b);
  padding: 1.2rem;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.meta-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 28px rgba(102, 126, 234, 0.4);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.8rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}

.card-header h3 {
  color: #ffffff;
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.meta-icon {
  font-size: 1.8rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.meta-info {
  display: grid;
  gap: 0.8rem;
  margin-bottom: 1rem;
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

.progress-section {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 0.8rem;
  border-radius: 12px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.progress-label {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
}

.progress-percentage {
  font-size: 1.1rem;
  color: #ffffff;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.progress-bar {
  background: rgba(255, 255, 255, 0.2);
  height: 18px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
  border-radius: 10px;
  transition: width 0.5s ease;
  box-shadow: 0 2px 8px rgba(67, 233, 123, 0.4);
}

/* Responsive */
@media (max-width: 400px) {
  .meta-card {
    padding: 1rem;
  }
  
  .card-header h3 {
    font-size: 1.1rem;
  }
  
  .meta-icon {
    font-size: 1.5rem;
  }
}
</style>