<template>
  <div class="meta-card">
    <div class="meta-header">
      <h3>{{ gasto.nombre }}</h3>
      <span class="meta-fecha">📅 {{ gasto.fechaInicio }}</span>
    </div>

    <p class="meta-detalle">
      <strong>Monto:</strong> ${{ gasto.monto.toFixed(2) }}
    </p>

    <p class="meta-detalle">
      <strong>Frecuencia:</strong> {{ gasto.frecuencia }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  gasto: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.meta-card {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  color: #333;
}
.meta-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.meta-header h3 {
  margin: 0;
  font-size: 20px;
  color: #3a1c71;
  font-weight: 800;
}
.meta-fecha {
  font-size: 14px;
  color: #555;
}
.meta-detalle {
  font-size: 16px;
  margin: 6px 0;
}
</style>
