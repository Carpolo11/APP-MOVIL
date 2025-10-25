<template>
  <ion-page>
    <ion-content class="ion-padding metas-bg">
      <ion-title class="app-title">💸 GASTOS RECURRENTES</ion-title>
      <div class="card">
        <div class="metas-container">
          <GastosRecurrentesForm @crear-gasto="agregarGasto" />
          <div class="metas-list">
            <GastosRecurrentesCard
              v-for="gasto in gastos"
              :key="gasto.id"
              :gasto="gasto"
            />
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonTitle } from "@ionic/vue";
import { ref, onMounted } from "vue";
import { collection, addDoc, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { getAuth } from "firebase/auth";
import GastosRecurrentesForm from "@/components/gastosrecurrentes/GastosRecurrentesForm.vue";
import GastosRecurrentesCard from "@/components/gastosrecurrentes/GastosRecurrentesCard.vue";

const auth = getAuth();
const gastos = ref<any[]>([]);

// Cargar gastos recurrentes en tiempo real
const cargarGastos = () => {
  const user = auth.currentUser;
  if (!user) return;

  const q = query(
    collection(db, "gastosRecurrentes"),
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
    gastos.value = lista;
    console.log("Gastos recurrentes actualizados:", gastos.value);
  });
};

// Agregar nuevo gasto recurrente
const agregarGasto = async (gasto: any) => {
  if (!gasto.nombre || !gasto.monto || !gasto.frecuencia || !gasto.fechaInicio) {
    alert("Por favor completa todos los campos");
    return;
  }

  if (gasto.monto <= 0) {
    alert("Ingresa un monto válido");
    return;
  }

  try {
    const user = auth.currentUser;

    if (user) {
      await addDoc(collection(db, "gastosRecurrentes"), {
        nombre: gasto.nombre,
        monto: Number(gasto.monto),
        frecuencia: gasto.frecuencia,
        fechaInicio: gasto.fechaInicio,
        fechaRegistro: new Date(),
        userId: user.uid
      });

      alert(`Gasto recurrente registrado: ${gasto.nombre}`);
    }
  } catch (error) {
    console.error("Error al registrar gasto recurrente:", error);
    alert("Hubo un error al registrar el gasto recurrente");
  }
};

onMounted(() => {
  cargarGastos();
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