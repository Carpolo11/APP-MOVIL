<template>
  <div class="info-box">
    <ion-icon name="information-circle"></ion-icon>
    <p><strong>Bienvenido, {{ userName }}!</strong> Gestiona tus finanzas de forma inteligente.</p>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';

defineProps<{
  userName: string;
}>();
</script>

<style scoped>
.info-box {
  background: linear-gradient(135deg, #e3f2fd, #f3e5f5);
  padding: 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
}

.info-box ion-icon {
  font-size: 28px;
  color: #667eea;
  flex-shrink: 0;
}

.info-box p {
  margin: 0;
  font-size: 14px;
  color: #2c3e50;
  line-height: 1.5;
}
</style>