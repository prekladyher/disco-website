<script setup lang="ts">
import ModalWindow from "@/components/layout/ModalWindow.vue";
import { useLanguageStore } from "@/stores/language";
import { useLayoutStore } from "@/stores/layout";
import { storeToRefs } from "pinia";
import { computed } from "vue";

const layoutStore = useLayoutStore();

const { loadedFiles } = storeToRefs(useLanguageStore());

const files = computed(() => {
  return Object.values(loadedFiles.value).sort((a, b) => a.fullPath.localeCompare(b.fullPath));
});
</script>

<template>
  <ModalWindow :show="layoutStore.showFiles" @close="layoutStore.showFiles = false">
    <div class="list-frame">
      <h3>Loaded Files</h3>
      <ul>
        <li v-for="file in files">
          <span>
            {{ file.fullPath }}
          </span>
          <button click="" title="remove">
            🗙
          </button>
        </li>
      </ul>
    </div>
  </ModalWindow>
</template>

<style scoped>
h3 {
  padding: 8px 16px;
}
ul {
  font-size: 12px;
  list-style-type: none;
  padding: 8px;
  margin: 0;
}
ul > li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 8px;
}
ul > li + li {
  border-top: 1px solid var(--color-border);
}
ul > li:hover {
  background-color: var(--color-border);
}
button {
  padding: 0;
  border: 0;
  background: none;
  color: var(--color-link);
  cursor: pointer;
  line-height: 1;
}
button:hover {
  color: var(--color-link-hover);
}
</style>