<template>
  <ion-page>
    <ion-content class="ion-padding metas-bg">
      <ion-title class="app-title">🎯 METAS DE AHORRO</ion-title>
      <div class="card">
        <div class="metas-container">
          <MetaForm @crear-meta="agregarMeta" />
          <div class="metas-list">
            <MetaCard v-for="(meta, i) in metas" :key="i" :meta="meta" />
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonTitle } from "@ionic/vue";
import { ref } from "vue";
import MetaForm from "@/components/metas/MetaForm.vue";
import MetaCard from "@/components/metas/MetaCard.vue";

const metas = ref<any[]>([]);

const agregarMeta = (meta: any) => {
  metas.value.push(meta);
};
</script>

<style scoped>
.metas-bg {
  --background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
}
.card {
  display: flex;
  justify-content: center;
}
.metas-container {
  width: 95%;
  max-width: 500px;
  padding: 40px 30px;
  background: linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b);
  border-radius: 24px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}
.app-title {
  text-align: center;
  font-weight: 900;
  font-size: 30px;
  color: #fff;
  margin-top: 20px;
  text-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
}
.metas-list {
  margin-top: 2rem;
  display: grid;
  gap: 1.5rem;
}
</style>
