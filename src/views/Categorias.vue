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
              <ion-input v-model="titulo" type="text" placeholder="Titulo de categoria" required/>
            </ion-item>

            <!-- fecha -->
            <ion-item class="input-group">
              <ion-icon name="mail-outline" slot="start"></ion-icon>
              <ion-input
                v-model="fecha"
                type="date"
                placeholder="Fecha"
                required/>
            </ion-item>

            <!-- Descripcion -->
            <ion-item class="input-group">
              <ion-icon name="lock-closed-outline" slot="start"></ion-icon>
              <ion-input
                v-model="descripcion"
                type="text"
                placeholder="Descripcion (opcional)"/>
            </ion-item>

            <!-- Porcentaje Maximo -->
            <!-- <ion-item class="input-group">
              <ion-icon name="lock-closed-outline" slot="start"></ion-icon>
              <ion-input
                v-model="porcentajeMax"
                type="number"
                  min="0"
                  max="100"
                placeholder="Porcentaje Máximo"
                required/>
            </ion-item> -->

            <!-- Botón registro -->
             <div class="button-row">

            <ion-button expand="block"
              class="back-btn"
              @click="categoriaEditando ? guardarEdicion() : crearCat()" >    
              {{ categoriaEditando ? "GUARDAR CAMBIOS" : "CREAR CATEGORÍA" }}
            </ion-button>
            </div>

            <!-- Botón volver -->
            <div class="button-row">
             <ion-button expand="block" router-link="/dashboard" class="back-btn">
               VOLVER
            </ion-button>
            </div>
          </form>



          <div v-for="cat in categoriasUsuario" :key="cat.id" class="categoria-item">
        
          <div class="cat-info">
            <h3>{{ cat.titulo }}</h3>
            <span class="categoria-icon">📋</span>
          </div>
          
          <div class="categoria-info">
            <div class="info-item">
              <span class="icon">📅</span>
              <div>
                <p class="label">Fecha</p>
                <p class="value">{{ (cat.fecha ) }}</p>
              </div>
            </div>
            
            <div class="info-item">
              <span class="icon">📖</span>
              <div>
                <p class="label">Descripción</p>
                <p class="value">{{ (cat.descripcion) }}</p>
              </div>
            </div>
             
            <!-- <div class="info-item">
              <span class="icon">💯</span>
              <div>
                <p class="label">Porcentaje</p>
                <p class="value">{{ (cat.porcentaje) }}%</p>
              </div>
            </div> -->



          </div>
            <div class="acciones">
              <ion-button class="boton-edit" size="small" @click="editarCat(cat)">
                Editar
              </ion-button>

              <ion-button class="boton-elim" size="small" @click="eliminarCat(cat.id)">
                Eliminar
              </ion-button>
            
            </div>
         
        </div>




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
import { collection, addDoc, getDoc, getDocs, query, where, onSnapshot, doc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useRouter } from "vue-router"; // ✅ Importa el router
import { getAuth } from "firebase/auth";
import { updateDoc, deleteDoc } from "firebase/firestore";

const router = useRouter(); // ✅ Instancia de router
const auth = getAuth();


const titulo = ref("");
const fecha = ref("");
const descripcion = ref("");
// const porcentajeMax = ref<number>();
const sumaPorcentajes = ref<number>();
const categoriasUsuario = ref<any[]>([]);


//Trae las categorias
const TraerCate = async () =>{
  const user = auth.currentUser;
  if (user) {
    const q = query(collection(db, "categorias"), where("userId", "==", user.uid));
    onSnapshot(q, (snapshot) => {
      categoriasUsuario.value = [];
      snapshot.forEach((doc) => {
        categoriasUsuario.value.push({ id: doc.id, ...doc.data() });
      });
    });
  }
};


//Traer pocentaje
// const TraerPorcen = async () => {
//   const user = auth.currentUser;
//   if (user) { 
//     const q = query( collection(db, "categorias"), where("userId", "==", user.uid));
//     onSnapshot(q, (snapshot) => {
//       let SumaPorcen = 0;
//       snapshot.forEach((doc) => {
//         const data = doc.data();
//         SumaPorcen += Number(data.porcentaje) || 0;
//       });
//       sumaPorcentajes.value = SumaPorcen;
//     });
//   }

