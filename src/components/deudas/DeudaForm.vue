<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>
        {{ deudaEditada ? 'Editar Deuda / Crédito' : 'Nueva Deuda / Crédito' }}
      </ion-card-title>
    </ion-card-header>

    <ion-card-content>
      <ion-item>
        <ion-label position="floating">Nombre deuda</ion-label>
        <ion-input v-model="form.nombre" type="text" required />
      </ion-item>

      <ion-item>
        <ion-label position="floating">Monto total deuda</ion-label>
        <ion-input v-model.number="form.montoTotal" type="number" required />
      </ion-item>

      <ion-item>
        <ion-label position="floating">Cuota mínima mensual</ion-label>
        <ion-input v-model.number="form.cuotaMinima" type="number" required />
      </ion-item>

      <ion-item>
        <ion-label position="floating">Fecha límite de pago</ion-label>
        <ion-input v-model="form.fechaLimite" type="date" required />
      </ion-item>

      <div class="botones">
        <ion-button expand="block" color="success" @click="guardar">Guardar</ion-button>
        <ion-button expand="block" color="medium" @click="$emit('cancelar')">Volver</ion-button>
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton
} from '@ionic/vue'

interface Deuda {
  nombre: string
  montoTotal: number
  cuotaMinima: number
  fechaLimite: string
}

const props = defineProps<{ deudaEditada: Deuda | null }>()
const emit = defineEmits(['guardar', 'cancelar'])

const form = ref<Deuda>({
  nombre: '',
  montoTotal: 0,
  cuotaMinima: 0,
  fechaLimite: ''
})

// Si se edita una deuda, cargar sus valores
watch(
  () => props.deudaEditada,
  (nuevaDeuda) => {
    if (nuevaDeuda) {
      form.value = { ...nuevaDeuda }
    } else {
      form.value = { nombre: '', montoTotal: 0, cuotaMinima: 0, fechaLimite: '' }
    }
  },
  { immediate: true }
)

// Guardar deuda
const guardar = () => {
  if (!form.value.nombre || !form.value.montoTotal || !form.value.fechaLimite) {
    alert('Por favor completa todos los campos obligatorios.')
    return
  }
  emit('guardar', { ...form.value })
}
</script>

<style scoped>
.botones {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 15px;
}
</style>
