<script setup lang="ts">
import { useConversationStore, type ConversationModel } from "@/stores/conversation";
import { definePaths, useDialogueGraphStore } from "@/stores/dialogueGraph";
import { debounce } from "@/utils";
import { storeToRefs } from "pinia";
import type { EventHandlers, VNetworkGraphInstance } from "v-network-graph";
import { reactive, ref, toRaw, watch } from "vue";
import { configs } from "./config";
import DialogueGraphNode from "./DialogueGraphNode.vue";
import { focusPointAsync, useUpdateCurrentEntry } from "./utils";

const props = defineProps<{
  conversation?: ConversationModel
}>();

const { currentEntry, activePath } = storeToRefs(useConversationStore());

const dialogueGraphStore = useDialogueGraphStore();
const { loading, nodes, edges, paths, layouts, zoomLevel } = storeToRefs(dialogueGraphStore);

const nodeGraph = ref<VNetworkGraphInstance>();

defineExpose({
  nodeGraph
});

const selectedNodes = ref<string[]>([]);
const selectedEdges = ref<string[]>([]);

const updateCurrentEntry = useUpdateCurrentEntry(selectedNodes, selectedEdges);
watch([selectedNodes, selectedEdges], updateCurrentEntry, { flush: 'post' });

const eventHandlers: EventHandlers = reactive({});

const { handler: updateViewBox } = debounce(() => dialogueGraphStore.updateViewBox(nodeGraph.value));
eventHandlers["view:pan"] = updateViewBox;
eventHandlers["view:zoom"] = updateViewBox;

async function gotoNode(id: string) {
  await focusPointAsync(nodeGraph, zoomLevel, toRaw(layouts.value.nodes[id]));
  selectedNodes.value = [id];
  selectedEdges.value = [];
}

async function syncCurrentEntry() {
  if (!currentEntry.value || dialogueGraphStore.id !== currentEntry.value.conversationID) {
    return; // no entry or incorrect graph loaded
  }
  const nodeId = "" + currentEntry.value.id;
  if (nodes.value[nodeId]) {
    nodes.value[nodeId].selected = true;
    // don't focus when already selected (focus only for external event)
    if (selectedNodes.value.indexOf(nodeId) < 0 && !selectedEdges.value?.[0]?.startsWith(nodeId + "_")) {
      await gotoNode(nodeId);
    }
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

watch(currentEntry, async (newEntry, oldEntry) => {
  if (oldEntry !== undefined && nodes.value[oldEntry.id]) {
    nodes.value[oldEntry.id].selected = false;
  }
  await syncCurrentEntry();
});

watch(activePath, entries => {
  Object.keys(paths.value).forEach(key => delete paths.value[key]);
  definePaths(entries).forEach((path, idx) => paths.value["" + idx] = path);
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
      :paths="paths"
      :event-handlers="eventHandlers"
    >
      <template #override-node="nodeProps">
        <DialogueGraphNode
          :key="conversation?.id + '_' + nodeProps.nodeId"
          v-bind="nodeProps"
        ></DialogueGraphNode>
      </template>
    </v-network-graph>
  </section>
</template>

<style scoped>
.wrapper {
  overflow: hidden;
}
</style>
