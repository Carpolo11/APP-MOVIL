<template>
  <form @submit.prevent="emitirMeta" class="formulario">
    <ion-item class="input-group">
      <ion-icon name="flag-outline" slot="start"></ion-icon>
      <ion-input v-model="nombre" placeholder="Nombre de la meta" required />
    </ion-item>

    <ion-item class="input-group">
      <ion-icon name="cash-outline" slot="start"></ion-icon>
      <ion-input 
        v-model="monto" 
        type="number" 
        min="1" 
        placeholder="Monto objetivo" 
        required 
      />
    </ion-item>

    <ion-item class="input-group">
      <ion-icon name="calendar-outline" slot="start"></ion-icon>
      <input 
        v-model="plazo" 
        type="date" 
        :min="minDate"
        class="date-input" 
        required 
      />
    </ion-item>

    <ion-item class="input-group">
      <ion-icon name="stats-chart-outline" slot="start"></ion-icon>
      <ion-input 
        v-model="porcentaje" 
        type="number" 
        min="0" 
        max="100" 
        placeholder="% de ingreso" 
        required 
      />
    </ion-item>

    <div class="button-row">
      <ion-button expand="block" type="submit" class="back-btn">
        CREAR META
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
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

const nombre = ref("");
const monto = ref("");
const plazo = ref("");
const porcentaje = ref("");

// Fecha mínima (hoy)
const minDate = new Date().toISOString().split('T')[0];

const emitirMeta = async () => {
  // Validaciones
  if (!nombre.value || !monto.value || !plazo.value || !porcentaje.value) {
    alert("Por favor completa todos los campos");
    return;
  }

  const montoNum = Number(monto.value);
  const porcentajeNum = Number(porcentaje.value);

  if (montoNum <= 0) {
    alert("Ingresa un monto objetivo válido");
    return;
  }

  if (porcentajeNum < 0 || porcentajeNum > 100) {
    alert("El porcentaje debe estar entre 0 y 100");
    return;
  }

  try {
    await addDoc(collection(db, "metas"), {
      titulo: nombre.value,
      nombre: nombre.value,
      montoObjetivo: montoNum,
      monto: montoNum,
      montoActual: 0,
      acumulado: 0,
      plazo: plazo.value,
      porcentajeAsignado: porcentajeNum,
      fechaRegistro: new Date(),
      completada: false
    });

    alert(`Meta creada exitosamente: ${nombre.value}`);
    
    // Limpiar formulario
    nombre.value = "";
    monto.value = "";
    plazo.value = "";
    porcentaje.value = "";
    
  } catch (error) {
    console.error("Error al crear meta:", error);
    alert("Hubo un error al crear la meta");
  }
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