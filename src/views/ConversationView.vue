<script setup lang="ts">
import DialogueDebug from "@/components/DialogueDebug.vue";
import DialogueMinimap from "@/components/DialogueMinimap.vue";
import DialogueSearch from "@/components/DialogueSearch.vue";
import DialogueFlow from "@/components/flow/DialogueFlow.vue";
import DialogueGraph from "@/components/graph/DialogueGraph.vue";
import { findStartEntry, useConversationStore } from "@/stores/conversation";
import { useDatabaseStore } from "@/stores/database";
import { storeToRefs } from "pinia";
import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const conversationStore = useConversationStore();
const { conversation, currentEntry } = storeToRefs(conversationStore);

function syncCurrentEntry() {
  const entryId = route.query.entryId;
  if (typeof entryId !== "string" || !/^[0-9]+$/.test(entryId)) {
    return; // missing or invalid entryId parameter
  }
  if (currentEntry.value && currentEntry.value.id === +entryId) {
    return; // entry already synced
  }
  currentEntry.value = conversation.value?.entriesById.get(+entryId);
}

watch(() => [route.params.id, route.query.entryId], async ([id, entryId]) => {
  await useDatabaseStore().loading;
  if (!id) {
    await conversationStore.loadConversation(null);
  } else if (conversationStore.conversation?.id !== +id) {
    await conversationStore.loadConversation(+id);
  }
  if (conversation.value && typeof entryId !== "string") {
    router.replace({ ...route, query: { entryId: findStartEntry(conversation.value).id }})
  } else {
    syncCurrentEntry();
  }
}, { immediate: true });

watch(currentEntry, entry => {
  const entryId = route.query.entryId;
  if (entry && entryId !== "" + entry.id) {
    router.push({ ...route, query: { entryId: entry.id }});
  }
});
</script>

<template>
  <main>
    <DialogueGraph :conversation="conversation" />
    <section class="dialogue-pane">
      <DialogueFlow />
    </section>
    <DialogueMinimap />
    <DialogueSearch />
  </main>
  <DialogueDebug />
</template>

<style scoped>
main {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto;
  overflow-y: scroll;
}
.dialogue-pane {
  color: #eeeeee;
  background: #333333;
  box-shadow: rgba(0, 0, 0, 0.4) 0px -1px 2px;
  min-height: 300px;
  height: max-content;
}
.dialogue-pane::before {
  position: absolute;
  display: block;
  content: "";
  width: 100%;
  height: 100%;
  background: url("/logo.png") center center no-repeat;
  filter: grayscale() opacity(0.1);
}
</style>
