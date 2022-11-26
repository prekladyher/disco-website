<script setup lang="ts">
import DialogueBadgeCondition from "./DialogueBadgeCondition.vue";
import DialogueBadgeScript from "./DialogueBadgeScript.vue";
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
        <DialogueBadgeCondition v-if="entry?.conditionsString" :condition="entry.conditionsString" />
        <DialogueBadgeScript v-if="entry?.userScript" :script="entry?.userScript" />
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
