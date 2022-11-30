<script setup lang="ts">
import HeaderPanelDark from "./HeaderPanelDark.vue";
import HeaderPanelDebug from "./HeaderPanelDebug.vue";
import HeaderPanelHome from "./HeaderPanelHome.vue";
import HeaderPanelLocale from "./HeaderPanelLocale.vue";
import HeaderPanelSync from "./HeaderPanelSync.vue";
import HeaderPanelTitle from "./HeaderPanelTitle.vue";
</script>

<template>
  <header>
    <nav>
      <HeaderPanelHome />
      <HeaderPanelTitle />
      <div class="glue"></div>
      <HeaderPanelDebug />
      <HeaderPanelDark />
      <HeaderPanelSync />
      <HeaderPanelLocale />
    </nav>
  </header>
</template>

<style scoped>
nav {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  background: var(--color-background-soft);
  color: var(--color-text);
  height: 100%;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 1px 2px;
  padding-inline: 8px;
}

nav > * + * {
  margin-left: 8px;
}

nav > .glue {
  flex-grow: 1;
}
</style>
