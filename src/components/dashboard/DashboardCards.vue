<template>
  <div class="dashboard-cards">
    <!-- Card Saldo Total -->
    <div class="card saldo">
      <div class="card-content">
        <h3>Saldo Total</h3>
        <p class="monto">${{ saldoTotal.toLocaleString() }}</p>
      </div>
    </div>

    <!-- Card Total Entradas -->
    <div class="card entradas">
      <div class="card-content">
        <h3>Total Entradas</h3>
        <p class="numero-destacado">{{ totalEntradas }}</p>
      </div>
    </div>

    <!-- Card Total Categorías -->
    <div class="card categorias">
      <div class="card-content">
        <h3>Total Categorías</h3>
        <p class="numero-destacado">{{ totalCategorias }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  saldoTotal: Number,
  totalEntradas: Number,
  totalCategorias: Number,
});
</script>

<style scoped>
.dashboard-cards {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 30px;
}

.card {
  border-radius: 15px;
  padding: 20px;
  width: 250px;
  text-align: center;
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
  transition: transform 0.3s ease;
}
.card:hover {
  transform: scale(1.03);
}

.saldo {
  background: linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b);
}
.entradas {
  background: linear-gradient(135deg, #00b09b, #96c93d);
}
.categorias {
  background: linear-gradient(135deg, #2193b0, #6dd5ed);
}

.monto {
  font-size: 1.8rem;
  font-weight: 800;
}

.numero-destacado {
  font-size: 2.2rem;
  font-weight: 800;
}


</style>
