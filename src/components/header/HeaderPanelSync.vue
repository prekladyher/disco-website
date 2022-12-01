<script setup lang="ts">
import { useLanguageStore } from "@/stores/language";
import { useIntervalFn } from "@vueuse/shared";
import { ref, watch } from "vue";
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

const animate = ref(false);
watch(pending, () => {
  animate.value = true;
  setTimeout(() => animate.value = false, 500)
});
</script>

<template>
  <HeaderPanelSwitch
    title="toggle file sync"
    class="switch"
    :class="{ active, pending: animate }"
    @click="active ? pause() : resume()"
  >
    <IconSync class="spinner" />
    <span
      class="count"
    >{{ languageStore.loadedCount }}</span>
  </HeaderPanelSwitch>
</template>

<style scoped>
.switch {
  position: relative;
}

.pending > .spinner  {
  rotate: -360deg;
  transition: rotate 0.5s;
}

.count {
  position: absolute;
  font-size: 10px;
  color: var(--color-text);
  bottom: -2px;
  right: -2px;
  line-height: 1;
  padding: 1px 3px;
  background: var(--color-background-soft);
  border-radius: 5px;
}
</style>