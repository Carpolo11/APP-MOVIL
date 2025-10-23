<template>
  <form @submit.prevent="emitirMeta" class="formulario">
    <ion-item class="input-group">
      <ion-icon name="flag-outline" slot="start"></ion-icon>
      <ion-input v-model="nombre" placeholder="Nombre de la meta" required />
    </ion-item>

    <ion-item class="input-group">
      <ion-icon name="cash-outline" slot="start"></ion-icon>
      <ion-input v-model.number="monto" type="number" min="1" placeholder="Monto objetivo" required />
    </ion-item>

    <ion-item class="input-group">
      <ion-icon name="calendar-outline" slot="start"></ion-icon>
      <ion-input v-model="plazo" placeholder="Plazo (fecha o meses)" required />
    </ion-item>

    <ion-item class="input-group">
      <ion-icon name="stats-chart-outline" slot="start"></ion-icon>
      <ion-input v-model.number="porcentaje" type="number" min="0" max="100" placeholder="% de ingreso" required />
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
import { IonItem, IonInput, IonButton, IonIcon } from "@ionic/vue";
import { ref } from "vue";

const emit = defineEmits(["crear-meta"]);

const nombre = ref("");
const monto = ref<number>(0);
const plazo = ref("");
const porcentaje = ref<number>(0);

const emitirMeta = () => {
  if (!nombre.value || !monto.value || !plazo.value || porcentaje.value < 0 || porcentaje.value > 100) return;
  emit("crear-meta", {
    nombre: nombre.value,
    monto: monto.value,
    plazo: plazo.value,
    porcentajeAsignado: porcentaje.value,
    acumulado: 0
  });
  nombre.value = "";
  monto.value = 0;
  plazo.value = "";
  porcentaje.value = 0;
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
