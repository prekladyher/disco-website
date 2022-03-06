<script setup lang="ts">
import { useDatabaseStore } from '@/stores/database';
import { watch } from 'vue';
import type { DialoguePathType } from './DialogueFlow/types';
import DialogueFlowEntry from './DialogueFlowEntry.vue';

const props = defineProps<{
  path: DialoguePathType
}>();

const { database } = useDatabaseStore();

watch(() => props.path, path => {

}, { immediate: true });
</script>

<template>
  <div class="path-entry">
    <div class="steps" v-if="path.steps.length">
      <div v-for="step in path.steps">
        <code class="code">
          {{ step.entry?.fields.Title }}
        </code>
      </div>
    </div>
    <DialogueFlowEntry v-if="path.destination.entry" :entry="path.destination.entry" />
  </div>
</template>

<style scoped>
.path-entry {
  border: 1px solid #222;
  padding: 4px 3px;
  flex: 1;
}
.steps {
  line-height: 1;
  font-size: 12px;
  display: flex;
  margin-bottom: 4px;
  flex-wrap: wrap;
  gap: 3px;
}
.code {
  font-size: 12px;
  background: black;
  line-height: 16px;
  padding: 2px 5px;
  border-radius: 4px;
}
</style>
