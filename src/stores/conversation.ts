import type { ConversationType, DialogueEntryType, DialogueLinkType } from "@/types";
import { defineStore } from "pinia";
import { unref } from "vue";

export interface ConversationModel {
  id: number,
  fields: Record<string, any>,
  entriesById: Map<number, DialogueEntryType>
  linksById: Map<string, DialogueLinkType>
}

/**
 * Build conversation model from the given conversation data.
 */
export function defineConversation(data: ConversationType): ConversationModel {
  const id = data.id;
  const fields = data.fields;
  const entries = data.dialogueEntries || [];

  const entriesById = new Map(entries.map(entry => [entry.id, entry]));

  const linksById = new Map(entries.map(entry => {
    return (entry.outgoingLinks || []).map((link, idx) => ({
      id: `${entry.id}_${idx}`,
      ...link
    }));
  }).flat().map(link => [link.id, link]));

  return { id, fields, entriesById, linksById };
}

/**
 * Fetch conversation data from the server.
 */
export function fetchConversation(id: number) {
  return fetch(`${import.meta.env.BASE_URL}/database/conversations/${unref(id)}.json`)
      .then(res => res.json())
      .then(json => defineConversation(json[0]))
}

/**
 * Find valid conversation start entry.
 */
 export function findStartEntry(conversation: ConversationModel): DialogueEntryType {
  // Entry 0 should be START and entry 1 should be INPUT
  const inputEntry = conversation.entriesById.get(1)
  if (inputEntry && inputEntry.outgoingLinks?.length) {
    return conversation.entriesById.get(0) as DialogueEntryType;
  }

  // Get entries that could be used as a start entry
  const validEntries = Array.from(conversation.entriesById.values())
    .filter(entry => entry.fields.DialogueEntryType);
  if (!validEntries.length) {
    return conversation.entriesById.get(0) as DialogueEntryType;
  }

  // Get the leftmost entry as fallback
  return validEntries
    .reduce((result, entry) => result.canvasRect.x < entry.canvasRect.x ? result : entry);
}


export const useConversationStore = defineStore({
  id: "conversation",
  state: () => {
    return {
      loading: false,
      debug: false,
      conversation: undefined as ConversationModel|undefined,
      currentEntry: undefined as DialogueEntryType|undefined,
      activePath: [] as DialogueEntryType[]
    };
  },
  actions: {
    async loadConversation(id: number|null) {
      this.loading = true;
      try {
        this.conversation = id ? await fetchConversation(id) : undefined;
        this.currentEntry = undefined;
        this.activePath = [];
      } finally {
        this.loading = false
      }
    },
    updateCurrentEntry(entry: DialogueEntryType|undefined) {
      this.currentEntry = entry;
    },
    updateActivePath(path: DialogueEntryType[]) {
      this.activePath = path;
    }
  }
});
