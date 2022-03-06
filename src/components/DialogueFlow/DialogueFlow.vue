<script setup lang="ts">
import { useConversationStore } from "@/stores/conversation";
import { useDialogueGraphStore } from "@/stores/dialogueGraph";
import type { DialogueEntryType } from "@/types";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import DialogueFlowEntry from "../DialogueFlowEntry.vue";
import DialogueFlowPath from "../DialogueFlowPath.vue";
import IconNext from "../IconNext.vue";
import type { DialoguePathType, DialogueStepType } from "./types";
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

const route = useRoute();
function createLink(step: DialogueStepType) {
  return {
    name: "conversation",
    params: {
      id: step.link.conversationId
    },
    query: {
      entryId: step.link.entryId
    }
  }
}

watch(target, updateFlow, { deep: true });
</script>

<template>
  <section class="dialogue-flow">
    <DialogueFlowEntry v-if="entry" :entry="entry" />
    <div v-for="path in paths" class="flow-path">
      <router-link :to="createLink(path.destination)" class="flow-next"><IconNext /></router-link>
      <DialogueFlowPath :path="path" />
    </div>
  </section>
</template>

<style scoped>
.dialogue-flow {
  padding: 10px;
}
.flow-path {
  display: flex;
  margin-top: 5px;
  gap: 5px;
}
.flow-next {
  background: #4978aa;
  display: flex;
  align-items: center;
  padding: 0 10px;
  border-radius: 5px;
}
.flow-next:hover {
  background: #6892be;
}
</style>
