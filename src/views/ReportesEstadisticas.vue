<template>
  <ion-page>
    <ion-content class="ion-padding creatCat-bg">

      <ion-title class="app-title">📊 Reportes y Estadísticas</ion-title>

      <div class="dashboard-container">

        <!-- Filtros arriba, sueltos -->
        <div class="filtros">
          <label>Periodo:</label>
          <select v-model="periodoSeleccionado">
            <option value="diario">Diario</option>
            <option value="semanal">Semanal</option>
            <option value="mensual">Mensual</option>
            <option value="anual">Anual</option>
          </select>
        </div>

        <!-- Resumen General -->
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

        <!-- Secciones de gráficos -->
        <div class="grid-2col">

          <!-- Comparativa -->
          <div class="seccion-grafico">
            <h4>📈 Comparativa Ingresos vs Gastos</h4>
            <div class="grafico"><canvas ref="graficoComparativo"></canvas></div>
          </div>

          <!-- Categorías -->
          <div class="seccion-grafico">
            <h4>💰 Categorías con Mayor Gasto</h4>
            <div class="grafico"><canvas ref="graficoCategoriasGasto"></canvas></div>

            <div class="top-categorias" v-if="topCategoriasGasto.length > 0">
              <div v-for="(cat, idx) in topCategoriasGasto.slice(0, 3)" :key="idx" class="categoria-item">
                <span class="categoria-nombre">{{ cat.nombre }}</span>
                <span class="categoria-monto">${{ cat.total.toFixed(2) }}</span>
                <span class="categoria-porcentaje">{{ cat.porcentaje.toFixed(1) }}%</span>
              </div>
            </div>
          </div>

          <!-- Pie Chart -->
          <div class="seccion-grafico">
            <h4>🎯 Distribución de Gastos</h4>
            <div class="grafico-pie"><canvas ref="graficoDistribucion"></canvas></div>
          </div>

          <!-- Tendencia -->
          <div class="seccion-grafico">
            <h4>📊 Tendencia Semanal</h4>
            <div class="grafico"><canvas ref="graficoTendencia"></canvas></div>
          </div>
        </div>

        <!-- Stats Finales -->
        <div class="stats-adicionales">
          <div class="stat-item">
            <span class="stat-label">Promedio de gasto diario</span>
            <span class="stat-value">${{ promedioDiarioGasto.toFixed(2) }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Promedio de ingreso diario</span>
            <span class="stat-value">${{ promedioDiarioIngreso.toFixed(2) }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Total de transacciones</span>
            <span class="stat-value">{{ totalTransacciones }}</span>
          </div>
        </div>

      </div>

      <div class="button-row">
        <ion-button expand="block" router-link="/dashboard" class="back-btn">VOLVER</ion-button>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonTitle,
  IonButton 
} from "@ionic/vue";
import { ref, onMounted, watch } from 'vue'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase/firebaseConfig'
import { getAuth } from "firebase/auth";
import Chart from 'chart.js/auto'

const auth = getAuth();
const periodoSeleccionado = ref('mensual')
const saldoDisponible = ref(0)
const ingresosTotales = ref(0)
const gastosTotales = ref<number>(0)
const balanceMensual = ref(0)

// Refs para canvas
const graficoComparativo = ref<HTMLCanvasElement | null>(null)
const graficoCategoriasGasto = ref<HTMLCanvasElement | null>(null)
const graficoDistribucion = ref<HTMLCanvasElement | null>(null)
const graficoTendencia = ref<HTMLCanvasElement | null>(null)

// Instancias de gráficos
let chartComparativo: Chart | null = null
let chartCategorias: Chart | null = null
let chartDistribucion: Chart | null = null
let chartTendencia: Chart | null = null

// Datos adicionales
const todasLasEntradas = ref<any[]>([])
const todosLosGastos = ref<any[]>([])
const topCategoriasGasto = ref<any[]>([])
const promedioDiarioGasto = ref(0)
const promedioDiarioIngreso = ref(0)
const totalTransacciones = ref(0)

// Traer entradas en tiempo real
const traerEntradas = async () => {
  const user = auth.currentUser;
  if (user) {
    const q = query(collection(db, "entradas"), where("userId", "==", user.uid));
    onSnapshot(q, (snapshot) => {
      let totalEntradas = 0;
      const entradas: any[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        totalEntradas += Number(data.monto) || 0;
        entradas.push({ ...data, id: doc.id });
      });
      todasLasEntradas.value = entradas;
      ingresosTotales.value = totalEntradas;
      calcularBalance();
      analizarDatos();
      renderGraficos();
    });
  }
};

