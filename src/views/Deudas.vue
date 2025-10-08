<template>
  <ion-page>
    <ion-content class="ion-padding deudas-view">
      <div class="wrapper">
      <div class="login-container">
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

          <ion-list class="lista-deudas">
            <ion-item v-for="(deuda, index) in deudas" :key="index">
              <ion-label>
                <h2>{{ deuda.nombre }}</h2>
                <p>Monto total: {{ deuda.montoTotal.toLocaleString() }}</p>
                <p>Cuota mínima: {{ deuda.cuotaMinima.toLocaleString() }}</p>
                <p>Fecha límite: {{ deuda.fechaLimite }}</p>
              </ion-label>

              <div class="acciones">
                <ion-button color="warning" size="small" @click="editarDeuda(index)">Editar</ion-button>
                <ion-button color="danger" size="small" @click="eliminarDeuda(index)">Eliminar</ion-button>
              </div>
            </ion-item>
          </ion-list>
        </div>
      </div>
      </div>
    </ion-content>
  </ion-page>
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

.wrapper {
  height: 100%; /* ocupa todo el ion-content */
  display: flex;
  align-items: center;   /* centra vertical */
  justify-content: center; /* centra horizontal */
}

.deudas-view {
  --background: linear-gradient(to bottom, #00c6ff, #0072ff, #7a00ff);
  display: flex;
  justify-content: center; /* centra horizontalmente */
  align-items: flex-start; /* mantiene arriba */
  min-height: 100vh;
  overflow-y: auto;
  padding-top: 60px; /* baja el cuadro */
  padding-bottom: 60px;
}

/* Caja blanca centrada */
.login-container {
  width: 90%;
  max-width: 400px;
  background: white;
  padding: 30px 25px;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
}

.titulo {
  text-align: center;
  color: #0d47a1;
  margin-bottom: 20px;
  font-weight: 600;
}

.lista-deudas {
  margin-top: 20px;
}

.acciones {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
</style>
