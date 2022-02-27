<script setup lang="ts">
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/conversations/666">Conversation</RouterLink>
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
}
</style>