// Traer gastos en tiempo real
const traerGastos = async () => {
  const user = auth.currentUser;
  if (user) {
    const q = query(collection(db, "gastos"), where("UserId", "==", user.uid));
    onSnapshot(q, (snapshot) => {
      let totalGastos = 0;
      const gastos: any[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        totalGastos += Number(data.monto) || 0;
        gastos.push({ ...data, id: doc.id });
      });
      todosLosGastos.value = gastos;
      gastosTotales.value = totalGastos;
      calcularBalance();
      analizarDatos();
      renderGraficos();
    });
  }
};

// Calcular balance
function calcularBalance() {
  saldoDisponible.value = ingresosTotales.value - gastosTotales.value;
  balanceMensual.value = ingresosTotales.value - gastosTotales.value;
  totalTransacciones.value = todasLasEntradas.value.length + todosLosGastos.value.length;
}

// Analizar datos adicionales
function analizarDatos() {
  // Analizar categorías con mayor gasto
  const categoriaMap = new Map<string, number>();
  todosLosGastos.value.forEach(gasto => {
    const categoria = gasto.categoria || 'Sin categoría';
    const monto = Number(gasto.monto) || 0;
    categoriaMap.set(categoria, (categoriaMap.get(categoria) || 0) + monto);
  });

  topCategoriasGasto.value = Array.from(categoriaMap.entries())
    .map(([nombre, total]) => ({
      nombre,
      total,
      porcentaje: (total / gastosTotales.value) * 100
    }))
    .sort((a, b) => b.total - a.total);

  // Analizar días con mayor movimiento
  const ingresosPorDia = new Map<string, number>();
  todasLasEntradas.value.forEach(entrada => {
    if (entrada.fecha) {
      const fecha = new Date(entrada.fecha.seconds * 1000).toLocaleDateString();
      ingresosPorDia.set(fecha, (ingresosPorDia.get(fecha) || 0) + Number(entrada.monto));
    }
  });

  const gastosPorDia = new Map<string, number>();
  todosLosGastos.value.forEach(gasto => {
    if (gasto.fecha) {
      const fecha = new Date(gasto.fecha.seconds * 1000).toLocaleDateString();
      gastosPorDia.set(fecha, (gastosPorDia.get(fecha) || 0) + Number(gasto.monto));
    }
  });

  // Calcular promedios diarios
  const diasUnicos = new Set([...ingresosPorDia.keys(), ...gastosPorDia.keys()]);
  const numDias = diasUnicos.size || 1;
  promedioDiarioGasto.value = gastosTotales.value / numDias;
  promedioDiarioIngreso.value = ingresosTotales.value / numDias;
}

// Renderizar todos los gráficos
function renderGraficos() {
  renderGraficoComparativo();
  renderGraficoCategoriasGasto();
  renderGraficoDistribucion();
  renderGraficoTendencia();
}

// Gráfico comparativo (ya existente)
function renderGraficoComparativo() {
  if (!graficoComparativo.value) return;

  if (chartComparativo) {
    chartComparativo.destroy();
  }

  chartComparativo = new Chart(graficoComparativo.value, {
    type: 'bar',
    data: {
      labels: ['Ingresos', 'Gastos'],
      datasets: [{
        label: 'Comparativo',
        data: [ingresosTotales.value, gastosTotales.value],
        backgroundColor: ['#43e97b', '#ff6a6a'],
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// Gráfico de categorías con mayor gasto
function renderGraficoCategoriasGasto() {
  if (!graficoCategoriasGasto.value) return;

  if (chartCategorias) {
    chartCategorias.destroy();
  }

  const top5 = topCategoriasGasto.value.slice(0, 5);
  const labels = top5.map(c => c.nombre);
  const data = top5.map(c => c.total);

  chartCategorias = new Chart(graficoCategoriasGasto.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Gasto',
        data,
        backgroundColor: [
          '#ff6a6a',
          '#ffb199',
          '#ffd699',
          '#a8e6cf',
          '#dcedc1'
        ],
        borderRadius: 8
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { beginAtZero: true }
      }
    }
  });
}

// Gráfico de distribución (Pie Chart)
function renderGraficoDistribucion() {
  if (!graficoDistribucion.value) return;

  if (chartDistribucion) {
    chartDistribucion.destroy();
  }

  const top6 = topCategoriasGasto.value.slice(0, 6);
  const labels = top6.map(c => c.nombre);
  const data = top6.map(c => c.total);

  chartDistribucion = new Chart(graficoDistribucion.value, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: [
          '#ff6a6a',
          '#667eea',
          '#43e97b',
          '#ffb199',
          '#764ba2',
          '#ffd699'
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#fff', font: { size: 10 } }
        }
      }
    }
  });
}

