<script setup lang="ts">
import DialogueL10n from "@/components/l10n/DialogueL10n.vue";
import { useDatabaseStore } from "@/stores/database";
import type { DialogueEntryType } from "@/types";
import { computed } from "vue";
import DialogueFlowBadge from "./DialogueFlowBadge.vue";

const props = defineProps<{
  entry: DialogueEntryType
}>();

const { database } = useDatabaseStore();

const alternates = computed(() => [1, 2, 3, 4].map(i => ({
  kind: "Alternate" + i,
  text: props.entry.fields["Alternate" + i],
  condition: props.entry.fields["Condition" + i]
})).filter(it => !!it.text));

const actor = computed(() => {
  const actorId = props.entry?.fields.Actor;
  return actorId ? database?.actorsById.get(+actorId) : undefined;
});
</script>

<template>
  <div class="flow-entry">
    <div class="header">
      <span v-if="actor" class="actor" :title="actor?.fields?.Description">{{ actor?.fields.Name }}</span>
    </div>
    <div class="content">
      <div class="steps">
        <code class="badge badge-priority" title="entry priority">
          {{ entry.conditionPriority }}
        </code>
        <DialogueFlowBadge :value="entry.conditionsString" :type="'condition'" />
        <!-- annotation type entry -->
        <code v-if="entry.fields?.annotation_title" class="badge" title="annotation title">
          {{ entry.fields?.annotation_title }}
        </code>
        <code v-if="entry.fields?.annotation_text" class="badge" title="annotation text">
          {{ entry.fields?.annotation_text }}
        </code>
        <!-- /annotation type entry -->
      </div>
      <div v-if="entry.fields['Dialogue Text']" class="entry-text" tooltip="dialogue text">
        <DialogueL10n :entry="entry" kind="Dialogue Text" />
      </div>
      <div v-if="entry.fields.DialogueEntryType !== 'DialogueFragment'" class="badge" title="title">
        {{ entry.fields.Title }}
      </div>
      <!-- alternate text -->
      <template v-for="alternate in alternates">
        <div class="alternate">
          <div class="steps">
            <DialogueFlowBadge :value="alternate.condition" :type="'condition'" :title="'alternate condition'" />
          </div>
          <div class="entry-text" title="alternate text">
            <DialogueL10n :entry="entry" :kind="alternate.kind" />
          </div>
        </div>
      </template>
      <!-- /alternate text -->
      <DialogueFlowBadge :value="entry.userScript" :type="'script'" />
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/flow.css";

.flow-entry {
  display: flex;
  gap: 3px;
  line-height: 1.2;
}
.header {
  display: flex;
  flex-basis: 12rem;
  align-self: stretch;
  justify-content: center;
  padding: 0 5px;
  background: var(--color-border);
  border-radius: 5px
}


.actor {
  align-self: center;
}

.content {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 3px;
}

.alternate {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
</style>
