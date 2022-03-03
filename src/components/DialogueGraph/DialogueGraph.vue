<script setup lang="ts">
import type { ConversationModel } from "@/stores/conversation";
import { useDialogueGraphStore } from "@/stores/dialogueGraph";
import { ref } from "@vue/reactivity";
import { storeToRefs } from "pinia";
import type { EventHandlers, Node, VNetworkGraphInstance } from "v-network-graph";
import { watch, type PropType } from "vue";
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
  <DialogueGraphTooltip v-if="debug" :node="currentNode" />
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
