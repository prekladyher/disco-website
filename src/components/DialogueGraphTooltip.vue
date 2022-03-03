<script setup lang="ts">
import type { DialogueEntryType } from "@/types";
import { ref, watch } from "vue";

const props = defineProps<{
  entries: DialogueEntryType[]
}>();

const text = ref("");

watch(() => props.entries, entries => {
  if (!entries.length) {
    text.value = "";
  } else {
    const filtered = entries.map(it => ({ ...it, outgoingLinks: undefined }));
    text.value = JSON.stringify(filtered, null, "  ");
  }
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
