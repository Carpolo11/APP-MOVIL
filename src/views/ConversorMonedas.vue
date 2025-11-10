<template>
  <div class="contenedor">
    <h2>Conversor de Monedas</h2>

    <div class="formulario">
      <label>Monto:</label>
      <input type="number" v-model.number="monto" placeholder="Ingresa monto" min="0" />

      <label>Moneda origen:</label>
      <select v-model="monedaOrigen">
        <option value="COP">COP (Peso Colombiano)</option>
        <option value="USD">USD (Dólar Estadounidense)</option>
        <option value="EUR">EUR (Euro)</option>
      </select>

      <label>Moneda destino:</label>
      <select v-model="monedaDestino">
        <option value="COP">COP (Peso Colombiano)</option>
        <option value="USD">USD (Dólar Estadounidense)</option>
        <option value="EUR">EUR (Euro)</option>
      </select>

      <button @click="convertir">Convertir</button>
    </div>

    <div v-if="resultado" class="resultado">
      <h3>Resultado:</h3>
      <p>
        {{ monto }} {{ monedaOrigen }} =
        <strong>{{ resultado.toFixed(2) }} {{ monedaDestino }}</strong>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "ConversorMonedas",
  data() {
    return {
      monto: null,
      monedaOrigen: "USD",
      monedaDestino: "COP",
      tasas: null,
      resultado: null,
    };
  },
  methods: {
    async obtenerTasas() {
      try {
        // API gratuita que no necesita clave: exchangerate.host
        const res = await fetch(`https://api.exchangerate.host/latest?base=${this.monedaOrigen}`);
        const data = await res.json();
        this.tasas = data.rates;
      } catch (error) {
        console.error("Error obteniendo tasas:", error);
      }
    },
    async convertir() {
      if (!this.monto || this.monto <= 0) {
        alert("Por favor ingresa un monto válido.");
        return;
      }
      await this.obtenerTasas();

      if (this.tasas && this.tasas[this.monedaDestino]) {
        this.resultado = this.monto * this.tasas[this.monedaDestino];
      } else {
        alert("No se pudo realizar la conversión.");
      }
    },
  },
};
</script>

<style scoped>
.contenedor {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 15px;
  max-width: 400px;
  margin: 2rem auto;
  text-align: center;
  font-family: "Poppins", sans-serif;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.formulario {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
input,
select {
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid #ccc;
}
button {
  background: #007bff;
  color: white;
  padding: 0.7rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}
button:hover {
  background: #0056b3;
}
.resultado {
  margin-top: 1.5rem;
  font-size: 1.2rem;
  color: #333;
}
</style>
