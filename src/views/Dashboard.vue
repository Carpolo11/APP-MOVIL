<template>
  <ion-page>
    <ion-content scroll-y="true" class="dashboard-content">
      <section class="dashboard">
        <DashboardHeader />

        <DashboardCards
          :saldo-total="saldoTotal"
          :total-entradas="totalEntradas"
          :total-categorias="totalCategorias"
        />

        <h2 class="opciones-title">Opciones Disponibles</h2>

        <div class="opciones-grid">
          <div
            v-for="opcion in opciones"
            :key="opcion.nombre"
            class="opcion-card"
            @click="irARuta(opcion.route)"
          >
            <div class="icono">{{ opcion.icono }}</div>
            <p>{{ opcion.nombre }}</p>
          </div>
        </div>

        <!-- 🔴 BOTÓN DE CERRAR SESIÓN -->
        <div class="cerrar-sesion-container">
          <button class="btn-cerrar-sesion" @click="cerrarSesion">
            🔒 Cerrar sesión
          </button>
        </div>
      </section>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { getAuth, signOut } from "firebase/auth";

// 🔐 Instancia de autenticación
const auth = getAuth();

// Componentes
import DashboardHeader from "@/components/dashboard/DashboardHeader.vue";
import DashboardCards from "@/components/dashboard/DashboardCards.vue";

const totalEntradas = ref(0);
const totalCategorias = ref(0);
const saldoTotal = ref(0);

const router = useRouter();
const irARuta = (ruta) => router.push(ruta);

const opciones = [
  { nombre: "Categorías", icono: "🗂️", route: "/categoria" },
  { nombre: "Entradas", icono: "💰", route: "/crear-entrada" },
  { nombre: "Gastos", icono: "💸", route: "/gasto" },
  { nombre: "Metas", icono: "🎯", route: "/metas" },
  { nombre: "Recurrentes", icono: "♻️", route: "/recurrentes" },
  { nombre: "Reportes", icono: "📈", route: "/reportes" },
  { nombre: "Ahorros", icono: "🏦", route: "/ahorros" },
  { nombre: "Deudas", icono: "💳", route: "/deudas" },
];

// 🔚 Función para cerrar sesión
const cerrarSesion = async () => {
  try {
    await signOut(auth);
    router.push("/login"); // Redirige al login
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};

const cargarEntradas = async () => {
  const user = auth.currentUser;
  const q = query(collection(db, "entradas"), where("userId", "==", user?.uid));
  onSnapshot(q, (snapshot) => {
    let totalMonto = 0;
    snapshot.forEach((doc) => (totalMonto += Number(doc.data().monto) || 0));
    totalEntradas.value = snapshot.size;
    saldoTotal.value = totalMonto;
  });
};

const cargarCategorias = async () => {
  const user = auth.currentUser;
  const q = query(collection(db, "categorias"), where("userId", "==", user.uid));
  const snapshot = await getDocs(q);
  totalCategorias.value = snapshot.size;
};

onMounted(() => {
  cargarEntradas();
  cargarCategorias();
});
</script>

<style scoped>
.dashboard-content {
  padding: 20px;
  --background: linear-gradient(180deg, #0f2027, #203a43, #2c5364);
  color: white;
  min-height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.opciones-title {
  text-align: center;
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 15px;
}

.opciones-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
}

.opcion-card {
  background: #ffffff10;
  border-radius: 15px;
  width: 110px;
  height: 110px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  transition: transform 0.2s ease;
  cursor: pointer;
}
.opcion-card:hover {
  transform: scale(1.05);
  background: #ffffff20;
}

.icono {
  font-size: 2rem;
}

/* 🔴 Estilos del botón de cerrar sesión */
.cerrar-sesion-container {
  display: flex;
  justify-content: center;
  margin-top: 25px;
}

.btn-cerrar-sesion {
  background-color: #e63946;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-cerrar-sesion:hover {
  background-color: #d62828;
}
</style>
