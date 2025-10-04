<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="header-toolbar">
        <ion-title class="header-title">
          <ion-icon name="wallet" class="header-icon"></ion-icon>
          FinanceApp
        </ion-title>
        <ion-buttons slot="end">
          <ion-button @click="cerrarSesion" class="logout-btn">
            <ion-icon name="log-out-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="dashboard-content">
      <div class="dashboard-container">
        <!-- Hero Section -->
        <div class="hero-section">
          <div class="welcome-card">
            <div class="welcome-content">
              <h1 class="welcome-title">¡Hola, {{ nombreUsuario }}! 👋</h1>
              <p class="welcome-subtitle">Controla tus finanzas de manera inteligente</p>
            </div>
            <div class="welcome-illustration">
              <ion-icon name="analytics-outline"></ion-icon>
            </div>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card purple-gradient">
            <div class="stat-icon">
              <ion-icon name="file-tray-full"></ion-icon>
            </div>
            <div class="stat-info">
              <h3>{{ totalCategorias }}</h3>
              <p>Categorías</p>
            </div>
          </div>

          <div class="stat-card blue-gradient">
            <div class="stat-icon">
              <ion-icon name="pie-chart"></ion-icon>
            </div>
            <div class="stat-info">
              <h3>{{ porcentajeAsignado.toFixed(1) }}%</h3>
              <p>Asignado</p>
            </div>
          </div>

          <div class="stat-card green-gradient">
            <div class="stat-icon">
              <ion-icon name="trending-up"></ion-icon>
            </div>
            <div class="stat-info">
              <h3>{{ porcentajeDisponible.toFixed(1) }}%</h3>
              <p>Disponible</p>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="section-header">
          <h2>Acciones Rápidas</h2>
          <ion-badge color="primary">{{ totalCategorias }}</ion-badge>
        </div>

        <div class="actions-grid">
          <div class="action-card primary-action" @click="irCrearCategoria">
            <div class="action-icon-wrapper primary-bg">
              <ion-icon name="add-circle"></ion-icon>
            </div>
            <div class="action-content">
              <h3>Crear Categoría</h3>
              <p>Define nuevas categorías de gastos</p>
            </div>
            <ion-icon name="chevron-forward" class="action-arrow"></ion-icon>
          </div>

          <div class="action-card disabled-action">
            <div class="action-icon-wrapper secondary-bg">
              <ion-icon name="wallet"></ion-icon>
            </div>
            <div class="action-content">
              <h3>Registrar Gasto</h3>
              <p>Próximamente disponible</p>
            </div>
            <ion-badge color="warning">Pronto</ion-badge>
          </div>

          <div class="action-card disabled-action">
            <div class="action-icon-wrapper tertiary-bg">
              <ion-icon name="bar-chart"></ion-icon>
            </div>
            <div class="action-content">
              <h3>Ver Reportes</h3>
              <p>Analiza tus finanzas</p>
            </div>
            <ion-badge color="warning">Pronto</ion-badge>
          </div>

          <div class="action-card disabled-action">
            <div class="action-icon-wrapper quaternary-bg">
              <ion-icon name="settings"></ion-icon>
            </div>
            <div class="action-content">
              <h3>Configuración</h3>
              <p>Personaliza tu experiencia</p>
            </div>
            <ion-badge color="warning">Pronto</ion-badge>
          </div>
        </div>

        <!-- Categorías -->
        <div class="section-header" v-if="categorias.length > 0">
          <h2>Mis Categorías</h2>
          <ion-button fill="clear" size="small" @click="irCrearCategoria">
            <ion-icon slot="start" name="add"></ion-icon>
            Nueva
          </ion-button>
        </div>

        <div v-if="categorias.length > 0" class="categories-container">
          <div 
            v-for="(categoria, index) in categorias" 
            :key="categoria.id"
            class="category-card"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="category-header">
              <div class="category-icon" :style="{ background: getGradient(index) }">
                <ion-icon :name="getIcon(index)"></ion-icon>
              </div>
              <div class="category-info">
                <h3>{{ categoria.titulo }}</h3>
                <p>{{ categoria.descripcion || 'Sin descripción' }}</p>
              </div>
            </div>
            <div class="category-footer">
              <div class="category-date">
                <ion-icon name="calendar-outline"></ion-icon>
                {{ formatFecha(categoria.fecha) }}
              </div>
              <div class="category-percentage">
                <ion-badge :color="getBadgeColor(categoria.porcentaje)">
                  {{ categoria.porcentaje }}%
                </ion-badge>
              </div>
            </div>
            <div class="category-progress">
              <div 
                class="progress-fill" 
                :style="{ 
                  width: `${categoria.porcentaje}%`,
                  background: getGradient(index)
                }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
          <div class="empty-illustration">
            <ion-icon name="folder-open-outline"></ion-icon>
          </div>
          <h3>No tienes categorías aún</h3>
          <p>Comienza a organizar tus finanzas creando tu primera categoría de gastos</p>
          <ion-button @click="irCrearCategoria" class="cta-button">
            <ion-icon slot="start" name="add-circle"></ion-icon>
            Crear mi primera categoría
          </ion-button>
        </div>

        <!-- Footer Info -->
        <div class="footer-info">
          <ion-icon name="shield-checkmark"></ion-icon>
          <p>Tus datos están seguros y protegidos</p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonButton,
  IonButtons,
  IonBadge,
} from "@ionic/vue";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

