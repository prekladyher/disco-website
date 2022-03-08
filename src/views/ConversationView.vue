<script setup lang="ts">
import { useConversationStore, findStartEntry } from "@/stores/conversation";
import { useDatabaseStore } from "@/stores/database";
import { storeToRefs } from "pinia";
import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import DialogueDebug from "../components/DialogueDebug.vue";
import DialogueGraph from "../components/DialogueGraph";
import DialoguePane from "../components/DialoguePane.vue";

const router = useRouter();
const route = useRoute();

const conversationStore = useConversationStore();
const { conversation } = storeToRefs(conversationStore);

watch(() => route.params.id, async id => {
  await useDatabaseStore().loading;
  await conversationStore.loadConversation(id ? +id : null);
  if (conversation.value && typeof route.query.entryId !== "string") {
    router.replace({ ...route, query: { entryId: findStartEntry(conversation.value).id }})
  }
}, { immediate: true });
</script>

<template>
  <main>
    <DialogueGraph :conversation="conversation" />
    <DialoguePane />
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
</style>
