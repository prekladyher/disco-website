import type { ConversationModel } from "./stores/conversation";
import type { DialogueEntryType } from "./types";

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
