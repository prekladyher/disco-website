<script setup lang="ts">
import ActionIcon from "./ActionIcon.vue";

defineProps<{
  modelValue: boolean
}>();

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>

<template>
  <ActionIcon @click="$emit('update:modelValue', !modelValue)">
    <slot></slot>
  </ActionIcon>
</template>