interface Categoria {
  id: string;
  titulo: string;
  fecha: string;
  descripcion: string;
  porcentaje: number;
  fechaCreacion: string;
}

const router = useRouter();
const nombreUsuario = ref("Usuario");
const categorias = ref<Categoria[]>([]);

onMounted(() => {
  cargarCategorias();
  const usuario = localStorage.getItem("usuario");
  if (usuario) {
    const userData = JSON.parse(usuario);
    nombreUsuario.value = userData.nombre || "Usuario";
  }
});

const cargarCategorias = () => {
  const categoriasGuardadas = localStorage.getItem("categorias");
  if (categoriasGuardadas) {
    categorias.value = JSON.parse(categoriasGuardadas);
  }
};

const totalCategorias = computed(() => categorias.value.length);

const porcentajeAsignado = computed(() => {
  return categorias.value.reduce((sum, cat) => sum + cat.porcentaje, 0);
});

const porcentajeDisponible = computed(() => {
  return 100 - porcentajeAsignado.value;
});

const irCrearCategoria = () => {
  router.push("/crear-categoria");
};

const cerrarSesion = () => {
  router.push("/home");
};

const formatFecha = (fecha: string): string => {
  const date = new Date(fecha);
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
  });
};

const getGradient = (index: number): string => {
  const gradients = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
    "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
  ];
  return gradients[index % gradients.length];
};

const getIcon = (index: number): string => {
  const icons = [
    "fast-food-outline",
    "car-outline",
    "home-outline",
    "fitness-outline",
    "game-controller-outline",
    "medical-outline",
    "school-outline",
    "shirt-outline",
  ];
  return icons[index % icons.length];
};

const getBadgeColor = (porcentaje: number): string => {
  if (porcentaje >= 30) return "success";
  if (porcentaje >= 15) return "warning";
  return "danger";
};
</script>

<style scoped>
/* General Styles */
.dashboard-content {
  --background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
}

.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px 40px;
}

/* Header */
.header-toolbar {
  --background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --color: white;
  padding: 10px 0;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 22px;
}

.header-icon {
  font-size: 28px;
  color: #ffd700;
}

.logout-btn {
  --color: white;
  font-size: 24px;
}

/* Hero Section */
.hero-section {
  padding: 20px 0;
}

.welcome-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
}

.welcome-card::before {
  content: "";
  position: absolute;
  top: -50%;
  right: -20%;
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.welcome-content {
  color: white;
  z-index: 1;
}

.welcome-title {
  font-size: 28px;
  font-weight: 800;
  margin: 0 0 8px 0;
}

.welcome-subtitle {
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
}

.welcome-illustration {
  font-size: 80px;
  color: rgba(255, 255, 255, 0.2);
  z-index: 1;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin: 20px 0;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
}

.purple-gradient .stat-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.blue-gradient .stat-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.green-gradient .stat-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-info h3 {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  color: #2c3e50;
}

.stat-info p {
  margin: 0;
  font-size: 13px;
  color: #7f8c8d;
}

/* Section Header */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 30px 0 15px;
}

.section-header h2 {
  font-size: 22px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

/* Actions Grid */
.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 30px;
}

.action-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.action-card.primary-action:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.action-card.disabled-action {
  opacity: 0.6;
  cursor: not-allowed;
}

.action-icon-wrapper {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
  flex-shrink: 0;
}

.primary-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.secondary-bg {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.tertiary-bg {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.quaternary-bg {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.action-content {
  flex: 1;
}

.action-content h3 {
  margin: 0 0 5px 0;
  font-size: 16px;
  font-weight: 700;
  color: #2c3e50;
}

.action-content p {
  margin: 0;
  font-size: 13px;
  color: #7f8c8d;
}

.action-arrow {
  font-size: 20px;
  color: #bdc3c7;
}

/* Categories */
.categories-container {
  display: grid;
  gap: 15px;
}

.category-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  animation: slideIn 0.5s ease forwards;
  opacity: 0;
}

@keyframes slideIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
  from {
    opacity: 0;
    transform: translateY(20px);
  }
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.category-header {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.category-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
  flex-shrink: 0;
}

.category-info {
  flex: 1;
}

.category-info h3 {
  margin: 0 0 5px 0;
  font-size: 18px;
  font-weight: 700;
  color: #2c3e50;
}

.category-info p {
  margin: 0;
  font-size: 14px;
  color: #7f8c8d;
}

.category-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.category-date {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: #95a5a6;
}

.category-date ion-icon {
  font-size: 16px;
}

.category-progress {
  height: 6px;
  background: #ecf0f1;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.5s ease;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.empty-illustration {
  font-size: 100px;
  color: #e0e0e0;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 22px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 10px 0;
}

.empty-state p {
  color: #7f8c8d;
  margin: 0 0 30px 0;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.cta-button {
  --background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --border-radius: 25px;
  font-weight: 700;
  text-transform: none;
  padding: 0 30px;
  height: 50px;
}

/* Footer */
.footer-info {
  text-align: center;
  padding: 30px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #95a5a6;
  font-size: 13px;
}

.footer-info ion-icon {
  font-size: 18px;
  color: #27ae60;
}

/* Responsive */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .welcome-title {
    font-size: 22px;
  }

  .welcome-illustration {
    display: none;
  }
}
</style>