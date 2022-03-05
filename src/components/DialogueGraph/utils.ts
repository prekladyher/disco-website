import { useConversationStore } from "@/stores/conversation";
import { findStartEntry } from "@/stores/dialogueGraph";
import type { FixablePosition, VNetworkGraphInstance } from "v-network-graph";
import type { Ref } from "vue";

export function focusNode(graph: VNetworkGraphInstance|undefined, id: string|undefined) {
  if (!graph || !id || !graph.layouts?.nodes?.[id]) {
    return;
  }
  const { x, y } = graph.layouts.nodes[id] as FixablePosition;
  const sizes = graph.getSizes();
  const focusPoint = graph.translateFromDomToSvgCoordinates({
    x: sizes.width / 4,
    y: sizes.height / 2
  });
  graph.panBy({
    x: graph.zoomLevel * (focusPoint.x - x),
    y: graph.zoomLevel * (focusPoint.y - y)
  });
}

export function focusNodeAsync(graph: VNetworkGraphInstance|undefined, id: string|undefined): Promise<undefined> {
  return new Promise(resolve => {
    setTimeout(() => {
      focusNode(graph, id);
      resolve(undefined);
    });
  })
}
