<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="toolbar">
        <ion-title>🔔 Alertas y Notificaciones</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="alertas-bg">

      <div class="contenedor">

        <!-- Si no hay alertas -->
        <div v-if="alertas.length === 0" class="mensaje-vacio">
          <p>No tienes alertas por el momento 🎉</p>
        </div>

        <!-- Lista de alertas -->
        <div
          v-for="alerta in alertas"
          :key="alerta.id"
          class="alerta-card"
        >
          <div class="alerta-header">
            <span class="alerta-titulo">{{ alerta.titulo }}</span>
            <span class="alerta-fecha">{{ alerta.fecha }}</span>
          </div>

          <p class="alerta-descripcion">
            {{ alerta.descripcion }}
          </p>
        </div>

      </div>

    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from "vue";

const alertas = ref([
  {
    id: 1,
    titulo: "Límite superado",
    descripcion: "Has superado el 80% del presupuesto asignado a la categoría 'Comida'.",
    fecha: "Hoy"
  },
  {
    id: 2,
    titulo: "Pago próximo",
    descripcion: "Tu pago recurrente 'Netflix' se ejecuta mañana.",
    fecha: "Hace 2 días"
  },
  {
    id: 3,
    titulo: "Registrar gasto recurrente",
    descripcion: "Es hora de registrar el gasto recurrente de 'Transporte'.",
    fecha: "Hace 3 días"
  }
]);
</script>

<style scoped>
/* Fondo general */
.alertas-bg {
  --background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  padding: 20px;
  min-height: 100vh;
  color: white;
}

/* Contenedor general */
.contenedor {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}

/* Mensaje cuando no hay alertas */
.mensaje-vacio {
  text-align: center;
  margin-top: 40px;
  color: #ffffffcc;
  font-size: 1.2rem;
}

/* Tarjeta de alerta */
.alerta-card {
  background: linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b);
  padding: 18px;
  border-radius: 18px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  color: white;
  animation: fadeIn 0.4s ease-in-out;
  margin-left: 15px;
    margin-right: 15px;
}

/* Header dentro de la tarjeta */
.alerta-header {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  margin-bottom: 5px;
}

.alerta-titulo {
  font-size: 1.1rem;
}

.alerta-fecha {
  font-size: 0.9rem;
  opacity: 0.9;
}

/* Descripción */
.alerta-descripcion {
  margin-top: 6px;
  font-size: 0.95rem;
  opacity: 0.95;
}

/* Animación suave */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.toolbar {
  --background: linear-gradient(90deg, #a8edea, #fed6e3);
  color: #001f3f;
}

</style>
