<template>
  <ion-page>
    <ion-content class="ion-padding deudas-view">
      <ion-title class="titulo">💳 GESTIÓN DE DEUDAS Y CRÉDITOS</ion-title>
      <div class="wrapper">
        <div class="login-container">
          

          <!-- FORMULARIO -->
          <DeudaForm
            v-if="mostrarFormulario"
            :deudaEditada="deudaSeleccionada"
            @guardar="guardarDeuda"
            @cancelar="cancelarEdicion"
          />

          <!-- LISTA -->
          <div v-else>
            

            <ion-list class="lista-deudas">
              <ion-item class="deuda-item" v-for="deuda in deudas" :key="deuda.id">
                <ion-label>
                  <h2>{{ deuda.nombre }}</h2>
                  <p>Monto total: {{ deuda.montoTotal.toLocaleString() }}</p>
                  <p>Cuota mínima: {{ deuda.cuotaMinima.toLocaleString() }}</p>
                  <p>Fecha límite: {{ deuda.fechaLimite }}</p>
                </ion-label>

                <div class="acciones">
                  <ion-button class="boton-edit" size="small" @click="editarDeuda(deuda)">
                    Editar
                  </ion-button>
                  <ion-button class="boton-elim" size="small" @click="eliminarDeuda(deuda.id)">
                    Eliminar
                  </ion-button>
                </div>
              </ion-item>
            </ion-list>

            <ion-button expand="block" class="nuevo-volver" @click="nuevaDeuda">
              Nueva Deuda / Crédito
            </ion-button>
            <ion-button expand="block" class="nuevo-volver" router-link="/dashboard">
              VOLVER
            </ion-button>

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
      const refDoc = doc(db, 'deudas', idEdicion.value)
      await updateDoc(refDoc, {
        nombre: deuda.nombre,
        montoTotal: deuda.montoTotal,
        cuotaMinima: deuda.cuotaMinima,
        fechaLimite: deuda.fechaLimite
      })
      alert('Deuda actualizada correctamente.')
    } else {
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
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 40px;
}

.deudas-view {
  --background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  overflow-y: auto;
  padding-top: 60px;
  padding-bottom: 60px;
}

/* Caja blanca centrada */
.login-container {
  width: 95%;
  max-width: 500px;
  padding: 40px 30px;
  background: linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b);
  border-radius: 24px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.titulo {
  text-align: center;
  font-weight: 900;
  font-size: 30px;
  color: #fff;
  margin-top: 20px;
  text-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
}

.lista-deudas {
  --background: transparent;
  background: transparent;
  margin-top: 1px;
}

.acciones {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.deuda-item {
  --background: rgb(32, 32, 32);
  border-radius: 15px;
  margin-bottom: 15px;
}

ion-button.nuevo-volver {
  --background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  --color: white;
  font-weight: 700;
  font-size: 1.1rem;
  border-radius: 30px;
  box-shadow: 0 6px 14px rgba(255, 209, 102, 0.4);
  margin-top: 20px;
}

.boton-elim {
  --background: linear-gradient(90deg, #c73154, #ff7a5f);
  --color: white;
  font-weight: 70;
  border-radius: 20px;
}

.boton-edit {
  --background: linear-gradient(90deg, #13c2ad, #32af19);
  --color: white;
  font-weight: 70;
  border-radius: 20px;
}


</style>
