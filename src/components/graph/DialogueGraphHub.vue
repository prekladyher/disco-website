<script setup lang="ts">
import type { DialogueEntryType } from "@/types";

const props = defineProps<{
  entry: DialogueEntryType
}>();
</script>

<template>
  <div xmlns="http://www.w3.org/1999/xhtml" class="frame">
    <div class="title">
      {{entry?.fields.Title}}
    </div>
  </div>
</template>

<style scoped>
  .frame {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #888888;
    border-radius: 5px;
    line-height: 1.2;
  }
  .title {
    color: #dddddd;
    padding: 8px 5px;
  }
</style>
