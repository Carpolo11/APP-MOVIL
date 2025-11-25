<template>
  <!-- Formulario -->
  <form @submit.prevent="handleSubmit">
    
    <!-- Input: título del gasto -->
    <ion-item class="input-group">
      <ion-icon name="person-outline" slot="start"></ion-icon>
      <ion-input 
        v-model="titulo" 
        type="text" 
        placeholder="Titulo del gasto" 
        required
      />
    </ion-item>

    <!-- Input: monto del gasto -->
    <ion-item class="input-group">
      <ion-icon name="mail-outline" slot="start"></ion-icon>
      <ion-input 
        v-model="monto" 
        type="number" 
        placeholder="Monto del gasto" 
        required 
      />
    </ion-item>

    <!-- Input: descripción -->
    <ion-item class="input-group">
      <ion-icon name="lock-closed-outline" slot="start"></ion-icon>
      <ion-input
        v-model="descripcion"
        type="text"
        placeholder="Descripcion"
      />
    </ion-item>

    <!-- Select: categoría -->
    <ion-item class="input-group">
      <ion-icon name="list-outline" slot="start"></ion-icon>
      <ion-select
        v-model="cate" 
        placeholder="Selecciona una categoría"
        :selected-text="cate"
      >
        <!-- Opciones dinámicas -->
        <ion-select-option 
          v-for="categoria in categorias" 
          :key="categoria.titulo" 
          :value="categoria.titulo"
        >
          {{ categoria.titulo }}
        </ion-select-option>
      </ion-select>
    </ion-item>

    <!-- Botón principal -->
    <div class="button-row">
      <ion-button expand="block" type="submit" class="back-btn">
        {{ editando ? 'ACTUALIZAR GASTO' : 'CREAR GASTO' }}
      </ion-button>
    </div>

    <!-- Botón volver -->
    <div class="button-row">
      <ion-button expand="block" router-link="/dashboard" class="back-btn">
        VOLVER
      </ion-button>
    </div>

  </form>
</template>

<script setup lang="ts">
import {
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  IonSelect,
  IonSelectOption,
} from "@ionic/vue";
import { ref, watch } from "vue";

// Props recibidas desde el padre
const props = defineProps<{
  categorias: any[];     
  gastoEditando?: any;   
}>();

// Evento emitido al padre
const emit = defineEmits<{
  crearGasto: [gasto: any]; 
}>();

// Variables reactivas para los campos
const titulo = ref("");
const monto = ref<number>(0);
const descripcion = ref("");
const cate = ref("");
const editando = ref(false);      
const idEditando = ref<string | null>(null); 

// Cargar datos al editar un gasto
watch(() => props.gastoEditando, (gasto) => {
  if (gasto) {
    editando.value = true;        
    idEditando.value = gasto.id;  
    titulo.value = gasto.titulo;   
    monto.value = gasto.monto;
    descripcion.value = gasto.descripcion;
    cate.value = gasto.categoria;
  }
}, { immediate: true });

// Manejo del submit del formulario
const handleSubmit = () => {
  // Validar campos
  if (!titulo.value || !monto.value || !cate.value) {
    alert("Completa todos los campos");
    return;
  }

  // Emitir datos al padre
  emit("crearGasto", {
    id: idEditando.value,
    titulo: titulo.value,
    monto: Number(monto.value),
    descripcion: descripcion.value,
    categoria: cate.value,
    editando: editando.value
  });

  // Resetear formulario
  limpiarFormulario();
};

// Restablecer campos del formulario
const limpiarFormulario = () => {
  editando.value = false;
  idEditando.value = null;
  titulo.value = "";
  monto.value = 0;
  descripcion.value = "";
  cate.value = "";
};
</script>

<style scoped>
/* Estilo para los inputs */
.input-group {
  margin-bottom: 15px;
  border-radius: 25px;
}

/* Estilo botones */
.back-btn {
  --background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  --color: white;
  font-weight: 700;
  border-radius: 30px;
  margin-top: 12px;
  box-shadow: 0 4px 10px rgba(255, 209, 102, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.back-btn:hover {
  transform: translateY(-2px);
}

/* Contenedor de botones */
.button-row {
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>
