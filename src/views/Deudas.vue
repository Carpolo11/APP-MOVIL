<template>
  <ion-page>
    <ion-content class="ion-padding deudas-view">
      <div class="wrapper">
        <div class="login-container">
          <h1 class="titulo">Gestión de Deudas y Créditos</h1>

          <!-- FORMULARIO -->
          <DeudaForm
            v-if="mostrarFormulario"
            :deudaEditada="deudaSeleccionada"
            @guardar="guardarDeuda"
            @cancelar="cancelarEdicion"
          />

          <!-- LISTA -->
          <div v-else>
            <ion-button expand="block" color="primary" @click="nuevaDeuda">
              Nueva Deuda / Crédito
            </ion-button>

            <ion-list class="lista-deudas">
              <ion-item v-for="deuda in deudas" :key="deuda.id">
                <ion-label>
                  <h2>{{ deuda.nombre }}</h2>
                  <p>Monto total: {{ deuda.montoTotal.toLocaleString() }}</p>
                  <p>Cuota mínima: {{ deuda.cuotaMinima.toLocaleString() }}</p>
                  <p>Fecha límite: {{ deuda.fechaLimite }}</p>
                </ion-label>

                <div class="acciones">
                  <ion-button color="warning" size="small" @click="editarDeuda(deuda)">
                    Editar
                  </ion-button>
                  <ion-button color="danger" size="small" @click="eliminarDeuda(deuda.id)">
                    Eliminar
                  </ion-button>
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
import { ref, onMounted } from 'vue'
import { IonButton, IonList, IonItem, IonLabel, IonIcon } from '@ionic/vue'
import DeudaForm from '../components/deudas/DeudaForm.vue'

// Importar Firestore y funciones necesarias
import { db } from '@/firebase/firebaseConfig'
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore'
import { pencilOutline, trashOutline, addCircleOutline } from 'ionicons/icons'

interface Deuda {
  id?: string
  nombre: string
  montoTotal: number
  cuotaMinima: number
  fechaLimite: string
}

const deudas = ref<Deuda[]>([])
const mostrarFormulario = ref(false)
const deudaSeleccionada = ref<Deuda | null>(null)
const idEdicion = ref<string | null>(null)

// Escuchar la colección en tiempo real
onMounted(() => {
  const q = collection(db, 'deudas')
  onSnapshot(q, (snapshot) => {
    deudas.value = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Deuda)
    }))
  })
})

// ➕ Crear nueva deuda
const nuevaDeuda = () => {
  deudaSeleccionada.value = null
  idEdicion.value = null
  mostrarFormulario.value = true
}

// Guardar (crear o actualizar)
const guardarDeuda = async (deuda: Deuda) => {
  try {
    if (idEdicion.value) {
      // Editar
      const refDoc = doc(db, 'deudas', idEdicion.value)
      await updateDoc(refDoc, {
        nombre: deuda.nombre,
        montoTotal: deuda.montoTotal,
        cuotaMinima: deuda.cuotaMinima,
        fechaLimite: deuda.fechaLimite
      })
      alert('Deuda actualizada correctamente.')
    } else {
      // Nueva
      await addDoc(collection(db, 'deudas'), deuda)
      alert('Deuda guardada correctamente.')
    }
  } catch (error) {
    console.error('Error al guardar deuda:', error)
    alert('Ocurrió un error al guardar la deuda.')
  } finally {
    cancelarEdicion()
  }
}

// Editar deuda existente
const editarDeuda = (deuda: Deuda) => {
  deudaSeleccionada.value = { ...deuda }
  idEdicion.value = deuda.id || null
  mostrarFormulario.value = true
}

// Eliminar deuda
const eliminarDeuda = async (id?: string) => {
  if (!id) return
  if (confirm('¿Deseas eliminar esta deuda?')) {
    try {
      await deleteDoc(doc(db, 'deudas', id))
      alert('Deuda eliminada correctamente.')
    } catch (error) {
      console.error('Error al eliminar deuda:', error)
    }
  }
}

// ❌ Cancelar edición o creación
const cancelarEdicion = () => {
  mostrarFormulario.value = false
  deudaSeleccionada.value = null
  idEdicion.value = null
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
