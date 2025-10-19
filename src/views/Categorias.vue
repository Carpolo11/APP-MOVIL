<template>
  <ion-page>
    <ion-content class="ion-padding register-bg">
      <div class="register-wrapper">
        <div class="register-container">

            <h2> CREAR NUEVAS CATEGORIAS </h2>

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
            <ion-button expand="block" type="submit" class="register-btn">
              CREAR CATEGORIA
            </ion-button>
          </form>

            <!-- Botón volver -->
             <ion-button expand="block" router-link="/categorias" class="back-btn">
               VOLVER
            </ion-button>


          <!-- Volver a login -->
          <p class="redirect">
            <ion-button fill="outline" size="small" router-link="/categoria">
            </ion-button>
          </p>
        </div>
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

const titulo = ref("");
const fecha = ref("");
const descripcion = ref("");
const porcentajeMax = ref<number>(0);


const crearCat = () => {
  if (!titulo.value || !fecha.value || !descripcion.value || !porcentajeMax.value) {
    alert("Por favor completa todos los campos");
    return;
  }
  if (porcentajeMax.value > 100 || porcentajeMax.value < 0) {
    alert("Ingresa un porcentaje válido (0–100)");
    return;
  }
  alert(`Categoria creada: ${titulo.value}`);
};
</script>

<style scoped>
/* Fondo con glassmorphism */
.create-cat-bg {
  --background: linear-gradient(135deg, #6a11cb, #2575fc);
  display: flex;
  justify-content: center;
  align-items: center;
}

.create-cat-wrapper {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Caja contenedora */
.create-cat-container {
  width: 380px;
  padding: 30px 25px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
  text-align: center;
  color: #fff;
}

/* Encabezado */
.header {
  margin-bottom: 25px;
}
.header-icon {
  font-size: 45px;
  color: #ffd166;
}
h2 {
  font-weight: 700;
  margin: 10px 0 5px;
}
.header p {
  font-size: 0.9rem;
  opacity: 0.9;
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
.create-btn {
  --background: #ffd166;
  --color: #333;
  font-weight: 600;
  border-radius: 30px;
  margin-top: 10px;
  box-shadow: 0 4px 10px rgba(255, 209, 102, 0.4);
}
.create-btn:hover {
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

/* Responsivo */
@media (max-width: 400px) {
  .create-cat-container {
    width: 90%;
    padding: 25px 20px;
  }
}
</style>
