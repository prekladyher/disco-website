import { useConversationStore } from "@/stores/conversation";
import { useDialogueGraphStore } from "@/stores/dialogueGraph";
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

export function updateCurrentEntry(nodes: Ref<string[]>, edges: Ref<string[]>) {
  const conversationStore = useConversationStore();
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

export function useUpdateViewBox(nodeGraph: Ref<VNetworkGraphInstance|undefined>, delay = 0) {
  const dialogueGraphStore = useDialogueGraphStore();
  let debounceId = 0;
  return () => {
    if (debounceId) {
      clearTimeout(debounceId);
    }
    debounceId = setTimeout(() => {
      dialogueGraphStore.updateViewBox(nodeGraph.value)
      debounceId = 0;
    }, delay);
  };
}
