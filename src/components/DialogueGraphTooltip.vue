<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  node: {
    type: Object
  }
});

const text = ref("");

watch(() => props.node, node => {
  text.value = node ?
    JSON.stringify({ ...node, outgoingLinks: undefined }, null, "  ") :
    "";
});
</script>

<template>
  <div
    ref="tooltip"
    class="tooltip"
    v-if="text"
  >
    <pre>{{ text }}</pre>
  </div>
</template>

<style scoped>
.tooltip {
  position: absolute;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 5px;
  border: 1px solid black;
  pointer-events: none;
  top: 10px;
  right: 10px;
  max-width: 80vw;
}
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 10px;
  line-height: 1;
}
</style>
