<script setup lang="ts">
import type { CircleShapeStyle } from "v-network-graph";

const props = defineProps<{
  config: CircleShapeStyle
}>();
</script>

<template>
  <circle
    :r="config.radius"
    :fill="config.color"
    :stroke="config.strokeColor"
    :stroke-width="config.strokeWidth"
  />
</template>
