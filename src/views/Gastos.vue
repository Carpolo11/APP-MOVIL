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
              />
            </ion-item>


                     <ion-item class="input-group">
                       <ion-icon name="list-outline" slot="start"></ion-icon>
                         <ion-select
                            v-model="cate" placeholder="Selecciona una categoría" :selected-text="cate"  >
                             <ion-select-option v-for="categoria in categorias" :key="categoria.titulo" :value="categoria.titulo" >
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

                  <div class="categoria-lista ion-margin-top">
            <h2>💸 Mis Gastos</h2>
              <!-- Cabecera de columnas -->
            <div class="categoria-header">
                  <span>Título</span>
                  <span>Monto</span>
                  <span>Descripción</span>
                  <span>Categorias Asignadas</span>
                  

           </div>

            <div class="categoria-contenido">
            <ion-list>
              <ion-item v-for="gast in gastos" :key="gast.id" class="categoria-item">
                <div class="categoria-info">
                  <h3>{{ gast.titulo }}</h3>
                  <p>{{ gast.monto }}</p>
                  <p>{{ gast.descripcion }}</p>
                  <p>{{ gast.categoria }}</p>
                  
                  <div class="botones">
                      <ion-button class="ion-bottom"> Eliminar </ion-button>
                      <ion-button class="ion-bottom"> Editar </ion-button>
                  </div>
                  </div>
              </ion-item>
            </ion-list>
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
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useRouter } from "vue-router";
import { onSnapshot } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();

const router = useRouter();

const titulo = ref("");
const monto = ref<number>();
const descripcion = ref("");
const categorias = ref<any[]>([]);
const cate = ref("");
const entradas = ref<number>(0);
const gastos = ref<any[]>([]);

//Trae las categorias
const cargarCategorias = async () => {
  try {

    const user = auth.currentUser;
    const q = query(collection(db,"categorias"), where("userId", "==", user?.uid));
    const snapshot = await getDocs(q);
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

  const user = auth.currentUser;

  if(user){

    const q = query(collection(db, "entradas"), where("userId", "==", user.uid));
  onSnapshot(q, (snapshot) => {
    let totalEntradas = 0;
    snapshot.forEach((doc) => {
      totalEntradas += Number(doc.data().monto) || 0;
    });
    entradas.value = totalEntradas;
    console.log("Entradas actualizadas en tiempo real:", entradas.value);
  });

  };

  };
  

  
//Trae los Gastos
const TrearGastos = async () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const q = query(collection(db, "gastos"), where("UserId", "==", user.uid));
      onSnapshot(q, (snapshot) => {
        const nuevosGastos: any[] = [];
        snapshot.forEach((doc) => {
          nuevosGastos.push({ id: doc.id, ...doc.data() });
        });

        gastos.value = nuevosGastos;
        console.log("✅ Gastos actualizados en tiempo real:", gastos.value);
      });
    } else {
      console.log("❌ No hay usuario autenticado.");
    }
  });
  
};

    onMounted(() => {
     cargarCategorias();
     traerEntradas(); 
     TrearGastos();
  });


const crearGas = async () => {
  if (!titulo.value || !monto.value || !cate.value) {
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

    const user = auth.currentUser;

    if(user){
    await addDoc(collection(db, "gastos"), {
      titulo: titulo.value,
      monto: Number(monto.value),
      descripcion: descripcion.value,
      categoria: cate.value,
      fechaRegistro: new Date(),
      UserId: user.uid
    });

    };

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
  margin-bottom: 15px;
  border-radius: 25px;
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

/* Estilo base para cada ítem de la categoría (tarjeta) */
.categoria-item {
    --padding-start: 0;
    --inner-padding-end: 0;
    --min-height: auto;
    margin: 10px 0;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08); /* Sombra suave para la tarjeta */
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    background-color: white;
    border-left: 5px solid ; /* Barra de color a la izquierda para destacar */
}

/* Efecto hover en el ítem */
.categoria-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

/* Contenedor de la información dentro de ion-item */
.categoria-info {
    display: block; /* Vuelve a ser un bloque para el diseño móvil */
    width: 100%;
    padding: 15px 20px;
}

/* Diseño de cada ítem en pantallas más grandes (fila tipo tabla) */
@media (min-width: 768px) {
    .categoria-info {
        display: grid;
        grid-template-columns: 2fr 3fr 1fr 1fr auto;
        gap: 10px;
        align-items: center;
        padding: 10px 20px; /* Menos padding vertical para parecerse más a una fila */
    }

    /* Oculta los labels redundantes en la vista de tabla */
    .categoria-info p:not(.botones p) {
        display: flex;
        align-items: center; /* Alineación vertical para el contenido de las celdas */
    }

    .categoria-info h3,
    .categoria-info p {
        margin: 0; /* Quita los márgenes por defecto en la vista de tabla */
    }

    /* Esconde los labels de Fecha y Porcentaje en la vista de tabla */
    .categoria-info p:nth-of-type(3):before, /* Fecha */
    .categoria-info p:nth-of-type(4):before { /* Porcentaje */
        content: none;
    }
}


/* Estilo para el título del ítem */
.categoria-info h3 {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 5px;
}

/* Estilo para la descripción y otros párrafos (móvil) */
.categoria-info p {
    font-size: 0.9rem;
    margin-bottom: 5px;
}

/* Etiquetado para móvil: añade los nombres de las columnas antes del contenido */
@media (max-width: 767px) {
    /* Título */
    .categoria-info h3:before {
        content: 'Título: ';
        font-weight: bold;
    }
    /* Descripción */
    .categoria-info p:nth-of-type(1):before {
        content: 'Descripción: ';
        font-weight: bold;
    }
    /* Fecha */
    .categoria-info p:nth-of-type(2):before {
        content: 'Fecha: ';
        font-weight: bold;
    }
    /* Porcentaje */
    .categoria-info p:nth-of-type(3):before {
        content: 'Porcentaje: ';
        font-weight: bold;
    }
}



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
</style>
