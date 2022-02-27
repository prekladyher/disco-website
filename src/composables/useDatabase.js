import { ref } from "vue";

function createIndex(list, resolveKey) {
  return Object.fromEntries(list.map(item => [resolveKey(item), item]));
}

export function fetchData() {
  const data = ref(null);
  const error = ref(null);

  function doFetch(type) {
    return fetch(`/database/${type}.json`).then(res => res.json());
  }

  Promise.all([
    doFetch("actors"),
    doFetch("conversations"),
    doFetch("items"),
    doFetch("variables")
  ]).then(([actors, conversations, items, variables]) => {
    data.value = {
      actors, 
      actorsById: createIndex(it, it => it.id),
      conversations,
      conversationsById: createIndex(it, it => it.id),
      items,
      itemsById: createIndex(it, it => it.id),
      variables,
      variablesByName: createIndex(it, it => it.fields.Name),
    };
  });

  doFetch()

  return { data, error };
}

export function useDatabase() {
  return fetchData();
}
