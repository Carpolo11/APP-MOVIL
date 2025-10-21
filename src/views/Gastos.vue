<template>
  <ion-page>
    <ion-content class="ion-padding creatCat-bg">
      <ion-title class="app-title">
        💸➕ CREA UN NUEVO GASTO
      </ion-title>

      <div class="card">
        <div class="create-cat-container">

          
          <form @submit.prevent="crearGas">
            
            <ion-item class="input-group">
              <ion-icon name="person-outline" slot="start"></ion-icon>
              <ion-input 
                v-model="titulo" 
                type="text" 
                placeholder="Titulo del gasto" 
                required
              />
            </ion-item>

            <ion-item class="input-group">
              <ion-icon name="mail-outline" slot="start"></ion-icon>
              <ion-input 
                v-model="monto" 
                type="number" 
                placeholder="Monto del gasto" 
                required 
              />
            </ion-item>

            <ion-item class="input-group">
              <ion-icon name="lock-closed-outline" slot="start"></ion-icon>
              <ion-input
                v-model="descripcion"
                type="text"
                placeholder="Descripcion"
                required
              />
            </ion-item>


<ion-item class="input-group">
  <ion-icon name="list-outline" slot="start"></ion-icon>
  <ion-select
    v-model="cate"
    placeholder="Selecciona una categoría"
    :selected-text="cate"  >
    <ion-select-option
      v-for="categoria in categorias"
      :key="categoria.titulo"
      :value="categoria.titulo"
    >
      {{ categoria.titulo }}
    </ion-select-option>
  </ion-select>
</ion-item>


            <div class="button-row">
              <ion-button expand="block" type="submit" class="back-btn">
                CREAR GASTO
              </ion-button>
            </div>


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
  IonSelect,
  IonSelectOption,
} from "@ionic/vue";
import { ref, onMounted } from "vue";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useRouter } from "vue-router";
import { onSnapshot } from "firebase/firestore";

const router = useRouter();

const titulo = ref("");
const monto = ref<number>(0);
const descripcion = ref("");
const categorias = ref<any[]>([]);
const cate = ref("");
const entradas = ref<number>(0);
const gastos = ref<number>(0);

//Trae las categorias
const cargarCategorias = async () => {
  try {
    const snapshot = await getDocs(collection(db, "categorias"));
    const lista: any[] = [];
    snapshot.forEach((doc) => {
      lista.push(doc.data());
    });
    categorias.value = lista;
    console.log("Categorías cargadas:", categorias.value);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
  }
};


//Trae las entradas
const traerEntradas = async () => {

  const refEntradas = collection(db, "entradas");
  onSnapshot(refEntradas, (snapshot) => {
    let totalEntradas = 0;
    snapshot.forEach((doc) => {
      totalEntradas += Number(doc.data().monto) || 0;
    });
    entradas.value = totalEntradas;
    console.log("Entradas actualizadas en tiempo real:", entradas.value);
  });

  };
  

  
//Trae los Gastos
const TrearGastos = async () => {
  const refGastos = collection(db, "gastos");
  onSnapshot(refGastos, (snapshot) => {
    let totalGasto = 0;
    snapshot.forEach((doc) => {
      totalGasto += Number(doc.data().monto) || 0;
    });
    gastos.value = totalGasto;
    console.log("Gastos actualizados en tiempo real:", gastos.value);
  });
  
};

    onMounted(() => {
     cargarCategorias();
     traerEntradas(); 
     TrearGastos();
  });


const crearGas = async () => {
  if (!titulo.value || !monto.value || !descripcion.value || !cate.value) {
    alert("Por favor completa todos los campos");
    return;
  }
  if (monto.value < 0) {
    alert("Ingresa un gasto válido");
    return;
  }  


  const nuevoTotal = Number(entradas.value) - Number(gastos.value);
  if (monto.value > nuevoTotal) {
    alert(
      `⚠️ No puedes crear este gasto. El monto ($${monto.value}) supera el saldo disponible actual. Saldo disponible: ($${nuevoTotal})`
    );
    return;
  }

  try {
    await addDoc(collection(db, "gastos"), {
      titulo: titulo.value,
      monto: Number(monto.value),
      descripcion: descripcion.value,
      categoria: cate.value,
      fechaRegistro: new Date(),
    });



    alert(`Creación exitosa: ${titulo.value}`);
    titulo.value = "";
    monto.value = 0;
    descripcion.value = "";
    cate.value = "";

    router.push("/gasto");
  } catch (error) {
    console.error("Error al crear gasto:", error);
    alert("Hubo un error al crear el gasto");
  }

};
</script>



<style scoped>
/*  Fondo general */
.creatCat-bg {
  --background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
}

/* Contenedor centrado */
.card {
  display: flex;
  justify-content: center;
  align-items: center;

}

/* Contenedor principal (tarjeta) */
.create-cat-container {
  width: 90%;
  max-width: 420px;
  padding: 40px 30px;
  background: linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  margin-top: 20px;
  
}

/* Inputs */
.input-group {
  --border-color: rgba(0, 4, 255, 0.3);
  background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 40%, #fbc2eb 100%);
  color: white;
  border-radius: 15px;
  margin-bottom: 18px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.input-group:hover {
  transform: scale(1.02);
  box-shadow: 0 0 10px rgba(255, 152, 25, 0.45);
}


/* Botones */
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

/* Fila de botones */
.button-row {
  display: flex;
  justify-content: center;
  width: 100%;
}

/* Título */
.app-title {
  text-align: center;
  font-weight: 800;
  font-size: 24px;
  color: #fff;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  margin-top: 15px;
}

/* 📱 Responsivo */
@media (max-width: 400px) {
  .create-cat-container {
    width: 95%;
    padding: 25px 20px;
  }
  .app-title {
    font-size: 20px;
  }
}
</style>
