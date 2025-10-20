<template>
  <ion-card class="formulario-ahorro">
    <ion-card-header>
      <ion-card-title>
        {{ ahorroEditado ? 'Editar Ahorro' : 'Nuevo Ahorro' }}
      </ion-card-title>
    </ion-card-header>

    <ion-card-content>


      <ion-item class="input-group">
          <ion-icon name="wallet-outline"></ion-icon>
          <ion-input
            v-model="form.nombre"
            label="Nombre ahorro / meta"
            label-placement="floating"
            placeholder="Ej: Vacaciones"
            required
          ></ion-input>
        </ion-item>

      <ion-item class="input-group">
        <ion-icon name="cash-outline"></ion-icon>
        <ion-input
          v-model.number="form.montoMeta"
          label="Monto meta *"
          label-placement="floating"
          type="number"
          min="0"
          placeholder="Ej: 200000"
          required
        />
      </ion-item>

    
      <ion-item class="input-group">
        <ion-icon name="cash-outline"></ion-icon>
        <ion-input
          v-model.number="form.porcentaje"
          label="Porcentaje automatico de ingreso (%) *"
          label-placement="floating"
          type="number"
          min="0"
          max="100"
          placeholder="Ej: 20"
          required
        />
      </ion-item>

      <div class="botones">
        <ion-button expand="block" class="guardar" @click="guardar">Guardar</ion-button>
        <ion-button expand="block" class="volver" @click="$emit('cancelar')">Volver</ion-button>
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

interface Ahorro {
  nombre: string
  montoMeta: number
  porcentaje: number
 
}

const props = defineProps<{ ahorroEditado: Ahorro | null }>()
const emit = defineEmits(['guardar', 'cancelar'])



const form = ref<Ahorro>({
  nombre: '',
  montoMeta: null as unknown as number,
  porcentaje: null as unknown as number,
})

// Si se edita un ahorro, cargar sus valores
watch(
  () => props.ahorroEditado,
  (nuevoAhorro) => {
    if (nuevoAhorro) {
      form.value = { ...nuevoAhorro }
    } else {
      form.value = { nombre: '', montoMeta: null as unknown as number, porcentaje: null as unknown as number }
    }
  },
  { immediate: true }
)

// Guardar ahorro
const guardar = () => {
  if (!form.value.nombre || !form.value.montoMeta || form.value.porcentaje < 0 || form.value.porcentaje > 100) {
    alert('Por favor completa todos los campos obligatorios.')
    return
  }
  emit('guardar', { 
    nombre: form.value.nombre,
    montoMeta: Number(form.value.montoMeta),
    porcentaje: Number(form.value.porcentaje),
  })
}
</script>

<style scoped>
/* Fondo del formulario */
.formulario-ahorro {
  background-color: #ffffff;
  color: #000000;
  border-radius: 14px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 16px;
  max-width: 400px;
  margin: 0 auto;
}

/* Título */
ion-card-title {
  color: #0d47a1;
  font-weight: 700;
  text-align: center;
  font-size: 1.2rem;
}

/* Campos del formulario */
ion-item {
  --background: transparent;
  --color: #000000;
  border-bottom: 1px solid #ccc;
  margin-bottom: 12px;
}

/* Labels */
ion-label {
  color: #0d47a1;
  font-weight: 500;
}

/* Entradas */
ion-input {
  --color: #ffffff;
}

/* Contenedor botones */
.botones {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 15px;
}

/* Botón Guardar */
ion-button.guardar {
  --background: #007bff;
  --background-hover: #0066cc;
  --color: #ffffff;
  font-weight: bold;
  border-radius: 8px;
}


/* Botón Volver */
ion-button.volver {
  --background: #e0e0e0;
  --background-hover: #bdbdbd;
  --color: #000000;
  font-weight: 600;
  border-radius: 8px;
}

/* Inputs */
.input-group {
  margin-bottom: 15px;
  border-radius: 25px;
  --border-color: #000000;
  --highlight-color-focused: #000000;
  --background: #313131;
}

</style>
