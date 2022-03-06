<script setup lang="ts">
import type { ConversationModel } from "@/stores/conversation";
import { findStartEntry, useDialogueGraphStore } from "@/stores/dialogueGraph";
import { ref } from "@vue/reactivity";
import { storeToRefs } from "pinia";
import type { EventHandlers, VNetworkGraphInstance } from "v-network-graph";
import { reactive, watch, type PropType } from "vue";
import { useRouter } from "vue-router";
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

const router = useRouter();
async function gotoNode(id: string) {
  await focusNodeAsync(nodeGraph.value, "" + id);
  selectedNodes.value = ["" + id];
  selectedEdges.value = [];
}

watch(() => props.conversation, async conversation => {
  loading.value = true;
  selectedNodes.value = [];
  selectedEdges.value = [];
  dialogueGraphStore.loadConversation(conversation);
  if (conversation) {
    let focusId = router.currentRoute.value.query.entryId;
    if (typeof focusId !== "string" || !nodes.value[focusId]) {
      focusId = "" + findStartEntry(conversation).id;
    }
    await gotoNode(focusId); 
  }
  loading.value = false;
}, { immediate: true });

watch(() => router.currentRoute.value.query.entryId, async entryId => {
  if (typeof entryId === "string" && nodes.value[entryId]) {
    await gotoNode(entryId);
  }
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
.tooltip {
  position: absolute;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 5px;
  border: 1px solid black;
  font-size: 12px;
}
</style>
