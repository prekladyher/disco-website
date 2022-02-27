<script setup lang="ts">
import DialogueGraph from "../components/DialogueGraph.vue";
import { useRoute } from "vue-router";
import { fetchConversation, type ConversationModel } from "../composables/fetchConversation";
import { ref, watch } from "vue";

const route = useRoute();

const model = ref<ConversationModel|null>(null);

watch(() => route.params.id, id => {
  if (id) {
    fetchConversation(parseInt(id as string, 10))
        .then(result => model.value = result);
  }
}, { immediate: true });
</script>

<template>
  <main>
    <DialogueGraph v-if="model" :conversation="model" />
  </main>
</template>

<style>
</style>
