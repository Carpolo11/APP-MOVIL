<template>
  <ion-page>
    <ion-content class="ion-padding ahorros-view">
      <ion-title class="titulo">🏦 GESTIÓN DE AHORROS</ion-title>
      <div class="wrapper">
        <div class="login-container">
          

          <AhorrosForm
            v-if="mostrarFormulario"
            :ahorroEditado="ahorroSeleccionado"
            @guardar="guardarAhorro"
            @cancelar="cancelarEdicion"
          />

          <div v-else>
            

            <ion-list class="lista-ahorro">
              <ion-item class="ahorrobd" v-for="ahorro in ahorros" :key="ahorro.id">
                <ion-label>
                  <h2>{{ ahorro.nombre }}</h2>
                  <p>Monto meta: {{ ahorro.montoMeta.toLocaleString() }}</p>
                  <p>Porcentaje: {{ ahorro.porcentaje }}%</p>
                </ion-label>

                <div class="acciones">
                  <ion-button class="boton-edit" size="small" @click="editarAhorro(ahorro)">
                    Editar
                  </ion-button>
                  <ion-button class="boton-elim" size="small" @click="eliminarAhorro(ahorro.id)">
                    Eliminar
                  </ion-button>
                </div>
              </ion-item>
            </ion-list>

            <ion-button expand="block" class="nuevo-ahorro" @click="nuevoAhorro">
              Nuevo Ahorro
            </ion-button>
            <ion-button expand="block" class="nuevo-ahorro" router-link="/dashboard">
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
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 40px;

}

.ahorros-view {
  --background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  overflow-y: auto;
  padding-top: 60px;
  padding-bottom: 60px;
}

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

.lista-ahorro {
  --background: transparent;
  background: transparent;
  margin-top: 1px;
}

.acciones {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

ion-button.nuevo-ahorro {
  --background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  --color: white;
  font-weight: 700;
  font-size: 1.1rem;
  border-radius: 30px;
  box-shadow: 0 6px 14px rgba(255, 209, 102, 0.4);
  margin-top: 20px;
}

.ahorrobd {
  --background: rgb(32, 32, 32);
  border-radius: 15px;
  margin-bottom: 15px;
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
