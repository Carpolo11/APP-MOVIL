<template>
  <!-- Formulario que ejecuta onSubmit sin refrescar -->
  <form @submit.prevent="onSubmit" class="formulario">

    <!-- Campo: Nombre del gasto -->
    <ion-item class="input-group">
      <ion-icon name="receipt-outline" slot="start"></ion-icon>
      <!-- Entrada vinculada a nombre -->
      <ion-input 
        v-model="nombre" 
        placeholder="Nombre del Gasto" 
        required 
      />
    </ion-item>

    <!-- Campo: Monto -->
    <ion-item class="input-group">
      <ion-icon name="cash-outline" slot="start"></ion-icon>
      <!-- Entrada numérica -->
      <ion-input 
        v-model="monto" 
        type="number" 
        step="0.01"
        min="0.01" 
        placeholder="Monto" 
        required 
      />
    </ion-item>

    <!-- Campo: Frecuencia -->
    <ion-item class="input-group">
      <ion-icon name="sync-outline" slot="start"></ion-icon>
      <!-- Select para elegir tipo de frecuencia -->
      <ion-select 
        v-model="frecuencia" 
        placeholder="Selecciona la frecuencia"
        interface="action-sheet"
        required
      >
        <ion-select-option value="mensual">Mensual</ion-select-option>
        <ion-select-option value="semanal">Semanal</ion-select-option>
        <ion-select-option value="anual">Anual</ion-select-option>
      </ion-select>
    </ion-item>

    <!-- Campo: Fecha de inicio -->
    <ion-item class="input-group">
      <ion-icon name="calendar-outline" slot="start"></ion-icon>
      <!-- Input de fecha -->
      <input 
        v-model="fechaInicio" 
        type="date" 
        class="date-input" 
        required 
      />
    </ion-item>

    <!-- Botón para enviar -->
    <div class="button-row">
      <ion-button expand="block" type="submit" class="back-btn">
        REGISTRAR GASTO
      </ion-button>
    </div>

    <!-- Botón para volver -->
    <div class="button-row">
      <ion-button expand="block" router-link="/dashboard" class="back-btn">
        VOLVER
      </ion-button>
    </div>

  </form>
</template>

<script setup lang="ts">
/* Importación de componentes de Ionic */
import { 
  IonItem, 
  IonInput, 
  IonButton, 
  IonIcon,
  IonSelect,
  IonSelectOption
} from "@ionic/vue";

/* Importación de reactividad de Vue */
import { ref, watch } from "vue";

/* Props que reciben un gasto a editar */
const props = defineProps<{ gastoEditado?: any }>();

/* Evento que se envía al padre al crear o editar */
const emit = defineEmits(["crear-gasto"]);

/* Variables reactivas del formulario */
const nombre = ref("");
const monto = ref<number | null>(null);
const frecuencia = ref("");
const fechaInicio = ref("");

/* Función que envía los datos y limpia el formulario */
const onSubmit = () => {
  emit("crear-gasto", {
    nombre: nombre.value.trim(),
    monto: monto.value,
    frecuencia: frecuencia.value,
    fechaInicio: fechaInicio.value
  });

  // Limpiar campos
  nombre.value = "";
  monto.value = null;
  frecuencia.value = "";
  fechaInicio.value = "";
};

/* Watcher: carga los datos cuando se va a editar un gasto */
watch(
  () => props.gastoEditado,
  (nuevo) => {
    if (nuevo) {
      nombre.value = nuevo.nombre;
      monto.value = nuevo.monto;
      frecuencia.value = nuevo.frecuencia;
      fechaInicio.value = nuevo.fechaInicio;
    }
  },
  { immediate: true } // se ejecuta apenas carga
);

</script>

<style scoped>
/* Estilos visuales del formulario y entradas */
.formulario {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-group {
  background: linear-gradient(135deg, #a1c4fd, #c2e9fb, #fbc2eb);
  border-radius: 18px;
  margin-bottom: 20px;
  position: relative;
  --padding-start: 12px;
  --padding-end: 12px;
}

ion-select {
  width: 100%;
  --placeholder-color: #666;
  --placeholder-opacity: 0.8;
  color: #2c3e50;
  font-weight: 500;
}

ion-select::part(text) {
  color: #2c3e50;
  font-weight: 500;
}

.date-input {
  width: 100%;
  padding: 0.8rem;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 1rem;
  color: #2c3e50;
  font-weight: 500;
}

.back-btn {
  --background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  --color: white;
  font-weight: 700;
  font-size: 1.1rem;
  border-radius: 30px;
  box-shadow: 0 6px 14px rgba(255, 209, 102, 0.4);
}

.button-row {
  display: flex;
  justify-content: center;
}
</style>
