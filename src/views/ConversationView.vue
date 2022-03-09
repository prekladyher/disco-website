<script setup lang="ts">
import { useConversationStore, findStartEntry } from "@/stores/conversation";
import { useDatabaseStore } from "@/stores/database";
import { storeToRefs } from "pinia";
import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import DialogueDebug from "../components/DialogueDebug.vue";
import DialogueGraph from "../components/DialogueGraph";
import DialogueFlow from "../components/DialogueFlow/DialogueFlow.vue";

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
    <section class="dialogue-pane">
      <DialogueFlow />
    </section>
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
