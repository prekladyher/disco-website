<script setup lang="ts">
import type { ConversationModel } from "@/stores/conversation";
import { useDialogueGraphStore } from "@/stores/dialogueGraph";
import type { DialogueEntryType } from "@/types";
import { ref } from "@vue/reactivity";
import { storeToRefs } from "pinia";
import type { EventHandlers, FixablePosition, Node, Point, VNetworkGraphInstance } from "v-network-graph";
import { reactive, watch, type PropType } from "vue";
import DialogueGraphTooltip from "../DialogueGraphTooltip.vue";
import { configs } from "./config";

const props = defineProps({
  conversation: {
    type: Object as PropType<ConversationModel>,
    required: true
  }
});

const dialogueGraphStore = useDialogueGraphStore();
watch(() => props.conversation, conversation => {
  dialogueGraphStore.load(conversation);
}, { immediate: true });

const { debug, nodes, edges, layouts } = storeToRefs(dialogueGraphStore);

const nodeGraph = ref<VNetworkGraphInstance>();
const eventHandlers: EventHandlers = reactive({});

const hoverEntries = ref<DialogueEntryType[]>([]);
eventHandlers["node:pointerover"] = ({ node }) => {
  if (debug.value) {
    const entry = props.conversation.entriesById.get(+node);
    hoverEntries.value = entry ? [entry] : [];
  }
};
eventHandlers["node:pointerout"] = ({}) => {
  hoverEntries.value = [];
};
eventHandlers["edge:pointerover"] = ({ edges }) => {
  if (debug.value) {
    const entryIds = edges[0].split("_").slice(1, -1);
    hoverEntries.value = entryIds.map(id => props.conversation.entriesById.get(+id)) as DialogueEntryType[];
  }
};
eventHandlers["edge:pointerout"] = ({}) => {
  hoverEntries.value = [];
};

const zoomLevel = ref(0.75)

eventHandlers["node:click"] = ({ node }) => {
  const graph = nodeGraph.value;
  if (!graph || !graph.layouts?.nodes?.[node]) {
    return;
  }
  const { x, y } = graph.layouts.nodes[node] as FixablePosition;
  const sizes = graph.getSizes();
  const focusPoint = graph.translateFromDomToSvgCoordinates({
    x: sizes.width / 4,
    y: sizes.height / 2
  });
  graph.panBy({
    x: zoomLevel.value * (focusPoint.x - x),
    y: zoomLevel.value * (focusPoint.y - y)
  });
};
</script>

<template>
  <v-network-graph
    ref="nodeGraph"
    v-model:zoom-level="zoomLevel"
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
