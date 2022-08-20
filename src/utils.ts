import { ref } from "vue";

/**
 * Simple debounce function wrapper.
 */
export function debounce(callback: Function, delay = 0) {
  let debounceId = 0;
  const pending = ref(false);
  const handler = (...params: any[]) => {
    pending.value = true;
    if (debounceId) {
      clearTimeout(debounceId);
    }
    debounceId = setTimeout(() => {
      callback(...params);
      debounceId = 0;
      pending.value = false;
    }, delay);
  };
  return { handler, pending };
}
