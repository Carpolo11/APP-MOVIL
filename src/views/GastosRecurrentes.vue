<template>
  <ion-page>
    <ion-content class="ion-padding metas-bg">
      <ion-title class="app-title">💸 GASTOS RECURRENTES</ion-title>
      <div class="card">
        <div class="metas-container">
          <GastosRecurrentesForm 
          @crear-gasto="crearGasto" 
          :gastoEditado="gastoEditando" />
          
          <!-- Mensaje si no hay gastos -->
          <div v-if="gastos.length === 0" class="empty-message">
            <p>📝 Aún no tienes gastos recurrentes registrados.</p>
          </div>
          
          <!-- Lista de gastos -->
          <div v-else class="metas-list">
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
import { collection, onSnapshot, query, where, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { getAuth } from "firebase/auth";
import GastosRecurrentesForm from "@/components/gastosrecurrentes/GastosRecurrentesForm.vue";
import GastosRecurrentesCard from "@/components/gastosrecurrentes/GastosRecurrentesCard.vue";

const auth = getAuth();
const gastos = ref<any[]>([]);

const gastoEditando = ref<any | null>(null);

// Crear gasto
const crearGasto = async (nuevoGasto: any) => {
  const user = auth.currentUser;
  if (!user) return mostrarToast("Debes iniciar sesión", "danger");

  // Si estamos editando un gasto:
  if (gastoEditando.value) {
    const refDoc = doc(db, "gastosRecurrentes", gastoEditando.value.id);
    await updateDoc(refDoc, {
      nombre: nuevoGasto.nombre,
      monto: parseFloat(nuevoGasto.monto),
      frecuencia: nuevoGasto.frecuencia,
      fechaInicio: nuevoGasto.fechaInicio
    });
    gastoEditando.value = null;
    return mostrarToast("Gasto actualizado", "success");
  }

  // Crear uno nuevo:
  await addDoc(collection(db, "gastosRecurrentes"), {
    userId: user.uid,
    nombre: nuevoGasto.nombre,
    monto: parseFloat(nuevoGasto.monto),
    frecuencia: nuevoGasto.frecuencia,
    fechaInicio: nuevoGasto.fechaInicio,
    fechaCreacion: new Date().toISOString()
  });

  mostrarToast("¡Gasto registrado!", "success");
};

// Activar modo edición
const editarGasto = (gasto: any) => {
  gastoEditando.value = gasto;
};

// Eliminar gasto
const eliminarGasto = async (id: string) => {
  await deleteDoc(doc(db, "gastosRecurrentes", id));
  mostrarToast("Gasto eliminado", "success");
};

// Cargar gastos en tiempo real
const cargarGastos = () => {
  const user = auth.currentUser;
  if (!user) return;

  const q = query(collection(db, "gastosRecurrentes"), where("userId", "==", user.uid));

  onSnapshot(q, (snapshot) => {
    const lista: any[] = [];
    snapshot.forEach((doc) => lista.push({ id: doc.id, ...doc.data() }));
    gastos.value = lista;
  });
};

const mostrarToast = async (mensaje: string, color: string) => {
  const toast = await toastController.create({
    message: mensaje,
    duration: 2000,
    color,
    position: "top"
  });
  toast.present();
};

onMounted(() => cargarGastos());
</script>


<style scoped>
.metas-bg {
  --background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
}
.card {
  display: flex;
  justify-content: center;
}
.metas-container {
  width: 95%;
  max-width: 500px;
  padding: 40px 30px;
  background: linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b);
  border-radius: 24px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}
.app-title {
  text-align: center;
  font-weight: 900;
  font-size: 30px;
  color: #fff;
  margin-top: 20px;
  text-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
}
.metas-list {
  margin-top: 2rem;
  display: grid;
  gap: 1.5rem;
}
.empty-message {
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
}
</style>