<template>
  <!-- Formulario principal -->
  <form @submit.prevent="emitirMeta" class="formulario">

    <!-- Nombre de la meta -->
    <ion-item class="input-group">
      <ion-icon name="flag-outline" slot="start"></ion-icon>
      <ion-input v-model="nombre" placeholder="Nombre de la meta" required />
    </ion-item>

    <!-- Monto objetivo -->
    <ion-item class="input-group">
      <ion-icon name="cash-outline" slot="start"></ion-icon>
      <ion-input 
        v-model="monto" 
        type="number" 
        min="1" 
        :max="saldoDisponible"
        placeholder="Monto objetivo" 
        required 
      />
    </ion-item>

    

    <!-- Fecha lÃ­mite -->
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

    <!-- BotÃ³n crear o actualizar -->
    <div class="button-row">
      <ion-button expand="block" type="submit" class="back-btn">
        {{ metaEditar ? 'ACTUALIZAR META' : 'CREAR META' }}
      </ion-button>
    </div>

    <!-- BotÃ³n volver -->
    <div class="button-row">
      <ion-button expand="block" router-link="/dashboard" class="back-btn">
        VOLVER
      </ion-button>
    </div>

  </form>
</template>

<script setup lang="ts">
// Importaciones de Ionic, Vue y Firebase
import { 
  IonItem, 
  IonInput, 
  IonButton, 
  IonIcon
} from "@ionic/vue";
import { ref, watch, onMounted } from "vue";
import { collection, addDoc, doc, updateDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { getAuth } from "firebase/auth";

// Instancia de autenticaciÃ³n
const auth = getAuth();

// Campos del formulario
const nombre = ref("");
const monto = ref("");
const plazo = ref("");

// Saldo disponible
const saldoDisponible = ref(0);

// Fecha mÃ­nima = hoy
const minDate = new Date().toISOString().split('T')[0];

// Definir el emit
const emit = defineEmits(['meta-guardada']);

// Calcular saldo disponible
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

    // Obtener total de metas (solo el monto objetivo, no el acumulado)
    const metasQuery = query(collection(db, "metas"), where("userId", "==", user.uid));
    const metasSnapshot = await getDocs(metasQuery);
    let totalMetas = 0;
    metasSnapshot.forEach((doc) => {
      const metaData = doc.data();
      // Si estamos editando, excluimos esta meta del cÃ¡lculo
      if (props.metaEditar && doc.id === props.metaEditar.id) {
        return;
      }
      totalMetas += Number(metaData.monto) || 0;
    });

    // Calcular saldo disponible
    saldoDisponible.value = totalEntradas - totalGastos - totalRecurrentes - totalMetas;
    
    console.log("Saldo disponible:", saldoDisponible.value);
  } catch (error) {
    console.error("Error al calcular saldo disponible:", error);
  }
};

// FunciÃ³n que crea o actualiza la meta
const emitirMeta = async () => {
  const user = auth.currentUser;
  if (!user) return alert("Debes iniciar sesiÃ³n.");

  const montoIngresado = Number(monto.value);

  // Validar que el monto no exceda el saldo disponible
  if (montoIngresado > saldoDisponible.value) {
    alert(`âŒ El monto objetivo no puede exceder tu saldo disponible de $${formatNumber(saldoDisponible.value)}`);
    return;
  }

  // Datos de la meta
  const data = {
    nombre: nombre.value,
    monto: montoIngresado,
    plazo: plazo.value
  };

  // Si estÃ¡ editando una meta existente
  if (props.metaEditar) {
    try {
      await updateDoc(doc(db, "metas", props.metaEditar.id), data);
      alert("Meta actualizada correctamente");
      await calcularSaldoDisponible(); // Recalcular saldo
      
      // Limpiar formulario y emitir evento
      limpiarFormulario();
      emit('meta-guardada');
    } catch (e) {
      console.error(e);
      alert("Error al actualizar meta");
    }
    return;
  }

  // Si estÃ¡ creando una nueva meta
  try {
    await addDoc(collection(db, "metas"), {
      ...data,
      acumulado: 0,
      fechaRegistro: new Date(),
      completada: false,
      userId: user.uid
    });

    alert("âœ… Meta creada correctamente");
    await calcularSaldoDisponible(); // Recalcular saldo
    
    // Limpiar formulario y emitir evento
    limpiarFormulario();
    emit('meta-guardada');
  } catch (e) {
    console.error(e);
    alert("Error al crear meta");
  }
};

// FunciÃ³n para limpiar el formulario
const limpiarFormulario = () => {
  nombre.value = "";
  monto.value = "";
  plazo.value = "";
};

// Recibe metaEditar cuando se quiere editar una meta
const props = defineProps({
  metaEditar: { type: Object, default: null }
});

// Rellena el formulario con los datos de la meta que se estÃ¡ editando
watch(
  () => props.metaEditar,
  (nueva) => {
    if (nueva) {
      nombre.value = nueva.nombre;
      monto.value = nueva.monto;
      plazo.value = nueva.plazo;
    } else {
      limpiarFormulario();
    }
  },
  { immediate: true }
);

// Formatear nÃºmeros
const formatNumber = (num: number) => num.toLocaleString("es-CO");

// Cargar saldo disponible al montar el componente
onMounted(() => {
  calcularSaldoDisponible();
});

</script>

<style scoped>
/* Estilo del formulario */
.formulario {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Estilo de los inputs */
.input-group {
  background: linear-gradient(135deg, #a1c4fd, #c2e9fb, #fbc2eb);
  border-radius: 18px;
  margin-bottom: 20px;
  position: relative;
}

/* InformaciÃ³n del saldo */
.saldo-info {
  background: rgba(255, 255, 255, 0.2);
  padding: 12px;
  border-radius: 12px;
  text-align: center;
  margin-bottom: 10px;
}

.saldo-info p {
  margin: 0;
  color: white;
  font-weight: 700;
  font-size: 1rem;
}

/* Estilo del input de fecha */
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

/* Estilo de botones */
.back-btn {
  --background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  --color: white;
  font-weight: 700;
  font-size: 1.1rem;
  border-radius: 30px;
  box-shadow: 0 6px 14px rgba(255, 209, 102, 0.4);
}

/* Contenedor de botones */
.button-row {
  display: flex;
  justify-content: center;
}
</style>