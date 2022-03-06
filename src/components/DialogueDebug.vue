<script setup lang="ts">
import { useConversationStore } from "@/stores/conversation";
import { useDialogueGraphStore } from "@/stores/dialogueGraph";
import type { DialogueEntryType } from "@/types";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";

const conversationStore = useConversationStore();
const { debug, target } = storeToRefs(useDialogueGraphStore());

const debugText = ref("");

function renderText(entryIds: string[]): string {
  const conversation = conversationStore.conversation;
  if (!conversation) {
    return "";
  }
  const entries = entryIds
    .map(id => conversation.entriesById.get(+id))
    .filter(entry => !!entry) as DialogueEntryType[];
  return entries
    .map(it => JSON.stringify(it, null, "  "))
    .join("\n");
}

function updateText() {
  const { node, edge } = target.value;
  if (node) {
    debugText.value = renderText([node]);
  } else if (edge) {
    debugText.value = renderText(edge.split("_").slice(1, -1));
  } else {
    debugText.value = "";
  }
}

watch(target, () => {
  if (debug.value) {
    updateText();
  }
}, { deep: true });
watch(debug, (debug) => {
  if (debug) {
    updateText();
  } else {
    debugText.value = "";
  }
}, { immediate: true });
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
  background: rgba(255, 255, 255, 0.9);
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
