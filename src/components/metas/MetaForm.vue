<template>
  <div class="meta-form-container">
    <h2>💡 Nueva Meta</h2>

    <form @submit.prevent="agregarMeta" class="meta-form">
      <div class="form-group">
        <label>Nombre</label>
        <input
          v-model="nombre"
          type="text"
          placeholder="Ej: Viaje a la playa 🌴"
          required
        />
      </div>

      <div class="form-group">
        <label>Monto Objetivo</label>
        <div class="input-wrap">
          <span>$</span>
          <input
            v-model.number="monto"
            type="number"
            min="1"
            step="0.01"
            placeholder="0.00"
            required
          />
        </div>
      </div>

      <div class="form-group">
        <label>Plazo</label>

        <!-- Contenedor para input fecha + icono -->
        <div class="date-wrap">
          <input
            ref="dateInput"
            v-model="plazo"
            type="date"
            :max="maxFechaStr"
            required
            @focus="openDatePicker"
            @keydown.enter.prevent="openDatePicker"
          />

          <!-- Icono calendario: abre el date picker al hacer click -->
          <button
            type="button"
            class="calendar-btn"
            @click="openDatePicker"
            aria-label="Abrir calendario"
          >
            <!-- SVG calendar -->
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 11H13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M7 15H13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
              <path d="M16 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <button type="submit" class="btn-guardar">Guardar Meta</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['nuevaMeta'])

const nombre = ref('')
const monto = ref<number | null>(null)
const plazo = ref('')

// referencia al input date
const dateInput = ref<HTMLInputElement | null>(null)

// Fecha máxima opcional (5 años a futuro)
const maxFecha = new Date()
maxFecha.setFullYear(maxFecha.getFullYear() + 5)
const maxFechaStr = maxFecha.toISOString().split('T')[0]

function openDatePicker() {
  const el = dateInput.value
  if (!el) return

  try {
   
    if (typeof (el as any).showPicker === 'function') {
      ;(el as any).showPicker()
      return
    }
  } catch (e) {
    // ignore
  }

 
  el.focus()
 
  try {
    el.click()
  } catch (e) {
    
  }
}

function agregarMeta() {
  if (!nombre.value || !monto.value || monto.value <= 0 || !plazo.value) return

  emit('nuevaMeta', {
    id: Date.now(),
    nombre: nombre.value,
    monto: monto.value,
    // guardamos en formato YYYY-MM-DD
    plazo: new Date(plazo.value).toISOString().split('T')[0],
    ahorroActual: 0
  })

  nombre.value = ''
  monto.value = null
  plazo.value = ''
}
</script>

<style scoped>
.meta-form-container {
  backdrop-filter: blur(10px);
  background: linear-gradient(180deg, rgba(255,255,255,0.75), rgba(250,250,255,0.75));
  border: 1px solid rgba(255,255,255,0.6);
  padding: 2rem;
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.12);
  color: #111827;
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
}
h2 {
  text-align: center;
  margin-bottom: 1.25rem;
  color: #4f46e5;
}
.form-group { margin-bottom: 1rem; }
label { font-weight: 700; color: #374151; display:block; margin-bottom:0.4rem; }

/* inputs generales */
input {
  width: 100%;
  padding: 0.9rem;
  border-radius: 12px;
  border: 1px solid rgba(203,213,225,0.7);
  background: rgba(255,255,255,0.95);
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.04);
  transition: all 0.18s ease;
  font-size: 0.95rem;
}
input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 6px 18px rgba(99,102,241,0.12);
}

/* input monto */
.input-wrap { display:flex; align-items:center; gap:0.5rem; }
.input-wrap span { color:#059669; font-weight:800; }

/* date wrapper: input + icon */
.date-wrap {
  position: relative;
}
.date-wrap input {
  padding-right: 3.5rem; /* espacio para el botón calendario */
}
.calendar-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg,#ff8aa0,#ff6bcb);
  color: white;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(255,107,203,0.18);
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}
.calendar-btn:hover { transform: translateY(-50%) scale(1.03); box-shadow: 0 10px 24px rgba(255,107,203,0.22); }
.calendar-btn svg { opacity: 0.95; }

/* botón guardar */
.btn-guardar {
  width: 100%;
  padding: 0.95rem;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: #fff;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 0.6rem;
  box-shadow: 0 8px 28px rgba(79,70,229,0.18);
}
.btn-guardar:hover { transform: translateY(-3px); box-shadow: 0 14px 36px rgba(79,70,229,0.22); }

/* responsive */
@media (max-width: 520px) {
  .meta-form-container { padding: 1.25rem; border-radius: 14px; }
  .date-wrap input { padding-right: 3rem; }
  .calendar-btn { right: 6px; width: 34px; height: 34px; }
}
</style>
