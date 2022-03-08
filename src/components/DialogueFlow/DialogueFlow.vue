<script setup lang="ts">
import { useConversationStore } from "@/stores/conversation";
import type { DialogueEntryType } from "@/types";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import DialogueFlowEntry from "../DialogueFlowEntry.vue";
import DialogueFlowPath from "../DialogueFlowPath.vue";
import IconNext from "../IconNext.vue";
import type { DialoguePathType, DialogueStepType } from "./types";
import { resolvePaths } from "./utils";

const { conversation, currentEntry } = storeToRefs(useConversationStore());

const entry = ref<DialogueEntryType>();
const paths = ref<DialoguePathType[]>([]);

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

watch(currentEntry, () => {
  entry.value = currentEntry.value;
  if (conversation.value && entry.value) {
    paths.value = resolvePaths(conversation.value, entry.value.id);
  } else {
    paths.value = [];
  }
});
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
