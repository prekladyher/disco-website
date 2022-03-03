import type { DialogueEntryType } from "@/types";
import { defineStore } from "pinia";
import type { Edges, Layouts, Nodes } from "v-network-graph";
import type { ConversationModel } from "./conversation";

/**
 * Determine if the given dialogue entry should be visible in the graph.
 */
 export function isEntryVisible(entry: DialogueEntryType) {
  // Ignore untyped START input entries
  if (entry.fields.DialogueEntryType === undefined) {
    return entry.fields.Title !== "input";
  }
  // Always show terminal entries
  if (!entry.outgoingLinks) {
    return true;
  }
  // Render entries with external links
  if (entry.outgoingLinks.some(link => link.originConversationID !== link.destinationConversationID)) {
    return true;
  }
  // Ignore internal FORK conditions
  return (entry.fields.DialogueEntryType !== "Fork" || !entry.conditionsString);
}

/**
 * Resolve graph edges from the given dialogue entry.
 */
export function resolveEdges(conversation: ConversationModel, originId: number): DialogueEntryType[][] {
  const origin = conversation.entriesById.get(originId);
  if (!origin?.outgoingLinks) {
    return []; // No outgoing links defined
  }
  if (origin.fields.DialogueEntryType === "Jump") {
    return []; // JUMP links are not rendered
  }
  const paths: DialogueEntryType[][] = [];
  for (let link of origin.outgoingLinks) {
    // External links can not be represented as edges
    if (link.originConversationID !== link.destinationConversationID) {
      continue;
    }
    // Get destination dialogue entry
    const destination = conversation.entriesById.get(link.destinationDialogueID);
    if (!destination) {
      throw new Error(`Invalid link destination: ${JSON.stringify(link)}`);
    }
    // Resolve paths through invisible entries
    if (!isEntryVisible(destination)) {
      for (let subpath of resolveEdges(conversation, destination.id)) {
        paths.push([destination, ...subpath]);
      }
    } else {
      paths.push([destination]);
    }
  }
  return paths;
}

/**
 * Define graph nodes and edges.
 */
 export function defineGraph(conversation: ConversationModel) {
  const nodes: Nodes = {};
  const edges: Edges = {};
  for (let entry of conversation.entriesById.values()) {
    if (!isEntryVisible(entry)) {
      continue; // ignore invisible entries
    }
    nodes[entry.id] = {
      name: entry.fields.Title || ("" + entry.id),
      ...entry
    };
    for (let path of resolveEdges(conversation, entry.id)) {
      edges[entry.id + "_" + path.map(it => it.id).join("_")] = {
        source: "" + entry.id,
        target: "" + path[path.length - 1].id,
        path: path
      };
    }
  }
  
  const layouts: Layouts = { nodes: {} };
  for (let entry of conversation.entriesById.values()) {
    let { x, y } = entry.canvasRect;
    // Fix unpositionined (START) nodes
    if (x === 0 && y === 0) {
      const targets = resolveEdges(conversation, entry.id).map(path => path[path.length - 1]);
      if (targets.length) {
        x = Math.min(...targets.map(it => it.canvasRect.x)) - 300;
        y = targets.map(it => it.canvasRect.y).reduce((acc, it) => acc + it) / targets.length;
      }
    }
    layouts.nodes[entry.id] = { x, y };
  };

  return { nodes, edges, layouts };
}

export const useDialogueGraphStore = defineStore({
  id: "dialogueGraph",
  state: () => {
    return {
      debug: false,
      nodes: {} as Nodes,
      edges: {} as Edges,
      layouts: {
        nodes: {}
      } as Layouts
    };
  },
  actions: {
    load(conversation: ConversationModel) {
      Object.keys(this.nodes).forEach(id => delete this.nodes[id]);
      Object.keys(this.edges).forEach(id => delete this.edges[id]);
      Object.keys(this.layouts.nodes).forEach(id => delete this.layouts.nodes[id]);
      if (conversation) {
        const graphModel = defineGraph(conversation);
        Object.assign(this.nodes, graphModel.nodes);
        Object.assign(this.edges, graphModel.edges);
        Object.assign(this.layouts.nodes, graphModel.layouts.nodes);
      }
    }
  }
});
