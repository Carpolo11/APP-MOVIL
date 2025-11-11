  <template>
    <ion-page>
      <ion-content class="ion-padding convert-bg">
        <ion-title class="app-title">💱 CONVERSOR DE MONEDAS</ion-title>

        <div class="convert-card">
          <!-- Formulario -->
          <form @submit.prevent="convertir">
            <!-- Monto -->
            <ion-item class="input">
              <ion-icon name="cash-outline" slot="start"></ion-icon>
              <ion-input
                v-model.number="monto"
                type="number"
                placeholder="Ingresa monto"
                min="0"
                required
              />
            </ion-item>

            <!-- Moneda origen -->
            <ion-item class="input">
              <ion-icon name="arrow-up-circle-outline" slot="start"></ion-icon>
              <ion-select v-model="monedaOrigen" placeholder="Moneda origen">
                <ion-select-option value="COP">COP (Peso Colombiano)</ion-select-option>
                <ion-select-option value="USD">USD (Dólar Estadounidense)</ion-select-option>
                <ion-select-option value="EUR">EUR (Euro)</ion-select-option>
              </ion-select>
            </ion-item>

            <!-- Moneda destino -->
            <ion-item class="input">
              <ion-icon name="arrow-down-circle-outline" slot="start"></ion-icon>
              <ion-select v-model="monedaDestino" placeholder="Moneda destino" >
                <ion-select-option value="COP">COP (Peso Colombiano)</ion-select-option>
                <ion-select-option value="USD">USD (Dólar Estadounidense)</ion-select-option>
                <ion-select-option value="EUR">EUR (Euro)</ion-select-option>
              </ion-select>
            </ion-item>

            <!-- Botón convertir -->
            <div class="button-row">
              <ion-button expand="block" type="submit" class="convert-btn">
                CONVERTIR
              </ion-button>
            </div>

                        <!-- Botón volver -->
              <div class="button-row">
              <ion-button expand="block" router-link="/dashboard" class="back-btn">
                VOLVER
              </ion-button>
              </div>
          </form>

          <!-- Resultado -->
          <div v-if="resultado" class="resultado">
            <h3>Resultado:</h3>
            <p>
              {{ monto }} {{ monedaOrigen }} =
              <strong>
    {{ resultado.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
    {{ monedaDestino }}
  </strong>
            </p>
          </div>
        </div>
      </ion-content>
    </ion-page>
  </template>

  <script setup lang="ts">
  import {
    IonPage,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonIcon,
    IonTitle,
    IonSelect,
    IonSelectOption,
  } from "@ionic/vue";
  import { ref } from "vue";
  import axios from "axios";

  const monto = ref<number | null>(null);
  const monedaOrigen = ref("");
  const monedaDestino = ref("");
  const tasas = ref<Record<string, number> | null>(null);
  const resultado = ref<number | null>(null);

  const obtenerTasas = async () => {
    try {
      const res = await axios.get(`https://open.er-api.com/v6/latest/${monedaOrigen.value}`);
      tasas.value = res.data.rates;
    } catch (error) {
      console.error("Error obteniendo tasas:", error);
      alert("Hubo un error al obtener las tasas de cambio.");
    }
  };

  const convertir = async () => {
    if (!monto.value || monto.value <= 0) {
      alert("Por favor ingresa un monto válido.");
      return;
    }

    await obtenerTasas();

    if (tasas.value && tasas.value[monedaDestino.value]) {
      resultado.value = monto.value * tasas.value[monedaDestino.value];
    } else {
      alert("No se pudo realizar la conversión.");
    }
  };
  </script>

  <style scoped>
  /* Fondo general */
  .convert-bg {
    --background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  }

  /* Tarjeta contenedora */
  .convert-card {
    width: 90%;
    max-width: 420px;
    margin: 30px auto;
    padding: 30px;
    background: linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b);
    border-radius: 20px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    text-align: center;
  }

  /* Título */
  .app-title {
    text-align: center;
    font-weight: 800;
    font-size: 24px;
    color: #fff;
    text-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    margin-top: 10px;
    margin-bottom: 10px;
  }

  /* Inputs */
  .input{
    margin-bottom: 15px;
    border-radius: 25px;
    --background: black;
  }

  /* Botón principal */
  .convert-btn {
    --background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
    --color: white;
    font-weight: 700;
    border-radius: 30px;
    margin-top: 12px;
    box-shadow: 0 4px 10px rgba(255, 209, 102, 0.4);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .convert-btn:hover {
    transform: translateY(-2px);
  }

  /* Resultado */
  .resultado {
    margin-top: 20px;
    background: #ffffffc9;
    border-radius: 10px;
    padding: 15px;
    color: #222;
  }

  .resultado h3 {
    margin-bottom: 8px;
    font-weight: 700;
    color: #203a43;
  }

  .resultado strong {
    color: #0f2027;
  }

  /* Fila de botones */
  .button-row {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .back-btn {
    --background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
    --color: white;
    font-weight: 700;
    border-radius: 30px;
    margin-top: 12px;
    box-shadow: 0 4px 10px rgba(255, 209, 102, 0.4);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }


  .back-btn:hover {
    transform: translateY(-2px);
    --background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);

  }
  </style>
