<script setup>
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/conversations/666">Conversation</RouterLink>
    </nav>
  </header>
  <RouterView />
</template>

<style>
@import "@/assets/base.css";
@import "v-network-graph/lib/style.css";

#app {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 2em auto;
  height: 100vh;
}
#app > * {
  overflow: hidden;
}
</style>
