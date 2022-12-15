import { useDialogueGraphStore, type ViewBox } from "@/stores/dialogueGraph";
import { storeToRefs } from "pinia";
import type { VNetworkGraphInstance } from "v-network-graph";
import { watchEffect, type Ref } from "vue";


/**
 * Calculate viewport (i.e. dialogue graph view area) path.
 * @param viewBox Current dialogue graph view box.
 * @return Viewport path to dialogue graph draw view area in the minimap.
 */
export function getViewportPath(viewBox: ViewBox) {
  return `M${-viewBox.x},${-viewBox.y} v${viewBox.height} h${viewBox.width} v${-viewBox.height} z`
}

/**
 * Use minimap pointer events to move the viewport.
 */
export function useViewportMove(
    wrapper: Ref<Element|undefined>,
    minimap: Ref<VNetworkGraphInstance|undefined>,
    graph: Ref<VNetworkGraphInstance|undefined>) {
  const { zoomLevel } = storeToRefs(useDialogueGraphStore());
  const handleMove = (event: Event) => {
    if (!wrapper.value || !minimap.value || !graph.value) {
      return;
    }
    const pointerEvent = event as PointerEvent;
    if (!pointerEvent.buttons) {
      return; // no pointer
    }
    const offset = wrapper.value.getBoundingClientRect();
    const coords = minimap.value?.translateFromDomToSvgCoordinates({
      x: pointerEvent.pageX - offset.left,
      y: pointerEvent.pageY - offset.top
    });
    const nodeGraph = graph.value;
    const focusPoint = nodeGraph.translateFromDomToSvgCoordinates({
      x: nodeGraph.getSizes().width / 2,
      y: nodeGraph.getSizes().height / 2
    });
    nodeGraph.panBy({
      x: (focusPoint.x - coords.x) * zoomLevel.value,
      y: (focusPoint.y - coords.y) * zoomLevel.value
    });
  };
  return { handleMove };
}

/**
 * Fit minimap after new graph is loaded.
 */
export function useFitOnLoad(minimap: Ref<VNetworkGraphInstance|undefined>) {
  const { id: loadedId } = storeToRefs(useDialogueGraphStore());
  let activeId: number|undefined = undefined;
  return watchEffect(() => {
    // Minimap not yet loaded or already loaded
    if (!minimap.value || activeId === loadedId.value) {
      return;
    }
    minimap.value.panToCenter();
    minimap.value.fitToContents();
    activeId = loadedId.value;
  }, { flush: "post" });
}
