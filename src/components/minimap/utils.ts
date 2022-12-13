import { useDialogueGraphStore, type ViewBox } from "@/stores/dialogueGraph";
import { storeToRefs } from "pinia";
import type { VNetworkGraphInstance } from "v-network-graph";
import type { Box } from "v-network-graph/lib/modules/svg-pan-zoom-ex";
import type { Ref } from "vue";

export function getViewportPath(viewBox: ViewBox, viewArea: Box|undefined) {
  if (!viewArea) {
    return "";
  }
  let backdrop =
    `M${viewArea.left},${viewArea.top}` +
    `h${viewArea.right - viewArea.left} v${viewArea.bottom - viewArea.top} h${viewArea.left - viewArea.right} z`;
  let visible = `M${-viewBox.x},${-viewBox.y} v${viewBox.height} h${viewBox.width} v${-viewBox.height} z`;
  return {
    backdrop,
    viewport: backdrop + " " + visible
  };
}

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
