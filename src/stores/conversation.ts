import { fetchConversation, type ConversationModel } from "@/composables/fetchConversation";
import { defineStore } from "pinia";

export const useConversation = defineStore({
  id: "conversation",
  state: () => {
    return {
      loading: false,
      conversation: null as ConversationModel|null
    };
  },
  actions: {
    async load(id: number|null) {
      this.loading = true;
      try {
        this.conversation = id ? await fetchConversation(id) : null;
      } finally {
        this.loading = false
      }
    }
  }
});
