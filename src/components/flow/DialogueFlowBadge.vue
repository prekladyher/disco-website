<script setup lang="ts">
import ScriptCondition from "@/components/script/ScriptCondition.vue";
import ScriptSource from "@/components/script/ScriptSource.vue";
import { computed } from "vue";

const props = defineProps<{
  value?: string,
  type: "condition" | "script",
  title?: string
}>();

const title = computed(() => {
  if (props.title) {
    return props.title;
  }
  if (props.type === "condition") {
    return "entry condition";
  }
  if (props.type === "script") {
    return "user script";
  }
  return null;
});
</script>

<template>
  <div v-if="value" class="badge" :class="'badge-' + type" :title="title">
    <ScriptCondition v-if="type === 'condition'" :value="value" />
    <ScriptSource v-if="type === 'script'" :value="value" />
  </div>
</template>
