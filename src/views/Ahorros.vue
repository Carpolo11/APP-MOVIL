<template>
  <ion-page>
    <ion-content class="ion-padding ahorros-view">
      <div class="wrapper">
      <div class="login-container">
        <h1 class="titulo">Gestión de Ahorros</h1>

        <AhorrosForm
          v-if="mostrarFormulario"
          :ahorroEditado="ahorroSeleccionado"
          @guardar="guardarAhorro"
          @cancelar="cancelarEdicion"
        />

        <div v-else>
          <ion-button expand="block" color="primary" @click="nuevoAhorro">
            Nuevo Ahorro
          </ion-button>

          <ion-list class="lista-ahorro">
            <ion-item v-for="(ahorro, index) in ahorros" :key="index">
              <ion-label>
                <h2>{{ ahorro.nombre }}</h2>
                <p>Monto meta: {{ ahorro.montoMeta.toLocaleString() }}</p>
                <p>porcentaje: {{ ahorro.porcentaje.toLocaleString() }}</p>
              </ion-label>

              <div class="acciones">
                <ion-button color="warning" size="small" @click="editarAhorro(index)">Editar</ion-button>
                <ion-button color="danger" size="small" @click="eliminarAhorro(index)">Eliminar</ion-button>
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
import AhorrosForm from '../components/ahorros/AhorrosForm.vue'

interface Ahorro {
  nombre: string
  montoMeta: number
  porcentaje: number
}

const ahorros = ref<Ahorro[]>([])
const mostrarFormulario = ref(false)
const ahorroSeleccionado = ref<Ahorro | null>(null)
const indiceEdicion = ref<number | null>(null)

// Crear nuevo ahorro
const nuevoAhorro = () => {
  ahorroSeleccionado.value = null
  mostrarFormulario.value = true
}

// Guardar ahorro (nuevo o editado)
const guardarAhorro = (ahorro: Ahorro) => {
  if (indiceEdicion.value !== null) {
    ahorros.value[indiceEdicion.value] = ahorro
  } else {
    ahorros.value.push(ahorro)
  }
  cancelarEdicion()
}

// Editar ahorro existente
const editarAhorro = (index: number) => {
  ahorroSeleccionado.value = { ...ahorros.value[index] }
  indiceEdicion.value = index
  mostrarFormulario.value = true
}

// Eliminar ahorro
const eliminarAhorro = (index: number) => {
  if (confirm('¿Deseas eliminar este ahorro?')) {
    ahorros.value.splice(index, 1)
  }
}

// Cancelar edición o creación
const cancelarEdicion = () => {
  mostrarFormulario.value = false
  ahorroSeleccionado.value = null
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

.ahorros-view {
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

.lista-ahorro {
  margin-top: 20px;
}

.acciones {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
</style>