// };

onMounted(() => {
  // TraerPorcen(); //Cargamos al iniciar
  TraerCate();

});



const crearCat = async () => {
  if (!titulo.value || !fecha.value ) {
    alert("Por favor completa todos los campos");
    return;
  }
  // if (porcentajeMax.value > 100 || porcentajeMax.value < 0) {
  //   alert("Ingresa un porcentaje válido (0–100)");
  //   return;
  // }

  // await TraerPorcen();

    // Validar que la suma no supere el 100 %
  // const nuevoTotal = Number(sumaPorcentajes.value) + Number(porcentajeMax.value);
  // const sobrante =  100 - (Number(sumaPorcentajes.value));
  // if (nuevoTotal > 100) {
  //   alert(
  //     `⚠️ No puedes crear esta categoría. El total de porcentajes (${nuevoTotal}%) supera el 100%. porcentaje disponible (${sobrante}%)`
  //   );
  //   return;
  // }
   
      try {

      const user = auth.currentUser;
    if (user){
    await addDoc(collection(db, "categorias"), {
      titulo: titulo.value,
      fecha: fecha.value,
      descripcion: descripcion.value,
      // porcentaje: Number(porcentajeMax.value), 
      fechaRegistro: new Date(),
      userId: user.uid
    });

    }

    titulo.value = "";
    fecha.value = "";
    descripcion.value = "";
    // porcentajeMax.value = 0;

    alert(`Creacion exitosa: ${titulo.value}`);
    // Aquí podrías redirigir a la página de login
     router.push("/categoria");
  } catch (error) {
    console.error("Error al crear categoria:", error);
    alert("Hubo un error al crear categoria");
  }

  
};


// =============================
// 🟦 EDITAR CATEGORÍA
// =============================
const editarCat = async (cat: any) => {
  // Rellenamos el formulario con los datos existentes
  titulo.value = cat.titulo;
  fecha.value = cat.fecha;
  descripcion.value = cat.descripcion;
  // porcentajeMax.value = cat.porcentaje;

  // Guardamos el ID actual
  categoriaEditando.value = cat.id;
};

const categoriaEditando = ref<string | null>(null);

// Guardar cambios
const guardarEdicion = async () => {
  if (!categoriaEditando.value) return;

    // Validar porcentaje válido
  // if (Number(porcentajeMax.value) < 0 || Number(porcentajeMax.value) > 100) {
  //   alert("Ingresa un porcentaje válido (0–100)");
  //   return;
  // }

      // Validar que la suma no supere el 100 %
  // const nuevoTotal = Number(sumaPorcentajes.value) + Number(porcentajeMax.value);
  // const sobrante =  100 - (Number(sumaPorcentajes.value));
  // if (nuevoTotal > 100) {
  //   alert(
  //     `⚠️ No puedes Editar esta categoría. El total de porcentajes (${nuevoTotal}%) supera el 100%. porcentaje disponible (${sobrante}%)`
  //   );
  //   return;
  // }

  try {
    const refCat = doc(db, "categorias", categoriaEditando.value);

    await updateDoc(refCat, {
      titulo: titulo.value,
      fecha: fecha.value,
      descripcion: descripcion.value,
      // porcentaje: Number(porcentajeMax.value)
    });

    alert("Categoría actualizada correctamente ✔");

    // Limpiar formulario
    titulo.value = "";
    fecha.value = "";
    descripcion.value = "";
    // porcentajeMax.value = 0;
    categoriaEditando.value = null;

  } catch (error) {
    console.error("Error actualizando:", error);
  }
};

