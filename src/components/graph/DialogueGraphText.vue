<script setup lang="ts">
import { useDatabaseStore } from '@/stores/database';
import type { DialogueEntryType } from '@/types';

const props = defineProps<{
  entry: DialogueEntryType
}>();

const { database } = useDatabaseStore();

const actorId = props.entry.fields.Actor;
const actor = actorId !== undefined ? database?.actorsById.get(+actorId) : undefined;
</script>

<template>
  <div xmlns="http://www.w3.org/1999/xhtml" class="frame">
    <div class="title">
      {{actor?.fields.Name}}
    </div>
    <div class="text">
      {{entry.fields['Dialogue Text']}}
    </div>
  </div>
</template>

<style scoped>
  .frame {
    display: flex;
    flex-direction: column;
    border: 3px solid #666666;
    background-color: #666666;
  }
  .title {
    font-weight: bold;
    padding: 5px 4px;
    line-height: 1;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .text {
    flex-grow: 1;
    background: #eeeeee;
    padding: 5px;
    color: black;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
