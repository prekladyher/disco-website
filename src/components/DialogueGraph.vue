<script setup>
import { ref, unref } from "@vue/reactivity";
import { computed } from "@vue/runtime-core";
import DialogueGraphTooltip from "./DialogueGraphTooltip.vue";

const { conversation } = defineProps({
  conversation: { 
    type: Object,
    required: true 
  }
});

const configs = {
  view: {
    scalingObjects: true,
    fit: true,
  },
  node: {
    normal: {
      type: "rect"
    }
  },
  edge: {
    marker: {
      target: {
        type: "arrow"
      }
    }
  }
};

const nodes = Object.fromEntries(conversation.entries.map(entry => {
  const node = {
    name: "" + entry.id,
    x: entry.canvasRect.x,
    y: entry.canvasRect.y,
    ...entry,
  };
  return [entry.id, node];
}));

const layouts = ref({ nodes });

const edges = Object.fromEntries(Object.values(conversation.linksById)
  .flat()
  .filter(link => !link.external)
  .map(link => [
    `${link.originDialogueID}_${link.id}`, 
    { source: link.originDialogueID, target: link.destinationDialogueID, ...link }
  ]));

const currentNode = ref();

const eventHandlers = {
  "node:pointerover": ({ node }) => {
    currentNode.value = nodes[node];
  },
  "node:pointerout": _ => {
    currentNode.value = undefined;
  },
}
</script>

<template>
  <VNetworkGraph
    ref="graph"
    :configs="configs"
    :nodes="nodes"
    :edges="edges"
    :layouts="layouts"
    :event-handlers="eventHandlers"
  />
  <DialogueGraphTooltip :node="currentNode" />
</template>

<style scoped>
.tooltip {
  position: absolute;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 5px;
  border: 1px solid black;
  font-size: 12px;
}
</style>
