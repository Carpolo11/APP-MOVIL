<template>
  <section class="metas-view">
    <div class="decor-bg">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
    </div>

    <div class="content">
      <h1>🎯Metas de Ahorro</h1>
      <MetaForm @nuevaMeta="agregarMeta" />
      <MetaList :metas="metas" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import MetaForm from '@/components/metas/MetaForm.vue'
import MetaList from '@/components/metas/MetaList.vue'

const metas = ref(JSON.parse(localStorage.getItem('metas') || '[]'))

function agregarMeta(meta: any) {
  metas.value.push(meta)
  localStorage.setItem('metas', JSON.stringify(metas.value))
}

watch(metas, (nuevas) => {
  localStorage.setItem('metas', JSON.stringify(nuevas))
}, { deep: true })
</script>

<style scoped>
.metas-view {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  padding: 40px 20px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-25px); }
}
.content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 700px;
}
h1 {
  text-align: center;
  color: #2d3748;
  margin-bottom: 30px;
  font-size: 2rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
</style>
