<template>
  <div class="info-box">
    <ion-icon name="information-circle-outline"></ion-icon>
    <p><strong>Hola, {{ userName }}!</strong> Tu resumen financiero te espera. Gestiona tus recursos de forma inteligente. 📈</p>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
defineProps<{ userName: string; }>();
</script>

<style scoped>
.info-box {
  background: linear-gradient(135deg, #e0f7fa, #b2ebf2); 
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.info-box ion-icon {
  font-size: 30px;
  color: #00bcd4; /* Azul cian */
  flex-shrink: 0;
}
.info-box p {
  margin: 0;
  font-size: 15px;
  color: #2c3e50;
  line-height: 1.4;
}

/* Responsividad */
@media (max-width: 600px) {
  .info-box {
    padding: 15px;
    gap: 10px;
  }
  .info-box ion-icon {
    font-size: 24px;
  }
  .info-box p {
    font-size: 14px;
  }
}
</style>