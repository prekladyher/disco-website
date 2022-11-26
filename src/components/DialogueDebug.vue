<script setup lang="ts">
import { useConversationStore } from "@/stores/conversation";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";

const { debug, currentEntry } = storeToRefs(useConversationStore());

const debugText = ref("");

function updateText(){
  if (!currentEntry.value || !debug.value) {
    debugText.value = "";
  } else {
    debugText.value = JSON.stringify(currentEntry.value, null, "  ");
  }
}

watch(currentEntry, updateText);
watch(debug, updateText, { immediate: true });
</script>

<template>
  <div
    ref="tooltip"
    class="tooltip"
    v-if="debugText"
  >
    <pre>{{ debugText }}</pre>
  </div>
</template>

<style scoped>
.tooltip {
  position: absolute;
  color: var(--color-heading);
  background: var(--color-background-soft);
  border-radius: 5px;
  border: 1px solid black;
  top: 4rem;
  right: 2rem;
  max-width: 80vw;
  max-height: calc(100vh - 5rem);
  z-index: 1;
  overflow-y: scroll;
}
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 10px;
  line-height: 1;
}
</style>
