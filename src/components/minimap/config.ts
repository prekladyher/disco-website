import { defineConfigs } from "v-network-graph";

export const configs = defineConfigs({
  view: {
    fit: true,
    panEnabled: false,
    zoomEnabled: false,
    maxZoomLevel: 1,
    minZoomLevel: 0.001,
    doubleClickZoomEnabled: false
  },
  node: {
    selectable: 0,
    draggable: false,
    normal: {
      radius: node => node.selected ? 4 : 1,
      color: node => node.selected ? "#ee0000" : "#666666",
    },
    label: {
      visible: false
    },
    zOrder: {
      enabled: true,
      zIndex: node => node.selected ? 1 : 0
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
  }
});