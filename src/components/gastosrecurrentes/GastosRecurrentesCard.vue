<template>
  <!-- Tarjeta que muestra la información del gasto -->
  <div class="meta-card">

    <!-- Encabezado con nombre del gasto e ícono -->
    <div class="card-header">
      <h3>{{ gasto.nombre }}</h3>
      <span class="meta-icon">💸</span>
    </div>
    
    <!-- Contenedor de la información -->
    <div class="meta-info">

      <!-- Item: monto -->
      <div class="info-item">
        <span class="icon">💰</span>
        <div>
          <p class="label">Monto</p>
          <p class="value">${{ formatNumber(gasto.monto) }}</p>
        </div>
      </div>
      
      <!-- Item: frecuencia -->
      <div class="info-item">
        <span class="icon">🔄</span>
        <div>
          <p class="label">Frecuencia</p>
          <p class="value">{{ capitalizar(gasto.frecuencia) }}</p>
        </div>
      </div>
      
      <!-- Item: fecha de inicio -->
      <div class="info-item">
        <span class="icon">📅</span>
        <div>
          <p class="label">Fecha de Inicio</p>
          <p class="value">{{ formatFecha(gasto.fechaInicio) }}</p>
        </div>
      </div>

      <!-- Botones de editar y eliminar -->
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
/* Botones de Ionic */
import { IonButton } from "@ionic/vue";

/* Eventos que el componente envía al padre */
const emit = defineEmits(["editar-gasto", "eliminar-gasto"]);

/* Prop que recibe la información de un gasto */
const props = defineProps<{ gasto: any }>();

/* Envía el gasto completo para editar */
const editar = () => emit("editar-gasto", props.gasto);

/* Envía solo el ID para eliminar */
const eliminar = () => emit("eliminar-gasto", props.gasto.id);

/* Formatea la fecha a estilo colombiano */
const formatFecha = (fecha: string) => {
  return new Date(fecha).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};

/* Formatea números con decimales y separadores */
const formatNumber = (num: number) =>
  num.toLocaleString("es-CO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

/* Convierte la primera letra en mayúscula */
const capitalizar = (texto: string) =>
  texto.charAt(0).toUpperCase() + texto.slice(1);
</script>

<style scoped>
/* Estilo visual de la tarjeta */
.meta-card {
  background: linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b);
  padding: 1.2rem;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* Efecto hover */
.meta-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 28px rgba(102, 126, 234, 0.4);
}

/* Encabezado de la tarjeta */
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
}

.meta-icon {
  font-size: 1.8rem;
}

/* Información del gasto */
.meta-info {
  display: grid;
  gap: 0.8rem;
}

/* Elemento individual de información */
.info-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: rgba(255, 255, 255, 0.15);
  padding: 0.6rem 0.8rem;
  border-radius: 12px;
}

.info-item .label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
}

.info-item .value {
  font-size: 0.95rem;
  color: #ffffff;
  font-weight: 700;
}

/* Contenedor de botones */
.acciones {
  display: flex;
  margin-top: 15px;
  justify-content: center;
  gap: 6px;
}

/* Botón eliminar */
.boton-elim {
  --background: linear-gradient(90deg, #c73154, #ff7a5f);
  --color: white;
  border-radius: 20px;
}

/* Botón editar */
.boton-edit {
  --background: linear-gradient(90deg, #13c2ad, #32af19);
  --color: white;
  border-radius: 20px;
}
</style>
