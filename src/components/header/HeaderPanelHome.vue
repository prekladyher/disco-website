<script setup lang="ts">
import IconHome from "@/components/icons/IconHome.vue";
</script>

<template>
  <router-link to="/" class="link" title="home">
    <IconHome class="icon" />
  </router-link>
</template>

<style scoped>
.link {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 32px;
  height: 32px;
}
</style>