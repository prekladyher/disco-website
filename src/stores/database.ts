import type { DialogueDatabase } from "@/stores/types";
import { fetchData } from "@/composables/fetchDatabase";
import { ref } from "vue";

const database = ref<DialogueDatabase|null>(null);
const pending = ref<boolean>(false);

export function useDatabase() {
  if (pending.value || database.value) {
    return { database };
  }
  fetchData().then(result => {
    database.value = result;
  });
  return { database };
}
