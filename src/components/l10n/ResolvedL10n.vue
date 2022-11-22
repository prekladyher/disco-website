<script setup lang="ts">
const props = defineProps<{
  source?: string,
  target?: string
}>();
</script>

<template>
  <div>
    <div>{{source}}</div>
    <div>{{target}}</div>
  </div>
</template>
