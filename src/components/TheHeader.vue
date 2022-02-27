<script setup lang="ts">
import IconHome from "./IconHome.vue";
</script>

<template>
  <header>
    <nav>
      <router-link to="/"><IconHome /></router-link>
    </nav>
  </header>
</template>

<style scoped>
header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: var(--vt-c-black-soft);
  color: var(--vt-c-white);
}

a {
  margin-left: 1em;
  display: inline-block;
  vertical-align: middle;
  height: 24px;
}
</style>
