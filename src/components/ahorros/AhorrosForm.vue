<template>
  <ion-card class="form-card">
    <ion-card-header>
      <ion-card-title class="titulo">Ahorros y Alcancías Virtuales</ion-card-title>
    </ion-card-header>

    <ion-card-content>
      <form @submit.prevent="guardarAhorro">
        <!-- Nombre del ahorro -->
        <ion-item class="input-group">
          <ion-icon name="wallet-outline" slot="start"></ion-icon>
          <ion-input
            v-model="form.nombreAhorro"
            label="Nombre del ahorro"
            label-placement="floating"
            placeholder="Ej. Vacaciones 2025"
            required
          ></ion-input>
        </ion-item>

        <!-- Monto meta -->
        <ion-item class="input-group">
          <ion-icon name="cash-outline" slot="start"></ion-icon>
          <ion-input
            v-model.number="form.montoMeta"
            type="number"
            label="Monto meta"
            min="0"
            label-placement="floating"
            placeholder="Ej. 2000000"
            required
          ></ion-input>
        </ion-item>

        <!-- Porcentaje automático -->
        <ion-item class="input-group">
          <ion-icon name="trending-up-outline" slot="start"></ion-icon>
          <ion-input
            v-model.number="form.porcentaje"
            type="number"
            label="Porcentaje automático de ingreso (%)"
            label-placement="floating"
            placeholder="Ej. 10"
            min="0"
            max="100"
            required
          ></ion-input>
        </ion-item>

        <!-- Gráfico de progreso -->
        <div class="progreso-container" v-if="form.montoMeta > 0">
          <p>Progreso actual: {{ progreso.toFixed(1) }}%</p>
          <ion-progress-bar :value="progreso / 100" color="success"></ion-progress-bar>
        </div>

        <!-- Botones -->
        <div class="botones">
          <ion-button expand="block" color="primary" type="submit">Guardar</ion-button>
          <ion-button expand="block" fill="outline" color="medium" @click="volver">Volver</ion-button>
        </div>
      </form>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonInput,
  IonItem,
  IonIcon,
  IonProgressBar
} from '@ionic/vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  nombreAhorro: '',
  montoMeta: "" as unknown as number,
  porcentaje: "" as unknown as number,
  acumulado: 0 // puedes usar este campo si luego sumas aportes
})

const progreso = computed(() => {
  if (form.value.montoMeta <= 0) return 0
  return (form.value.acumulado / form.value.montoMeta) * 100
})

const guardarAhorro = () => {
  if (!form.value.nombreAhorro || form.value.montoMeta <= 0 || form.value.porcentaje <= 0) {
    alert('Por favor completa todos los campos correctamente.')
    return
  }

  console.log('Ahorro guardado:', form.value)
  alert(`Ahorro "${form.value.nombreAhorro}" guardado correctamente.`)
  router.push('/home') // ajusta la ruta según tu flujo
}

const volver = () => {
  router.back()
}
</script>

<style scoped>
.form-card {
    background: white;
  width: 90%;
  max-width: 500px;
  margin: auto;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.titulo {
  text-align: center;
  font-size: 1.4rem;
  color: #1565c0;
}

.input-group {
  margin-bottom: 16px;
}

.progreso-container {
  margin-top: 20px;
  text-align: center;
}

.botones {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
