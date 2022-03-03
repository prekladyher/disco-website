<script setup lang="ts">
import { useConversationStore } from "@/stores/conversation";
import { useDialogueGraphStore } from "@/stores/dialogueGraph";
import { storeToRefs } from "pinia";
import { watch } from "vue";
import IconHome from "./IconHome.vue";

const { conversation, loading } = storeToRefs(useConversationStore());
const { debug } = storeToRefs(useDialogueGraphStore());
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
      <div class="glue"></div>
      <div class="switch">
        <label>
          Debug
          <input type="checkbox" v-model="debug">
        </label>
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

nav > .glue {
  flex-grow: 1;
}

.loading {
  color: #888888;
}

.switch {
  margin: 1em;
}

.switch * {
  cursor: pointer;
}

svg.icon {
  display: block;
}
</style>
