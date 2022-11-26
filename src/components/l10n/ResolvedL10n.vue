<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  source?: string,
  target?: string
}>();

const missing = computed(() => {
  return props.source !== "" && !props.target
});
</script>

<template>
  <div>
    <div class="source">
      {{source}}
  </div>
    <div
      class="target"
      :class=" { missing }"
      v-if="target !== undefined"
    >
      {{target}}
    </div>
  </div>
</template>

<style scoped>
.source::before {
  content: "⬤";
  color: #888888;
  margin-right: 8px;
}

.source::before {
  content: "⬤";
  font-style: normal;
  color: #888888;
  margin-right: 8px;
}

.target {
  margin-top: 4px;
}

.target::before {
  content: "⬤";
  font-style: normal;
  color: #008800;
  margin-right: 8px;
}

.missing::before {
  content: "⬤";
  color: #880000;
}
</style>
