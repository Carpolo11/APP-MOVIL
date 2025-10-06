<template>
  <section class="entrada-view">
    <EntradaForm />
  </section>
</template>

<script setup lang="ts">
import EntradaForm from '@/components/entradas/EntradaForm.vue'
</script>

<style scoped>
.entrada-view {
  background: linear-gradient(to bottom right, #e3f2fd, #fce4ec);
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
