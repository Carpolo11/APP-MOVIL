<template>
  <section class="ahorro-view">
    <AhorroForm />
  </section>
</template>

<script setup lang="ts">
import AhorroForm from '@/components/ahorros/AhorrosForm.vue'
</script>

<style scoped>
.ahorro-view {
  background: linear-gradient(to bottom, #00c6ff, #0072ff, #7a00ff);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 40px;
}
</style>
