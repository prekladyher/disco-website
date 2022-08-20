<script setup lang="ts">
import { IconHome } from "@/components/icons";
import { useConversationStore } from "@/stores/conversation";
import { storeToRefs } from "pinia";

const { conversation, debug, loading } = storeToRefs(useConversationStore());
</script>

<template>
  <header>
    <nav>
      <router-link to="/"><IconHome class="icon" /></router-link>
      <div v-if="conversation && !loading" class="title">
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
  box-shadow: rgba(0, 0, 0, 0.4) 0px 1px 2px;
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
