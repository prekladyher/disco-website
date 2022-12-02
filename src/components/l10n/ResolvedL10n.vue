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
.source::before, .target::before {
  content: "⬤";
  display: inline-block;
  font-style: normal;
  line-height: 1;
  color: #888888;
  margin-right: 4px;
}

.target {
  margin-top: 4px;
}

.target::before {
  color: #008800;
}

.missing::before {
  color: #880000;
}
</style>
