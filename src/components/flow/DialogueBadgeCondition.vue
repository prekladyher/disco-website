<script setup lang="ts">
const props = defineProps<{
  condition: string
}>();

const condition = props.condition.replace(/Variable\["([^"]+)"\]/g, "$1");
</script>

<template>
  <code class="badge badge-condition" title="entry condition">
    {{ condition }}
  </code>
</template>
