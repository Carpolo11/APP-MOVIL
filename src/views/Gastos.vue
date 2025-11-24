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
                {{ editando ? 'ACTUALIZAR GASTO' : 'CREAR GASTO' }}
              </ion-button>
            </div>


            <div class="button-row">
              <ion-button expand="block" router-link="/dashboard" class="back-btn">
                VOLVER
              </ion-button>
            </div>

          </form>

      <div v-for="gast in gastos" :key="gast.id" class="gasto-card">
        
          <div class="categoria-info">
            <h3>{{ gast.titulo || 'Gasto sin descripción' }}</h3>
            <span class="gasto-icon">💸</span>
          </div>
          
          <div class="gasto-info">
            <div class="info-item">
              <span class="icon">💵</span>
              <div>
                <p class="label">Monto</p>
                <p class="value">${{ (gast.monto) }}</p>
              </div>
            </div>
            
            <div class="info-item">
              <span class="icon">📖</span>
              <div>
                <p class="label">Descripción</p>
                <p class="value">{{ (gast.descripcion) }}</p>
              </div>
            </div>
             
            <div class="info-item">
              <span class="icon">📋</span>
              <div>
                <p class="label">Categoria</p>
                <p class="value">{{ (gast.categoria) }}</p>
              </div>
            </div>



          </div>
          <div class="acciones">
            <ion-button class="boton-edit" size="small" @click="editarGasto(gast)">
              Editar
            </ion-button>

            <ion-button class="boton-elim" size="small" @click="eliminarGasto(gast.id)">
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
  IonSelect,
  IonSelectOption,
} from "@ionic/vue";
import { ref, onMounted } from "vue";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  onSnapshot
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useRouter } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();
const router = useRouter();

const titulo = ref("");
const monto = ref<number>(0);
const descripcion = ref("");
const cate = ref("");
const categorias = ref<any[]>([]);
const gastos = ref<any[]>([]);
const sumaGastosTotal = ref<number>();
const entradas = ref<number>(0);

// Para EDITAR
const editando = ref(false);
const idEditando = ref<string | null>(null);

//==============================
// CARGAR CATEGORÍAS
//==============================
const cargarCategorias = async () => {

    const user = auth.currentUser;
    if(user){
    const q = query(collection(db,"categorias"), where("userId", "==", user?.uid));
    const snapshot = await getDocs(q);
    const lista: any[] = [];
    snapshot.forEach((doc) => {
      lista.push(doc.data());
    });
    categorias.value = lista;
    console.log("Categorías cargadas:", categorias.value);
    };
  }; 

//==============================
// CARGAR GASTOS EN TIEMPO REAL
//==============================
const TrearGastos = async () => {
  onAuthStateChanged(auth, (user) => {
    if (!user) return;

    const q = query(collection(db, "gastos"), where("UserId", "==", user.uid));

    onSnapshot(q, (snapshot) => {
      gastos.value = snapshot.docs.map((d) => ({id: d.id,...d.data(),}));
    });
  });
};

//Trae las entradas
const traerEntradas = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const q = query(collection(db, "entradas"), where("userId", "==", user.uid));

  onSnapshot(q, (snapshot) => {
    let total = 0;
    snapshot.forEach((doc) => {
      total += Number(doc.data().monto) || 0;
    });
    entradas.value = total;
  });
};


//Suma de gastos totales
const TraerSumaGastos = async () => {

  const user = auth.currentUser;

  if (user) { 
    const q = query(
      collection(db, "gastos"),
      where("userId", "==", user.uid)
    );

    onSnapshot(q, (snapshot) => {
      let SumaGasto = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        SumaGasto += Number(data.monto) || 0;
      });

      sumaGastosTotal.value = SumaGasto;
    });
  }

};


//==============================
// CREAR O EDITAR GASTO
//==============================
const crearGas = async () => {
  if (!titulo.value || !monto.value || !cate.value) {
    alert("Completa todos los campos");
    return;
  }

  const user = auth.currentUser;
  if (!user) return;

    if( Number(sumaGastosTotal.value) + Number(monto.value) > Number(entradas.value)){
    alert("No tienes fondos suficientes para crear este gasto");
    
    return;
  }

  // Modo EDITAR
  if (editando.value && idEditando.value) {

    const refDoc = doc(db, "gastos", idEditando.value);

    await updateDoc(refDoc, {
      titulo: titulo.value,
      monto: Number(monto.value),
      descripcion: descripcion.value,
      categoria: cate.value,
    });

    alert("Gasto actualizado correctamente");

    limpiarFormulario();
    return;
  }

  // Modo CREAR
  await addDoc(collection(db, "gastos"), {
    titulo: titulo.value,
    monto: Number(monto.value),
    descripcion: descripcion.value,
    categoria: cate.value,
    fechaRegistro: new Date(),
    UserId: user.uid,
  });

  alert("Gasto creado correctamente");
  limpiarFormulario();
};

//==============================
// CARGAR DATOS PARA EDITAR
//==============================
const editarGasto = (gasto: any) => {
  editando.value = true;
  idEditando.value = gasto.id;

  titulo.value = gasto.titulo;
  monto.value = gasto.monto;
  descripcion.value = gasto.descripcion;
  cate.value = gasto.categoria;
};

//==============================
// ELIMINAR GASTO
//==============================
const eliminarGasto = async (id: string) => {
  if (!confirm("¿Seguro que deseas eliminar este gasto?")) return;

  const refDoc = doc(db, "gastos", id);
  await deleteDoc(refDoc);

  alert("Gasto eliminado");
};

//==============================
// LIMPIAR FORMULARIO
//==============================
const limpiarFormulario = () => {
  editando.value = false;
  idEditando.value = null;
  titulo.value = "";
  monto.value = 0;
  descripcion.value = "";
  cate.value = "";
};

//==============================
onMounted(() => {
  cargarCategorias();
  TrearGastos();
  TraerSumaGastos();
  traerEntradas();
});
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
        
        font-weight: bold;
    }
    /* Descripción */
    .categoria-info p:nth-of-type(1):before {
        content: 'Monto $: ';
        font-weight: bold;
    }
    /* Fecha */
    .categoria-info p:nth-of-type(2):before {
        content: 'Descripcion: ';
        font-weight: bold;
    }

        .categoria-info p:nth-of-type(3):before {
        content: 'Categoria Asignada: ';
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

.gasto-card {
  background: linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b);
  padding: 1.2rem;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  margin-top: 20px;
}

.gasto-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 28px rgba(102, 126, 234, 0.4);
}

.categoria-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.8rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}

.categoria-info h3 {
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

.categoria-info h3 {
    font-size: 1.1rem;
  }

.gasto-info {
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


.gasto-icon {
  font-size: 1.8rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  flex-shrink: 0;
  margin-left: 0.5rem;
}


.gasto-icon {
    font-size: 1.5rem;
  }



</style>