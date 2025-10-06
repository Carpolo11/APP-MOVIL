<template>
  <div class="actions">
    <button class="btn primary" @click="emit('guardar')">Guardar</button>
    <button class="btn secondary" @click="volver">Volver</button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['guardar'])
function volver() {
  history.back()
}
</script>

<style scoped>
.btn {
  padding: 0.9rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 10px;
  transition: background 0.3s ease;
}

.primary {
  background-color: #3f51b5;
  color: white;
}

.secondary {
  background-color: #ffca28;
  color: #2c3e50;
}

.btn:hover {
  opacity: 0.95;
}

</style>
