import { isRef, ref, unref, watchEffect } from "vue";
import type { ConversationType, DialogueLinkType, DialogueEntryType } from "../stores/types";

export interface ConversationModel {
  id: number,
  fields: Record<string, any>,
  entriesById: Map<number, DialogueEntryType>
  linksById: Map<string, DialogueLinkType>
}

export function defineConversation(data: ConversationType): ConversationModel {
  const id = data.id;
  const fields = data.fields;
  const entries = data.dialogueEntries || [];

  const entriesById = new Map(entries.map(entry => [entry.id, entry]));

  const linksById = new Map(entries.map(entry => {
    return (entry.outgoingLinks || []).map((link, idx) => ({
      id: `${entry.id}_${idx}`,
      external: link.destinationConversationID !== id,
      ...link
    }));
  }).flat().map(link => [link.id, link]));

  return { id, fields, entriesById, linksById };
}

export function fetchConversation(id: number) {
  return fetch(`${import.meta.env.BASE_URL}/database/conversations/${unref(id)}.json`)
      .then(res => res.json())
      .then(json => defineConversation(json[0]))
}
