<template>
  <form @submit.prevent="onSubmit">
    <div class="input-group monto">
      <label>Monto *</label>
      <div class="input-wrap">
        <span>$</span>
        <input v-model.number="monto" type="number" step="0.01" min="0.01" placeholder="0.00" required />
      </div>
    </div>

    <div class="input-group">
      <label>Fecha *</label>
      <input v-model="fecha" type="date" :max="hoy" required />
    </div>

    <div class="input-group">
      <label>Descripción</label>
      <textarea v-model="descripcion" rows="3" placeholder="Opcional..."></textarea>
    </div>

    <button type="submit" :disabled="!monto || !fecha">Guardar</button>
    <button type="button" class="btn-secundario" @click="$emit('volver')">Volver</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['guardar', 'volver'])

const monto = ref(0)
const fecha = ref(new Date().toISOString().split('T')[0])
const descripcion = ref('')
const hoy = new Date().toISOString().split('T')[0]

function onSubmit() {
  emit('guardar', {
    id: Date.now().toString(),
    monto: monto.value,
    fecha: fecha.value,
    descripcion: descripcion.value,
  })
  monto.value = 0
  descripcion.value = ''
}
</script>

<style scoped>
.input-group { margin-bottom: 1.2rem; }
label { display: block; margin-bottom: 0.4rem; font-weight: 600; color: #444; font-size: 0.9rem; }
input, textarea {
  width: 100%; padding: 0.8rem; border: 2px solid #e3e3e3;
  border-radius: 8px; font-size: 1rem; transition: 0.2s;
}
input:focus, textarea:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102,126,234,0.2); }
.monto .input-wrap { display: flex; align-items: center; border: 2px solid #e3e3e3; border-radius: 8px; padding: 0.4rem 0.8rem; }
.monto .input-wrap span { font-weight: bold; color: #43e97b; margin-right: 0.5rem; font-size: 1.4rem; }
.monto input { border: none; flex: 1; font-size: 1.5rem; font-weight: 600; }
button {
  width: 100%; padding: 0.9rem; border: none; border-radius: 10px;
  font-weight: 600; font-size: 1rem; color: #fff;
  background: linear-gradient(135deg, #667eea, #764ba2);
  margin-top: 0.5rem; transition: 0.2s; cursor: pointer;
}
button:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 5px 15px rgba(118,75,162,0.3); }
button:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-secundario { background: linear-gradient(135deg, #f093fb, #f5576c); }
</style>
