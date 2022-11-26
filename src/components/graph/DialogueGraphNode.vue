<script setup lang="ts">
import { useConversationStore } from "@/stores/conversation";
import { useDialogueGraphStore } from "@/stores/dialogueGraph";
import type { AnyShapeStyle } from "v-network-graph";
import { ref } from "vue";
import DialogueGraphFork from "./DialogueGraphFork.vue";
import DialogueGraphHub from "./DialogueGraphHub.vue";
import DialogueGraphJump from "./DialogueGraphJump.vue";
import DialogueGraphScript from "./DialogueGraphScript.vue";
import DialogueGraphStart from "./DialogueGraphStart.vue";
import DialogueGraphText from "./DialogueGraphText.vue";

import { useResizeObserver } from "@vueuse/core";

const props = defineProps<{
  nodeId: string,
  config: AnyShapeStyle
}>();

const { conversation } = useConversationStore();
const entry = conversation?.entriesById.get(parseInt(props.nodeId));

const { nodes } = useDialogueGraphStore();
const node = nodes[props.nodeId];

const contentRef = ref(null);
useResizeObserver(contentRef, (entries) => {
  const entry = entries[0];
  node.width = entry.contentRect.width;
  node.height = entry.contentRect.height;
}, { box: "border-box" });
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
    <div xmlns="http://www.w3.org/1999/xhtml" ref="contentRef">
      <DialogueGraphHub
        v-if="entry?.fields.DialogueEntryType === 'Hub'"
        :entry="entry"
      />
      <DialogueGraphText
        v-else-if="entry?.fields.DialogueEntryType === 'DialogueFragment'"
        :entry="entry"
      />
      <DialogueGraphFork
        v-else-if="entry?.fields.DialogueEntryType === 'Fork'"
        :entry="entry"
      />
      <DialogueGraphScript
        v-else-if="entry?.fields.DialogueEntryType === 'Instruction'"
        :entry="entry"
      />
      <DialogueGraphJump
        v-else-if="entry?.fields.DialogueEntryType === 'Jump'"
        :entry="entry"
      />
    </div>
  </foreignObject>
</template>
