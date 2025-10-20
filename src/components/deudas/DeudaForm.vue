<template>
  <ion-card class="formulario-deuda">
    <ion-card-header>
      <ion-card-title>
        {{ deudaEditada ? 'Editar Deuda / Crédito' : 'Nueva Deuda / Crédito' }}
      </ion-card-title>
    </ion-card-header>

    <ion-card-content>


      <ion-item class="input-group">
          <ion-icon name="wallet-outline"></ion-icon>
          <ion-input
            v-model="form.nombre"
            label="Nombre deuda / crédito"
            label-placement="floating"
            placeholder="Ej: Tarjeta de crédito"
            required
          ></ion-input>
        </ion-item>

      <ion-item class="input-group">
        <ion-icon name="cash-outline"></ion-icon>
        <ion-input
          v-model.number="form.montoTotal"
          label="Monto total *"
          label-placement="floating"
          type="number"
          min="0"
          placeholder="Ingrese monto total"
          required
        />
      </ion-item>

    
      <ion-item class="input-group">
        <ion-icon name="cash-outline"></ion-icon>
        <ion-input
          v-model.number="form.cuotaMinima"
          label="Cuota mínima mensual"
          label-placement="floating"
          type="number"
          min="0"
          placeholder="Ingrese cuota mínima"
          required
        />
      </ion-item>

      <ion-item class="input-group">
        <ion-icon name="calendar-outline"></ion-icon>
        <ion-input
          v-model="form.fechaLimite"
          label="Fecha límite de pago *"
          label-placement="floating"
          type="date"
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


// 🔹 Importar Firestore
import { collection, addDoc } from 'firebase/firestore'
import { db } from '@/firebase/firebaseConfig' // Ruta hacia tu archivo


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
  montoTotal: null as unknown as number,
  cuotaMinima: null as unknown as number,
  fechaLimite: ''
})

// Si se edita una deuda, cargar sus valores
watch(
  () => props.deudaEditada,
  (nuevaDeuda) => {
    if (nuevaDeuda) {
      form.value = { ...nuevaDeuda }
    } else {
      form.value = { nombre: '', montoTotal: null as unknown as number, cuotaMinima: null as unknown as number, fechaLimite: '' }
    }
  },
  { immediate: true }
)



// 🔹 Guardar deuda en Firestore
const guardar = async () => {
  if (!form.value.nombre || form.value.montoTotal == null || !form.value.fechaLimite) {
    alert('Por favor completa todos los campos obligatorios.')
    return
  }


try {
    await addDoc(collection(db, 'deudas'), {
      nombre: form.value.nombre.trim(),
      montoTotal: Number(form.value.montoTotal) || 0,
      cuotaMinima: Number(form.value.cuotaMinima) || 0,
      fechaLimite: form.value.fechaLimite,
      fechaRegistro: new Date().toISOString()
    })

    alert('✅ Deuda guardada con éxito')

    form.value = { nombre: '', montoTotal: null as unknown as number, cuotaMinima: null as unknown as number, fechaLimite: '' }

  } catch (error) {
    console.error('Error al guardar en Firestore:', error)
    alert('❌ Error al guardar la deuda')
  }

}
</script>

<style scoped>
/* Fondo del formulario */
.formulario-deuda {
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
