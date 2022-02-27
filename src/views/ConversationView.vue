<script setup lang="ts">
import DialogueGraph from "../components/DialogueGraph.vue";
import { useRoute } from "vue-router";
import { fetchConversation } from "../composables/fetchConversation";

const route = useRoute();
const { data: conversation } = fetchConversation(parseInt(route.params.id as string, 10));
</script>

<template>
  <main>
    <DialogueGraph v-if="conversation" :conversation="conversation" />
  </main>
</template>

<style>
</style>
