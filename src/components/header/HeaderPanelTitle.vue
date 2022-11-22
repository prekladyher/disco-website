<script setup lang="ts">
import { useConversationStore } from "@/stores/conversation";
import { storeToRefs } from "pinia";

const { conversation, loading } = storeToRefs(useConversationStore());
</script>

<template>
  <div>
    <div v-if="conversation && !loading" class="title">
      {{ conversation.fields.Title }}
    </div>
    <div v-if="loading" class="loading">
      LOADING...
    </div>
  </div>
</template>

<style scoped>
.loading {
  color: #888888;
}
</style>
