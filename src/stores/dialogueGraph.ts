import type { DialogueEntryType, DialogueLinkType } from "@/types";
import { defineStore } from "pinia";
import type { Layouts, Path, VNetworkGraphInstance } from "v-network-graph";
import type { ConversationModel } from "./conversation";

export interface NodeType {
  id: string,
  type?: string,
  name: string,
  parent: boolean,
  selected: boolean,
  external: boolean
}

export interface EdgeType {
  id: string,
  source: string,
  target: string
}

export interface ViewBox {
  x: number,
  y: number,
  width: number,
  height: number
}

function isParentEntry(entry: DialogueEntryType): boolean {
  return entry.id === 0 || entry.fields?.DialogueEntryType === "Fork" && !!entry.fields?.InputId;
}

function isChildEntry(entry: DialogueEntryType): boolean {
  return entry.id === 1 && entry.fields?.Title === "input"
    || entry.fields?.DialogueEntryType === "Fork" && !entry.fields?.InputId;
}

function isInternalLink(link: DialogueLinkType): boolean {
  return link.destinationConversationID === link.originConversationID;
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
 * Define graph path for the given dialogue entry path.
 */
export function definePath(entries: DialogueEntryType[]): Path {
  const edgeIds = [];
  for (let i = 0; i < entries.length - 1; i++) {
    const entry = entries[i];
    if (isParentEntry(entry)) {
      continue; // parents don't have outgoing links
    }
    const nextIdx = entry.outgoingLinks?.findIndex(it => {
      return it.destinationConversationID == entry.conversationID
          && it.destinationDialogueID == entries[i + 1].id;
    });
    edgeIds.push(`${entry.id}_${nextIdx}`);
  }
  return { edges: edgeIds };
}

export const useDialogueGraphStore = defineStore({
  id: "dialogueGraph",
  state: () => {
    return {
      loading: false,
      id: undefined as number|undefined,
      nodes: {} as Record<string, NodeType>,
      edges: {} as Record<string, EdgeType>,
      layouts: {
        nodes: {}
      } as Layouts,
      paths: {} as Record<string, Path>,
      zoomLevel: 0.75,
      viewBox: undefined as ViewBox|undefined,
    };
  },
  actions: {
    loadConversation(conversation?: ConversationModel) {
      this.id = undefined;
      Object.keys(this.nodes).forEach(id => delete this.nodes[id]);
      Object.keys(this.edges).forEach(id => delete this.edges[id]);
      Object.keys(this.layouts.nodes).forEach(id => delete this.layouts.nodes[id]);
      this.zoomLevel = 0.75;
      if (conversation) {
        this.id = conversation.id;
        const graphModel = defineGraph(conversation);
        Object.assign(this.nodes, graphModel.nodes);
        Object.assign(this.edges, graphModel.edges);
        Object.assign(this.layouts.nodes, graphModel.layouts.nodes);
      }
    },
    updateViewBox(graph: VNetworkGraphInstance|undefined) {
      if (!graph || !graph.svgPanZoom) {
        this.viewBox = undefined;
      } else {
        const viewArea = graph.svgPanZoom.getViewArea();
        this.viewBox = {
          x: -viewArea.box.left,
          y: -viewArea.box.top,
          width: viewArea.box.right - viewArea.box.left,
          height: viewArea.box.bottom - viewArea.box.top
        };
      }
    }
  }
});
