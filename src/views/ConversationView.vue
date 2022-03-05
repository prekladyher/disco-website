<script setup lang="ts">
import DialogueGraph from "../components/DialogueGraph";
import { useRoute } from "vue-router";
import { watch } from "vue";
import { useConversationStore } from "@/stores/conversation";
import { storeToRefs } from "pinia";

const route = useRoute();

const conversationStore = useConversationStore();
const { conversation } = storeToRefs(conversationStore);

watch(() => route.params.id, (id) => {
  conversationStore.load(id ? parseInt(id as string, 10) : null);
}, { immediate: true });
</script>

<template>
  <main class="fixed">
    <DialogueGraph :conversation="conversation" />
  </main>
</template>

<style>
</style>
