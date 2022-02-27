<script setup lang="ts">
import DialogueGraph from "../components/DialogueGraph.vue";
import { useRoute } from "vue-router";
import { watch } from "vue";
import { useConversation } from "@/stores/conversation";
import { storeToRefs } from "pinia";

const route = useRoute();

const conversationStore = useConversation();
const { conversation } = storeToRefs(conversationStore);

watch(() => route.params.id, (id) => {
  conversationStore.load(id ? parseInt(id as string, 10) : null);
}, { immediate: true });
</script>

<template>
  <main>
    <DialogueGraph v-if="conversation" :conversation="conversation" />
  </main>
</template>

<style>
</style>
