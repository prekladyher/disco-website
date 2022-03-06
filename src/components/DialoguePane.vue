<script setup lang="ts">
import DialogueFlow from "./DialogueFlow/DialogueFlow.vue";
</script>

<template>
  <section class="dialogue-pane">
    <DialogueFlow />
  </section>
</template>

<style scoped>
.dialogue-pane {
  color: #eeeeee;
  background: #333333;
  box-shadow: rgba(0, 0, 0, 0.4) 0px -1px 2px;
  min-height: 300px;
  height: max-content;
}
.dialogue-pane::before {
  position: absolute;
  display: block;
  content: "";
  width: 100%;
  height: 100%;
  background: url("/logo.png") center center no-repeat;
  filter: grayscale() opacity(0.1);
}
</style>
