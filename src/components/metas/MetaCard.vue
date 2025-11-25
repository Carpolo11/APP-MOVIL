<template>
  <!-- Tarjeta completa -->
  <div class="meta-card" :class="{ 'completada': estaCompletada }">

    <!-- Encabezado de la meta -->
    <div class="card-header">
      <h3>{{ meta.nombre }}</h3>
      <span class="meta-icon">{{ estaCompletada ? '✅' : '🎯' }}</span>
    </div>
    
    <!-- Información principal -->
    <div class="meta-info">

      <!-- Monto objetivo -->
      <div class="info-item">
        <span class="icon">💰</span>
        <div>
          <p class="label">Monto Objetivo</p>
          <p class="value">${{ formatNumber(meta.monto) }}</p>
        </div>
      </div>

      <!-- Monto acumulado -->
      <div class="info-item">
        <span class="icon">💵</span>
        <div>
          <p class="label">Acumulado</p>
          <p class="value">${{ formatNumber(meta.acumulado || 0) }}</p>
        </div>
      </div>

      <!-- Fecha límite -->
      <div class="info-item">
        <span class="icon">📅</span>
        <div>
          <p class="label">Plazo</p>
          <p class="value">{{ formatFecha(meta.plazo) }}</p>
        </div>
      </div>

    </div>

    <!-- Sección del progreso -->
    <div class="progress-section">

      <!-- Encabezado del progreso -->
      <div class="progress-header">
        <span class="progress-label">Progreso</span>
        <span class="progress-percentage">{{ progreso.toFixed(1) }}%</span>
      </div>

      <!-- Barra de progreso -->
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ width: Math.min(progreso, 100) + '%' }"
          :class="{ 'completada-fill': estaCompletada }"
        ></div>
      </div>

      <!-- Mensaje de completado -->
      <div v-if="estaCompletada" class="mensaje-completado">
        🎉 ¡Meta completada!
      </div>
    </div>

    <!-- Formulario para aportar dinero -->
    <div v-if="!estaCompletada" class="aportar-section">
      <form @submit.prevent="realizarAporte" class="aportar-form">
        <ion-input 
          v-model="montoAporte" 
          type="number" 
          min="1"
          :max="Math.min(montoRestante, saldoDisponible)"
          placeholder="Monto a aportar"
          class="input-aporte"
        />
        <ion-button type="submit" class="boton-aportar" size="small">
          Aportar
        </ion-button>
      </form>
      <p class="restante-text">Falta: ${{ formatNumber(montoRestante) }}</p>
      <p class="saldo-disponible-text">Saldo disponible: ${{ formatNumber(saldoDisponible) }}</p>
    </div>

    <!-- Botones de acción -->
    <div class="actions">

      <!-- Botón editar -->
      <ion-button 
        class="boton-edit" 
        size="small" 
        @click="$emit('editar', meta)"
        :disabled="estaCompletada"
      >
        Editar
      </ion-button>

      <!-- Botón eliminar -->
      <ion-button 
        class="boton-elim" 
        size="small" 
        @click="$emit('eliminar', meta.id)"
      >
        Eliminar
      </ion-button>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { IonInput, IonButton } from "@ionic/vue";
import { doc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { getAuth } from "firebase/auth";

const auth = getAuth();

/* Recibe la meta desde el componente padre */
const props = defineProps<{ meta: any }>();

/* Estado para el monto a aportar */
const montoAporte = ref("");

/* Saldo disponible para aportar */
const saldoDisponible = ref(0);

/* Calcula el progreso (%) */
const progreso = computed(() => {
  const acumulado = props.meta.acumulado || 0;
  return (acumulado / props.meta.monto) * 100 || 0;
});

/* Verifica si la meta está completada */
const estaCompletada = computed(() => {
  return (props.meta.acumulado || 0) >= props.meta.monto;
});

/* Calcula cuánto falta para completar la meta */
const montoRestante = computed(() => {
  return Math.max(0, props.meta.monto - (props.meta.acumulado || 0));
});

/* Calcular saldo disponible para aportar */
const calcularSaldoDisponible = async () => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    // Obtener total de entradas
    const entradasQuery = query(collection(db, "entradas"), where("userId", "==", user.uid));
    const entradasSnapshot = await getDocs(entradasQuery);
    let totalEntradas = 0;
    entradasSnapshot.forEach((doc) => {
      totalEntradas += Number(doc.data().monto) || 0;
    });

    // Obtener total de gastos
    const gastosQuery = query(collection(db, "gastos"), where("UserId", "==", user.uid));
    const gastosSnapshot = await getDocs(gastosQuery);
    let totalGastos = 0;
    gastosSnapshot.forEach((doc) => {
      totalGastos += Number(doc.data().monto) || 0;
    });

    // Obtener total de gastos recurrentes
    const recurrentesQuery = query(collection(db, "gastosRecurrentes"), where("userId", "==", user.uid));
    const recurrentesSnapshot = await getDocs(recurrentesQuery);
    let totalRecurrentes = 0;
    recurrentesSnapshot.forEach((doc) => {
      totalRecurrentes += Number(doc.data().monto) || 0;
    });

    // Obtener total ya acumulado en TODAS las metas
    const metasQuery = query(collection(db, "metas"), where("userId", "==", user.uid));
    const metasSnapshot = await getDocs(metasQuery);
    let totalAcumuladoEnMetas = 0;
    metasSnapshot.forEach((doc) => {
      totalAcumuladoEnMetas += Number(doc.data().acumulado) || 0;
    });

    // Calcular saldo disponible
    saldoDisponible.value = totalEntradas - totalGastos - totalRecurrentes - totalAcumuladoEnMetas;
    
    console.log("Saldo disponible para aportar:", saldoDisponible.value);
  } catch (error) {
    console.error("Error al calcular saldo disponible:", error);
  }
};

