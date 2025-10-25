<template>
  <header class="dashboard-header">
    <h1>💰 FinanceApp</h1>
    <p>Hola, <strong>{{userEmail}}</strong> Tu resumen financiero te espera.</p>
    <p>Gestiona tus recursos de forma inteligente. 📊</p>
  </header>
</template>


<script setup lang="ts">

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ref, onMounted } from "vue";

const userEmail = ref("Invitado"); // Valor por defecto

const auth = getAuth();


// Detectamos el usuario logueado
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userEmail.value = user.email || "Usuario sin correo";
    } else {
      userEmail.value = "Invitado";
    }
  });
});
</script>



<style scoped>
.dashboard-header {
  text-align: center;
  background: linear-gradient(90deg, #a8edea, #fed6e3);
  color: #001f3f;
  padding: 2px 6px;
  border-radius: 6px;
  margin-bottom: 10px;
  line-height: 1.2;
}
</style>
