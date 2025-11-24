<template>
  <!-- Formulario principal -->
  <form @submit.prevent="emitirMeta" class="formulario">

    <!-- Nombre de la meta -->
    <ion-item class="input-group">
      <ion-icon name="flag-outline" slot="start"></ion-icon>
      <ion-input v-model="nombre" placeholder="Nombre de la meta" required />
    </ion-item>

    <!-- Monto objetivo -->
    <ion-item class="input-group">
      <ion-icon name="cash-outline" slot="start"></ion-icon>
      <ion-input 
        v-model="monto" 
        type="number" 
        min="1" 
        placeholder="Monto objetivo" 
        required 
      />
    </ion-item>

    <!-- Fecha límite -->
    <ion-item class="input-group">
      <ion-icon name="calendar-outline" slot="start"></ion-icon>
      <input 
        v-model="plazo" 
        type="date" 
        :min="minDate"
        class="date-input" 
        required 
      />
    </ion-item>

    <!-- Porcentaje de ingreso asignado -->
    <ion-item class="input-group">
      <ion-icon name="stats-chart-outline" slot="start"></ion-icon>
      <ion-input 
        v-model="porcentaje" 
        type="number" 
        min="0" 
        max="100" 
        placeholder="% de ingreso" 
        required 
      />
    </ion-item>

    <!-- Botón crear o actualizar -->
    <div class="button-row">
      <ion-button expand="block" type="submit" class="back-btn">
        CREAR META
      </ion-button>
    </div>

    <!-- Botón volver -->
    <div class="button-row">
      <ion-button expand="block" router-link="/dashboard" class="back-btn">
        VOLVER
      </ion-button>
    </div>

  </form>
</template>

<script setup lang="ts">
// Importaciones de Ionic, Vue y Firebase
import { 
  IonItem, 
  IonInput, 
  IonButton, 
  IonIcon
} from "@ionic/vue";
import { ref, watch } from "vue";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { getAuth } from "firebase/auth";

// Instancia de autenticación
const auth = getAuth();

// Campos del formulario
const nombre = ref("");
const monto = ref("");
const plazo = ref("");
const porcentaje = ref("");

// Fecha mínima = hoy
const minDate = new Date().toISOString().split('T')[0];

// Función que crea o actualiza la meta
const emitirMeta = async () => {
  const user = auth.currentUser;
  if (!user) return alert("Debes iniciar sesión.");

  // Datos de la meta
  const data = {
    nombre: nombre.value,
    monto: Number(monto.value),
    plazo: plazo.value,
    porcentajeAsignado: Number(porcentaje.value)
  };

  // Si está editando una meta existente
  if (props.metaEditar) {
    try {
      await updateDoc(doc(db, "metas", props.metaEditar.id), data);
      alert("Meta actualizada correctamente");
    } catch (e) {
      console.error(e);
      alert("Error al actualizar meta");
    }
    return;
  }

  // Si está creando una nueva meta
  try {
    await addDoc(collection(db, "metas"), {
      ...data,
      acumulado: 0,
      fechaRegistro: new Date(),
      completada: false,
      userId: user.uid
    });

    alert("Meta creada correctamente");
  } catch (e) {
    console.error(e);
    alert("Error al crear meta");
  }

  // Limpia el formulario
  nombre.value = "";
  monto.value = "";
  plazo.value = "";
  porcentaje.value = "";
};

// Recibe metaEditar cuando se quiere editar una meta
const props = defineProps({
  metaEditar: { type: Object, default: null }
});

// Rellena el formulario con los datos de la meta que se está editando
watch(
  () => props.metaEditar,
  (nueva) => {
    if (nueva) {
      nombre.value = nueva.nombre;
      monto.value = nueva.monto;
      plazo.value = nueva.plazo;
      porcentaje.value = nueva.porcentajeAsignado;
    }
  },
  { immediate: true }
);

</script>

<style scoped>
/* Estilo del formulario */
.formulario {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Estilo de los inputs */
.input-group {
  background: linear-gradient(135deg, #a1c4fd, #c2e9fb, #fbc2eb);
  border-radius: 18px;
  margin-bottom: 20px;
  position: relative;
}

/* Estilo del input de fecha */
.date-input {
  width: 100%;
  padding: 0.8rem;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 1rem;
  color: #2c3e50;
  font-weight: 500;
}

.date-input:focus {
  outline: none;
}

/* Estilo de botones */
.back-btn {
  --background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  --color: white;
  font-weight: 700;
  font-size: 1.1rem;
  border-radius: 30px;
  box-shadow: 0 6px 14px rgba(255, 209, 102, 0.4);
}

/* Contenedor de botones */
.button-row {
  display: flex;
  justify-content: center;
}
</style>
