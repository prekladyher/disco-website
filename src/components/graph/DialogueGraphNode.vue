<script setup lang="ts">
import { useConversationStore } from '@/stores/conversation';
import { useDialogueGraphStore } from '@/stores/dialogueGraph';
import type { RectangleShapeStyle } from 'v-network-graph';

const props = defineProps<{
  nodeId: string,
  config: RectangleShapeStyle,
}>();


const { conversation } = useConversationStore();
const entry = conversation?.entriesById.get(parseInt(props.nodeId));

const { nodes } = useDialogueGraphStore();
const node = nodes[props.nodeId];
</script>

<template>
  <foreignObject
    :x="- node.width / 2"
    :y="- node.height / 2"
    :width="node.width"
    :height="node.height"
  >
    <div xmlns="http://www.w3.org/1999/xhtml" class="node-frame">
      <div class="text-body">
        {{entry?.fields.Title}}
      </div>
    </div>
  </foreignObject>
</template>

<style scoped>
  .node-frame {
    border: 3px solid #888888;
    border-radius: 5px;
    background: #dddddd;
    height: 100%;
    color: #111111;
    line-height: 1.2;
    font-size: 15px;
    font-family: sans-serif;
  }

  .text-body {
    padding: 6px;
    word-wrap: break-word;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>