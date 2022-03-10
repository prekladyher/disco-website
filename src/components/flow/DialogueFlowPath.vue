<script setup lang="ts">
import { useDatabaseStore } from '@/stores/database';
import { watch } from 'vue';
import DialogueFlowEntry from './DialogueFlowEntry.vue';
import type { DialoguePathType } from './types';

const props = defineProps<{
  path: DialoguePathType
}>();

const { database } = useDatabaseStore();

watch(() => props.path, path => {

}, { immediate: true });
</script>

<template>
  <div class="path-entry">
    <div v-if="path.steps.length" class="steps">
      <code v-if="path.steps.length" class="badge badge-priority" title="priority">
        {{ path.steps[0]?.entry?.conditionPriority }}
      </code>
      <template v-for="step in path.steps">
        <code v-if="step.entry?.conditionsString" class="badge badge-condition" title="condition">
          {{ step.entry?.conditionsString }}
        </code>
        <code v-if="step.entry?.userScript" class="badge badge-script" title="script">
          {{ step.entry?.userScript }}
        </code>
      </template>
    </div>
    <DialogueFlowEntry v-if="path.destination.entry" :entry="path.destination.entry" />
  </div>
</template>

<style scoped>
@import "@/assets/flow.css";

.path-entry {
  border: 1px solid #222;
  padding: 4px 3px;
  flex: 1;
}

.path-entry > .steps {
  margin-bottom: 3px;
}
</style>
