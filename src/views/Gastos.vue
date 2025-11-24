<template>
  <ion-page>
    <ion-content class="ion-padding creatCat-bg">
      <ion-title class="app-title">
        💸➕ CREA UN NUEVO GASTO
      </ion-title>

      <div class="card">
        <div class="create-cat-container">
          
          <!-- 📝 Componente del Formulario -->
          <GastosForm 
            :categorias="categorias"
            :gasto-editando="gastoEditando"
            @crear-gasto="crearGas"
          />

          <!-- 📋 Lista de Gastos -->
          <GastosCard
            v-for="gast in gastos"
            :key="gast.id"
            :gasto="gast"
            @editar="editarGasto"
            @eliminar="eliminarGasto"
          />

        </div>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
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
import GastosForm from "@/components/gastos/GastosForm.vue";
import GastosCard from "@/components/gastos/GastosCard.vue";

const auth = getAuth();
const router = useRouter();

const categorias = ref<any[]>([]);
const gastos = ref<any[]>([]);
const gastoEditando = ref<any>(null);

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

//==============================
// CREAR O EDITAR GASTO
//==============================
const crearGas = async (gasto: any) => {
  const user = auth.currentUser;
  if (!user) return;

  // Modo EDITAR
  if (gasto.editando && gasto.id) {
    const refDoc = doc(db, "gastos", gasto.id);

    await updateDoc(refDoc, {
      titulo: gasto.titulo,
      monto: gasto.monto,
      descripcion: gasto.descripcion,
      categoria: gasto.categoria,
    });

    alert("Gasto actualizado correctamente");
    gastoEditando.value = null;
    return;
  }

  // Modo CREAR
  await addDoc(collection(db, "gastos"), {
    titulo: gasto.titulo,
    monto: gasto.monto,
    descripcion: gasto.descripcion,
    categoria: gasto.categoria,
    fechaRegistro: new Date(),
    UserId: user.uid,
  });

  alert("Gasto creado correctamente");
  gastoEditando.value = null;
};

//==============================
// CARGAR DATOS PARA EDITAR
//==============================
const editarGasto = (gasto: any) => {
  gastoEditando.value = gasto;
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
onMounted(() => {
  cargarCategorias();
  TrearGastos();
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