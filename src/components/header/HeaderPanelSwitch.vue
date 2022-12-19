<script setup lang="ts">
import ActionIcon from "../shared/ActionIcon.vue";

</script>

<template>
  <ActionIcon
    class="switch"
    role="switch"
    title="toggle debug"
  >
    <slot></slot>
  </ActionIcon>
</template>

<style scoped>
.switch::before {
  position: absolute;
  display: block;
  content: "";
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-background-soft);
  border-radius: 50%;
}

.switch.active::before {
  filter: invert(0.1);
}

.switch.active > :first-child {
  filter: invert();
}
</style>