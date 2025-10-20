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
              <ion-item v-for="ahorro in ahorros" :key="ahorro.id">
                <ion-label>
                  <h2>{{ ahorro.nombre }}</h2>
                  <p>Monto meta: {{ ahorro.montoMeta.toLocaleString() }}</p>
                  <p>Porcentaje: {{ ahorro.porcentaje }}%</p>
                </ion-label>

                <div class="acciones">
                  <ion-button color="warning" size="small" @click="editarAhorro(ahorro)">
                    Editar
                  </ion-button>
                  <ion-button color="danger" size="small" @click="eliminarAhorro(ahorro.id)">
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
import { IonButton, IonList, IonItem, IonLabel } from '@ionic/vue'
import AhorrosForm from '../components/ahorros/AhorrosForm.vue'
import { db } from '@/firebase/firebaseConfig'
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore'

interface Ahorro {
  id?: string
  nombre: string
  montoMeta: number
  porcentaje: number
}

// refs principales
const ahorros = ref<Ahorro[]>([])
const mostrarFormulario = ref(false)
const ahorroSeleccionado = ref<Ahorro | null>(null)
const idEdicion = ref<string | null>(null)

// referencia a la colección de Firestore
const ahorrosRef = collection(db, 'ahorros')

// cargar ahorros desde Firebase
const cargarAhorros = async () => {
  const querySnapshot = await getDocs(ahorrosRef)
  ahorros.value = querySnapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Ahorro, 'id'>)
  }))
}

// crear nuevo ahorro
const nuevoAhorro = () => {
  ahorroSeleccionado.value = null
  mostrarFormulario.value = true
}

// guardar ahorro (nuevo o editado)
const guardarAhorro = async (ahorro: Ahorro) => {
  try {
    if (idEdicion.value) {
      // actualizar existente
      const docRef = doc(db, 'ahorros', idEdicion.value)
      await updateDoc(docRef, {
        nombre: ahorro.nombre,
        montoMeta: ahorro.montoMeta,
        porcentaje: ahorro.porcentaje
      
      })
      alert('✅ Ahorro actualizado con éxito')
    } else {
      // agregar nuevo
      await addDoc(ahorrosRef, {
        nombre: ahorro.nombre,
        montoMeta: ahorro.montoMeta,
        porcentaje: ahorro.porcentaje
      })
      alert('✅ Ahorro guardado con éxito')
    }

    await cargarAhorros()
    cancelarEdicion()
  } catch (e) {
    console.error('Error al guardar ahorro:', e)
    alert('Ocurrió un error al guardar el ahorro.')
  }
}

// editar ahorro existente
const editarAhorro = (ahorro: Ahorro) => {
  ahorroSeleccionado.value = { ...ahorro }
  idEdicion.value = ahorro.id || null
  mostrarFormulario.value = true
}

// eliminar ahorro
const eliminarAhorro = async (id?: string) => {
  if (!id) return
  if (confirm('¿Deseas eliminar este ahorro?')) {
    try {
      await deleteDoc(doc(db, 'ahorros', id))
      await cargarAhorros()
    } catch (e) {
      console.error('Error al eliminar ahorro:', e)
    }
  }
}

// cancelar creación o edición
const cancelarEdicion = () => {
  mostrarFormulario.value = false
  ahorroSeleccionado.value = null
  idEdicion.value = null
}

// cargar al montar
onMounted(() => {
  cargarAhorros()
})
</script>

<style scoped>
.wrapper {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ahorros-view {
  --background: linear-gradient(to bottom, #00c6ff, #0072ff, #7a00ff);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  overflow-y: auto;
  padding-top: 60px;
  padding-bottom: 60px;
}

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