/* Función para realizar un aporte */
const realizarAporte = async () => {
  const aporte = Number(montoAporte.value);
  
  if (!aporte || aporte <= 0) {
    alert("Ingresa un monto válido");
    return;
  }

  if (aporte > montoRestante.value) {
    alert("❌ El aporte no puede ser mayor al monto restante");
    return;
  }

  if (aporte > saldoDisponible.value) {
    alert(`❌ No tienes suficiente saldo disponible. Tu saldo es: $${formatNumber(saldoDisponible.value)}`);
    return;
  }

  try {
    const nuevoAcumulado = (props.meta.acumulado || 0) + aporte;
    const completada = nuevoAcumulado >= props.meta.monto;

    // Actualizar primero localmente para feedback inmediato
    props.meta.acumulado = nuevoAcumulado;
    props.meta.completada = completada;

    // Luego actualizar en Firebase
    await updateDoc(doc(db, "metas", props.meta.id), {
      acumulado: nuevoAcumulado,
      completada: completada
    });

    montoAporte.value = "";
    
    // Recalcular saldo disponible
    await calcularSaldoDisponible();
    
    if (completada) {
      alert("🎉 ¡Felicidades! Has completado tu meta");
    } else {
      alert(`✅ Aporte registrado: $${formatNumber(aporte)}`);
    }
  } catch (error) {
    console.error("Error al realizar aporte:", error);
    alert("No se pudo registrar el aporte");
  }
};

/* Formatea la fecha */
const formatFecha = (fecha: string) => {
  return new Date(fecha).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/* Formatea números (con puntos y comas) */
const formatNumber = (num: number) => num.toLocaleString("es-CO");

/* Cargar saldo disponible al montar */
onMounted(() => {
  calcularSaldoDisponible();
});
</script>

<style scoped>
/* Contenedor principal */
.meta-card {
  background: linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b);
  padding: 1.2rem;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.meta-card.completada {
  background: linear-gradient(135deg, #11998e, #38ef7d);
  box-shadow: 0 8px 20px rgba(56, 239, 125, 0.4);
}

.meta-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 28px rgba(102, 126, 234, 0.4);
}

/* Encabezado */
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

/* Información */
.meta-info {
  display: grid;
  gap: 0.8rem;
  margin-bottom: 1rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: rgba(255, 255, 255, 0.15);
  padding: 0.6rem 0.8rem;
  border-radius: 12px;
}

.info-item .icon {
  font-size: 1.5rem;
}

.info-item .label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.info-item .value {
  font-size: 0.95rem;
  color: #ffffff;
  font-weight: 700;
  margin: 0;
}

/* Progreso */
.progress-section {
  background: rgba(255, 255, 255, 0.15);
  padding: 0.8rem;
  border-radius: 12px;
  margin-bottom: 1rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: #ffffff;
  font-weight: 600;
}

.progress-bar {
  background: rgba(255, 255, 255, 0.2);
  height: 18px;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
  transition: width 0.5s ease;
}

.progress-fill.completada-fill {
  background: linear-gradient(90deg, #ffd700 0%, #ffed4e 100%);
}

.mensaje-completado {
  text-align: center;
  color: #ffffff;
  font-weight: 700;
  font-size: 1.1rem;
  margin-top: 0.5rem;
}

/* Sección de aportar */
.aportar-section {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.8rem;
  border-radius: 12px;
  margin-bottom: 1rem;
}

.aportar-form {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.5rem;
}

.input-aporte {
  flex: 1;
  --background: rgba(255, 255, 255, 0.9);
  --color: #2c3e50;
  --padding-start: 12px;
  --padding-end: 12px;
  border-radius: 8px;
  font-weight: 600;
}

.boton-aportar {
  --background: linear-gradient(90deg, #667eea, #764ba2);
  --color: white;
  font-weight: 600;
}

.restante-text {
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.85rem;
  font-weight: 600;
  margin: 0 0 0.3rem 0;
}

.saldo-disponible-text {
  text-align: center;
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.75rem;
  font-weight: 500;
  margin: 0;
}

/* Botones */
.actions {
  display: flex;
  justify-content: center;
  gap: 6px;
}

.boton-elim {
  --background: linear-gradient(90deg, #c73154, #ff7a5f);
  --color: white;
}

.boton-edit {
  --background: linear-gradient(90deg, #13c2ad, #32af19);
  --color: white;
}

.boton-edit:disabled {
  opacity: 0.5;
}
</style>
