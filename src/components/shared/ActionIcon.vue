<script setup lang="ts">
defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <button
    type="button"
    class="action-icon"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<style scoped>
.action-icon {
  display: flex;
  height: 32px;
  width: 32px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: 0;
  border-radius: 50%;
  padding: 0;
}

button.action-icon {
  background: none;
  border: none;
  color: var(--color-link);
}

button.action-icon:hover:not([disabled]) {
  background: none;
  border: none;
  color: var(--color-link-hover);
}

button.action-icon[disabled] {
  color: #888888;
}
</style>
