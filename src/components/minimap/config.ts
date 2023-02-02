import { useConversationStore } from "@/stores/conversation";
import { useLanguageStore } from "@/stores/language";
import { storeToRefs } from "pinia";
import { defineConfigs, type Node } from "v-network-graph";

export function useMinimapConfigs() {

  const { conversation } = storeToRefs(useConversationStore());
  const languageStore = useLanguageStore();

  const nodeColor = (node: Node) => {
    const fields = conversation.value?.entriesById.get(parseInt(node.id))?.fields;
    const target = fields ? languageStore.activeStrings?.[`Dialogue Text/${fields["Articy Id"]}`]?.target : undefined;
    return node.selected ? "#ee0000" : (target ? "#008800" : "#666666");
  };

  return defineConfigs({
    view: {
      panEnabled: false,
      zoomEnabled: false,
      maxZoomLevel: 1,
      minZoomLevel: 0.001,
      doubleClickZoomEnabled: false,
      autoPanAndZoomOnLoad: false
    },
    node: {
      selectable: 0,
      draggable: false,
      normal: {
        radius: node => node.selected ? 4 : 1,
        color: nodeColor,
      },
      label: {
        visible: false
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
    },
    path: {
      visible: true,
      normal: {
        color: "#ee0000",
        width: 2
      }
    }
  });
}
