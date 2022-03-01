<script setup lang="ts">
import type { Edges, EventHandlers, Layouts, Node, Nodes, UserConfigs } from "v-network-graph";
import { ref } from "@vue/reactivity";
import DialogueGraphTooltip from "./DialogueGraphTooltip.vue";
import type { ConversationModel } from "@/stores/conversation";
import { isEntryVisible, resolveEdges } from "@/graph";
import type { DialogueEntryType } from "@/types"
import type { PropType } from "vue";

const { conversation } = defineProps({
  conversation: {
    type: Object as PropType<ConversationModel>,
    required: true
  }
});

function getNodeColor(node: any) {
  switch (node.fields?.DialogueEntryType) {
    case "Hub": return "#333333";
    case "DialogueFragment": return "#44aa66";
    case "Fork": return "#666666";
    case "Jump": return "#d0c66c";
    case "Instruction": return "#aa3333";
    default: return "red";
  }
}

const configs: UserConfigs = {
  view: {
    scalingObjects: true,
    fit: true,
  },
  node: {
    normal: {
      type: (node) => node.fields.Title === "START" ? "circle" : "rect",
      radius: 35,
      width: 70,
      height: 70,
      color: getNodeColor,
    },
    hover: {
      color: getNodeColor
    },
    label: {
      fontSize: 15
    }
  },
  edge: {
    normal: {
      color: "#888"
    },
    marker: {
      target: {
        type: "arrow",
      }
    }
  }
};

const nodes: Nodes = {};
const edges: Edges = {};
for (let entry of conversation.entriesById.values()) {
  if (!isEntryVisible(entry)) {
    continue; // ignore invisible entries
  }
  nodes[entry.id] = {
    name: entry.fields.Title || ("" + entry.id),
    ...entry
  };
  for (let path of resolveEdges(conversation, entry.id)) {
    edges[entry.id + "_" + path.map(it => it.id).join("_")] = {
      source: "" + entry.id,
      target: "" + path[path.length - 1].id,
      path: path
    };
  }
}

const layouts: Layouts = { nodes: {} };
for (let entry of conversation.entriesById.values()) {
  let { x, y } = entry.canvasRect;
  // Fix unpositionined (START) nodes
  if (x === 0 && y === 0) {
    const targets = resolveEdges(conversation, entry.id).map(path => path[path.length - 1]);
    if (targets.length) {
      x = Math.min(...targets.map(it => it.canvasRect.x)) - 300;
      y = targets.map(it => it.canvasRect.y).reduce((acc, it) => acc + it) / targets.length;
    }
  }
  layouts.nodes[entry.id] = { x, y };
};

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
