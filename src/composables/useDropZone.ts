import { useEventListener } from "@vueuse/core";
import { ref, type Ref } from "vue";

/**
 * See https://github.com/vueuse/vueuse/blob/main/packages/core/useDropZone/index.ts
 */
export function useDropZone(
  target: Ref<HTMLElement|undefined>,
  onDrop: (entries: FileSystemEntry[]) => void,
) {
  const isOverDropZone = ref(false)
  let counter = 0;
  useEventListener<DragEvent>(target, "dragenter", (event) => {
    event.preventDefault()
    counter += 1;
    isOverDropZone.value = true;
  });
  useEventListener<DragEvent>(target, "dragover", (event) => {
    event.preventDefault();
  });
  useEventListener<DragEvent>(target, "dragleave", (event) => {
    event.preventDefault();
    if (--counter === 0)
      isOverDropZone.value = false;
  });
  useEventListener<DragEvent>(target, "drop", (event) => {
    event.preventDefault();
    counter = 0;
    isOverDropZone.value = false;
    const entries = Array.from(event.dataTransfer?.items || [])
      .map(item => item.webkitGetAsEntry())
      .filter((entry): entry is FileSystemEntry => !!entry);
    onDrop(entries);
  });
  return {
    isOverDropZone,
  };
}
