<template>
  <form @submit.prevent="onSubmit" class="formulario">
    <ion-item class="input-group">
      <ion-icon name="receipt-outline" slot="start"></ion-icon>
      <ion-input 
        v-model="nombre" 
        placeholder="Nombre del Gasto" 
        required 
      />
    </ion-item>

    <ion-item class="input-group">
      <ion-icon name="cash-outline" slot="start"></ion-icon>
      <ion-input 
        v-model="monto" 
        type="number" 
        step="0.01"
        min="0.01" 
        placeholder="Monto" 
        required 
      />
    </ion-item>

    <ion-item class="input-group">
      <ion-icon name="sync-outline" slot="start"></ion-icon>
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

    <ion-item class="input-group">
      <ion-icon name="calendar-outline" slot="start"></ion-icon>
      <input 
        v-model="fechaInicio" 
        type="date" 
        class="date-input" 
        required 
      />
    </ion-item>

    <div class="button-row">
      <ion-button expand="block" type="submit" class="back-btn">
        REGISTRAR GASTO
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
  IonSelectOption
} from "@ionic/vue";
import { ref } from "vue";

const emit = defineEmits(["crear-gasto"]);

const nombre = ref("");
const monto = ref<number | null>(null);
const frecuencia = ref("");
const fechaInicio = ref("");

const onSubmit = () => {
  emit("crear-gasto", {
    nombre: nombre.value.trim(),
    monto: monto.value,
    frecuencia: frecuencia.value,
    fechaInicio: fechaInicio.value
  });

  nombre.value = "";
  monto.value = null;
  frecuencia.value = "";
  fechaInicio.value = "";
};
</script>

<style scoped>
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

.date-input:focus {
  outline: none;
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