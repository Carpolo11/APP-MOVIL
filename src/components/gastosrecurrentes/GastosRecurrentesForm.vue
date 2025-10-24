<template>
  <form @submit.prevent="onSubmit" class="meta-form">
    <div class="input-group">
      <label>Nombre del Gasto: </label>
      <input
        v-model="nombre"
        type="text"
        placeholder="Ej. Arriendo, Internet, Luz..."
        required
      />
    </div>

    <div class="input-group">
      <label>Monto: </label>
      <div class="input-wrap">
        <span>$</span>
        <input
          v-model.number="monto"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0.00"
          required
          class="monto-input"
        />
      </div>
    </div>

    <div class="input-group">
      <label>Frecuencia:</label>
      <select v-model="frecuencia" required>
        <option value="" disabled>Selecciona la frecuencia</option>
        <option value="mensual">Mensual</option>
        <option value="semanal">Semanal</option>
        <option value="anual">Anual</option>
      </select>
    </div>

    <div class="input-group">
      <label>Fecha de inicio:</label>
      <input v-model="fechaInicio" type="date" required />
    </div>

    <button type="submit" class="btn-crear">Registrar gasto</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits(["crear-gasto"]);

const nombre = ref("");
const monto = ref<number | null>(null);
const frecuencia = ref("");
const fechaInicio = ref("");

const onSubmit = () => {
  emit("crear-gasto", {
    nombre: nombre.value.trim(),
    monto: monto.value,
    frecuencia: frecuencia.value,
    fechaInicio: fechaInicio.value
  });

  nombre.value = "";
  monto.value = null;
  frecuencia.value = "";
  fechaInicio.value = "";
};
</script>

<style scoped>
.meta-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.input-group {
  display: flex;
  flex-direction: column;
  color: #fff;
}
.input-group label {
  font-weight: 700;
  margin-bottom: 5px;
}
.input-group input,
.input-group select {
  padding: 10px;
  border: none;
  border-radius: 8px;
  outline: none;
  font-size: 16px;
}
.input-wrap {
  display: flex;
  align-items: center;
  border-radius: 8px;
  padding: 0;
  background-color: transparent;
}
.input-wrap span {
  font-weight: bold;
  margin-right: 5px;
  color: #fff;
}
.monto-input {
  background-color:#333;
  color: #ccc;
  border: none;
  padding: 10px;
  border-radius: 8px;
  font-size: 16px;
  width: 100%;
}
.btn-crear {
  background-color: #0f2027;
  color: #fff;
  font-weight: bold;
  padding: 12px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.3s;
  font-size: 16px;
}
.btn-crear:hover {
  background-color: #203a43;
}
</style>
