<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  value: string
}>();

const condition = computed(() => {
  if (!props.value) {
    return "";
  }
  return props.value.replace(/Variable\["([^"]+)"\]/g, "$1");
});
</script>

<template>
  <code>
    {{ condition }}
  </code>
</template>
