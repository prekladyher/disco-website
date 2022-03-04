<script setup lang="ts">
import TheHeader from "./components/TheHeader.vue";
</script>

<template>
  <TheHeader />
  <router-view />
</template>

<style>
@import "@/assets/base.css";
@import "v-network-graph/lib/style.css";

#app {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 3rem auto;
  height: 100vh;
}

#app > main.fixed {
  overflow: hidden;
}
</style>
