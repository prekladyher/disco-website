<script setup lang="ts">
import { ref } from "@vue/reactivity";

const { node } = defineProps({
  node: {
    type: Object
  }
});
</script>

<template>
  <div
    ref="tooltip"
    class="tooltip"
    v-if="node"
  >
    <pre>{{ JSON.stringify(node.fields, null, "  ") }}</pre>
  </div>
</template>

<style scoped>
.tooltip {
  position: absolute;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 5px;
  border: 1px solid black;
  pointer-events: none;
  font-size: 12px;
  top: 10px;
  right: 10px;
  max-width: 80vw;
}
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
