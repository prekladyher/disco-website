import { isRef, ref, unref } from "vue";

export function defineConversation(data) {
  const id = data.id;
  const fields = data.fields;
  const entries = data.dialogueEntries;

  const entryById = Object.fromEntries(data.dialogueEntries
    .map(entry => {
      return [entry.id, entry];
    }));

  const linksById = Object.fromEntries(data.dialogueEntries
    .map(entry => [
      entry.id,
      (entry.outgoingLinks || []).map((link, idx) => ({
        id: idx,
        external: link.destinationConversationID !== id,
        ...link 
      }))
    ]));

  return { id, fields, entries, entryById, linksById };
}

export function fetchConversation(id) {
  const data = ref(null);
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
