<template>
  <!-- Página de Ionic -->
  <ion-page>

    <!-- Contenido con padding y fondo -->
    <ion-content class="ion-padding metas-bg">

      <!-- Título principal -->
      <ion-title class="app-title">💸 GASTOS RECURRENTES</ion-title>

      <div class="card">
        <div class="metas-container">

          <!-- Formulario para crear/editar gastos -->
          <!-- @crear-gasto = evento emitido desde el formulario -->
          <!-- :gastoEditado = se pasa el objeto a editar -->
          <GastosRecurrentesForm 
            @crear-gasto="crearGasto" 
            :gastoEditado="gastoEditando" 
          />

          <!-- Mostrar mensaje si no hay gastos -->
          <div v-if="gastos.length === 0" class="empty-message">
            <p>📝 Aún no tienes gastos recurrentes registrados.</p>
          </div>

          <!-- Mostrar lista de gastos si existen -->
          <div v-else class="metas-list">

            <!-- Componente tarjeta para cada gasto -->
            <GastosRecurrentesCard
              v-for="gasto in gastos"     
              :key="gasto.id"             
              :gasto="gasto"              
              @editar-gasto="editarGasto"
              @eliminar-gasto="eliminarGasto"
            />
          </div>

        </div>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonTitle, toastController } from "@ionic/vue";
import { ref, onMounted } from "vue";
import { 
  collection,
  onSnapshot,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { getAuth } from "firebase/auth";
import GastosRecurrentesForm from "@/components/gastosrecurrentes/GastosRecurrentesForm.vue";
import GastosRecurrentesCard from "@/components/gastosrecurrentes/GastosRecurrentesCard.vue";

/* Obtener la sesión de usuario */
const auth = getAuth();

/* Lista reactiva de gastos */
const gastos = ref<any[]>([]);

/* Variable para almacenar gasto en edición */
const gastoEditando = ref<any | null>(null);

/* Crear o actualizar un gasto */
const crearGasto = async (nuevoGasto: any) => {
  const user = auth.currentUser; // usuario logueado
  if (!user) return mostrarToast("Debes iniciar sesión", "danger");

  /* Si ya hay un gasto en edición */
  if (gastoEditando.value) {
    const refDoc = doc(db, "gastosRecurrentes", gastoEditando.value.id);

    await updateDoc(refDoc, {
      nombre: nuevoGasto.nombre,
      monto: parseFloat(nuevoGasto.monto),
      frecuencia: nuevoGasto.frecuencia,
      fechaInicio: nuevoGasto.fechaInicio
    });

    gastoEditando.value = null; // salir del modo edición
    return mostrarToast("Gasto actualizado", "success");
  }

  /* Crear un gasto nuevo */
  await addDoc(collection(db, "gastosRecurrentes"), {
    userId: user.uid,                   // ID del usuario
    nombre: nuevoGasto.nombre,
    monto: parseFloat(nuevoGasto.monto),
    frecuencia: nuevoGasto.frecuencia,
    fechaInicio: nuevoGasto.fechaInicio,
    fechaCreacion: new Date().toISOString() // fecha automática
  });

  mostrarToast("¡Gasto registrado!", "success");
};

/* Activar modo edición */
const editarGasto = (gasto: any) => {
  gastoEditando.value = gasto; // llenar formulario con datos
};

/* Eliminar gasto */
const eliminarGasto = async (id: string) => {
  await deleteDoc(doc(db, "gastosRecurrentes", id)); // borrar desde Firestore
  mostrarToast("Gasto eliminado", "success");
};

/* Cargar gastos en tiempo real */
const cargarGastos = () => {
  const user = auth.currentUser;
  if (!user) return;

  /* Consulta gastos del usuario actual */
  const q = query(
    collection(db, "gastosRecurrentes"),
    where("userId", "==", user.uid)  // filtrar por usuario
  );

  /* onSnapshot = escuchar cambios en tiempo real */
  onSnapshot(q, (snapshot) => {
    const lista: any[] = [];

    snapshot.forEach((doc) =>
      lista.push({ id: doc.id, ...doc.data() }) // agregar id + datos
    );

    gastos.value = lista; // actualizar estado
  });
};

/* Función para mostrar mensajes toast */
const mostrarToast = async (mensaje: string, color: string) => {
  const toast = await toastController.create({
    message: mensaje,
    duration: 2000,
    color: color,
    position: "top"
  });
  toast.present(); // mostrar toast
};

/* Cargar gastos cuando se abre la vista */
onMounted(() => cargarGastos());
</script>

<style scoped>
/* Fondo degradado */
.metas-bg {
  --background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
}

/* Centrar tarjeta */
.card {
  display: flex;
  justify-content: center;
}

/* Contenedor principal */
.metas-container {
  width: 95%;
  max-width: 500px;
  padding: 40px 30px;
  background: linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b);
  border-radius: 24px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

/* Título */
.app-title {
  text-align: center;
  font-weight: 900;
  font-size: 30px;
  color: #fff;
  margin-top: 20px;
  text-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
}

/* Lista de tarjetas */
.metas-list {
  margin-top: 2rem;
  display: grid;
  gap: 1.5rem;
}

/* Mensaje vacío */
.empty-message {
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
}
</style>
