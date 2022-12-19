<script setup lang="ts">
import DialogueFlowEntry from "@/components/flow/DialogueFlowEntry.vue";
import DialogueFlowPath from "@/components/flow/DialogueFlowPath.vue";
import { IconNext } from "@/components/icons";
import { useConversationStore } from "@/stores/conversation";
import type { DialogueEntryType } from "@/types";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import type { DialoguePathType, DialogueStepType } from "./types";
import { resolvePaths } from "./utils";

const conversationStore = useConversationStore();
const { conversation, currentEntry } = storeToRefs(conversationStore);

const entry = ref<DialogueEntryType>();
const paths = ref<DialoguePathType[]>([]);

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

watch(currentEntry, () => {
  entry.value = currentEntry.value;
  if (conversation.value && entry.value) {
    paths.value = resolvePaths(conversation.value, entry.value.id);
  } else {
    paths.value = [];
  }
}, { immediate: true });

const highlightPath = ref<DialoguePathType>();
watch(highlightPath, path => {
  if (!path) {
    conversationStore.updateActivePath([]);
  } else {
    const entries = [path.origin, ...path.steps.map(step => step.entry)] as DialogueEntryType[];
    if (path.destination.entry) {
      entries.push(path.destination.entry);
    }
    conversationStore.updateActivePath(entries);
  }
});
</script>

<template>
  <section class="dialogue-flow">
    <DialogueFlowEntry v-if="entry" :entry="entry" />
    <div v-for="(path, index) in paths" class="flow-path" :key="path.origin.id + '_' + index">
      <router-link
        :to="createLink(path.destination)"
        @mouseover="highlightPath = path"
        @mouseleave="highlightPath = undefined"
        @click="highlightPath = undefined"
        class="flow-next">
        <IconNext />
      </router-link>
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
  color: var(--color-background-soft);
  background: var(--color-link);
  display: flex;
  align-items: center;
  padding: 0 10px;
  border-radius: 5px;
}
.flow-next:hover {
  background: var(--color-link-hover);
}
</style>
