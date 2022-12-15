<script setup lang="ts">
defineProps<{
  show: boolean
}>();

defineEmits<{
  (e: "close"): void
}>();
</script>

<template>
  <Teleport to="#overlay">
    <Transition name="modal">
      <div class="backdrop" @click="$emit('close')" v-if="show">
          <div class="window" v-on:click.stop>
            <slot></slot>
          </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.backdrop {
  position: fixed;
  display: grid;
  justify-content: center;
  padding-block: 16px;
  align-items: center;
  overflow-y: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(2px) grayscale(1);
}

.window {
  width: 800px;
  max-width: calc(100vw - 32px);
  background: var(--color-background);
  border-radius: 8px;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.4s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .window,
.modal-leave-active .window {
  -webkit-transition: -webkit-transform 0.2s ease-in-out;
  -moz-transition: -moz-transform 0.2s ease-in-out;
  transition: transform 0.2s ease-in-out;
}

.modal-enter-from .window {
  transform: scale(0.9);
}
.modal-leave-to .window {
  transform: scale(1.1);
}
</style>
