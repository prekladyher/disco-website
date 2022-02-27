<script setup lang="ts">
import TheHeader from './components/TheHeader.vue';
</script>

<template>
  <TheHeader />
  <RouterView />
</template>

<style>
@import "@/assets/base.css";
@import "v-network-graph/lib/style.css";

a {
  color: #ff5252;
}

#app {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 3rem auto;
  height: 100vh;
}

#app > main {
  overflow: hidden;
}
</style>