// =============================
// 🟥 ELIMINAR CATEGORÍA
// =============================
const eliminarCat = async (id: string) => {
  const confirmar = confirm("¿Seguro que deseas eliminar esta categoría?");
  if (!confirmar) return;

  try {
    await deleteDoc(doc(db, "categorias", id));
    alert("Categoría eliminada ✔");
  } catch (error) {
    console.error("Error al eliminar:", error);
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

/* Estilos generales para el contenedor principal de la lista */
.categoria-lista {
    max-width: 900px; /* Limita el ancho máximo para una mejor lectura en pantallas grandes */
    margin: 20px auto; /* Centra el componente y añade margen superior/inferior */
    padding: 15px;
    background: linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b);
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Sombra suave para un efecto elevado */
}

/* Estilo para el título de la sección */
.categoria-lista h2 {
    color: white; 
    font-weight: 700;
    font-size: 1.8rem;
    padding-bottom: 10px;
    border-bottom: 2px solid #e9ecef; /* Línea separadora */
    margin-bottom: 20px;
}

/* Estilo para la cabecera de las columnas (solo visible en pantallas medianas/grandes) */
.categoria-header {
    display: none; /* Ocultar por defecto en móvil */
    padding: 10px 20px;
    background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
    color: white;
    font-weight: bold;
    border-radius: 8px 8px 0 0; /* Bordes redondeados en la parte superior */
    margin-bottom: 5px;
    gap: 10px;
}

/* Diseño de la cabecera en pantallas más grandes */
@media (min-width: 768px) {
    .categoria-header {
        display: grid;
        /* Define la estructura de columnas */
        grid-template-columns: 2fr 3fr 1fr 1fr 1fr; /* Título, Descripción, Fecha, Porcentaje, Acciones (espacio implícito) */
        align-items: center;
    }
}

/* Contenedor de la lista de ítems (dentro de ion-list) */
.categoria-contenido ion-list {
    padding: 0;
    background: none; /* Quita el fondo de ion-list si lo tiene por defecto */
}



/* Contenedor de la información dentro de ion-item */






/* Contenedor de los botones */
.botones {
    display: flex;
    gap: 3px; /* Espacio entre los botones */
    margin-top: 15px; /* Espacio superior en vista móvil */
    justify-content: flex-end; /* Alinea los botones a la derecha en vista de tabla */
}

@media (min-width: 768px) {
    .botones {
        margin-top: 0; /* Quita el margen superior en vista de tabla */
        justify-content: center; /* Centra los botones en su celda */
    }
}


/* Estilo de los botones */
.botones ion-button {
    --border-radius: 20px; /* Botones más redondeados */
    font-size: 0.8rem;
    height: 35px;
    text-transform: capitalize;
}

/* Estilo para el botón de Eliminar */
.botones ion-button:nth-child(1) { /* Eliminar */
    --background: #dc3545; /* Rojo */
    --background-hover: red;
}

/* Estilo para el botón de Editar */
.botones ion-button:nth-child(2) { /* Editar */
    --background: #ffc107; /* Amarillo/Naranja */
    --background-hover: #e0a800;
    --color: #343a40; /* Color de texto oscuro para contraste */
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
  margin-bottom: 15px;
  border-radius: 25px;

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


.categoria-item {
  background: linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b);
  padding: 1.2rem;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  margin-top: 20px;
}

.categoria-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 28px rgba(102, 126, 234, 0.4);
}


.cat-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.8rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}

.cat-info h3 {
  color: #ffffff;
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cat-info h3 {
    font-size: 1.1rem;
  }

.categoria-icon {
  font-size: 1.8rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  flex-shrink: 0;
  margin-left: 0.5rem;
}


.categoria-icon {
    font-size: 1.5rem;
  }



  .categoria-info {
  display: grid;
  gap: 0.8rem;
}


.info-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 0.6rem 0.8rem;
  border-radius: 12px;
  transition: background 0.2s ease;
}

.info-item:hover {
  background: rgba(255, 255, 255, 0.25);
}

.info-item .icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.info-item .label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-weight: 500;
}

.info-item .value {
  font-size: 0.95rem;
  color: #ffffff;
  margin: 0;
  font-weight: 700;
}



.boton-elim {
  --background: linear-gradient(90deg, #c73154, #ff7a5f);
  --color: white;
  font-weight: 70;
  border-radius: 20px;
}

.boton-edit {
  --background: linear-gradient(90deg, #13c2ad, #32af19);
  --color: white;
  font-weight: 70;
  border-radius: 20px;
}

.acciones {
  display: flex;
  margin-top: 15px;
  justify-content: center;
  gap: 6px;
}



</style>
