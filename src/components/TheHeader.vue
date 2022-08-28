<script setup lang="ts">
import { IconHome } from '@/components/icons';
import { useConversationStore } from '@/stores/conversation';
import { useLanguageStore } from '@/stores/language';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const { conversation, debug, loading } = storeToRefs(useConversationStore());

const languageStore = useLanguageStore();

const activeDrop = ref(false);

async function onDrop(event: DragEvent) {
  activeDrop.value = false;
  languageStore.loadFiles(Array.from(event.dataTransfer?.files || []));
}
</script>

<template>
  <header
    :class="{ dropzone: activeDrop }"
    @dragover.prevent="activeDrop=true"
    @dragleave="activeDrop=false"
    @drop.prevent="onDrop"
  >
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
      <div class="switch">
        <label>
          L10n
          <input type="checkbox" v-model="languageStore.show">
        </label>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.dropzone::after {
  display: block;
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;;
  border: 3px solid #cc0000;
}

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
  user-select: none;
}

.switch * {
  cursor: pointer;
}

svg.icon {
  display: block;
}
</style>
