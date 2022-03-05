import { defineConfigs, type Node, type NodeConfig } from "v-network-graph";
import type { RecursivePartial } from "v-network-graph/lib/common/common";
import type { SvgPanZoomInstance } from "v-network-graph/lib/modules/svg-pan-zoom-ex";

function getNodeColor(node: any) {
  switch (node?.fields?.DialogueEntryType) {
    case "Hub": return "#333333";
    case "DialogueFragment": return "#44aa66";
    case "Fork": return "#666666";
    case "Jump": return "#d0c66c";
    case "Instruction": return "#aa3333";
    default: return "#333333";
  }
}

const NODE_STYLE: RecursivePartial<NodeConfig> = {
  normal: {
    type: (node: Node) => node?.fields?.DialogueEntryType ? "rect" : "circle",
    radius: 35,
    width: 70,
    height: 70,
    borderRadius: 4,
    color: getNodeColor
  }
};

export const configs = defineConfigs({
  view: {
    scalingObjects: true,
    minZoomLevel: 0.05,
    maxZoomLevel: 3,
  },
  node: {
    selectable: 1,
    normal: {
      ...NODE_STYLE.normal
    },
    selected: {
      ...NODE_STYLE.normal,

    },
    hover: {
      ...NODE_STYLE.normal
    },
    focusring: {
      visible: true,
      width: 5,
      padding: 3,
      color: "#ed1a00",
      dasharray: "4"
    },
    label: {
      fontSize: 15
    }
  },
  edge: {
    selectable: 1,
    normal: {
      color: "#666666",
      width: 3
    },
    selected: {
      color: "#ed1a00",
      animate: true,
      animationSpeed: 10,
      width: 5
    },
    hover: {
      color: "#666666"
    },
    marker: {
      target: {
        type: "arrow",
      }
    }
  }
});
