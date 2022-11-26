<script setup lang="ts">
const props = defineProps<{
  script: string
}>();

const script = props.script.replace(/--\[\[ Variable\[ \]\];?$/, "");
</script>

<template>
  <code class="badge badge-script" title="script">
    {{ script }}
  </code>
</template>
