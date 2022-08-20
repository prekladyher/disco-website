import type { ConversationType, DialogueEntryType, DialogueLinkType } from "@/types";
import { defineStore } from "pinia";
import { unref } from "vue";

/**
 * Loaded conversation model.
 */
export interface ConversationModel {

  /**
   * Conversation identifier.
   */
  id: number;

  /**
   * Conversation attributes.
   */
  fields: Record<string, any>;

  /**
   * Dialogue entry index.
   */
  entriesById: Map<number, DialogueEntryType>;

  /**
   * Entry link index.
   */
  linksById: Map<string, DialogueLinkType>;

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

/**
 * Use conversation store.
 */
export const useConversationStore = defineStore({
  id: "conversation",
  state: () => {
    return {

      /**
       * Flag indicating that the conversation data is being loaded.
       */
      loading: false,

      /**
       * Flag indicating whether to show additional debug information.
       */
      debug: false,

      /**
       * Conversation data mode.
       */
      conversation: undefined as ConversationModel|undefined,

      /**
       * Currently active (focused) conversation entry.
       */
      currentEntry: undefined as DialogueEntryType|undefined,

      /**
       * Currently active (focused) conversation path.
       */
      activePath: [] as DialogueEntryType[]

    };
  },
  actions: {

    /**
     * Load data for conversation with the given identifier.
     */
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

    /**
     * Switch currently active entry.
     */
    updateCurrentEntry(entry: DialogueEntryType|undefined) {
      this.currentEntry = entry;
    },

   /**
    * Switch currently active entry path.
    */
    updateActivePath(path: DialogueEntryType[]) {
      this.activePath = path;
    }

  }
});
