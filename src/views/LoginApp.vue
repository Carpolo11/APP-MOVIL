<template>
  <ion-page>
    <ion-content class="ion-padding login-bg">
      <div class="login-wrapper">
        <div class="login-container">
          <!-- Avatar -->
          <div class="avatar">
            <img src="@/assets/avatar1.png" alt="Avatar" />
          </div>

          <!-- Formulario -->
          <form @submit.prevent="login">
            <!-- Username -->
            <ion-item class="input-group">
              <ion-icon name="person-outline" slot="start"></ion-icon>
              <ion-input
                v-model="email"
                type="text"
                placeholder="Username"
                required
              />
            </ion-item>

            <!-- Password -->
            <ion-item class="input-group">
              <ion-icon name="lock-closed-outline" slot="start"></ion-icon>
              <ion-input
                v-model="password"
                type="password"
                placeholder="Password"
                required
              />
            </ion-item>

            <!-- BotÃ³n login -->
            <ion-button expand="block" type="submit" class="login-btn">
              INICIAR SESION
            </ion-button>

            <!-- Opciones -->
            <div class="options">
              <ion-checkbox v-model="rememberMe"></ion-checkbox>
              <span>Remember me</span>
              <a href="#">Forgot password?</a>
            </div>
          </form>

          <!-- Crear cuenta -->
          <p class="redirect">
            Not a member?
            <ion-button fill="outline" size="small" router-link="/registro">
              Create account
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
  IonCheckbox,
} from "@ionic/vue";
import { ref } from "vue";

const email = ref("");
const password = ref("");
const rememberMe = ref(false);

const login = () => {
  if (email.value && password.value) {
    alert(`Bienvenido: ${email.value}`);
  } else {
    alert("Por favor ingresa todos los campos");
  }
};
</script>

<style scoped>

.login-wrapper {
  height: 100%; /* ocupa todo el ion-content */
  display: flex;
  align-items: center;   /* centra vertical */
  justify-content: center; /* centra horizontal */
}

/* Fondo con degradado */
.login-bg {
  --background: linear-gradient(to bottom, #00c6ff, #0072ff, #7a00ff);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Caja del login */
.login-container {
  width: 350px;
  padding: 30px;
  border-radius: 12px;
  background: white;
  text-align: center;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
}

/* Avatar */
.avatar img {
  width: 180px;
  height: 180px;
  margin-bottom: 15px;
  border-radius: 50%;
}

/* Inputs */
.input-group {
  margin-bottom: 15px;
  border-radius: 25px;
  --border-color: #0072ff;
  --highlight-color-focused: #0072ff;
}

/* BotÃ³n login */
.login-btn {
  --background: #ffb703;
  --color: black;
  font-weight: bold;
  border-radius: 25px;
  margin-top: 10px;
  font-size: 16px;
}

.login-btn:hover {
  --background: #ff9800;
}

/* Opciones */
.options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 12px 0;
  font-size: 14px;
  color: #000;
}

.options a {
  color: black;
  text-decoration: none;
}

.options a:hover {
  text-decoration: underline;
  
}

/* Crear cuenta */
.redirect {
  margin-top: 20px;
  font-size: 14px;
  color: #000;
}

.redirect ion-button {
  --border-color: #0072ff;
  --color: #0072ff;
  border-radius: 25px;
}

.redirect ion-button:hover {
  --background: #0072ff;
  --color: white;
}
</style>