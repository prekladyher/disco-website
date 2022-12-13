import { useConversationStore } from "@/stores/conversation";
import type { FixablePosition, VNetworkGraphInstance } from "v-network-graph";
import type { Ref } from "vue";

export function focusPoint(graph: VNetworkGraphInstance|undefined, zoomLevel: number, point: FixablePosition) {
  if (!graph) {
    return;
  }
  const sizes = graph.getSizes();
  const shift = graph.translateFromDomToSvgCoordinates({
    x: sizes.width / 4,
    y: sizes.height / 2
  });
  graph.panBy({
    x: zoomLevel * (shift.x - point.x),
    y: zoomLevel * (shift.y - point.y)
  });
}

export function focusPointAsync(
  graph: Ref<VNetworkGraphInstance|undefined>,
  zoomLevel: Ref<number>,
  point: FixablePosition
): Promise<undefined> {
  return new Promise(resolve => {
    setTimeout(() => {
      focusPoint(graph.value, zoomLevel.value, point);
      resolve(undefined);
    });
  })
}

export function useUpdateCurrentEntry(nodes: Ref<string[]>, edges: Ref<string[]>) {
  const conversationStore = useConversationStore();
  return () => {
    if (nodes.value.length && !edges.value.length) {
      const entry = conversationStore.conversation?.entriesById.get(+nodes.value[0]);
      conversationStore.updateCurrentEntry(entry);
    } else if (edges.value.length && !nodes.value.length) {
      const entryId = edges.value[0].split("_")[0];
      const entry = conversationStore.conversation?.entriesById.get(+entryId);
      conversationStore.updateCurrentEntry(entry);
    } else if (!edges.value.length && !nodes.value.length) {
      conversationStore.updateCurrentEntry(undefined);
    }
  }
}
