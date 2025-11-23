<template>
  <div class="meta-card">
    <div class="card-header">
      <h3>{{ gasto.nombre }}</h3>
      <span class="meta-icon">💸</span>
    </div>
    
    <div class="meta-info">
      <div class="info-item">
        <span class="icon">💰</span>
        <div>
          <p class="label">Monto</p>
          <p class="value">${{ formatNumber(gasto.monto) }}</p>
        </div>
      </div>
      
      <div class="info-item">
        <span class="icon">🔄</span>
        <div>
          <p class="label">Frecuencia</p>
          <p class="value">{{ capitalizar(gasto.frecuencia) }}</p>
        </div>
      </div>
      
      <div class="info-item">
        <span class="icon">📅</span>
        <div>
          <p class="label">Fecha de Inicio</p>
          <p class="value">{{ formatFecha(gasto.fechaInicio) }}</p>
        </div>
      </div>
      <!-- BOTONES -->
    <div class="acciones">
      <ion-button class="boton-edit" size="small" @click="editar">
        Editar
      </ion-button>
      <ion-button class="boton-elim" size="small" @click="eliminar">
        Eliminar
      </ion-button>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonButton } from "@ionic/vue";

const emit = defineEmits(["editar-gasto", "eliminar-gasto"]);
const props = defineProps<{ gasto: any }>();

const editar = () => emit("editar-gasto", props.gasto);
const eliminar = () => emit("eliminar-gasto", props.gasto.id);

const formatFecha = (fecha: string) => {
  return new Date(fecha).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};

const formatNumber = (num: number) =>
  num.toLocaleString("es-CO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

const capitalizar = (texto: string) =>
  texto.charAt(0).toUpperCase() + texto.slice(1);
</script>

<style scoped>
.meta-card {
  background: linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b);
  padding: 1.2rem;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.meta-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 28px rgba(102, 126, 234, 0.4);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.8rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}

.card-header h3 {
  color: #ffffff;
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.meta-icon {
  font-size: 1.8rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.meta-info {
  display: grid;
  gap: 0.8rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 0.6rem 0.8rem;
  border-radius: 12px;
  transition: background 0.2s ease;
}

.info-item:hover {
  background: rgba(255, 255, 255, 0.25);
}

.info-item .icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.info-item .label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-weight: 500;
}

.info-item .value {
  font-size: 0.95rem;
  color: #ffffff;
  margin: 0;
  font-weight: 700;
}

/* Responsive */
@media (max-width: 400px) {
  .meta-card {
    padding: 1rem;
  }
  
  .card-header h3 {
    font-size: 1.1rem;
  }
  
  .meta-icon {
    font-size: 1.5rem;
  }
}


.acciones {
  display: flex;
  margin-top: 15px;
  justify-content: center;
  gap: 6px;
}


.boton-elim {
  --background: linear-gradient(90deg, #c73154, #ff7a5f);
  --color: white;
  font-weight: 70;
  border-radius: 20px;
}

.boton-edit {
  --background: linear-gradient(90deg, #13c2ad, #32af19);
  --color: white;
  font-weight: 70;
  border-radius: 20px;
}

</style>