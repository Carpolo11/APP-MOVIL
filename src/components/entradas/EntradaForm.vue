<template>
  <div class="form-wrapper">
    <div class="form-card">
      <h1>Registrar Entrada de Dinero</h1>
      <p class="subtitle">Agrega una nueva entrada para actualizar tu saldo disponible.</p>

      <EntradaInput label="Descripción (opcional)" v-model="descripcion" type="text" />
      <EntradaInput label="Monto" v-model="monto" type="number" required />
      <EntradaInput label="Fecha" v-model="fecha" type="date" required />

      <EntradaActions @guardar="guardarEntrada" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EntradaInput from './EntradaInput.vue'
import EntradaActions from './EntradaActions.vue'

const descripcion = ref('')
const monto = ref<string | number>('')
const fecha = ref('')

function guardarEntrada() {
  if (!monto.value || Number(monto.value) <= 0 || !fecha.value) {
    alert('Por favor ingresa un monto válido y una fecha.')
    return
  }

  const entrada = {
    descripcion: descripcion.value,
    monto: parseFloat(monto.value.toString()),
    fecha: new Date(fecha.value),
  }

  console.log('Entrada registrada:', entrada)
}
</script>

<style scoped>
.form-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem 2rem;
  background: linear-gradient(to bottom right, #e3f2fd, #fce4ec);
  min-height: 100vh;
}

.form-card {
  background-color: #fff;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
  font-family: 'Segoe UI', sans-serif;
}

h1 {
  font-size: 2rem;
  color: #3f51b5;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1rem;
  color: #555;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .form-card {
    padding: 2rem;
  }

  h1 {
    font-size: 1.5rem;
  }
}
</style>
