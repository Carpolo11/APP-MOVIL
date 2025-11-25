<template>
  <ion-page>
    <ion-content class="ion-padding metas-bg">

      <!-- Título principal -->
      <ion-title class="app-title">🎯 METAS DE AHORRO</ion-title>

      <div class="card">
        <div class="metas-container">

          <!-- Formulario de crear/editar meta -->
          <MetaForm :metaEditar="metaSeleccionada" @meta-guardada="limpiarEdicion" />
          
          <!-- Si no hay metas -->
          <div v-if="metas.length === 0" class="empty-message">
            <p>📝 Aún no tienes metas creadas.</p>
          </div>
          
          <!-- Si hay metas, las muestra con MetaCard -->
          <div v-else class="metas-list">
            <MetaCard 
              v-for="meta in metas"
              :key="meta.id"
              :meta="meta"
              @editar="prepararEdicion"   
              @eliminar="eliminarMeta"    
            />
          </div>

        </div>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
// Importaciones de Ionic
import { IonPage, IonContent, IonTitle } from "@ionic/vue";

// Importaciones de Vue
import { ref, onMounted } from "vue";

// Componentes hijos
import MetaForm from "@/components/metas/MetaForm.vue";
import MetaCard from "@/components/metas/MetaCard.vue";

// Firebase
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { getAuth } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";

// Datos del usuario
const auth = getAuth();

// Lista de metas cargadas de Firebase
const metas = ref<any[]>([]);

// Cargar metas del usuario en tiempo real
const cargarMetas = () => {
  const user = auth.currentUser;
  if (!user) {
    console.log("No hay usuario autenticado");
    return;
  }

  // Consulta metas del usuario actual, ordenadas por completada y fecha
  const q = query(
    collection(db, "metas"),
    where("userId", "==", user.uid),
    orderBy("completada", "asc"),
    orderBy("fechaRegistro", "desc")
  );

  // Escucha en tiempo real
  onSnapshot(q, (snapshot) => {
    const lista: any[] = [];
    snapshot.forEach((doc) => {
      lista.push({
        id: doc.id,
        ...doc.data()
      });
    });
    metas.value = lista;
    console.log("Metas cargadas:", metas.value);
  });
};

// Se ejecuta al entrar a la página
onMounted(() => {
  cargarMetas();
});

// Eliminar meta por ID
const eliminarMeta = async (id: string) => {
  const confirmDelete = confirm("¿Seguro que deseas eliminar esta meta?");
  if (!confirmDelete) return;

  try {
    await deleteDoc(doc(db, "metas", id));
    alert("Meta eliminada correctamente");
  } catch (error) {
    console.error("Error al eliminar meta:", error);
    alert("No fue posible eliminar la meta");
  }
};

// Meta seleccionada para edición
const metaSeleccionada = ref<Record<string, any> | undefined>(undefined);

// Pone los datos de la meta en el formulario
const prepararEdicion = (meta: Record<string, any>) => {
  metaSeleccionada.value = meta;
};

// Limpia la selección después de guardar
const limpiarEdicion = () => {
  metaSeleccionada.value = undefined;
};

</script>

<style scoped>
/* Fondo con gradiente */
.metas-bg {
  --background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
}

/* Centrado */
.card {
  display: flex;
  justify-content: center;
}

/* Contenedor */
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

/* Lista de metas */
.metas-list {
  margin-top: 2rem;
  display: grid;
  gap: 1.5rem;
}

/* Texto cuando no hay metas */
.empty-message {
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
}
</style>
