<template>
  <ion-page>
    <ion-content class="ion-padding entradas-bg">
      <ion-title class="app-title">💰 ENTRADAS DE DINERO</ion-title>
      <div class="card">
        <div class="entradas-container">
          <EntradaForm @crear-entrada="agregarEntrada" />
          <div class="entradas-list">
            <EntradaCard v-for="entrada in entradas" :key="entrada.id" :entrada="entrada" />
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonTitle } from "@ionic/vue";
import { ref, onMounted } from "vue";
import EntradaForm from "@/components/entradas/EntradaForm.vue";
import EntradaCard from "@/components/entradas/EntradaCard.vue";
import { collection, addDoc, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { getAuth } from "firebase/auth";

const auth = getAuth();
const entradas = ref<any[]>([]);

// Cargar entradas en tiempo real
const cargarEntradas = () => {
  const user = auth.currentUser;
  if (!user) return;

  const q = query(
    collection(db, "entradas"),
    where("userId", "==", user.uid),
    orderBy("fecha", "desc")
  );

  onSnapshot(q, (snapshot) => {
    const lista: any[] = [];
    snapshot.forEach((doc) => {
      lista.push({
        id: doc.id,
        ...doc.data()
      });
    });
    entradas.value = lista;
    console.log("Entradas actualizadas en tiempo real:", entradas.value);
  });
};

const agregarEntrada = async (entrada: any) => {
  if (!entrada.monto || !entrada.fecha) {
    alert("Por favor completa todos los campos obligatorios");
    return;
  }
  
  if (entrada.monto <= 0) {
    alert("Ingresa un monto válido mayor a 0");
    return;
  }

  try {
    const user = auth.currentUser;

    if (user) {
      await addDoc(collection(db, "entradas"), {
        descripcion: entrada.descripcion || "",
        monto: Number(entrada.monto),
        fecha: entrada.fecha,
        fechaRegistro: new Date(),
        userId: user.uid
      });

      alert(`Entrada registrada exitosamente por ${Number(entrada.monto).toLocaleString("es-CO")}`);
    }
  } catch (error) {
    console.error("Error al registrar entrada:", error);
    alert("Hubo un error al registrar la entrada");
  }
};

onMounted(() => {
  cargarEntradas();
});
</script>

<style scoped>
.entradas-bg {
  --background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
}
.card {
  display: flex;
  justify-content: center;
}
.entradas-container {
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
.entradas-list {
  margin-top: 2rem;
  display: grid;
  gap: 1.5rem;
}
</style>