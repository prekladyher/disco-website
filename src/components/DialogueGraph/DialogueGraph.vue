<script setup lang="ts">
import type { ConversationModel } from "@/stores/conversation";
import { findStartEntry, useDialogueGraphStore } from "@/stores/dialogueGraph";
import { ref } from "@vue/reactivity";
import { storeToRefs } from "pinia";
import type { EventHandlers, VNetworkGraphInstance } from "v-network-graph";
import { reactive, watch, type PropType } from "vue";
import DialogueGraphTooltip from "../DialogueGraphTooltip.vue";
import { configs } from "./config";
import { useDebugTooltip } from "./debug";
import { focusNodeAsync } from "./utils";

const props = defineProps({
  conversation: {
    type: Object as PropType<ConversationModel>
  }
});

const dialogueGraphStore = useDialogueGraphStore();
const { loading, debug, nodes, edges, layouts, zoomLevel } = storeToRefs(dialogueGraphStore);

const nodeGraph = ref<VNetworkGraphInstance>();
const eventHandlers: EventHandlers = reactive({});

const { entries: hoverEntries, handlers: hoverHandlers } = useDebugTooltip();
Object.assign(eventHandlers, hoverHandlers);

const selectedNodes = ref<string[]>([]);
const selectedEdges = ref<string[]>([]);

eventHandlers["node:select"] = (ids) => {
  dialogueGraphStore.focusNode(ids?.[0] || null);
};
eventHandlers["edge:select"] = (ids) => {
  dialogueGraphStore.focusEdge(ids?.[0] || null);
};

watch(props, async ({ conversation }) => {
  loading.value = true;
  dialogueGraphStore.loadConversation(conversation);
  if (conversation) {
    selectedNodes.value = ["" + findStartEntry(conversation).id];
    selectedEdges.value = [];
    await focusNodeAsync(nodeGraph.value, selectedNodes.value?.[0]);
  }
  loading.value = false;
}, { immediate: true });
</script>

<template>
  <v-network-graph
    :class="{ loaded: !loading }"
    ref="nodeGraph"
    v-model:zoom-level="zoomLevel"
    v-model:selected-nodes="selectedNodes"
    v-model:selected-edges="selectedEdges"
    :configs="configs"
    :nodes="nodes"
    :layouts="layouts"
    :edges="edges"
    :event-handlers="eventHandlers"
  >
    <template #edge-label="{ edge, ...slotProps }">
      <v-edge-label
        :text="edge.label"
        v-bind="slotProps"
      />
    </template>
  </v-network-graph>
  <DialogueGraphTooltip
    v-if="debug"
    :entries="hoverEntries"
  />
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
