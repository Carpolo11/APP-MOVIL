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

    <button type="submit" :disabled="!monto || !fecha || guardando">
      {{ guardando ? 'Guardando...' : 'Guardar' }}
    </button>
    <button type="button" class="btn-secundario" @click="volver" :disabled="guardando">
      Volver
    </button>

    <div v-if="mensaje" class="mensaje" :class="mensaje.tipo">
      {{ mensaje.texto }}
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/firebase/firebaseConfig'

const router = useRouter()

const monto = ref<number | null>(null)
const fecha = ref(new Date().toISOString().split('T')[0])
const descripcion = ref('')
const hoy = new Date().toISOString().split('T')[0]
const mensaje = ref<{ texto: string; tipo: string } | null>(null)
const guardando = ref(false)

async function onSubmit() {
  if (!monto.value || monto.value <= 0) {
    mostrarMensaje('El monto debe ser mayor a 0', 'error')
    return
  }

  guardando.value = true

  try {
    // Crear nueva entrada en Firebase
    const nuevaEntrada = {
      monto: monto.value,
      fecha: fecha.value,
      descripcion: descripcion.value || 'Sin descripción',
      createdAt: Timestamp.now()
    }

    await addDoc(collection(db, 'entradas'), nuevaEntrada)

    mostrarMensaje('¡Entrada registrada exitosamente!', 'exito')

    // Limpiar formulario
    monto.value = null
    descripcion.value = ''
    fecha.value = new Date().toISOString().split('T')[0]

    

  } catch (error) {
    console.error('Error al guardar entrada:', error)
    mostrarMensaje('Error al guardar la entrada. Intenta de nuevo.', 'error')
  } finally {
    guardando.value = false
  }
}

function volver() {
  router.push('/dashboard')
}

function mostrarMensaje(texto: string, tipo: string) {
  mensaje.value = { texto, tipo }
  setTimeout(() => {
    mensaje.value = null
  }, 3000)
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

/* Estilos para mensajes */
.mensaje {
  margin-top: 1rem;
  padding: 0.8rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  animation: slideIn 0.3s ease;
}
.mensaje.exito {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}
.mensaje.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
@keyframes slideIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>