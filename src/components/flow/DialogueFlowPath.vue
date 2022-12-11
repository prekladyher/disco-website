<script setup lang="ts">
import DialogueFlowBadge from "./DialogueFlowBadge.vue";
import DialogueFlowEntry from "./DialogueFlowEntry.vue";
import type { DialoguePathType } from "./types";

const props = defineProps<{
  path: DialoguePathType
}>();
</script>

<template>
  <div class="path-entry">
    <div v-if="path.steps.length" class="steps">
      <code v-if="path.steps.length" class="badge badge-priority" title="priority">
        {{ path.steps[0]?.entry?.conditionPriority }}
      </code>
      <template v-for="{ entry } in path.steps">
        <DialogueFlowBadge :value="entry?.conditionsString" :type="'condition'" />
        <DialogueFlowBadge :value="entry?.userScript" :type="'script'" />
      </template>
    </div>
    <DialogueFlowEntry v-if="path.destination.entry" :entry="path.destination.entry" />
  </div>
</template>

<style scoped>
@import "@/assets/flow.css";

.path-entry {
  flex: 1;
}

.path-entry > .steps {
  margin-bottom: 3px;
}
</style>
