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
              <div class="deuda-item" v-for="deuda in deudas" :key="deuda.id">
                <ion-label>
                  <div class="card-header">
                <h2>{{ deuda.nombre }}</h2>
                <span class="meta-icon">💳</span>
                </div>


                <div class="info-item">
                    <span class="icon">💰</span>
                    <div>
                      <p class="label">Monto total</p>
                      <p class="value">${{ deuda.montoTotal.toLocaleString() }}</p>
                    </div>
                  </div>

                  <div class="info-item">
                    <span class="icon">🪙</span>
                    <div>
                      <p class="label">Cuota mínima</p>
                      <p class="value">${{ deuda.cuotaMinima.toLocaleString() }}</p>
                    </div>
                  </div>

                  <div class="info-item">
                    <span class="icon">📅</span>
                    <div>
                      <p class="label">Fecha límite</p>
                      <p class="value">{{ deuda.fechaLimite }}</p>
                    </div>
                  </div>

                </ion-label>

                <div class="acciones">
                  <ion-button class="boton-edit" size="small" @click="editarDeuda(deuda)">
                    Editar
                  </ion-button>
                  <ion-button class="boton-elim" size="small" @click="eliminarDeuda(deuda.id)">
                    Eliminar
                  </ion-button>
                </div>
              </div>
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
import { IonButton, IonList, IonItem, IonLabel } from '@ionic/vue'
import DeudaForm from '../components/deudas/DeudaForm.vue'

// 🔹 Importar Firebase
import { db } from '@/firebase/firebaseConfig'
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where
} from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

interface Deuda {
  id?: string
  nombre: string
  montoTotal: number
  cuotaMinima: number
  fechaLimite: string
  uid?: string // ← Identificador del usuario
}

const deudas = ref<Deuda[]>([])
const mostrarFormulario = ref(false)
const deudaSeleccionada = ref<Deuda | null>(null)
const idEdicion = ref<string | null>(null)
const auth = getAuth()

// 🔸 Escuchar autenticación y cargar solo las deudas del usuario logueado
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const q = query(collection(db, 'deudas'), where('uid', '==', user.uid))
      onSnapshot(q, (snapshot) => {
        deudas.value = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Deuda)
        }))
      })
    } else {
      deudas.value = [] // Si no hay usuario, limpiar lista
    }
  })
})

// ➕ Nueva deuda
const nuevaDeuda = () => {
  deudaSeleccionada.value = null
  idEdicion.value = null
  mostrarFormulario.value = true
}

// 💾 Guardar (crear o actualizar)
const guardarDeuda = async (deuda: Deuda) => {
  const user = auth.currentUser
  if (!user) {
    alert('No hay un usuario autenticado.')
    return
  }

  try {
    if (idEdicion.value) {
      // Actualizar
      const refDoc = doc(db, 'deudas', idEdicion.value)
      await updateDoc(refDoc, {
        nombre: deuda.nombre,
        montoTotal: deuda.montoTotal,
        cuotaMinima: deuda.cuotaMinima,
        fechaLimite: deuda.fechaLimite
      })
      alert('✅ Deuda actualizada correctamente.')
    } else {
      // Crear nueva con el UID del usuario
      await addDoc(collection(db, 'deudas'), {
        ...deuda,
        uid: user.uid,
        fechaRegistro: new Date().toISOString()
      })
      alert('✅ Deuda guardada correctamente.')
    }
  } catch (error) {
    console.error('Error al guardar deuda:', error)
    alert('❌ Ocurrió un error al guardar la deuda.')
  } finally {
    cancelarEdicion()
  }
}

// ✏️ Editar deuda
const editarDeuda = (deuda: Deuda) => {
  deudaSeleccionada.value = { ...deuda }
  idEdicion.value = deuda.id || null
  mostrarFormulario.value = true
}

// 🗑️ Eliminar deuda
const eliminarDeuda = async (id?: string) => {
  if (!id) return
  if (confirm('¿Deseas eliminar esta deuda?')) {
    try {
      await deleteDoc(doc(db, 'deudas', id))
      alert('🗑️ Deuda eliminada correctamente.')
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
  margin-top: 15px;
  justify-content: center;
  gap: 6px;
}

.deuda-item {
  background: linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b);
  --background: rgba(#3a1c71, 0.8);
  padding: 1.2rem;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  margin-left: 6px;
  margin-right: 6px;
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.8rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}


.info-item:hover {
  background: rgba(255, 255, 255, 0.25);
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 0.6rem 0.8rem;
  border-radius: 12px;
  transition: background 0.2s ease;
  margin-top: 15px;
}


.info-item .icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.meta-icon {
    font-size: 1.5rem;
  }

.info-item .label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-weight: 500;
}


.card-header h2 {
  color: #ffffff;
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}


</style>
