import { isRef, ref, unref, watchEffect } from "vue";
import type { ConversationType, DialogueLinkType, DialogueEntryType } from "./databaseTypes";

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
  const data = ref<ConversationModel|null>(null);
  const error = ref(null);

  function doFetch() {
    data.value = null;
    error.value = null;
    fetch(`/database/conversations/${unref(id)}.json`)
      .then(res => res.json())
      .then(json => data.value = defineConversation(json[0]))
      .catch(err => error.value = err);
  }

  if (isRef(id)) {
    watchEffect(doFetch)
  } else {
    doFetch()
  }

  return { data, error };
}
