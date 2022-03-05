import { useConversationStore } from "@/stores/conversation";
import { useDialogueGraphStore } from "@/stores/dialogueGraph";
import type { DialogueEntryType } from "@/types";
import { storeToRefs } from "pinia";
import type { EventHandlers } from "v-network-graph";
import { ref, type Ref } from "vue";


export function useDebugTooltip(): { entries: Ref<DialogueEntryType[]>, handlers: EventHandlers } {
  const { debug } = storeToRefs(useDialogueGraphStore());
  const conversationStore = useConversationStore();
  const hoverEntries = ref<DialogueEntryType[]>([]);
  const eventHandlers: EventHandlers =  {
    "node:pointerover": ({ node }) => {
      if (debug.value) {
        const entry = conversationStore.conversation?.entriesById.get(+node);
        hoverEntries.value = entry ? [entry] : [];
      }
    },
    "node:pointerout": ({}) => {
      hoverEntries.value = [];
    },
    "edge:pointerover": ({ edges }) => {
      if (debug.value) {
        const entryIds = edges[0].split("_").slice(1, -1);
        const conversation = conversationStore.conversation;
        hoverEntries.value = entryIds
          .map(id => conversation?.entriesById.get(+id))
          .filter(entry => !!entry) as DialogueEntryType[];
      }
    },
    "edge:pointerout": ({}) => {
      hoverEntries.value = [];
    }
  };
  return {
    entries: hoverEntries,
    handlers: eventHandlers
  };
}
