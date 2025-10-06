<script setup lang="ts">
defineProps<{
  label: string
  modelValue: string | number | Date
  type: 'text' | 'number' | 'date'
  required?: boolean
}>()

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="input-group">
    <label>{{ label }}</label>
    <input
      :type="type"
      :value="modelValue"
      :required="required"
      @input="emit('update:modelValue', $event.target && ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<style scoped>
.input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
}

label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-size: 1rem;
}

input {
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: border 0.3s ease;
}

input:focus {
  border-color: #3f51b5;
  outline: none;
}

</style>