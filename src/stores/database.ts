import type { DialogueDatabase } from "@/types";
import { defineStore } from "pinia";
import { ref } from "vue";

/**
 * Index items with idenfier provided by the given callback.
 */
function createIndex<T, R>(list: T[], resolveKey: (item: T) => R) {
  return new Map(list.map(item => [resolveKey(item), item]));
}

/**
 * Fetch database data.
 */
export function fetchDatabase(): Promise<DialogueDatabase> {
  function doFetch(type: string) {
    return fetch(`${import.meta.env.BASE_URL}/database/${type}.json`).then(res => res.json());
  }

  return Promise.all([
    doFetch("actors"),
    doFetch("conversations"),
    doFetch("items"),
    doFetch("variables")
  ]).then(([actors, conversations, items, variables]) => {
    return {
      actorsById: createIndex(actors[0], it => it.id),
      conversationsById: createIndex(conversations, it => it.id),
      itemsById: createIndex(items[0], it => it.id),
      variablesByName: createIndex(variables[0], it => it.fields.Name),
    };
  });
}

/**
 * Use central database store.
 */
export const useDatabaseStore = defineStore({
  id: "database",
  state: () => {
    const database = ref<DialogueDatabase|null>(null);

    const loading = fetchDatabase().then(result => {
      database.value = result;
    });

    return {

      /**
       * Database loading promise.
       */
      loading,

      /**
       * Loaded database data.
       */
      database

    };
  }
});
