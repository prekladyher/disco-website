<script setup lang="ts">
import type { ConversationModel } from "@/stores/conversation";
import { useDialogueGraphStore } from "@/stores/dialogueGraph";
import { ref } from "@vue/reactivity";
import { storeToRefs } from "pinia";
import type { EventHandlers, VNetworkGraphInstance } from "v-network-graph";
import { reactive, watch, type PropType } from "vue";
import { useRouter } from "vue-router";
import { configs } from "./config";
import { focusNodeAsync, updateCurrentEntry } from "./utils";

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
eventHandlers["node:select"] = () => updateCurrentEntry(selectedNodes, selectedEdges);
eventHandlers["edge:select"] = () => updateCurrentEntry(selectedNodes, selectedEdges);

const router = useRouter();
async function gotoNode(id: string) {
  await focusNodeAsync(nodeGraph.value, id);
  selectedNodes.value = [id];
  selectedEdges.value = [];
}

watch(() => props.conversation, async conversation => {
  loading.value = true;
  selectedNodes.value = [];
  selectedEdges.value = [];
  dialogueGraphStore.loadConversation(conversation);
  const focusId = router.currentRoute.value.query.entryId;
  if (typeof focusId === "string" && nodes.value[focusId]) {
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
</style>