// Gráfico de tendencia semanal
function renderGraficoTendencia() {
  if (!graficoTendencia.value) return;

  if (chartTendencia) {
    chartTendencia.destroy();
  }

  // Obtener últimos 7 días
  const hoy = new Date();
  const ultimos7Dias = [];
  for (let i = 6; i >= 0; i--) {
    const dia = new Date(hoy);
    dia.setDate(dia.getDate() - i);
    ultimos7Dias.push(dia.toLocaleDateString());
  }

  const ingresosPorDia = new Map<string, number>();
  todasLasEntradas.value.forEach(entrada => {
    if (entrada.fecha) {
      const fecha = new Date(entrada.fecha.seconds * 1000).toLocaleDateString();
      ingresosPorDia.set(fecha, (ingresosPorDia.get(fecha) || 0) + Number(entrada.monto));
    }
  });

  const gastosPorDia = new Map<string, number>();
  todosLosGastos.value.forEach(gasto => {
    if (gasto.fecha) {
      const fecha = new Date(gasto.fecha.seconds * 1000).toLocaleDateString();
      gastosPorDia.set(fecha, (gastosPorDia.get(fecha) || 0) + Number(gasto.monto));
    }
  });

  const dataIngresos = ultimos7Dias.map(dia => ingresosPorDia.get(dia) || 0);
  const dataGastos = ultimos7Dias.map(dia => gastosPorDia.get(dia) || 0);

  chartTendencia = new Chart(graficoTendencia.value, {
    type: 'line',
    data: {
      labels: ultimos7Dias.map(d => {
        const parts = d.split('/');
        return `${parts[0]}/${parts[1]}`;
      }),
      datasets: [
        {
          label: 'Ingresos',
          data: dataIngresos,
          borderColor: '#43e97b',
          backgroundColor: 'rgba(67, 233, 123, 0.2)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Gastos',
          data: dataGastos,
          borderColor: '#ff6a6a',
          backgroundColor: 'rgba(255, 106, 106, 0.2)',
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#fff' }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: '#fff' }
        },
        x: {
          ticks: { color: '#fff' }
        }
      }
    }
  });
}

// Cargar datos iniciales
async function cargarDatos() {
  await traerEntradas();
  await traerGastos();
}

onMounted(cargarDatos)
watch(periodoSeleccionado, cargarDatos)
</script>

<style scoped>
.creatCat-bg {
  --background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
}

/* Nuevo contenedor ancho tipo dashboard */
.dashboard-container {
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  padding: 1.5rem;
  background: linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b);
  border-radius: 20px;
  backdrop-filter: blur(12px);
}

/* Título */
.app-title {
  text-align: center;
  font-weight: 800;
  font-size: 26px;
  color: #fff;
  margin-top: 10px;
  margin-bottom: 15px;
}

/* Filtros */
.filtros {
  margin-bottom: 1.3rem;
}

.filtros label {
  color: #fff;
  font-weight: 600;
}

select {
  width: 100%;
  padding: 0.6rem;
  border-radius: 8px;
  border: 2px solid rgba(255,255,255,0.4);
  color: #fff;
  background: rgba(255,255,255,0.2);
}

/* Resumen en 4 cards */
.resumen-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.card-resumen {
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
  color: #fff;
  box-shadow: 0 4px 10px rgba(0,0,0,0.25);
}

.card-resumen h3 {
  margin-top: 0.2rem;
  font-size: 1.2rem;
}

/* Colores */
.verde { background: linear-gradient(135deg, #43e97b, #38f9d7); }
.azul { background: linear-gradient(135deg, #667eea, #764ba2); }
.rojo { background: linear-gradient(135deg, #ff6a6a, #ffb199); }
.gris { background: linear-gradient(135deg, #2c3e50, #bdc3c7); }

/* Grid para gráficos */
.grid-2col {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.3rem;
}

/* Sección de gráficos */
.seccion-grafico {
  padding: 1rem;
  border-radius: 14px;
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(10px);
}

.grafico,
.grafico-pie {
  height: 260px;
  padding: 0.5rem;
  background: rgba(255,255,255,0.1);
  border-radius: 10px;
}

.grafico-pie {
  height: 300px;
}

/* Categorías */
.categoria-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background: rgba(255,255,255,0.2);
  border-radius: 8px;
  color: #fff;
  margin-bottom: 0.5rem;
}

/* Stats */
.stats-adicionales {
  margin-top: 1.5rem;
  background: rgba(255,255,255,0.15);
  padding: 1rem;
  border-radius: 12px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 0.7rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.2);
}

/* BOTÓN */
.back-btn {
  --background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  --color: white;
  font-weight: 600;
  font-size: 0.75rem;    
  border-radius: 18px;
  padding: 4px 10px;     
  width: 45%;            
  height: 34px;          
  margin: 15px auto 0;   
}

/* Responsive */
@media (max-width: 750px) {
  .grid-2col {
    grid-template-columns: 1fr;
  }
  .resumen-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

</style>
