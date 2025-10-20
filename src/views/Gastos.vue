<template>
  <ion-page>
    <ion-content class="ion-padding creatCat-bg">
        <ion-title class="app-title">💸➕ CREA UN NUEVO GASTO</ion-title>
        <div class="create-cat-container">

          <!-- Formulario -->
          <form @submit.prevent="crearGas">
            <!-- Titulo -->
            <ion-item class="input-group">
              <ion-icon name="person-outline" slot="start"></ion-icon>
              <ion-input v-model="titulo" type="text" placeholder="Titulo del gasto" required
              />
            </ion-item>

            <!-- Monto -->
            <ion-item class="input-group">
              <ion-icon name="mail-outline" slot="start"></ion-icon>
              <ion-input v-model="monto" type="number" placeholder="Monto del gasto" required />
            </ion-item>

            <!-- Descripcion -->
            <ion-item class="input-group">
              <ion-icon name="lock-closed-outline" slot="start"></ion-icon>
              <ion-input
                v-model="descripcion"
                type="text"
                placeholder="Descripcion"
                required
              />
            </ion-item>

            <!-- Categorias -->
<ion-item class="input-group">
  <ion-icon name="list-outline" slot="start"></ion-icon>
  <ion-select
    v-model="cate"
    placeholder="Selecciona una categoría"
    required
  >
    <ion-select-option
      v-for="categoria in categorias"
      :key="categoria.titulo"
      :value="categoria.titulo"
    >
      {{ categoria.titulo }}
    </ion-select-option>
  </ion-select>
</ion-item>


            <!-- Botón registro -->
             <div class="button-row">

            <ion-button expand="block" type="submit" class="back-btn">
              CREAR GASTO
            </ion-button>
            </div>

                        <!-- Botón volver -->
            <div class="button-row">
             <ion-button expand="block" router-link="/dashboard" class="back-btn">
               VOLVER
            </ion-button>
            </div>
          </form>

        </div>
      
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  IonSelect,
  IonSelectOption,
} from "@ionic/vue";
import { ref, onMounted } from "vue";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useRouter } from "vue-router";

const router = useRouter();

const titulo = ref("");
const monto = ref<number>(0);
const descripcion = ref("");
const categorias = ref<any[]>([]);
const cate = ref("");

// ✅ Función para cargar categorías solo una vez
const cargarCategorias = async () => {
  try {
    const snapshot = await getDocs(collection(db, "categorias"));
    const lista: any[] = [];
    snapshot.forEach((doc) => {
      lista.push(doc.data());
    });
    categorias.value = lista;
    console.log("Categorías cargadas:", categorias.value);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
  }
};

onMounted(() => {
  cargarCategorias(); // 🔹 Cargamos al iniciar
});

// ✅ Crear gasto
const crearGas = async () => {
  if (!titulo.value || !monto.value || !descripcion.value || !cate.value) {
    alert("Por favor completa todos los campos");
    return;
  }
  if (monto.value < 0) {
    alert("Ingresa un gasto válido");
    return;
  }

  try {
    await addDoc(collection(db, "gastos"), {
      titulo: titulo.value,
      monto: monto.value,
      descripcion: descripcion.value,
      categoria: cate.value,
      fechaRegistro: new Date(),
    });

    alert(`Creación exitosa: ${titulo.value}`);
    router.push("/gasto");
  } catch (error) {
    console.error("Error al crear gasto:", error);
    alert("Hubo un error al crear el gasto");
  }
};
</script>


<style scoped>

/* Caja contenedora */
.create-cat-container {
padding: 50px 40px; /* ↓ antes 30px 25px */
background: rgba(255, 255, 255, 0.15);
backdrop-filter: blur(12px);
border-radius: 20px;
box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);

}


.header-icon {
  font-size: 45px;
  color: #ffd166;
}
h2 {
  font-weight: 700;
  margin: 10px 0 5px;
}


/* Inputs */
.input-group {
  --border-color: rgba(255, 255, 255, 0.3);
  --highlight-color-focused: #ffd166;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 15px;
  margin-bottom: 18px;
  color: #fff;
}

/* Botón crear */
.back-btn {
  --background: #ffd166;
  --color: #333;
  font-weight: 600;
  border-radius: 30px;
  margin-top: 10px;
  box-shadow: 0 4px 10px rgba(255, 209, 102, 0.4);
}
.back-btn:hover {
  --background: #ffb703;
}

/* Botón volver */
.back-btn {
  --color: #fff;
  text-transform: none;
  margin-top: 20px;
  opacity: 0.85;
}
.back-btn:hover {
  opacity: 1;
}

.button-row {
  display: flex;
  justify-content: flex-start; /* o flex-end si lo quieres a la derecha */
  width: 100%;
}

.app-title {
  font-weight: 800;
  font-size: 22px;
}

  .app-title {
    font-size: 20px;
  }

/* Responsivo */
@media (max-width: 400px) {
  .create-cat-container {
    width: 90%;
    padding: 25px 20px;
  }
}
</style>
