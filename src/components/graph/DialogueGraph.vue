<script setup lang="ts">
import { useConversationStore, type ConversationModel } from "@/stores/conversation";
import { useDialogueGraphStore } from "@/stores/dialogueGraph";
import { storeToRefs } from "pinia";
import type { EventHandlers, VNetworkGraphInstance } from "v-network-graph";
import { reactive, ref, watch, type PropType } from "vue";
import { configs } from "./config";
import { focusNodeAsync, updateCurrentEntry } from "./utils";

const props = defineProps({
  conversation: {
    type: Object as PropType<ConversationModel>
  }
});

const { currentEntry } = storeToRefs(useConversationStore());

const dialogueGraphStore = useDialogueGraphStore();
const { loading, nodes, edges, layouts, zoomLevel } = storeToRefs(dialogueGraphStore);

const nodeGraph = ref<VNetworkGraphInstance>();

const selectedNodes = ref<string[]>([]);
const selectedEdges = ref<string[]>([]);

const eventHandlers: EventHandlers = reactive({});
eventHandlers["node:select"] = () => updateCurrentEntry(selectedNodes, selectedEdges);
eventHandlers["edge:select"] = () => updateCurrentEntry(selectedNodes, selectedEdges);

async function gotoNode(id: string) {
  await focusNodeAsync(nodeGraph.value, id);
  selectedNodes.value = [id];
  selectedEdges.value = [];
}

async function syncCurrentEntry() {
  if (!currentEntry.value || dialogueGraphStore.id !== currentEntry.value.conversationID) {
    return; // no entry or incorrect graph loaded
  }
  const nodeId = "" + currentEntry.value.id;
  if (nodes.value[nodeId] && selectedNodes.value.indexOf(nodeId) < 0) {
    await gotoNode(nodeId);
  }
}

watch(() => props.conversation, async conversation => {
  loading.value = true;
  selectedNodes.value = [];
  selectedEdges.value = [];
  dialogueGraphStore.loadConversation(conversation);
  await syncCurrentEntry();
  loading.value = false;
}, { immediate: true });

watch(currentEntry, async () => {
  await syncCurrentEntry();
});
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
</style>
