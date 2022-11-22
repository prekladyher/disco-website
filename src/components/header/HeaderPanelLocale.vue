<script setup lang="ts">
import { useLanguageStore } from "@/stores/language";
import IconLanguage from "../icons/IconLanguage.vue";
import HeaderPanelSwitch from "./HeaderPanelSwitch.vue";

const languageStore = useLanguageStore();

const TARGET_LOCALE = "cs";

function toggleL10n() {
  languageStore.activeLocale = languageStore.activeLocale ? "" : TARGET_LOCALE;
};
</script>

<template>
  <HeaderPanelSwitch
    title="toggle language"
    :class="{ active: languageStore.activeLocale === TARGET_LOCALE}"
    @click="toggleL10n()"
  >
    <IconLanguage />
  </HeaderPanelSwitch>
</template>