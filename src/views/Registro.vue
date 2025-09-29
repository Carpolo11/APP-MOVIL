<template>
  <ion-page>
    <ion-content class="ion-padding register-bg">
      <div class="register-wrapper">
        <div class="register-container">
          <!-- Avatar -->
          <div class="avatar">
            <img src="@/assets/registro.png" alt="Avatar" />
          </div>

          <!-- Formulario -->
          <form @submit.prevent="register">
            <!-- Nombre -->
            <ion-item class="input-group">
              <ion-icon name="person-outline" slot="start"></ion-icon>
              <ion-input
                v-model="name"
                type="text"
                placeholder="Full Name"
                required
              />
            </ion-item>

            <!-- Email -->
            <ion-item class="input-group">
              <ion-icon name="mail-outline" slot="start"></ion-icon>
              <ion-input
                v-model="email"
                type="email"
                placeholder="Email"
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

            <!-- Confirmar Password -->
            <ion-item class="input-group">
              <ion-icon name="lock-closed-outline" slot="start"></ion-icon>
              <ion-input
                v-model="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                required
              />
            </ion-item>

            <!-- Botón registro -->
            <ion-button expand="block" type="submit" class="register-btn">
              Register Now
            </ion-button>
          </form>

          <!-- Volver a login -->
          <p class="redirect">
            Already have an account?
            <ion-button fill="outline" size="small" router-link="/home">
              Login here
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

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

const register = () => {
  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    alert("Por favor completa todos los campos");
    return;
  }
  if (password.value !== confirmPassword.value) {
    alert("Las contraseñas no coinciden");
    return;
  }
  alert(`Cuenta creada para: ${name.value} (${email.value})`);
};
</script>

<style scoped>

.register-wrapper {
  height: 100%; /* ocupa todo el ion-content */
  display: flex;
  align-items: center;     /* centra vertical */
  justify-content: center; /* centra horizontal */
}

/* Fondo degradado */
.register-bg {
  --background: linear-gradient(to bottom, #00c6ff, #0072ff, #7a00ff);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Caja del registro */
.register-container {
  width: 350px;
  padding: 30px;
  border-radius: 12px;
  background: white;
  text-align: center;
  color: black;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
}

/* Inputs */
.input-group {
  margin-bottom: 15px;
  border-radius: 25px;
  --border-color: #0072ff;
  --highlight-color-focused: #0072ff;
}

/* Botón registro */
.register-btn {
  --background: #ffb703;
  --color: black;
  font-weight: bold;
  border-radius: 25px;
  margin-top: 10px;
  font-size: 16px;
}

.register-btn:hover {
  --background: #ff9800;
}

/* Redirección */
.redirect {
  margin-top: 20px;
  font-size: 14px;
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

/* Avatar */
.avatar {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
}

.avatar img {
  width: 180px;
  height: 180px;
  border-radius: 2%;
}
</style>
