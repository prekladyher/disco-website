<script setup lang="ts">
import { useConversationStore } from "@/stores/conversation";
import { storeToRefs } from "pinia";
import IconHome from "./IconHome.vue";

const { conversation, loading } = storeToRefs(useConversationStore());
</script>

<template>
  <header>
    <nav>
      <router-link to="/"><IconHome class="icon" /></router-link>
      <div v-if="conversation" class="title">
        {{ conversation.fields.Title }}
      </div>
      <div v-if="loading" class="loading">
        LOADING...
      </div>
    </nav>
  </header>
</template>

<style scoped>
nav {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  background: var(--vt-c-black-soft);
  color: var(--vt-c-white);
  height: 100%;
}

nav > * {
  margin-left: 1em;
  display: block;
}

.loading {
  color: #888888;
}

svg.icon {
  display: block;
}
</style>
