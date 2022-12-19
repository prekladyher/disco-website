<script setup lang="ts">
import { IconClose, IconDown, IconSearch, IconUp } from "@/components/icons";
import { useConversationStore } from "@/stores/conversation";
import type { DialogueEntryType } from "@/types";
import { debounce } from "@/utils";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import ActionIcon from "../shared/ActionIcon.vue";
import ToggleIcon from "../shared/ToggleIcon.vue";

const SEARCH_FIELDS = [
  "Articy Id",
  "Dialogue Text",
  "Alternate1", "Alternate2", "Alternate3", "Alternate4",
  "tooltip1", "tooltip2", "tooltip3", "tooltip4", "tooltip5",
  "tooltip6", "tooltip7", "tooltip8", "tooltip9", "tooltip10"
];

const conversationStore = useConversationStore();
const { conversation } = storeToRefs(conversationStore);

const searchActive = ref(false);
watch(searchActive, () => {
  searchText.value = "";
});

const searchInput = ref<HTMLElement>();
const searchText = ref("");
// Autofocus input on activation
watch(searchInput, input => {
  if (input) {
    input.focus();
  }
});
// Reset on conversation change
watch(conversation, () => {
  searchText.value = "";
});

const searchResult = ref<number[]>([]);
const resultPosition = ref(-1);
function performSearch() {
  resultPosition.value = -1;
  if (!conversation.value || !searchText.value || searchText.value.trim().length < 3) {
    searchResult.value = [];
    return;
  }
  searchResult.value = Array.from(conversation.value.entriesById.values())
    .filter(entry => entryMatches(entry, searchText.value.toLocaleLowerCase()))
    .map(entry => entry.id);
  if (searchResult.value.length) {
    resultPosition.value = 0;
  }
}

watch([resultPosition, searchResult], ([position]) => {
  if (!conversation.value || position < 0) {
    return;
  }
  const entryId = searchResult.value[position];
  conversationStore.updateCurrentEntry(conversation.value.entriesById.get(entryId));
});

function entryMatches(entry: DialogueEntryType, text: string): boolean {
  return Object.entries(entry.fields).some(([key, value]) => {
    return SEARCH_FIELDS.indexOf(key) > -1 && value.toLowerCase().indexOf(text) > -1;
  });
}

function nextMatch() {
  if (!searchResult.value.length) {
    return;
  }
  resultPosition.value = (resultPosition.value + 1) % searchResult.value.length;
}

function prevMatch() {
  if (!searchResult.value.length) {
    return;
  }
  resultPosition.value = (resultPosition.value + searchResult.value.length - 1) % searchResult.value.length;
}

const { handler: handleSearch, pending: searchDebounce } = debounce(performSearch, 500);
watch(searchText, handleSearch);
</script>

<template>
  <div class="search-wrapper" :class="{ active: searchActive }">
    <ToggleIcon v-model="searchActive" title="toggle search">

      <IconSearch v-if="!searchActive" />
      <IconClose v-if="searchActive" />
    </ToggleIcon>
    <Transition>
      <div class="search-form" v-if="searchActive">
        <input
          ref="searchInput"
          v-model="searchText"
          placeholder="enter search text"
          @keypress.enter.exact="nextMatch"
          @keypress.enter.shift="prevMatch"
          @keydown.esc="searchActive = false"
        >
        <ActionIcon
          :disabled="!searchResult.length"
          @click="prevMatch()"
          title="previous result"
        >
          <IconUp />
        </ActionIcon>
        <ActionIcon
          :disabled="!searchResult.length"
          @click="nextMatch()"
          title="next result"
        >
          <IconDown />
        </ActionIcon>
        <div class="search-result">
          <template v-if="searchDebounce">
            ? / ?
          </template>
          <template v-if="!searchDebounce">
            {{ resultPosition + 1 }} / {{ searchResult.length }}
          </template>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.search-wrapper {
  position: absolute;
  display: flex;
  top: 12px;
  left: 12px;
  gap: 5px;
  align-items: stretch;
  border: 2px solid var(--color-border);
  border-radius: 18px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 2px;
  background: var(--color-background-soft);
}
.search-wrapper.active {
  border-radius: 32px 0 0 32px;
}

.search-form {
  display: flex;
  transition: all 200ms ease;
  transition-property: max-width;
  overflow: hidden;
}

.search-form.v-enter-active,
.search-form.v-leave-active {
  max-width: calc(200px + 64px + 50px);
}

.search-form.v-enter-from,
.search-form.v-leave-to {
  max-width: 0;
}

.search-form input {
  width: 200px;
  border: 0;
  padding: 0 5px;
  outline: none;
  background: var(--color-background-soft);
}

.search-result {
  align-self: center;
  padding: 0 10px 0 5px;
  font-size: 12px;
  color: #888888;
  text-align: right;
  min-width: 50px;
  white-space: nowrap;
}
</style>
