<template>
  <section class="dashboard">
    <header class="dashboard-header">
      <h1>💰 FinanceApp</h1>
      <p>Hola, <strong>Usuario!</strong> Tu resumen financiero te espera.</p>
      <p>Gestiona tus recursos de forma inteligente. 📊</p>
    </header>

    <div class="dashboard-cards">
      <!-- Card Saldo Total -->
      <div class="card saldo">
        <div class="card-content">
          <h3>Saldo Total</h3>
          <p class="monto">${{ saldoTotal.toLocaleString() }}</p>
        </div>
      </div>

      <!-- Card Total Entradas -->
      <div class="card entradas">
        <div class="card-content">
          <h3>Total Entradas</h3>
          <p class="numero-destacado">{{ totalEntradas }}</p>
        </div>
      </div>

      <!-- Card Total Categorías -->
      <div class="card categorias">
        <div class="card-content">
          <h3>Total Categorías</h3>
          <p class="numero-destacado">{{ totalCategorias }}</p>
        </div>
      </div>
    </div>

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
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

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

const cargarEntradas = async () => {
  const refEntradas = collection(db, "entradas");
  onSnapshot(refEntradas, (snapshot) => {
    let totalMonto = 0;
    snapshot.forEach((doc) => (totalMonto += Number(doc.data().monto) || 0));
    totalEntradas.value = snapshot.size;
    saldoTotal.value = totalMonto;
  });
};

const cargarCategorias = async () => {
  const snapshot = await getDocs(collection(db, "categorias"));
  totalCategorias.value = snapshot.size;
};

onMounted(() => {
  cargarEntradas();
  cargarCategorias();
});
</script>

<style scoped>
.dashboard {
  padding: 20px;
  background: linear-gradient(180deg, #0f2027, #203a43, #2c5364);
  color: white;
  min-height: 100vh;
}

.dashboard-header {
  text-align: center;
  background: linear-gradient(90deg, #a8edea, #fed6e3);
  color: #001f3f;
  padding: 2px 6px;       
  border-radius: 6px;     
  margin-bottom: 10px;    
  line-height: 1.2;       
}



.dashboard-cards {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 30px;
}

.card {
  border-radius: 15px;
  padding: 20px;
  width: 250px;
  text-align: center;
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
  transition: transform 0.3s ease;
}
.card:hover {
  transform: scale(1.03);
}

.saldo {
  background: linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b);
}
.entradas {
  background: linear-gradient(135deg, #00b09b, #96c93d);
}
.categorias {
  background: linear-gradient(135deg, #2193b0, #6dd5ed);
}

.monto {
  font-size: 1.8rem;
  font-weight: 800;
}


.numero-destacado {
  font-size: 2.2rem;
  font-weight: 800;
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
</style>
