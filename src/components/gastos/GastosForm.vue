<template>
  <form @submit.prevent="handleSubmit">
    
    <ion-item class="input-group">
      <ion-icon name="person-outline" slot="start"></ion-icon>
      <ion-input 
        v-model="titulo" 
        type="text" 
        placeholder="Titulo del gasto" 
        required
      />
    </ion-item>

    <ion-item class="input-group">
      <ion-icon name="mail-outline" slot="start"></ion-icon>
      <ion-input 
        v-model="monto" 
        type="number" 
        placeholder="Monto del gasto" 
        required 
      />
    </ion-item>

    <ion-item class="input-group">
      <ion-icon name="lock-closed-outline" slot="start"></ion-icon>
      <ion-input
        v-model="descripcion"
        type="text"
        placeholder="Descripcion"
      />
    </ion-item>

    <ion-item class="input-group">
      <ion-icon name="list-outline" slot="start"></ion-icon>
      <ion-select
        v-model="cate" 
        placeholder="Selecciona una categoría" 
        :selected-text="cate"
      >
        <ion-select-option 
          v-for="categoria in categorias" 
          :key="categoria.titulo" 
          :value="categoria.titulo"
        >
          {{ categoria.titulo }}
        </ion-select-option>
      </ion-select>
    </ion-item>

    <div class="button-row">
      <ion-button expand="block" type="submit" class="back-btn">
        {{ editando ? 'ACTUALIZAR GASTO' : 'CREAR GASTO' }}
      </ion-button>
    </div>

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

// Props
const props = defineProps<{
  categorias: any[];
  gastoEditando?: any;
}>();

// Emits
const emit = defineEmits<{
  crearGasto: [gasto: any];
}>();

// Data
const titulo = ref("");
const monto = ref<number>(0);
const descripcion = ref("");
const cate = ref("");
const editando = ref(false);
const idEditando = ref<string | null>(null);

// Watch para cargar datos al editar
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

// Enviar formulario
const handleSubmit = () => {
  if (!titulo.value || !monto.value || !cate.value) {
    alert("Completa todos los campos");
    return;
  }

  emit("crearGasto", {
    id: idEditando.value,
    titulo: titulo.value,
    monto: Number(monto.value),
    descripcion: descripcion.value,
    categoria: cate.value,
    editando: editando.value
  });

  limpiarFormulario();
};

// Limpiar formulario
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
/* Inputs */
.input-group {
  margin-bottom: 15px;
  border-radius: 25px;
}

/* Botones */
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
  --background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
}

/* Fila de botones */
.button-row {
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>