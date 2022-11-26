<script setup lang="ts">
import type { DialogueEntryType } from "@/types";

const props = defineProps<{
  entry: DialogueEntryType
}>();
</script>

<template>
  <div xmlns="http://www.w3.org/1999/xhtml" class="frame">
    <div class="text">
      {{entry.fields.Title}}
    </div>
  </div>
</template>

<style scoped>
  .frame {
    display: flex;
    flex-direction: column;
    border: 3px solid #aa8888;
    background-color: #aa8888;
    border-radius: 5px;
    line-height: 1.2;
  }
  .text {
    flex-grow: 1;
    padding: 5px;
    color: black;
    overflow-wrap: break-word;
    background-color: #ffdddd;
  }
</style>
