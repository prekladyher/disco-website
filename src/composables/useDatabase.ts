import { ref } from "vue";
import type { DialogueDatabase } from "./databaseTypes";

function createIndex<T, R>(list: T[], resolveKey: (item: T) => R) {
  return new Map(list.map(item => [resolveKey(item), item]));
}

export function fetchData() {
  const data = ref<DialogueDatabase|null>(null);
  const error = ref(null);

  function doFetch(type: string) {
    return fetch(`${import.meta.env.BASE_URL}/database/${type}.json`).then(res => res.json());
  }

  Promise.all([
    doFetch("actors"),
    doFetch("conversations"),
    doFetch("items"),
    doFetch("variables")
  ]).then(([actors, conversations, items, variables]) => {
    data.value = {
      actorsById: createIndex(actors, it => it.id),
      conversationsById: createIndex(conversations, it => it.id),
      itemsById: createIndex(items, it => it.id),
      variablesByName: createIndex(variables, it => it.fields.Name),
    };
  });

  return { data, error };
}

export function useDatabase() {
  return fetchData();
}
