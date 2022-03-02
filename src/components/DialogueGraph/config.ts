import type { UserConfigs } from "v-network-graph";

function getNodeColor(node: any) {
  switch (node.fields?.DialogueEntryType) {
    case "Hub": return "#333333";
    case "DialogueFragment": return "#44aa66";
    case "Fork": return "#666666";
    case "Jump": return "#d0c66c";
    case "Instruction": return "#aa3333";
    default: return "red";
  }
}

export const configs: UserConfigs = {
  view: {
    scalingObjects: true,
    fit: true,
  },
  node: {
    normal: {
      type: (node) => node.fields.Title === "START" ? "circle" : "rect",
      radius: 35,
      width: 70,
      height: 70,
      color: getNodeColor,
    },
    hover: {
      color: getNodeColor
    },
    label: {
      fontSize: 15
    }
  },
  edge: {
    normal: {
      color: "#888"
    },
    marker: {
      target: {
        type: "arrow",
      }
    }
  }
};
