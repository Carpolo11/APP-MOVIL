<template>
  <section class="entrada-view">
    <!-- Fondos animados -->
    <div class="background-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <!-- Contenedor principal -->
    <div class="entrada-container">
      <h1>💰 Registrar Entrada</h1>
      <EntradaForm />
    </div>
  </section>
</template>

<script setup lang="ts">
import EntradaForm from '@/components/entradas/EntradaForm.vue';
</script>

<style scoped>
.entrada-view {
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 40px 20px;
}

/* Contenedor principal (card visual) */
.entrada-container {
  width: 90%;
  max-width: 420px;
  padding: 40px 30px;
  background: linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  margin-top: 20px;
}

h1 {
  text-align: center;
  font-size: 1.7rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

/* Decoraciones animadas */
.background-decoration {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
}
</style>