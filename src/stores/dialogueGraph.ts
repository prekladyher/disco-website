import type { DialogueEntryType, DialogueLinkType } from "@/types";
import { defineStore } from "pinia";
import type { Layouts, Path, VNetworkGraphInstance } from "v-network-graph";
import type { ConversationModel } from "./conversation";

/**
 * Dialogue graph node type.
 */
export interface NodeType {

  /**
   * Node identifier.
   */
  id: string;

  /**
   * Dialogue entry type.
   */
  type?: string;

  /**
   * Short node title.
   */
  name: string;

  /**
   * Node width.
   */
  width: number;

  /**
   * Node height.
   */
  height: number;

  /**
   * Flag indicating the node represents parent entry.
   */
  parent: boolean;

  /**
   * Flag indicating the node is in selected state.
   */
  selected: boolean;

  /**
   * Flag indicating node represents jump to a different conversation.
   */
  external: boolean;

}

/**
 * Dialogue graph edge type.
 */
export interface EdgeType {

  /**
   * Unique edge identifier.
   */
  id: string;

  /**
   * Source node identifier.
   */
  source: string;

  /**
   * Target node identifier.
   */
  target: string;

}

/**
 * Graph canvas view box.
 */
export interface ViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Check if the dialogue entry is parent to have child nodes.
 */
function isParentEntry(entry: DialogueEntryType): boolean {
  if (entry.id === 0) {
    return true; // START node is parent for input entry
  }
  // Fork entry with input port is parent for fork output entries
  return entry.fields?.DialogueEntryType === "Fork" && !!entry.fields?.InputId;
}

/**
 * Check if the dialogue entry is supposed to be child node.
 */
function isChildEntry(entry: DialogueEntryType): boolean {
  if (entry.id === 1 && entry.fields?.Title === "input") {
    return true; // Conversation input is child of START node
  }
  // Fork output entries are children of fork input entry
  return entry.fields?.DialogueEntryType === "Fork" && !entry.fields?.InputId;
}

/**
 * Check if the dialogue link leads to a different conversation.
 */
function isInternalLink(link: DialogueLinkType): boolean {
  return link.destinationConversationID === link.originConversationID;
}

/**
 * Calculate preferred node width.
 */
 function calcNodeWidth(entry: DialogueEntryType) {
  const type = entry.fields.DialogueEntryType;
  return type === "Hub" ? 160 : 250;
}

/**
 * Calculate preferred node height.
 */
function calcNodeHeight(entry: DialogueEntryType) {
  const type = entry.fields.DialogueEntryType;
  if (type === "Hub") {
    return 50;
  } else if (type === "Jump") {
    return 80;
  }
  const text = entry.fields["Dialogue Text"];
  if (text) {
    return 0
      + /* BORDER */ 6
      + /* HEADER */ 25
      + /* PADDING */ 10
      + /* LINE */ 18 * Math.ceil(text.length / 30 + 0.25);
  }
  return 100;
}

/**
 * Define graph node based on the given dialogue entry.
 */
function defineNode(entry: DialogueEntryType): NodeType {
  const fields = entry.fields;
  return {
    id: "" + entry.id,
    type: fields.DialogueEntryType,
    name: fields.Title || fields.annotation_title || fields.annotation_text || "",
    width: calcNodeWidth(entry),
    height: calcNodeHeight(entry),
    parent: isParentEntry(entry),
    selected: false,
    external: entry.outgoingLinks?.some(it => it.destinationConversationID !== entry.conversationID) || false
  };
}

/**
 * Define graph edges from the given dialogue entry.
 */
function defineEdges(conversation: ConversationModel, entry: DialogueEntryType, origin: DialogueEntryType): Record<string, EdgeType> {
  if (!entry.outgoingLinks || entry.fields?.DialogueEntryType === "Jump") {
    return {};
  }
  // Resolve child output links
  if (isParentEntry(entry)) {
    const edges = entry.outgoingLinks
      .filter(isInternalLink)
      .map(link => conversation.entriesById.get(link.destinationDialogueID))
      .map(output => output ? defineEdges(conversation, output, entry) : {});
    return Object.assign({}, ...edges);
  }
  // Resolve standard entry
  const edges = entry.outgoingLinks.map((link, idx) => ({ idx, link }))
    .filter(({ link }) => isInternalLink(link))
    .map(({ idx, link }) => {
      return {
        id: link.originDialogueID + "_" + idx,
        source: "" + origin.id,
        target: "" + link.destinationDialogueID
      };
    });
  return Object.fromEntries(edges.map(edge => [edge.id, edge]));
}

