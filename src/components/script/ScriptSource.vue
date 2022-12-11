<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  value: string
}>();

const source = computed(() => {
  if (!props.value) {
    return "";
  }
  return props.value.replace(/--\[\[ Variable\[ \]\];?$/, "");
});
</script>

<template>
  <code>
    {{ source }}
  </code>
</template>
