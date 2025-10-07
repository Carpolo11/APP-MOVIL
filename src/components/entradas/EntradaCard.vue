<template>
  <div class="form-container">
    <slot></slot>
  </div>
</template>

<style scoped>
.form-container {
  max-width: 480px;
  margin: 40px auto;
  padding: 2rem;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
}
@media (max-width: 600px) {
  .form-container { margin: 20px; padding: 1.5rem; }
}
</style>
