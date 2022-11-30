<script setup lang="ts">
import { useLanguageStore } from "@/stores/language";
import { useIntervalFn } from "@vueuse/shared";
import { ref } from "vue";
import { IconSync } from "../icons";
import HeaderPanelSwitch from "./HeaderPanelSwitch.vue";

const languageStore = useLanguageStore();

const pending = ref(false);

const RELOAD_INTERVAL = 10000;
const { pause, resume, isActive: active } = useIntervalFn(async () => {
  if (pending.value) {
    return; // duplicate request
  }
  try {
    pending.value = true;
    await languageStore.reloadFiles();
  } finally {
    pending.value = false;
  }
}, RELOAD_INTERVAL, { 
  immediate: false,
  immediateCallback: true
});
</script>

<template>
  <HeaderPanelSwitch
    title="toggle file sync"
    :class="{ active, pending }"
    @click="active ? pause() : resume()"
  >
    <IconSync class="spinner" />
  </HeaderPanelSwitch>
</template>

<style scoped>
.spinner {
  rotate: 0deg;
  transition: rotate 1s linear;
}
.pending > .spinner  {
  rotate: 180deg;
  transition: none;
}
</style>