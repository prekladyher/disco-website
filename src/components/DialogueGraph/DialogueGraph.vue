<script setup lang="ts">
import type { VNetworkGraphInstance, EventHandlers, Node, UserConfigs, Nodes, Edges, Layouts } from "v-network-graph";
import { ref } from "@vue/reactivity";
import DialogueGraphTooltip from "../DialogueGraphTooltip.vue";
import type { ConversationModel } from "@/stores/conversation";
import { defineGraph, type GraphModel } from "./graph";
import { configs } from "./config";
import { reactive, watch, type PropType } from "vue";

const props = defineProps({
  conversation: {
    type: Object as PropType<ConversationModel>,
    required: true
  }
});

const nodes = reactive<Nodes>({});
const edges = reactive<Edges>({});
const layouts = reactive<Layouts>({ nodes: {} });
watch(() => props.conversation, conversation => {
  Object.keys(nodes).forEach(id => delete nodes[id]);
  Object.keys(edges).forEach(id => delete edges[id]);
  Object.keys(layouts.nodes).forEach(id => delete layouts.nodes[id]);
  if (conversation) {
    const graphModel = defineGraph(conversation);
    Object.assign(nodes, graphModel.nodes);
    Object.assign(edges, graphModel.edges);
    Object.assign(layouts.nodes, graphModel.layouts.nodes);
  }
}, { immediate: true });

const nodeGraph = ref<VNetworkGraphInstance>();

const currentNode = ref<Node>();
const eventHandlers: EventHandlers = {
  "node:pointerover": event => {
    currentNode.value = nodeGraph.value?.nodes[event.node];
  },
  "node:pointerout": _ => {
    currentNode.value = undefined;
  },
};
</script>

<template>
  <v-network-graph
    ref="nodeGraph"
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
