<script setup lang="ts">
import { useConversationStore } from "@/stores/conversation";
import { useDialogueGraphStore } from "@/stores/dialogueGraph";
import { storeToRefs } from "pinia";
import { defineConfigs, type VNetworkGraphInstance } from "v-network-graph";
import { ref, watch } from "vue";
import IconClose from "./icons/IconClose.vue";
import IconMap from "./icons/IconMap.vue";

const { nodes, edges, layouts } = storeToRefs(useDialogueGraphStore());

const graph = ref<VNetworkGraphInstance>();

const { conversation } = storeToRefs(useConversationStore());

const loadTimer = ref(0);
watch(conversation, () => {
  if (loadTimer.value) {
    clearTimeout()
  }
  loadTimer.value = setTimeout(() => {
    graph.value?.panToCenter();
    graph.value?.fitToContents();
    loadTimer.value = 0;
  });
}, { immediate: true });

const configs = defineConfigs({
  view: {
    fit: true,
    panEnabled: false,
    zoomEnabled: false,
    maxZoomLevel: 1,
    minZoomLevel: 0.001,
    doubleClickZoomEnabled: false
  },
  node: {
    selectable: 0,
    draggable: false,
    normal: {
      radius: node => node.selected ? 4 : 1,
      color: node => node.selected ? "#ee0000" : "#666666",
    },
    label: {
      visible: false
    },
    zOrder: {
      enabled: true,
      zIndex: node => node.selected ? 1 : 0
    }
  },
  edge: {
    selectable: 0,
    margin: 1,
    summarize: false,
    normal: {
      width: 1,
      color: "#999999"
    },
    hover: {
      width: 1,
      color: "#999999"
    },
  }
});

const minimapActive = ref(false);
function toggleMinimap() {
  minimapActive.value = !minimapActive.value;
}
</script>

<template>
  <div class="minimap-wrapper" :class="{ active: minimapActive }">
    <div class="minimap">
      <v-network-graph
        v-if="minimapActive"
        ref="graph"
        :class="{ loaded: loadTimer === 0 }"
        :configs="configs"
        :nodes="nodes"
        :layouts="layouts"
        :edges="edges"
      >
      </v-network-graph>
    </div>
    <a class="action-icon" @click="toggleMinimap()">
      <IconMap v-if="!minimapActive" />
      <IconClose v-if="minimapActive" />
    </a>
  </div>
</template>

<style scoped>
.minimap-wrapper {
  position: absolute;
  top: 12px;
  right: 12px;
  border: 2px solid #cccccc;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 18px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 2px;
  overflow: hidden;
  width: 36px;
  aspect-ratio: 1 / 1;
  transition-property: width height aspect-ratio;
  transition: all 200ms ease;
}

.minimap-wrapper.active {
  width: 400px;
  height: auto;
  aspect-ratio: 16 / 9;
  max-width: 80vw;
}

.minimap {
  width: 400px;
  aspect-ratio: 16 / 9;
  max-width: 80vw;
}

.action-icon {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  height: 32px;
  width: 32px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
</style>
