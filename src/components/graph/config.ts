import { defineConfigs, type Node, type NodeConfig } from "v-network-graph";
import type { RecursivePartial } from "v-network-graph/lib/common/common";

function getNodeColor(node: any) {
  switch (node.type) {
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
    type: (node: Node) => node.type ? "rect" : "circle",
    radius: 35,
    width: (node: Node) => node.width,
    height: (node: Node) => node.height,
    borderRadius: 4,
    strokeWidth: 0,
    strokeColor: "#ffffff",
    color: getNodeColor
  }
};

export const configs = defineConfigs({
  view: {
    scalingObjects: true,
    minZoomLevel: 0.05,
    maxZoomLevel: 3,
    doubleClickZoomEnabled: false
  },
  node: {
    selectable: 1,
    draggable: false,
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
      color: "#ed1a00"
    },
    label: {
      visible: false,
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
      dasharray: "none",
      width: 4
    },
    hover: {
      color: "#666666"
    },
    marker: {
      target: {
        type: "arrow",
      }
    }
  },
  path: {
    visible: true,
    curveInNode: true,
    end: "edgeOfNode",
    normal: {
      color: "#ff0000aa",
      animate: true,
      dasharray: "10"
    }
  }
});
