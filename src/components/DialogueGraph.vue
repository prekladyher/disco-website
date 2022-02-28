<script setup lang="ts">
import type { Edges, EventHandlers, Layouts, Node, Nodes, UserConfigs } from "v-network-graph";
import { ref } from "@vue/reactivity";
import DialogueGraphTooltip from "./DialogueGraphTooltip.vue";
import type { ConversationModel } from "@/stores/conversation";
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
      type: (node) => node.start ? "circle" : "rect",
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
for (let entry of conversation.entriesById.values()) {
  if (!entry.fields?.DialogueEntryType) {
    continue; // START and INPUT nodes
  }
  if (entry.fields?.DialogueEntryType === "Fork" && entry.conditionsString) {
    continue; // will be rendered as edge
  }
  nodes[entry.id] = {
    name: entry.fields.Title || ("" + entry.id),
    ...entry
  };
}

function isEntryVisible(entry: DialogueEntryType) {
  // START entry and/or FORK conditions are not rendered
  return entry.fields?.DialogueEntryType &&
      (entry.fields?.DialogueEntryType !== "Fork" || !entry.conditionsString);
}

function markStart(entry: DialogueEntryType) {
  if (isEntryVisible(entry)) {
    nodes[entry.id].start = true;
  } else {
    entry.outgoingLinks
      ?.filter(link => link.destinationConversationID === entry.conversationID)
      .map(link => conversation.entriesById.get(link.destinationDialogueID) as DialogueEntryType)
      .forEach(markStart);
  }
}

if (conversation.entriesById.size) {
  const start = conversation.entriesById.values().next().value;
  if (start.fields?.Title !== "START") {
    throw new Error(`Invalid start entry: ${start}`);
  }
  markStart(start);
}


const layouts: Layouts = { nodes: {} };
for (let entry of conversation.entriesById.values()) {
  layouts.nodes[entry.id] = {
    x: entry.canvasRect.x,
    y: entry.canvasRect.y,
  };
};

function resolveEdges(entry: DialogueEntryType, follow = false): Edges {
  if (!isEntryVisible(entry) && !follow) {
    return {}; // Entry is not visible and we are not following a valid path
  }
  if (entry.fields.DialogueEntryType === "Jump") {
    return {}; // JUMP links are not rendered
  }
  const edges: Edges = {};
  for (let link of entry?.outgoingLinks || []) {
    // Only JUMP entries should link out of conversation
    if (link.originConversationID !== link.destinationConversationID) {
      throw new Error(`Invalid link detected: ${link}`);
    }
    // Get destination dialogue entry
    const destination = conversation.entriesById.get(link.destinationDialogueID);
    if (!destination) {
      throw new Error(`Invalid link destination: ${link}`);
    }
    // Resolve conditional FORK links
    if (destination.fields.DialogueEntryType === "Fork" && destination.conditionsString) {
      for (let [id, edge] of Object.entries(resolveEdges(destination, true))) {
        edges[`${entry.id}_${id}`] = {
          ...edge,
          source: "" + entry.id,
          entries: [destination, ...(edge.forks || [])]
        };
      }
    } else {
      const sourceId = "" + link.originDialogueID;
      const targetId = "" + link.destinationDialogueID;
      edges[`${sourceId}_${targetId}`] = {
        source: sourceId,
        target: targetId
      };
    }
  }
  return edges;
}

const edges: Edges = {};
for (let entry of conversation.entriesById.values()) {
  if (isEntryVisible(entry)) {
    const resolved = resolveEdges(entry);
    for (let [id, edge] of Object.entries(resolved)) {
      edges[id] = edge;
    }
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
