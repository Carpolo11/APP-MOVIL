<template>
  <form @submit.prevent="emitirEntrada" class="formulario">
    <ion-item class="input-group">
      <ion-icon name="create-outline" slot="start"></ion-icon>
      <ion-input 
        v-model="descripcion" 
        placeholder="Descripción (opcional):" 
      />
    </ion-item>

    <ion-item class="input-group">
      <ion-icon name="cash-outline" slot="start"></ion-icon>
      <ion-input 
        v-model="monto" 
        type="number" 
        min="0.01"
        step="0.01"
        placeholder="Monto:" 
        required 
      />
    </ion-item>

    <ion-item class="input-group">
      <ion-icon name="calendar-outline" slot="start"></ion-icon>
      <input 
        v-model="fecha" 
        type="date" 
        :max="maxDate"
        class="date-input" 
        required 
      />
    </ion-item>

    <div class="button-row">
      <ion-button expand="block" type="submit" class="back-btn">
        GUARDAR
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
  IonIcon
} from "@ionic/vue";
import { ref } from "vue";

// Define el evento que se emitirá al componente padre
const emit = defineEmits(["crear-entrada"]);

// Variables reactivas para los campos del formulario
const descripcion = ref("");
const monto = ref("");
const fecha = ref("");

// Obtiene la fecha actual en formato ISO y la usa como fecha máxima
const maxDate = new Date().toISOString().split('T')[0];

// Valida los datos del formulario y emite el evento para crear la entrada
const emitirEntrada = () => {
  // Verifica que los campos obligatorios estén completos
  if (!monto.value || !fecha.value) {
    alert("Por favor completa todos los campos obligatorios");
    return;
  }

  // Convierte el monto a número
  const montoNum = Number(monto.value);

  // Valida que el monto sea positivo
  if (montoNum <= 0) {
    alert("Ingresa un monto válido mayor a 0");
    return;
  }

  // Emite los datos al componente padre
  emit("crear-entrada", {
    descripcion: descripcion.value,
    monto: montoNum,
    fecha: fecha.value
  });

  // Resetea todos los campos del formulario
  descripcion.value = "";
  monto.value = "";
  fecha.value = "";
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