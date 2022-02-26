<script setup>
import DialogueGraph from "../components/DialogueGraph.vue";
import { useRoute } from "vue-router";
import { fetchConversation } from "../components/DatabaseComposable";

const route = useRoute();
const { data: conversation } = fetchConversation(route.params.id);
</script>

<template>
  <DialogueGraph v-if="conversation" :conversation="conversation" />
</template>

<style>
</style>
