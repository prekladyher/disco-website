<script setup lang="ts">
import { useConversationStore } from "@/stores/conversation";
import type { DialogueEntryType } from "@/types";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import IconClose from "../IconClose.vue";
import IconDown from "../IconDown.vue";
import IconSearch from "../IconSearch.vue";
import IconUp from "../IconUp.vue";

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
function toggleSearch() {
  searchActive.value = !searchActive.value;
}

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

const searchDebounce = ref(false);
let debounceId = 0;
watch(searchText, () => {
  if (debounceId) {
    clearTimeout(0);
  }
  searchDebounce.value = true;
  setTimeout(() => {
    searchDebounce.value = false;
    performSearch();
  }, 500);
});
</script>

<template>
  <div class="search-wrapper" :class="{ active: searchActive }">
    <a class="search-icon" @click="toggleSearch()">
      <IconSearch v-if="!searchActive" />
      <IconClose v-if="searchActive" />
    </a>
    <div class="search-form" v-if="searchActive">
      <input
        ref="searchInput"
        v-model="searchText"
        placeholder="enter search text"
        @keyup.enter.exact="nextMatch"
        @keyup.enter.shift="prevMatch"
      >
    </div>
    <div class="search-form" v-if="searchActive">
      <button class="search-icon" :disabled="!searchResult.length" @click="prevMatch()">
        <IconUp />
      </button>
      <button class="search-icon" :disabled="!searchResult.length" @click="nextMatch()">
        <IconDown />
      </button>
    </div>
    <div class="search-result" v-if="searchActive">
      <template v-if="searchDebounce">
        ? / ?
      </template>
      <template v-if="!searchDebounce">
        {{ resultPosition + 1 }} / {{ searchResult.length }}
      </template>
    </div>
  </div>
</template>

<style scoped>
.search-wrapper {
  position: absolute;
  display: flex;
  top: 60px;
  left: 12px;
  gap: 5px;
  align-items: stretch;
  border: 2px solid #cccccc;
  border-radius: 32px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 2px;
  background: white;
}
.search-wrapper.active {
  border-radius: 32px 0 0 32px;
}

.search-icon {
  display: flex;
  height: 32px;
  width: 32px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

button.search-icon {
  background: none;
  border: none;
  color: #4978aa;
}

button.search-icon:hover:not([disabled]) {
  background: none;
  border: none;
  color: #6892be;
}

button.search-icon[disabled] {
  color: #888888;
}

.search-form {
  display: flex;
}

.search-form input {
  border: 0;
  padding: 0 5px;
}

.search-result {
  align-self: center;
  padding: 0 10px 0 5px;
  font-size: 12px;
  color: #888888;
  text-align: right;
  min-width: 50px;
}
</style>