/**
 * Fix position of START node (it is originally not positioned in the graph).
 */
function fixStartPosition(conversation: ConversationModel) {
  const targets = conversation.entriesById.get(1)?.outgoingLinks
    ?.filter(isInternalLink)
    ?.map(link => conversation.entriesById.get(link.destinationDialogueID))
    ?.filter((entry): entry is DialogueEntryType => !!entry) || [];
  if (!targets.length) {
    return { x: 0, y: 0 };
  }
  const x = Math.min(...targets.map(it => it.canvasRect.x)) - 300;
  const y = targets.map(it => it.canvasRect.y).reduce((acc, it) => acc + it) / targets.length;
  return { x, y };
}

/**
 * Define graph nodes and edges.
 */
 export function defineGraph(conversation: ConversationModel) {
  const nodes: Record<string, NodeType> = {};
  const edges: Record<string, EdgeType> = {};

  // Get valid entries for nodes
  const entries = Array.from(conversation.entriesById.values())
    .filter(entry => !isChildEntry(entry));

  // Define nodes and edges
  entries.forEach(entry => {
    nodes[entry.id] = defineNode(entry);
    Object.assign(edges, defineEdges(conversation, entry, entry));
  });

  // Define node positions
  const layouts: Layouts = { nodes: {} };
  entries.forEach(entry => {
    let position = {
      x: entry.canvasRect.x,
      y: entry.canvasRect.y
    };
    if (entry.id === 0 && position.x === 0 && position.y === 0) {
      position = { ...fixStartPosition(conversation) };
    }
    layouts.nodes[entry.id] = position;
  });
  return { nodes, edges, layouts };
}

/**
 * Define graph paths for the given dialogue entry path.
 */
export function definePaths(entries: DialogueEntryType[]): Path[] {
  const edgeIds = [];
  for (let i = 0; i < entries.length - 1; i++) {
    const entry = entries[i];
    if (isParentEntry(entry)) {
      continue; // parents don't have outgoing links
    }
    if (entry.fields?.DialogueEntryType === "Jump") {
      // Split path on jump entry
      return [{ edges: edgeIds }, ...definePaths(entries.slice(i + 1))];
    }
    const nextIdx = entry.outgoingLinks?.findIndex(it => {
      return it.destinationConversationID == entry.conversationID
          && it.destinationDialogueID == entries[i + 1].id;
    });
    edgeIds.push(`${entry.id}_${nextIdx}`);
  }
  return [{ edges: edgeIds }];
}

/**
 * Use dialogue graph store.
 */
export const useDialogueGraphStore = defineStore({
  id: "dialogueGraph",
  state: () => {
    return {

      /**
       * Flag indicating that the graph data is being loaded.
       */
      loading: false,

      /**
       * Identifier of the currently loaded conversation.
       */
      id: undefined as number|undefined,

      /**
       * Graph node data.
       */
      nodes: {} as Record<string, NodeType>,

      /**
       * Graph edge data.
       */
      edges: {} as Record<string, EdgeType>,

      /**
       * Graph layout data.
       */
      layouts: {
        nodes: {}
      } as Layouts,

      /**
       * Graph path data.
       */
      paths: {} as Record<string, Path>,

      /**
       * Current graph zoom level.
       */
      zoomLevel: 0.8,

      /**
       * Current graph view box (in graph coordinates).
       */
      viewBox: undefined as ViewBox|undefined,

    };
  },
  actions: {

    /**
     * Load graph data for the given conversation or unload the current data.
     */
    loadConversation(conversation?: ConversationModel) {
      this.id = undefined;
      Object.keys(this.nodes).forEach(id => delete this.nodes[id]);
      Object.keys(this.edges).forEach(id => delete this.edges[id]);
      Object.keys(this.layouts.nodes).forEach(id => delete this.layouts.nodes[id]);
      this.zoomLevel = 0.8;
      if (conversation) {
        this.id = conversation.id;
        const graphModel = defineGraph(conversation);
        Object.assign(this.nodes, graphModel.nodes);
        Object.assign(this.edges, graphModel.edges);
        Object.assign(this.layouts.nodes, graphModel.layouts.nodes);
      }
    },

    /**
     * Update view box data based on the given graph instance.
     */
    updateViewBox(graph: VNetworkGraphInstance|undefined) {
      const viewArea = graph?.getViewBox();
      if (!viewArea) {
        this.viewBox = undefined;
      } else {
        this.viewBox = {
          x: -viewArea.left,
          y: -viewArea.top,
          width: viewArea.right - viewArea.left,
          height: viewArea.bottom - viewArea.top
        };
      }
    }

  }
});
