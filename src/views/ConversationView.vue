<script setup lang="ts">
import DialogueDebug from "@/components/DialogueDebug.vue";
import DialogueFlow from "@/components/flow/DialogueFlow.vue";
import DialogueGraph from "@/components/graph/DialogueGraph.vue";
import { IconList } from "@/components/icons";
import DialogueMinimap from "@/components/minimap/DialogueMinimap.vue";
import DialogueSearch from "@/components/search/DialogueSearch.vue";
import ToggleIcon from "@/components/shared/ToggleIcon.vue";
import { findStartEntry, useConversationStore } from "@/stores/conversation";
import { useDatabaseStore } from "@/stores/database";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const conversationStore = useConversationStore();
conversationStore.$reset(); // Always reset the store

const { conversation, currentEntry } = storeToRefs(conversationStore);

const dialogueGraph = ref<InstanceType<typeof DialogueGraph>|null>(null);

function syncCurrentEntry() {
  const entryId = route.query.entryId;
  if (typeof entryId !== "string" || !/^[0-9]+$/.test(entryId)) {
    return; // missing or invalid entryId parameter
  }
  if (currentEntry.value && currentEntry.value.id === +entryId) {
    return; // entry already synced
  }
  currentEntry.value = conversation.value?.entriesById.get(+entryId);
}

watch(() => [route.params.id, route.query.entryId], async ([id, entryId]) => {
  await useDatabaseStore().loading;
  if (!id) {
    await conversationStore.loadConversation(null);
  } else if (conversationStore.conversation?.id !== +id) {
    await conversationStore.loadConversation(+id);
  }
  if (conversation.value && typeof entryId !== "string") {
    router.replace({ ...route, query: { entryId: findStartEntry(conversation.value).id }})
  } else {
    syncCurrentEntry();
  }
}, { immediate: true });

watch(currentEntry, entry => {
  const entryId = route.query.entryId;
  if (entry && entryId !== "" + entry.id) {
    router.push({ ...route, query: { entryId: entry.id }});
  }
});

const showDialogue = ref(true);
</script>

<template>
  <main>
    <section class="dialogue-graph">
      <DialogueGraph
        ref="dialogueGraph"
        :conversation="conversation"
      />
      <div class="toggle-dialogue">
        <ToggleIcon v-model="showDialogue" title="toggle dialogue">
          <IconList />
        </ToggleIcon>
      </div>
    </section>
    <Transition name="pane">
      <section
        v-if="showDialogue"
        class="dialogue-pane"
        :class="{ empty: !currentEntry }"
      >
        <DialogueFlow />
      </section>
    </Transition>
    <DialogueSearch />
    <DialogueMinimap :graph="dialogueGraph" />
  </main>
  <DialogueDebug />
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.dialogue-graph {
  display: flex;
  flex: 1;
}
.dialogue-graph > :first-child {
  flex: 1;
}

.dialogue-pane {
  background: var(--color-background-soft);
  box-shadow: rgba(0, 0, 0, 0.4) 0px -1px 2px;
  overflow-y: scroll;
  max-height: 50%;
  flex-basis: min(300px, 50%);
}
.dialogue-pane.empty::before {
  position: absolute;
  display: block;
  content: "";
  width: 100%;
  height: 100%;
  background: url("/logo.png") center center no-repeat;
  filter: grayscale() opacity(0.1);
}

.toggle-dialogue {
  position: absolute;
  bottom: 12px;
  left: 12px;
  border: 2px solid var(--color-border);
  border-radius: 18px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 2px;
  background: var(--color-background-soft);
}

.pane-enter-active,
.pane-leave-active {
  overflow: hidden;
  transition: flex-basis 200ms ease-in-out;
}

.pane-enter-from,
.pane-leave-to {
  overflow: hidden;
  flex-basis: 0;
}
</style>
