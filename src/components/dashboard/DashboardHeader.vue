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
  padding: 20px 30px;
  border-radius: 12px;
  margin-bottom: 20px;
  line-height: 1.5;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}


.dashboard-header.compact {
  padding: 10px 18px;
  margin-bottom: 15px;
  max-width: 550px;
}

.dashboard-header h1,
.dashboard-header .title {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.dashboard-header p,
.dashboard-header .subtitle {
  font-size: 1.05rem;
  margin: 0;
}

</style>
