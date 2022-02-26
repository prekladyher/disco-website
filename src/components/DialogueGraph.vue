<script setup>
import { unref } from "@vue/reactivity";

const { conversation } = defineProps({
  conversation: { 
    type: Object,
    required: true 
  }
});

const configs = {
  view: {
    fit: true,
  }
};

const nodes = Object.fromEntries(conversation.entries.map(entry => {
  const node = {
    name: entry.id,
    x: entry.canvasRect.x,
    y: entry.canvasRect.y,
    ...entry,
  };
  return [entry.id, node];
}));

const layouts = { nodes };

const edges = Object.fromEntries(Object.values(conversation.linksById)
  .flat()
  .filter(link => !link.external)
  .map(link => [
    `${link.originDialogueID}_${link.id}`, 
    { source: link.originDialogueID, target: link.destinationDialogueID, data: link }
  ]));
</script>

<template>
  <VNetworkGraph 
    :configs="configs"
    :nodes="nodes"
    :edges="edges"
    :layouts="layouts" 
  />
</template>

<style scoped>
</style>
