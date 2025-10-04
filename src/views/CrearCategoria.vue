<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="header-toolbar">
        <ion-buttons slot="start">
          <ion-button @click="volver">
            <ion-icon name="arrow-back"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title class="header-title">
          <ion-icon name="pricetag" class="header-icon"></ion-icon>
          Nueva Categoría
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="content-bg">
      <div class="form-container">
        
        <!-- Indicador de porcentaje disponible -->
        <div class="percentage-card" :class="getPercentageClass()">
          <div class="percentage-header">
            <div class="percentage-icon">
              <ion-icon :name="getPercentageIcon()"></ion-icon>
            </div>
            <div class="percentage-info">
              <h3>Presupuesto Disponible</h3>
              <div class="percentage-display">
                {{ porcentajeDisponible.toFixed(1) }}<span class="percent-symbol">%</span>
              </div>
            </div>
          </div>
          
          <div class="percentage-progress">
            <div class="progress-track">
              <div 
                class="progress-fill" 
                :style="{ width: `${porcentajeUsado}%` }"
                :class="getProgressClass()"
              ></div>
            </div>
            <div class="progress-labels">
              <span class="used">{{ porcentajeUsado.toFixed(1) }}% usado</span>
              <span class="available">{{ porcentajeDisponible.toFixed(1) }}% libre</span>
            </div>
          </div>
        </div>

        <!-- Formulario -->
        <div class="form-card">
          <div class="form-header">
            <ion-icon name="create-outline"></ion-icon>
            <h2>Datos de la Categoría</h2>
          </div>

          <form @submit.prevent="guardarCategoria">
            <!-- Título -->
            <div class="input-wrapper">
              <label class="input-label">
                Título <span class="required">*</span>
              </label>
              <div class="input-group">
                <div class="input-icon">
                  <ion-icon name="text-outline"></ion-icon>
                </div>
                <input
                  v-model="titulo"
                  type="text"
                  maxlength="100"
                  placeholder="Ej: Alimentación, Transporte, Entretenimiento"
                  class="custom-input"
                  required
                />
              </div>
              <div class="input-footer">
                <span class="helper-text">Dale un nombre descriptivo</span>
                <span class="char-counter" :class="{ 'near-limit': titulo.length > 90 }">
                  {{ titulo.length }}/100
                </span>
              </div>
            </div>

            <!-- Fecha -->
            <div class="input-wrapper">
              <label class="input-label">
                Fecha <span class="required">*</span>
              </label>
              <div class="input-group">
                <div class="input-icon">
                  <ion-icon name="calendar-outline"></ion-icon>
                </div>
                <ion-datetime-button datetime="fecha" class="date-button"></ion-datetime-button>
              </div>
              <div class="input-footer">
                <span class="helper-text">¿Desde cuándo aplica esta categoría?</span>
              </div>
            </div>
            
            <ion-modal :keep-contents-mounted="true">
              <ion-datetime 
                id="fecha" 
                v-model="fecha"
                presentation="date"
                :max="maxDate"
                locale="es-ES"
              ></ion-datetime>
            </ion-modal>

            <!-- Porcentaje de gasto máximo -->
            <div class="input-wrapper highlight-input">
              <label class="input-label">
                Porcentaje Máximo <span class="required">*</span>
              </label>
              <div class="input-group percentage-input">
                <div class="input-icon">
                  <ion-icon name="pie-chart-outline"></ion-icon>
                </div>
                <input
                  v-model.number="porcentaje"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="0.00"
                  class="custom-input large-input"
                  required
                />
                <span class="input-suffix">%</span>
              </div>
              
              <!-- Validación visual del porcentaje -->
              <div class="validation-badge" v-if="porcentaje > 0">
                <div v-if="validarPorcentaje()" class="badge success-badge">
                  <ion-icon name="checkmark-circle"></ion-icon>
                  <span>Porcentaje válido - Puedes continuar</span>
                </div>
                <div v-else class="badge error-badge">
                  <ion-icon name="close-circle"></ion-icon>
                  <span>Excede el límite de {{ porcentajeDisponible.toFixed(1) }}% disponible</span>
                </div>
              </div>
              
              <div class="input-footer">
                <span class="helper-text">¿Qué porcentaje de tu presupuesto destinarás?</span>
              </div>
            </div>

            <!-- Descripción -->
            <div class="input-wrapper">
              <label class="input-label">
                Descripción <span class="optional">(opcional)</span>
              </label>
              <div class="textarea-group">
                <div class="textarea-icon">
                  <ion-icon name="document-text-outline"></ion-icon>
                </div>
                <textarea
                  v-model="descripcion"
                  :maxlength="255"
                  rows="4"
                  placeholder="Describe el propósito de esta categoría, qué gastos incluirá, etc..."
                  class="custom-textarea"
                ></textarea>
              </div>
              <div class="input-footer">
                <span class="helper-text">Información adicional sobre esta categoría</span>
                <span class="char-counter" :class="{ 'near-limit': descripcion.length > 230 }">
                  {{ descripcion.length }}/255
                </span>
              </div>
            </div>

            <!-- Botones -->
            <div class="button-group">
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="!formularioValido"
                :class="{ 'disabled': !formularioValido }"
              >
                <ion-icon name="checkmark-circle-outline"></ion-icon>
                <span>Guardar Categoría</span>
              </button>

              <button 
                type="button"
                class="btn btn-secondary"
                @click="volver"
              >
                <ion-icon name="close-circle-outline"></ion-icon>
                <span>Cancelar</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Lista de categorías existentes -->
        <div v-if="categorias.length > 0" class="categories-list-card">
          <div class="list-header">
            <div class="list-title">
              <ion-icon name="list"></ion-icon>
              <h2>Categorías Creadas ({{ categorias.length }})</h2>
            </div>
            <ion-badge color="primary">{{ porcentajeUsado.toFixed(1) }}% total</ion-badge>
          </div>
          
          <div class="categories-grid">
            <div 
              v-for="(cat, index) in categorias" 
              :key="cat.id"
              class="mini-category-card"
              :style="{ animationDelay: `${index * 0.05}s` }"
            >
              <div class="mini-category-icon" :style="{ background: getGradient(index) }">
                <ion-icon :name="getIcon(index)"></ion-icon>
              </div>
              <div class="mini-category-info">
                <h4>{{ cat.titulo }}</h4>
                <p>{{ cat.descripcion || 'Sin descripción' }}</p>
              </div>
              <div class="mini-category-badge">
                <ion-badge :color="getBadgeColor(cat.porcentaje)">
                  {{ cat.porcentaje }}%
                </ion-badge>
              </div>
            </div>
          </div>
        </div>

        <!-- Tips -->
        <div class="tips-card">
          <div class="tip-icon">
            <ion-icon name="bulb"></ion-icon>
          </div>
          <div class="tip-content">
            <h3>💡 Consejo</h3>
            <p>Asigna porcentajes realistas basados en tus necesidades. Puedes ajustarlos más adelante según tus hábitos de gasto.</p>
          </div>
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
  IonDatetime,
  IonDatetimeButton,
  IonModal,
  IonBadge,
  alertController,
  toastController,
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

