<script setup lang="ts">
import { useConversationStore } from "@/stores/conversation";
import { useDialogueGraphStore } from "@/stores/dialogueGraph";
import type { AnyShapeStyle } from "v-network-graph";
import DialogueGraphFork from "./DialogueGraphFork.vue";
import DialogueGraphHub from "./DialogueGraphHub.vue";
import DialogueGraphJump from "./DialogueGraphJump.vue";
import DialogueGraphScript from "./DialogueGraphScript.vue";
import DialogueGraphStart from "./DialogueGraphStart.vue";
import DialogueGraphText from "./DialogueGraphText.vue";

const props = defineProps<{
  nodeId: string,
  config: AnyShapeStyle
}>();

const { conversation } = useConversationStore();
const entry = conversation?.entriesById.get(parseInt(props.nodeId));

const { nodes } = useDialogueGraphStore();
const node = nodes[props.nodeId];
</script>

<template>
  <DialogueGraphStart
    v-if="entry && config.type === 'circle'"
    :config="config"
  />
  <foreignObject
    v-else
    :x="- node.width / 2"
    :y="- node.height / 2"
    :width="node.width"
    :height="node.height"
  >
    <DialogueGraphHub
      v-if="entry?.fields.DialogueEntryType === 'Hub'"
      :entry="entry"
      class="node-frame"
    />
    <DialogueGraphText
      v-else-if="entry?.fields.DialogueEntryType === 'DialogueFragment'"
      :entry="entry"
      class="node-frame"
    />
    <DialogueGraphFork
      v-else-if="entry?.fields.DialogueEntryType === 'Fork'"
      :entry="entry"
      class="node-frame"
    />
    <DialogueGraphScript
      v-else-if="entry?.fields.DialogueEntryType === 'Instruction'"
      :entry="entry"
      class="node-frame"
    />
    <DialogueGraphJump
      v-else-if="entry?.fields.DialogueEntryType === 'Jump'"
      :entry="entry"
      class="node-frame"
    />
  </foreignObject>
</template>

<style scoped>
  .node-frame {
    height: 100%;
    color: #ffffff;
    line-height: 1.2;
    font-size: 15px;
    font-family: sans-serif;
    border-radius: 5px;
  }
</style>