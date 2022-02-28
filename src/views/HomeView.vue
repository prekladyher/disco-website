<script setup lang="ts">
import { useDatabaseStore } from "@/stores/database";
import { storeToRefs } from "pinia";

const { database } = storeToRefs(useDatabaseStore());
</script>

<template>
  <main>
    <div class="list-wrapper">
      <ul v-if="database">
        <li v-for="[id, conversation] in database.conversationsById">
          <router-link :to="`/conversations/${id}`">
            {{id}} &ndash; {{ conversation.fields.Title }}
          </router-link>
        </li>
      </ul>
    </div>
  </main>
</template>

<style scoped>
.list-wrapper {
  max-height: 100%;
  overflow-y: scroll;
}
ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
ul > li {
  padding: 0 10px;
}
ul > li + li {
  border-top: 1px solid var(--color-border);
}
</style>
