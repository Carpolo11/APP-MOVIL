<template>
  <section class="deudas-view">
    <h1 class="titulo">Gestión de Deudas y Créditos</h1>

    <DeudaForm
      v-if="mostrarFormulario"
      :deudaEditada="deudaSeleccionada"
      @guardar="guardarDeuda"
      @cancelar="cancelarEdicion"
    />

    <div v-else>
      <ion-button expand="block" color="primary" @click="nuevaDeuda">
        Nueva Deuda / Crédito
      </ion-button>

      <ion-list>
        <ion-item v-for="(deuda, index) in deudas" :key="index">
          <ion-label>
            <h2>{{ deuda.nombre }}</h2>
            <p>Monto total: {{ deuda.montoTotal.toLocaleString() }}</p>
            <p>Cuota mínima: {{ deuda.cuotaMinima.toLocaleString() }}</p>
            <p>Fecha límite: {{ deuda.fechaLimite }}</p>
          </ion-label>

          <ion-button color="warning" @click="editarDeuda(index)">Editar</ion-button>
          <ion-button color="danger" @click="eliminarDeuda(index)">Eliminar</ion-button>
        </ion-item>
      </ion-list>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IonButton, IonList, IonItem, IonLabel } from '@ionic/vue'
import DeudaForm from '../components/deudas/DeudaForm.vue'

interface Deuda {
  nombre: string
  montoTotal: number
  cuotaMinima: number
  fechaLimite: string
}

const deudas = ref<Deuda[]>([])
const mostrarFormulario = ref(false)
const deudaSeleccionada = ref<Deuda | null>(null)
const indiceEdicion = ref<number | null>(null)

// Crear nueva deuda
const nuevaDeuda = () => {
  deudaSeleccionada.value = null
  mostrarFormulario.value = true
}

// Guardar deuda (nueva o editada)
const guardarDeuda = (deuda: Deuda) => {
  if (indiceEdicion.value !== null) {
    deudas.value[indiceEdicion.value] = deuda
  } else {
    deudas.value.push(deuda)
  }
  cancelarEdicion()
}

// Editar deuda existente
const editarDeuda = (index: number) => {
  deudaSeleccionada.value = { ...deudas.value[index] }
  indiceEdicion.value = index
  mostrarFormulario.value = true
}

// Eliminar deuda
const eliminarDeuda = (index: number) => {
  if (confirm('¿Deseas eliminar esta deuda?')) {
    deudas.value.splice(index, 1)
  }
}

// Cancelar edición o creación
const cancelarEdicion = () => {
  mostrarFormulario.value = false
  deudaSeleccionada.value = null
  indiceEdicion.value = null
}
</script>

<style scoped>
.deudas-view {
  padding: 16px;
  background: linear-gradient(to bottom right, #e3f2fd, #bbdefb);
  min-height: 100vh;
}

.titulo {
  text-align: center;
  color: #0d47a1;
  margin-bottom: 20px;
  font-weight: 600;
}
</style>
