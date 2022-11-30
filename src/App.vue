<script setup lang="ts">
import HeaderPanel from "@/components/header/HeaderPanel.vue";
import { useDropZone } from "@vueuse/core";
import { ref } from "vue";
import { useLanguageStore } from "./stores/language";

const languageStore = useLanguageStore();

const dropZoneRef = ref<HTMLDivElement>()
const { isOverDropZone } = useDropZone(dropZoneRef, files => {
  languageStore.clear();
  languageStore.loadFiles(files || []);
});
</script>

<template>
  <div 
    id="app-root"
    ref="dropZoneRef"
    :class="{ dropzone: isOverDropZone }"
  >
    <HeaderPanel />
    <router-view />
  </div>
</template>

<style>
@import "@fontsource/inter";
@import "@/assets/base.css";
@import "v-network-graph/lib/style.css";

#app-root {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 3rem auto;
  height: 100vh;
}

.dropzone::after {
  display: block;
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 3px solid #cc0000;
  background: rgba(128, 128, 128, 0.5);
}

.v-network-graph {
  opacity: 0;
}

.v-network-graph.loaded {
  opacity: 1;
  transition: opacity 0.3s;
}
</style>
