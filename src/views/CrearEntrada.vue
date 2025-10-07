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
  background: linear-gradient(135deg, #e3f2fd 0%, #fce4ec 50%, #f3e5f5 100%);
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
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  width: 100%;
  max-width: 480px;
  backdrop-filter: blur(8px);
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

.circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.15;
  animation: float 16s infinite ease-in-out;
}

.circle-1 {
  width: 380px;
  height: 380px;
  background: linear-gradient(135deg, #43e97b, #38f9d7);
  top: -180px;
  left: -180px;
  animation-delay: 0s;
}

.circle-2 {
  width: 280px;
  height: 280px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  bottom: -140px;
  right: -140px;
  animation-delay: 6s;
}

.circle-3 {
  width: 220px;
  height: 220px;
  background: linear-gradient(135deg, #f093fb, #f5576c);
  top: 50%;
  right: 10%;
  animation-delay: 12s;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-25px) rotate(180deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .entrada-view {
    padding: 20px 15px;
  }

  .entrada-container {
    padding: 1.5rem;
  }

  h1 {
    font-size: 1.4rem;
  }

  .circle {
    opacity: 0.08;
  }

  .circle-1 { width: 250px; height: 250px; }
  .circle-2 { width: 200px; height: 200px; }
  .circle-3 { width: 150px; height: 150px; }
}
</style>