const titulo = ref("");
const fecha = ref(new Date().toISOString());
const descripcion = ref("");
const porcentaje = ref<number>(0);
const categorias = ref<Categoria[]>([]);
const maxDate = new Date().toISOString();

onMounted(() => {
  cargarCategorias();
});

const cargarCategorias = () => {
  const categoriasGuardadas = localStorage.getItem("categorias");
  if (categoriasGuardadas) {
    categorias.value = JSON.parse(categoriasGuardadas);
  }
};

const porcentajeUsado = computed(() => {
  return categorias.value.reduce((sum, cat) => sum + cat.porcentaje, 0);
});

const porcentajeDisponible = computed(() => {
  return 100 - porcentajeUsado.value;
});

const validarPorcentaje = (): boolean => {
  return porcentaje.value > 0 && porcentaje.value <= porcentajeDisponible.value;
};

const formularioValido = computed(() => {
  return (
    titulo.value.trim().length > 0 &&
    titulo.value.length <= 100 &&
    fecha.value &&
    porcentaje.value > 0 &&
    porcentaje.value <= 100 &&
    validarPorcentaje() &&
    descripcion.value.length <= 255
  );
});

const getPercentageClass = () => {
  const usado = porcentajeUsado.value;
  if (usado >= 90) return "danger";
  if (usado >= 70) return "warning";
  return "success";
};

const getPercentageIcon = () => {
  const usado = porcentajeUsado.value;
  if (usado >= 90) return "alert-circle";
  if (usado >= 70) return "warning";
  return "checkmark-circle";
};

