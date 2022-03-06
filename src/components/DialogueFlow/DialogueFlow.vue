<script setup lang="ts">
import { useConversationStore } from "@/stores/conversation";
import { useDialogueGraphStore } from "@/stores/dialogueGraph";
import type { DialogueEntryType } from "@/types";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import DialogueFlowEntry from "../DialogueFlowEntry.vue";
import DialogueFlowPath from "../DialogueFlowPath.vue";
import type { DialoguePathType } from "./types";
import { resolvePaths } from "./utils";

const { conversation } = storeToRefs(useConversationStore());
const { target } = storeToRefs(useDialogueGraphStore());

const entry = ref<DialogueEntryType>();
const paths = ref<DialoguePathType[]>([]);

function updateFlow() {
  const { node, edge } = target.value;
  if (!node && !edge || !conversation.value) {
    entry.value = undefined;
    paths.value = [];
  } else {
    if (node) {
      entry.value = conversation.value?.entriesById.get(+node);
    } else if (edge) {
      entry.value = conversation.value?.entriesById.get(+edge.split("_")[1]);
    }
    if (entry.value) {
      paths.value = resolvePaths(conversation.value, entry.value.id);
    }
  }
}

watch(target, updateFlow, { deep: true });
</script>

<template>
  <section class="dialogue-flow">
    <DialogueFlowEntry v-if="entry" :entry="entry" />
    <div v-for="path in paths">
      <DialogueFlowPath :path="path" />
    </div>
  </section>
</template>

<style scoped>
.dialogue-flow {
  padding: 10px;
}
</style>
