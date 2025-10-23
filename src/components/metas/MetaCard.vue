<template>
  <div class="meta-card">
    <h3>{{ meta.nombre }}</h3>
    <p><strong>Monto:</strong> ${{ meta.monto }}</p>
    <p><strong>Plazo:</strong> {{ formatFecha(meta.plazo) }}</p>
    <p><strong>% asignado:</strong> {{ meta.porcentajeAsignado }}%</p>
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: progreso + '%' }"></div>
    </div>
    <p class="progress-text">Progreso: {{ progreso.toFixed(1) }}%</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ meta: any }>();
const progreso = (props.meta.acumulado / props.meta.monto) * 100;

const formatFecha = (fecha: string) => {
  return new Date(fecha).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};
</script>

<style scoped>
.meta-card {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.meta-card h3 {
  color: #0077cc;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}
.progress-bar {
  background-color: #eee;
  height: 24px;
  border-radius: 12px;
  overflow: hidden;
  margin: 1rem 0;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(to right, #0077cc, #00c896);
  transition: width 0.5s ease;
}
.progress-text {
  font-size: 1rem;
  color: #555;
}
</style>
