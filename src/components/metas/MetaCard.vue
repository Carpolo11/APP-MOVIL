<template>
  <!-- Tarjeta completa -->
  <div class="meta-card">

    <!-- Encabezado de la meta -->
    <div class="card-header">
      <h3>{{ meta.nombre }}</h3> <!-- Nombre de la meta -->
      <span class="meta-icon">🎯</span> <!-- Icono decorativo -->
    </div>
    
    <!-- Información principal -->
    <div class="meta-info">

      <!-- Monto objetivo -->
      <div class="info-item">
        <span class="icon">💰</span>
        <div>
          <p class="label">Monto Objetivo</p>
          <p class="value">${{ formatNumber(meta.monto) }}</p>
        </div>
      </div>

      <!-- Fecha límite -->
      <div class="info-item">
        <span class="icon">📅</span>
        <div>
          <p class="label">Plazo</p>
          <p class="value">{{ formatFecha(meta.plazo) }}</p>
        </div>
      </div>

      <!-- Porcentaje asignado -->
      <div class="info-item">
        <span class="icon">📊</span>
        <div>
          <p class="label">% Asignado</p>
          <p class="value">{{ meta.porcentajeAsignado }}%</p>
        </div>
      </div>

    </div>

    <!-- Sección del progreso -->
    <div class="progress-section">

      <!-- Encabezado del progreso -->
      <div class="progress-header">
        <span class="progress-label">Progreso</span>
        <span class="progress-percentage">{{ progreso.toFixed(1) }}%</span>
      </div>

      <!-- Barra de progreso -->
      <div class="progress-bar">
        <!-- Barra rellena según % -->
        <div class="progress-fill" :style="{ width: progreso + '%' }"></div>
      </div>
    </div>

    <!-- Botones de acción -->
    <div class="actions">

      <!-- Botón editar -->
      <ion-button 
        class="boton-edit" 
        size="small" 
        @click="$emit('editar', meta)"
      >
        Editar
      </ion-button>

      <!-- Botón eliminar -->
      <ion-button 
        class="boton-elim" 
        size="small" 
        @click="$emit('eliminar', meta.id)"
      >
        Eliminar
      </ion-button>

    </div>
  </div>
</template>

<script setup lang="ts">

/* Recibe la meta desde el componente padre */
const props = defineProps<{ meta: any }>();

/* Calcula el progreso (%) */
const progreso = (props.meta.acumulado / props.meta.monto) * 100 || 0;

/* Formatea la fecha */
const formatFecha = (fecha: string) => {
  return new Date(fecha).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/* Formatea números (con puntos y comas) */
const formatNumber = (num: number) => num.toLocaleString("es-CO");
</script>

<style scoped>
/* Contenedor principal */
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
/* Encabezado */
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
}
.meta-icon {
  font-size: 1.8rem;
}
/* Información */
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
  padding: 0.6rem 0.8rem;
  border-radius: 12px;
}
.info-item .icon {
  font-size: 1.5rem;
}
.info-item .label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
}
.info-item .value {
  font-size: 0.95rem;
  color: #ffffff;
  font-weight: 700;
}
/* Progreso */
.progress-section {
  background: rgba(255, 255, 255, 0.15);
  padding: 0.8rem;
  border-radius: 12px;
}
.progress-header {
  display: flex;
  justify-content: space-between;
}
.progress-bar {
  background: rgba(255, 255, 255, 0.2);
  height: 18px;
  border-radius: 10px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
  transition: width 0.5s ease;
}
/* Botones */
.actions {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 15px;
}
.boton-elim {
  --background: linear-gradient(90deg, #c73154, #ff7a5f);
  --color: white;
}
.boton-edit {
  --background: linear-gradient(90deg, #13c2ad, #32af19);
  --color: white;
}
</style>