const getProgressClass = () => {
  const usado = porcentajeUsado.value;
  if (usado >= 90) return "danger-progress";
  if (usado >= 70) return "warning-progress";
  return "success-progress";
};

const guardarCategoria = async () => {
  if (!formularioValido.value) {
    const alert = await alertController.create({
      header: "Formulario incompleto",
      message: "Por favor completa todos los campos correctamente.",
      buttons: ["OK"],
    });
    await alert.present();
    return;
  }

  const nuevaCategoria: Categoria = {
    id: Date.now().toString(),
    titulo: titulo.value.trim(),
    fecha: fecha.value,
    descripcion: descripcion.value.trim(),
    porcentaje: porcentaje.value,
    fechaCreacion: new Date().toISOString(),
  };

  categorias.value.push(nuevaCategoria);
  localStorage.setItem("categorias", JSON.stringify(categorias.value));

  const toast = await toastController.create({
    message: `✅ Categoría "${nuevaCategoria.titulo}" creada exitosamente`,
    duration: 2500,
    position: "top",
    color: "success",
    cssClass: "custom-toast",
  });
  await toast.present();

  limpiarFormulario();
  
  // Pequeño delay antes de volver
  setTimeout(() => {
    router.push("/dashboard");
  }, 500);
};

const limpiarFormulario = () => {
  titulo.value = "";
  fecha.value = new Date().toISOString();
  descripcion.value = "";
  porcentaje.value = 0;
};

const volver = async () => {
  if (titulo.value || descripcion.value || porcentaje.value > 0) {
    const alert = await alertController.create({
      header: "¿Salir sin guardar?",
      message: "Tienes cambios sin guardar. ¿Deseas salir de todos modos?",
      buttons: [
        {
          text: "Continuar editando",
          role: "cancel",
        },
        {
          text: "Salir",
          role: "confirm",
          handler: () => {
            router.push("/dashboard");
          },
        },
      ],
    });
    await alert.present();
  } else {
    router.push("/dashboard");
  }
};

const getGradient = (index: number): string => {
  const gradients = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
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
/* General */
.content-bg {
  --background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
}

.form-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 20px 16px 40px;
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
  font-size: 20px;
}

.header-icon {
  font-size: 24px;
  color: #ffd700;
}

/* Percentage Card */
.percentage-card {
  background: white;
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  border-left: 5px solid;
  transition: all 0.3s ease;
}

.percentage-card.success {
  border-left-color: #43e97b;
}

.percentage-card.warning {
  border-left-color: #ffc409;
}

.percentage-card.danger {
  border-left-color: #eb445a;
}

.percentage-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.percentage-icon {
  width: 60px;
  height: 60px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: white;
}

