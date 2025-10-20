<template>
  <section class="meta-list">
    <transition-group name="fade" tag="div">
      <MetaCard v-for="meta in metas" :key="meta.id" :meta="meta" />
    </transition-group>
  </section>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import MetaCard from './MetaCard.vue'

type Meta = {
  id: string | number
  // add other fields of a meta here as needed
  [key: string]: any
}

const props = defineProps<{ metas: Meta[] }>()
</script>

<style scoped>
.meta-list {
  margin-top: 2rem;
}
.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
