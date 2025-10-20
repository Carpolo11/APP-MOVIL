<template>
  <div class="meta-card">
    <div class="meta-header">
      <h3>{{ meta.nombre }}</h3>
      <span class="meta-fecha">📅 {{ meta.plazo }}</span>
    </div>

    <p class="meta-detalle">
      <strong>Objetivo:</strong> ${{ meta.monto.toFixed(2) }}
    </p>

    <div class="progress-container">
      <div class="progress-bar">
        <div class="progress" :style="{ width: progreso + '%' }"></div>
      </div>
      <span class="progress-text">{{ progreso.toFixed(1) }}%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'

const props = defineProps({
  meta: {
    type: Object,
    required: true
  }
})

const progreso = computed(() =>
  (props.meta.ahorroActual / props.meta.monto) * 100
)
</script>

<style scoped>
.meta-card {
  background: linear-gradient(145deg, rgba(250, 250, 255, 0.85), rgba(240, 245, 255, 0.7));
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 20px;
  padding: 1.5rem 1.8rem;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(14px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  color: #1f2937; /* Texto oscuro para contraste */
  transition: all 0.25s ease;
}

.meta-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(79, 70, 229, 0.2);
}

/* Header */
.meta-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.6rem;
}

.meta-header h3 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e293b;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.6);
}

.meta-fecha {
  font-size: 0.9rem;
  color: #4f46e5;
  font-weight: 600;
  background: rgba(79, 70, 229, 0.08);
  padding: 0.3rem 0.6rem;
  border-radius: 8px;
}

/* Detalle */
.meta-detalle {
  color: #374151;
  font-size: 1rem;
  margin-top: 0.4rem;
  font-weight: 500;
}

.meta-detalle strong {
  color: #111827;
  font-weight: 700;
}

/* Progreso */
.progress-container {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 12px;
  background: rgba(209, 213, 219, 0.6);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.08);
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4);
  border-radius: 10px;
  transition: width 0.5s ease-in-out;
}

.progress-text {
  font-weight: 700;
  color: #111827;
  min-width: 50px;
  text-align: right;
}
</style>
