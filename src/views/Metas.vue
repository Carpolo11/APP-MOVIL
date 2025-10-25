<template>
  <ion-page>
    <ion-content class="ion-padding metas-bg">
      <ion-title class="app-title">🎯 METAS DE AHORRO</ion-title>
      <div class="card">
        <div class="metas-container">
          <MetaForm @crear-meta="agregarMeta" />
          <div class="metas-list">
            <MetaCard v-for="meta in metas" :key="meta.id" :meta="meta" />
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonTitle } from "@ionic/vue";
import { ref, onMounted } from "vue";
import MetaForm from "@/components/metas/MetaForm.vue";
import MetaCard from "@/components/metas/MetaCard.vue";
import { collection, addDoc, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { getAuth } from "firebase/auth";

const auth = getAuth();
const metas = ref<any[]>([]);

// Cargar metas en tiempo real
const cargarMetas = () => {
  const user = auth.currentUser;
  if (!user) return;

  const q = query(
    collection(db, "metas"),
    where("userId", "==", user.uid)
  );

  onSnapshot(q, (snapshot) => {
    const lista: any[] = [];
    snapshot.forEach((doc) => {
      lista.push({
        id: doc.id,
        ...doc.data()
      });
    });
    metas.value = lista;
    console.log("Metas actualizadas en tiempo real:", metas.value);
  });
};

const agregarMeta = async (meta: any) => {
  if (!meta.titulo || !meta.montoObjetivo) {
    alert("Por favor completa todos los campos");
    return;
  }
  
  if (meta.montoObjetivo <= 0) {
    alert("Ingresa un monto objetivo válido");
    return;
  }

  try {
    const user = auth.currentUser;

    if (user) {
      await addDoc(collection(db, "metas"), {
        titulo: meta.titulo,
        montoObjetivo: Number(meta.montoObjetivo),
        montoActual: meta.montoActual || 0,
        descripcion: meta.descripcion || "",
        fechaRegistro: new Date(),
        completada: false,
        userId: user.uid
      });

      alert(`Meta creada exitosamente: ${meta.titulo}`);
    }
  } catch (error) {
    console.error("Error al crear meta:", error);
    alert("Hubo un error al crear la meta");
  }
};

onMounted(() => {
  cargarMetas();
});
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
</style>