import type { ConversationModel } from "@/stores/conversation";
import type { DialogueEntryType } from "@/types";
import type { DialoguePathType, DialogueStepType } from "./types";

/**
 * Determine if the given dialogue entry is to be displayed as valid destination.
 */
export function isDestinationEntry(entry: DialogueEntryType) {
  // START and input entries are not a valid destination
  if (entry.fields.DialogueEntryType === undefined) {
    return false;
  }
  // DialogueFragment entries are valid destinations
  if (entry.fields.DialogueEntryType === "DialogueFragment") {
    return true;
  }
  return false;
}

/**
 * Resolve dialogue paths leading from the given dialogue entry.
 */
export function resolvePaths(conversation: ConversationModel, originId: number): DialoguePathType[] {
  const origin = conversation.entriesById.get(originId);
  if (!origin?.outgoingLinks) {
    return []; // Invalid start or no outgoing links
  }
  const paths: DialoguePathType[] = [];
  for (let link of origin.outgoingLinks) {
    const step: DialogueStepType = {
      link: {
        conversationId: link.destinationConversationID,
        entryId: link.destinationDialogueID
      }
    };
    // Map external destination entries
    if (link.originConversationID === link.destinationConversationID) {
      step.entry = conversation.entriesById.get(link.destinationDialogueID);
    }
    // Resolve path through non-destination entries
    if (step.entry && !isDestinationEntry(step.entry)) {
      for (let subpath of resolvePaths(conversation, step.entry.id)) {
        paths.push({
          origin: origin,
          destination: subpath.destination,
          steps: [step, ...subpath.steps]
        });
      }
    } else {
      paths.push({
        origin: origin,
        destination: step,
        steps: []
      });
    }
  }
  return paths;
}
