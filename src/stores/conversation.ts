import type { ConversationType, DialogueEntryType, DialogueLinkType } from "@/types";
import { defineStore } from "pinia";
import { unref } from "vue";

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

export const useConversationStore = defineStore({
  id: "conversation",
  state: () => {
    return {
      loading: false,
      conversation: undefined as ConversationModel|undefined
    };
  },
  actions: {
    async load(id: number|null) {
      this.loading = true;
      try {
        this.conversation = id ? await fetchConversation(id) : undefined;
      } finally {
        this.loading = false
      }
    }
  }
});
