<script setup lang="ts">
import type { DialogueEntryType } from "@/types";
import ScriptCondition from "../script/ScriptCondition.vue";

const props = defineProps<{
  entry: DialogueEntryType
}>();
</script>

<template>
  <div xmlns="http://www.w3.org/1999/xhtml" class="frame">
    <div class="text">
      <ScriptCondition :value="entry.fields.Title || ''" />
    </div>
  </div>
</template>

<style scoped>
  .frame {
    display: flex;
    flex-direction: column;
    border: 3px solid #8888aa;
    background-color: #8888aa;
    border-radius: 5px;
    line-height: 1.2;
  }
  .text {
    flex-grow: 1;
    padding: 8px 5px;
    color: black;
    overflow-wrap: break-word;
    background-color: #ddddff;
  }
</style>
