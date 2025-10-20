<template>
  <ion-page>
    <ion-content class="ion-padding creatCat-bg">
        <ion-title class="app-title">🏷️➕ CREA UNA NUEVA CATEGORIA</ion-title>
        <div class="card">
        <div class="create-cat-container">

          <!-- Formulario -->
          <form @submit.prevent="crearCat">
            <!-- Titulo -->
            <ion-item class="input-group">
              <ion-icon name="person-outline" slot="start"></ion-icon>
              <ion-input v-model="titulo" type="text" placeholder="Titulo de categoria" required
              />
            </ion-item>

            <!-- fecha -->
            <ion-item class="input-group">
              <ion-icon name="mail-outline" slot="start"></ion-icon>
              <ion-input
                v-model="fecha"
                type="date"
                placeholder="Fecha"
                required
              />
            </ion-item>

            <!-- Descripcion -->
            <ion-item class="input-group">
              <ion-icon name="lock-closed-outline" slot="start"></ion-icon>
              <ion-input
                v-model="descripcion"
                type="text"
                placeholder="Descripcion"
                required
              />
            </ion-item>

            <!-- Porcentaje Maximo -->
            <ion-item class="input-group">
              <ion-icon name="lock-closed-outline" slot="start"></ion-icon>
              <ion-input
                v-model="porcentajeMax"
                type="number"
                placeholder="Asigna el porcenta maximo"
                required
              />
            </ion-item>

            <!-- Botón registro -->
             <div class="button-row">

            <ion-button expand="block" type="submit" class="back-btn">
              CREAR CATEGORIA
            </ion-button>
            </div>

            <!-- Botón volver -->
            <div class="button-row">
             <ion-button expand="block" router-link="/dashboard" class="back-btn">
               VOLVER
            </ion-button>
            </div>
          </form>

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
} from "@ionic/vue";
import { onMounted, ref } from "vue";
import { collection, addDoc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useRouter } from "vue-router"; // ✅ Importa el router

const router = useRouter(); // ✅ Instancia de router

const titulo = ref("");
const fecha = ref("");
const descripcion = ref("");
const porcentajeMax = ref<number>(0);
const sumaPorcentajes = ref<number>(0);

const TraerPorcen = async () => {

      const CargarCate = await getDocs(collection(db, "categorias"))
        let SumaPorcen = 0;
        CargarCate.forEach((doc) => {
          const data = doc.data();
          SumaPorcen += Number(data.porcentaje) || 0;

       });

       sumaPorcentajes.value = SumaPorcen;

};

onMounted(() => {
  TraerPorcen(); // 🔹 Cargamos al iniciar
});



const crearCat = async () => {
  if (!titulo.value || !fecha.value || !descripcion.value || !porcentajeMax.value) {
    alert("Por favor completa todos los campos");
    return;
  }
  if (porcentajeMax.value > 100 || porcentajeMax.value < 0) {
    alert("Ingresa un porcentaje válido (0–100)");
    return;
  }

  await TraerPorcen();

    // Validar que la suma no supere el 100 %
  const nuevoTotal = Number(sumaPorcentajes.value) + Number(porcentajeMax.value);
  const sobrante = (Number(sumaPorcentajes.value) - 100);
  if (nuevoTotal > 100) {
    alert(
      `⚠️ No puedes crear esta categoría. El total de porcentajes (${nuevoTotal}%) supera el 100%. porcentaje disponible (${sobrante}%)`
    );
    return;
  }
   
      try {

    // Guarda en la colección "Categorias"
    await addDoc(collection(db, "categorias"), {
      titulo: titulo.value,
      fecha: fecha.value,
      descripcion: descripcion.value,
      porcentaje: Number(porcentajeMax.value), 
      fechaRegistro: new Date(),
    });

    titulo.value = "";
    fecha.value = "";
    descripcion.value = "";
    porcentajeMax.value = 0;

    alert(`Creacion exitosa: ${titulo.value}`);
    // Aquí podrías redirigir a la página de login
     router.push("/categoria");
  } catch (error) {
    console.error("Error al crear categoria:", error);
    alert("Hubo un error al crear categoria");
  }

  
};
</script>

<style scoped>

/* 🎨 Fondo general */
.creatCat-bg {
  --background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
}


/* 🧱 Contenedor centrado */
.card {
  display: flex;
  justify-content: center;
  align-items: center;

}


/* Caja contenedora */
.create-cat-container {
  width: 90%;
  max-width: 420px;
  padding: 40px 30px;
  background: linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  margin-top: 20px;

}




.header-icon {
  font-size: 45px;
  color: #ffd166;
}
h2 {
  font-weight: 700;
  margin: 10px 0 5px;
}


/* Inputs */
.input-group {
  --border-color: rgba(255, 255, 255, 0.3);
  --highlight-color-focused: #ffd166;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 15px;
  margin-bottom: 18px;
  color: #fff;
}

/* Botón crear */
/* 🟡 Botones */
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

/* 🔘 Fila de botones */
.button-row {
  display: flex;
  justify-content: center;
  width: 100%;
}

.app-title {
  text-align: center;
  font-weight: 800;
  font-size: 24px;
  color: #fff;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  margin-top: 15px;
}

  .app-title {
    font-size: 20px;
  }

/* Responsivo */
@media (max-width: 400px) {
  .create-cat-container {
    width: 90%;
    padding: 25px 20px;
  }
}
</style>
