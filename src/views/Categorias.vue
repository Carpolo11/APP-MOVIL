<template>
  <ion-page>
    <ion-content class="ion-padding creatCat-bg">
        <ion-title class="app-title">🏷️➕ CREA UNA NUEVA CATEGORIA</ion-title>
        <div class="create-cat-container">

          <!-- Formulario -->
          <form @submit.prevent="crearCat">
            <!-- Titulo -->
            <ion-item class="input-group">
              <ion-icon name="person-outline" slot="start"></ion-icon>
              <ion-input v-model="titulo" type="text" placeholder="Titulo de categoria" required
              />
            </ion-item>

            <!-- fecha -->
            <ion-item class="input-group">
              <ion-icon name="mail-outline" slot="start"></ion-icon>
              <ion-input
                v-model="fecha"
                type="date"
                placeholder="Fecha"
                required
              />
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

            <!-- Porcentaje Maximo -->
            <ion-item class="input-group">
              <ion-icon name="lock-closed-outline" slot="start"></ion-icon>
              <ion-input
                v-model="porcentajeMax"
                type="number"
                placeholder="Asigna el porcenta maximo"
                required
              />
            </ion-item>

            <!-- Botón registro -->
             <div class="button-row">

            <ion-button expand="block" type="submit" class="back-btn">
              CREAR CATEGORIA
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
} from "@ionic/vue";
import { ref } from "vue";
import { collection, addDoc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useRouter } from "vue-router"; // ✅ Importa el router

const router = useRouter(); // ✅ Instancia de router

const titulo = ref("");
const fecha = ref("");
const descripcion = ref("");
const porcentajeMax = ref<number>(0);


const crearCat = async () => {
  if (!titulo.value || !fecha.value || !descripcion.value || !porcentajeMax.value) {
    alert("Por favor completa todos los campos");
    return;
  }
  if (porcentajeMax.value > 100 || porcentajeMax.value < 0) {
    alert("Ingresa un porcentaje válido (0–100)");
    return;
  }

      try {

    // Guarda en la colección "Categorias"
    await addDoc(collection(db, "categorias"), {
      titulo: titulo.value,
      fecha: fecha.value,
      descripcion: descripcion.value,
      porcentaje: porcentajeMax.value, 
      fechaRegistro: new Date(),
    });

    titulo.value = "";
    fecha.value = "";
    descripcion.value = "";
    porcentajeMax.value = 0;

    alert(`Creacion exitosa: ${titulo.value}`);
    // Aquí podrías redirigir a la página de login
     router.push("/categoria");
  } catch (error) {
    console.error("Error al crear categoria:", error);
    alert("Hubo un error al crear categoria");
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
