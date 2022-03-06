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
      <span v-if="actor" class="actor">{{ actor?.fields.Name }}</span>
    </div>
    <div class="content">
      <div class="steps">
        <code class="code">
          {{ entry.conditionPriority }}
        </code>
        <code class="code" v-if="entry.conditionsString">{{ entry.conditionsString }}</code>
      </div>
      <div class="text" v-if="entry.fields['Dialogue Text']">
        {{ entry.fields['Dialogue Text'] }}
      </div>
      <div class="code" v-if="entry.fields.DialogueEntryType !== 'DialogueFragment'">
        {{ entry.fields.Title }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.flow-entry {
  display: flex;
  gap: 3px;
  line-height: 1.2;
}
.header {
  flex-basis: 12rem;
  align-self: stretch;
  padding: 0 5px;
  background: #222;
  border-radius: 5px
}
.actor {
  font-weight: 600;
  color: #f4af04;
}

.steps {
  display: flex;
  gap: 3px 3px;
}
.content > * + * {
  margin-top: 3px;
}
.code {
  font-size: 12px;
  background: black;
  line-height: 16px;
  padding: 2px 5px;
  border-radius: 4px;
}
.text {
  background: #222;
  border-radius: 5px;
  font-style: italic;
  padding: 2px 5px 4px 5px;
}
</style>
