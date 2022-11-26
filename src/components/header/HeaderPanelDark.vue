<script setup lang="ts">
import IconMoon from "@/components/icons/IconMoon.vue";
import HeaderPanelSwitch from "./HeaderPanelSwitch.vue";

import { useDark, useToggle } from "@vueuse/core";

const dark = useDark()
const toggleDark = useToggle(dark)
</script>

<template>
  <HeaderPanelSwitch
    title="toggle dark mode"
    :class="{ active: dark }"
    @click="toggleDark()"
  >
    <IconMoon />
  </HeaderPanelSwitch>
</template>