<script setup lang="ts">
import { useDatabaseStore } from '@/stores/database';
import type { ActorType, DialogueEntryType } from '@/types';
import { ref, watch } from 'vue';

const props = defineProps<{
  entry: DialogueEntryType
}>();

const { database } = useDatabaseStore();
const actor = ref<ActorType>();

watch(() => props.entry, entry => {
  const actorId = entry?.fields.Actor;
  actor.value = actorId ? database?.actorsById.get(+actorId) : undefined;
}, { immediate: true });
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
        <code v-if="entry.conditionsString" class="badge badge-condition" title="entry condition">
          {{ entry.conditionsString }}
        </code>
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
        {{ entry.fields['Dialogue Text'] }}
      </div>
      <div v-if="entry.fields.DialogueEntryType !== 'DialogueFragment'" class="badge" title="title">
        {{ entry.fields.Title }}
      </div>
      <!-- alternate text -->
      <template v-for="idx in [1, 2, 3, 4]">
        <div v-if="entry.fields?.['Alternate' + idx]" class="alternate">
          <div class="steps">
            <code class="badge badge-condition" title="alternate condition">
              {{ entry.fields?.['Condition' + idx] }}
            </code>
          </div>
          <div class="entry-text" title="alternate text">
            {{ entry.fields?.['Alternate' + idx] }}
          </div>
        </div>
      </template>
      <!-- /alternate text -->
      <code v-if="entry.userScript" class="badge badge-script" title="script">
        {{ entry.userScript }}
      </code>
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
  flex-basis: 12rem;
  align-self: stretch;
  padding: 0 5px;
  background: #222222;
  border-radius: 5px
}
.actor {
  font-weight: 600;
  color: #f4af04;
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
