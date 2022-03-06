<script setup lang="ts">
import type { ConversationModel } from "@/stores/conversation";
import { findStartEntry, useDialogueGraphStore } from "@/stores/dialogueGraph";
import { ref } from "@vue/reactivity";
import { storeToRefs } from "pinia";
import type { EventHandlers, VNetworkGraphInstance } from "v-network-graph";
import { reactive, toRaw, watch, type PropType } from "vue";
import { configs } from "./config";
import { focusNodeAsync } from "./utils";

const props = defineProps({
  conversation: {
    type: Object as PropType<ConversationModel>
  }
});

const dialogueGraphStore = useDialogueGraphStore();
const { loading, nodes, edges, layouts, zoomLevel } = storeToRefs(dialogueGraphStore);

const nodeGraph = ref<VNetworkGraphInstance>();

const selectedNodes = ref<string[]>([]);
const selectedEdges = ref<string[]>([]);

const eventHandlers: EventHandlers = reactive({});
eventHandlers["node:select"] = (ids) => {
  dialogueGraphStore.target.node = ids?.[0];
};
eventHandlers["edge:select"] = (ids) => {
  dialogueGraphStore.target.edge = ids?.[0];
};

watch(() => props.conversation, async conversation => {
  loading.value = true;
  selectedNodes.value = [];
  selectedEdges.value = [];
  dialogueGraphStore.loadConversation(conversation);
  if (conversation) {
    const startEntry = findStartEntry(conversation);
    await focusNodeAsync(nodeGraph.value, "" + startEntry.id);
    selectedNodes.value = ["" + startEntry.id];
    selectedEdges.value = [];
  }
  loading.value = false;
}, { immediate: true });
</script>

<template>
  <section class="wrapper">
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
  </section>
</template>

<style scoped>
.wrapper {
  min-height: 180px;
  overflow: hidden;
}
.tooltip {
  position: absolute;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 5px;
  border: 1px solid black;
  font-size: 12px;
}
</style>
