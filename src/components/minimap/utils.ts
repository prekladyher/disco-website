import type { ViewBox } from "@/stores/dialogueGraph";
import type { VNetworkGraphInstance } from "v-network-graph";

export function getViewportPath(viewBox: ViewBox, minimap: VNetworkGraphInstance) {
  const svgPanZoom = minimap.svgPanZoom;
  if (!svgPanZoom) {
    return "";
  }
  const viewArea = svgPanZoom.getViewArea().box;
  let backdrop =
    `M${viewArea.left},${viewArea.top}` +
    `h${viewArea.right - viewArea.left} v${viewArea.bottom - viewArea.top} h${viewArea.left - viewArea.right} z`;
  let visible = `M${-viewBox.x},${-viewBox.y} v${viewBox.height} h${viewBox.width} v${-viewBox.height} z`;
  return backdrop + " " + visible;
}