.percentage-card.success .percentage-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.percentage-card.warning .percentage-icon {
  background: linear-gradient(135deg, #ffc409 0%, #ff9800 100%);
}

.percentage-card.danger .percentage-icon {
  background: linear-gradient(135deg, #eb445a 0%, #f5576c 100%);
}

.percentage-info h3 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: #7f8c8d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.percentage-display {
  font-size: 48px;
  font-weight: 800;
  color: #2c3e50;
  line-height: 1;
}

.percent-symbol {
  font-size: 28px;
  color: #7f8c8d;
  margin-left: 2px;
}

.percentage-progress {
  margin-top: 15px;
}

.progress-track {
  height: 12px;
  background: #ecf0f1;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.5s ease;
}

.success-progress {
  background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
}

.warning-progress {
  background: linear-gradient(90deg, #ffc409 0%, #ff9800 100%);
}

.danger-progress {
  background: linear-gradient(90deg, #eb445a 0%, #f5576c 100%);
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 600;
}

.progress-labels .used {
  color: #7f8c8d;
}

.progress-labels .available {
  color: #43e97b;
}

/* Form Card */
.form-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.form-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #ecf0f1;
}

.form-header ion-icon {
  font-size: 28px;
  color: #667eea;
}

.form-header h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #2c3e50;
}

/* Input Wrapper */
.input-wrapper {
  margin-bottom: 25px;
}

.input-wrapper.highlight-input {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  padding: 20px;
  border-radius: 15px;
  border: 2px dashed #667eea;
}

.input-label {
  display: block;
  font-size: 14px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.required {
  color: #eb445a;
}

.optional {
  color: #95a5a6;
  font-weight: 500;
  text-transform: none;
  letter-spacing: normal;
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.input-group:focus-within {
  background: white;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.input-icon {
  padding: 0 15px;
  font-size: 22px;
  color: #95a5a6;
}

.custom-input {
  flex: 1;
  padding: 15px 15px 15px 0;
  border: none;
  background: transparent;
  font-size: 16px;
  color: #2c3e50;
  font-weight: 500;
  outline: none;
}

.custom-input::placeholder {
  color: #bdc3c7;
}

.large-input {
  font-size: 24px;
  font-weight: 700;
}

.input-suffix {
  padding: 0 20px;
  font-size: 24px;
  font-weight: 700;
  color: #667eea;
}

.textarea-group {
  position: relative;
  display: flex;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.textarea-group:focus-within {
  background: white;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.textarea-icon {
  padding: 15px;
  font-size: 22px;
  color: #95a5a6;
}

.custom-textarea {
  flex: 1;
  padding: 15px 15px 15px 0;
  border: none;
  background: transparent;
  font-size: 16px;
  color: #2c3e50;
  font-family: inherit;
  resize: vertical;
  outline: none;
}

.custom-textarea::placeholder {
  color: #bdc3c7;
}

.input-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  font-size: 12px;
}

.helper-text {
  color: #95a5a6;
}

.char-counter {
  color: #bdc3c7;
  font-weight: 600;
}

.char-counter.near-limit {
  color: #ff9800;
}

/* Validation Badge */
.validation-badge {
  margin-top: 12px;
}

.badge {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
}

.success-badge {
  background: linear-gradient(135deg, rgba(67, 233, 123, 0.15) 0%, rgba(56, 249, 215, 0.15) 100%);
  color: #27ae60;
  border: 2px solid #43e97b;
}

.error-badge {
  background: linear-gradient(135deg, rgba(235, 68, 90, 0.15) 0%, rgba(245, 87, 108, 0.15) 100%);
  color: #c0392b;
  border: 2px solid #eb445a;
}

.badge ion-icon {
  font-size: 22px;
}

/* Date Button */
.date-button {
  flex: 1;
  --padding-start: 0;
  --padding-end: 15px;
}

/* Buttons */
.button-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 30px;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 24px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: none;
}

.btn ion-icon {
  font-size: 22px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.btn-primary.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f8f9fa;
  color: #7f8c8d;
  border: 2px solid #e9ecef;
}

.btn-secondary:hover {
  background: #e9ecef;
  border-color: #bdc3c7;
}

/* Categories List */
.categories-list-card {
  background: white;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #ecf0f1;
}

.list-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.list-title ion-icon {
  font-size: 24px;
  color: #667eea;
}

.list-title h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #2c3e50;
}

.categories-grid {
  display: grid;
  gap: 12px;
}

.mini-category-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s ease;
  animation: slideIn 0.4s ease forwards;
  opacity: 0;
}

@keyframes slideIn {
  to {
    opacity: 1;
    transform: translateX(0);
  }
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
}

.mini-category-card:hover {
  background: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transform: translateX(5px);
}

.mini-category-icon {
  width: 45px;
  height: 45px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  flex-shrink: 0;
}

.mini-category-info {
  flex: 1;
}

.mini-category-info h4 {
  margin: 0 0 3px 0;
  font-size: 15px;
  font-weight: 700;
  color: #2c3e50;
}

.mini-category-info p {
  margin: 0;
  font-size: 12px;
  color: #95a5a6;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mini-category-badge {
  flex-shrink: 0;
}

/* Tips Card */
.tips-card {
  background: linear-gradient(135deg, #fff7e6 0%, #ffe5b4 100%);
  border-radius: 15px;
  padding: 20px;
  display: flex;
  gap: 15px;
  border-left: 4px solid #ffc409;
}

.tip-icon {
  font-size: 32px;
  color: #ff9800;
  flex-shrink: 0;
}

.tip-content h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 700;
  color: #2c3e50;
}

.tip-content p {
  margin: 0;
  font-size: 14px;
  color: #5d4037;
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 768px) {
  .form-container {
    padding: 15px;
  }

  .form-card {
    padding: 20px;
  }

  .percentage-card {
    padding: 20px;
  }

  .percentage-display {
    font-size: 36px;
  }

  .categories-list-card {
    padding: 20px;
  }
}
</style>