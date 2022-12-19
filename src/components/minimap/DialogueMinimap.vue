<script setup lang="ts">
import { useDialogueGraphStore } from "@/stores/dialogueGraph";
import { watchOnce } from "@vueuse/shared";
import { storeToRefs } from "pinia";
import type { Layers, VNetworkGraphInstance } from "v-network-graph";
import { computed, ref } from "vue";
import type DialogueGraph from "../graph/DialogueGraph.vue";
import IconClose from "../icons/IconClose.vue";
import IconMap from "../icons/IconMap.vue";
import ToggleIcon from "../shared/ToggleIcon.vue";
import { configs } from "./config";
import { getViewportPath, useFitOnLoad, useViewportMove } from "./utils";


const props = defineProps<{
  graph: InstanceType<typeof DialogueGraph>|null
}>();

const { nodes, edges, paths, layouts, viewBox } = storeToRefs(useDialogueGraphStore());

const wrapper = ref<Element>();
const minimap = ref<VNetworkGraphInstance>();

const viewportPath = computed(() => {
  return viewBox.value ? getViewportPath(viewBox.value) : ""
});

const moving = ref(false);
const { handleMove } = useViewportMove(
  wrapper,
  minimap,
  computed(() => props.graph?.nodeGraph )
);
watchOnce(wrapper, (element) => {
  element?.addEventListener("pointermove", event => moving.value && handleMove(event));
  element?.addEventListener("pointerdown", (event) => {
    moving.value = true;
    handleMove(event);
  });
  element?.addEventListener("pointerout", () => moving.value = false);
});

useFitOnLoad(minimap);

const minimapActive = ref(false);

const layers: Layers = {
  viewport: "background"
};
</script>

<template>
  <div class="minimap-wrapper" :class="{ active: minimapActive }">
    <div class="minimap" ref="wrapper">
      <v-network-graph
        ref="minimap"
        :class="{ loaded: true }"
        :configs="configs"
        :nodes="nodes"
        :layouts="layouts"
        :edges="edges"
        :paths="paths"
        :layers="layers"
      >
        <template #viewport>
          <path
            fill="currentColor"
            :d="viewportPath"
          />
        </template>
      </v-network-graph>
      <div class="overlay" ref="overlay"></div>
    </div>
    <ToggleIcon v-model="minimapActive" title="toggle minimap" class="toggle-minimap">
      <IconMap v-if="!minimapActive" />
      <IconClose v-if="minimapActive" />
    </ToggleIcon>
  </div>
</template>

<style scoped>
.minimap-wrapper {
  position: absolute;
  top: 12px;
  right: 12px;
  border: 2px solid var(--color-border);
  background: var(--color-background-soft);
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

.minimap > .v-network-graph {
  opacity: 0;
  color: var(--color-border);
}

.active > .minimap > .v-network-graph {
  opacity: 1;
}

.minimap {
  width: 400px;
  aspect-ratio: 16 / 9;
  max-width: 80vw;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

.toggle-minimap {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
