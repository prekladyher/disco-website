<script setup>
import DialogueGraph from "../components/DialogueGraph.vue";
import { useRoute } from "vue-router";
import { fetchConversation } from "../composables/fetchConversation";

const route = useRoute();
const { data: conversation } = fetchConversation(route.params.id);
</script>

<template>
  <main>
    <DialogueGraph v-if="conversation" :conversation="conversation" />
  </main>
</template>

<style>
</style>
