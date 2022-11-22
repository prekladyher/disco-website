
<script setup lang="ts">
import IconDebug from "@/components/icons/IconDebug.vue";
import { useConversationStore } from "@/stores/conversation";
import { storeToRefs } from "pinia";
import HeaderPanelSwitch from "./HeaderPanelSwitch.vue";

const { debug } = storeToRefs(useConversationStore());

function toggleSwitch() {
  debug.value = !debug.value;
}
</script>

<template>
  <HeaderPanelSwitch
    title="toggle debug"
    :class="{ active: debug }"
    @click="toggleSwitch()"
  >
    <IconDebug />
  </HeaderPanelSwitch>
</template>
