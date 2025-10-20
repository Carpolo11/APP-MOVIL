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
  background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 40%, #fbc2eb 100%);
  padding: 40px 20px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}
.decor-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}
.circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.15;
  animation: float 15s infinite ease-in-out;
}
.circle-1 {
  width: 400px; height: 400px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  top: -150px; left: -100px;
}
.circle-2 {
  width: 300px; height: 300px;
  background: linear-gradient(135deg, #43e97b, #38f9d7);
  bottom: -150px; right: -150px;
  animation-delay: 8s;
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
