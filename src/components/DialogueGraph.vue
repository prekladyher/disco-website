<script setup lang="ts">
import type { Edges, EventHandlers, Layouts, Node, Nodes, UserConfigs } from "v-network-graph";
import { ref } from "@vue/reactivity";
import DialogueGraphTooltip from "./DialogueGraphTooltip.vue";
import type { PropType } from "vue";
import type { ConversationModel } from "@/stores/conversation";

const { conversation } = defineProps({
  conversation: {
    type: Object as PropType<ConversationModel>,
    required: true
  }
});

const configs: UserConfigs = {
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

const nodes: Nodes = {};
for (let entry of conversation.entriesById.values()) {
  nodes[entry.id] = {
    name: entry.fields.Title || ("" + entry.id),
    ...entry
  };
}

const layouts: Layouts = { nodes: {} };
for (let entry of conversation.entriesById.values()) {
  layouts.nodes[entry.id] = {
    x: entry.canvasRect.x,
    y: entry.canvasRect.y,
  };
};

const edges: Edges = {};
for (let [id, link] of conversation.linksById.entries()) {
  if (!link.external) {
    edges[id] = {
      source: "" + link.originDialogueID,
      target: "" + link.destinationDialogueID,
      ...link
    };
  }
}

const currentNode = ref<Node>();

const eventHandlers: EventHandlers = {
  "node:pointerover": ({ node }) => {
    currentNode.value = nodes[node];
  },
  "node:pointerout": _ => {
    currentNode.value = undefined;
  },
};
</script>

<template>
  <v-network-graph
    :configs="configs"
    :nodes="nodes"
    :layouts="layouts"
    :edges="edges"
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
