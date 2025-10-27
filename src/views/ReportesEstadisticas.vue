<template>
  <ion-page>
    <ion-content class="ion-padding creatCat-bg">
      <ion-title class="app-title">
        📊 Reportes y Estadísticas
      </ion-title>

      <div class="card">
        <div class="create-cat-container">
          <div class="filtros">
            <label>Periodo:</label>
            <select v-model="periodoSeleccionado">
              <option value="diario">Diario</option>
              <option value="semanal">Semanal</option>
              <option value="mensual">Mensual</option>
              <option value="anual">Anual</option>
            </select>
          </div>

          <div class="resumen-grid">
            <div class="card-resumen verde">
              <p>Saldo disponible</p>
              <h3>${{ saldoDisponible.toFixed(2) }}</h3>
            </div>
            <div class="card-resumen azul">
              <p>Ingresos totales</p>
              <h3>${{ ingresosTotales.toFixed(2) }}</h3>
            </div>
            <div class="card-resumen rojo">
              <p>Gastos totales</p>
              <h3>${{ gastosTotales.toFixed(2) }}</h3>
            </div>
            <div class="card-resumen gris">
              <p>Balance mensual</p>
              <h3>${{ balanceMensual.toFixed(2) }}</h3>
            </div>
          </div>

          <div class="grafico">
            <canvas ref="graficoCanvas"></canvas>
          </div>
        </div>
      </div>
      <div class="button-row">
        <ion-button expand="block" router-link="/dashboard" class="back-btn">
          VOLVER
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonTitle,
  // 👈 SE AGREGA IONBUTTON AQUÍ
  IonButton 
} from "@ionic/vue";
import { ref, onMounted, watch } from 'vue'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/firebase/firebaseConfig'
import { getAuth } from "firebase/auth";
import Chart from 'chart.js/auto'


const auth = getAuth();
const periodoSeleccionado = ref('mensual')
const saldoDisponible = ref(0)
const ingresosTotales = ref(0)
const gastosTotales = ref(0)
const balanceMensual = ref(0)
const graficoCanvas = ref<HTMLCanvasElement | null>(null)

async function cargarDatos() {
  const user = auth.currentUser;
  if (!user) return;

  // Query para entradas del usuario actual
  const qEntradas = query(
    collection(db, 'entradas'),
    where("UserId", "==", user.uid)
  );
  const entradasSnap = await getDocs(qEntradas);

  // Query para gastos del usuario actual
  const qGastos = query(
    collection(db, 'gastos'),
    where("UserId", "==", user.uid)
  );
  const gastosSnap = await getDocs(qGastos);

  const entradas = entradasSnap.docs.map(doc => doc.data())
  const gastos = gastosSnap.docs.map(doc => doc.data())

  ingresosTotales.value = entradas.reduce((acc, e) => acc + e.monto, 0)
  gastosTotales.value = gastos.reduce((acc, g) => acc + g.monto, 0)
  saldoDisponible.value = ingresosTotales.value - gastosTotales.value
  balanceMensual.value = ingresosTotales.value - gastosTotales.value

  renderGrafico()
}

function renderGrafico() {
  if (!graficoCanvas.value) return

  new Chart(graficoCanvas.value, {
    type: 'bar',
    data: {
      labels: ['Ingresos', 'Gastos'],
      datasets: [{
        label: 'Comparativo',
        data: [ingresosTotales.value, gastosTotales.value],
        backgroundColor: ['#43e97b', '#ff6a6a']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      }
    }
  })
}

onMounted(cargarDatos)
watch(periodoSeleccionado, cargarDatos)
</script>

<style scoped>
.creatCat-bg {
  --background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
}

.card {
  display: flex;
  justify-content: center;
  align-items: center;
}

.create-cat-container {
  width: 95%;
  max-width: 420px;
  padding: 30px 20px;
  background: linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  margin-top: 20px;
}

.app-title {
  text-align: center;
  font-weight: 800;
  font-size: 24px;
  color: #fff;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  margin-top: 15px;
}

.filtros {
  margin-bottom: 1rem;
}

select {
  width: 100%;
  padding: 0.6rem;
  border: 2px solid #e3e3e3;
  border-radius: 8px;
  font-size: 1rem;
}

.resumen-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.6rem;
  margin-bottom: 1rem;
}

.card-resumen {
  padding: 0.6rem;
  border-radius: 10px;
  color: #fff;
  text-align: center;
  font-weight: 600;
}

.verde { background: linear-gradient(135deg, #43e97b, #38f9d7); }
.azul { background: linear-gradient(135deg, #667eea, #764ba2); }
.rojo { background: linear-gradient(135deg, #ff6a6a, #ffb199); }
.gris { background: linear-gradient(135deg, #2c3e50, #bdc3c7); }

.card-resumen h3 {
  font-size: 1.1rem;
  margin-top: 0.3rem;
}

.grafico {
  height: 220px;
  margin-top: 1rem;
}

/* Responsive */
@media (max-width: 400px) {
  .create-cat-container {
    padding: 20px 15px;
  }
  .app-title {
    font-size: 20px;
  }
  .grafico {
    height: 180px;
  }
}

.back-btn {
  --background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  --color: white;
  font-weight: 700;
  font-size: 1.1rem;
  border-radius: 30px;
  
}
.button-row {
  display: flex;
  justify-content: center;
}
</style>