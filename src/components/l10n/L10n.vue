<script setup lang="ts">
import { useLanguageStore } from '@/stores/language';
import { computed } from '@vue/reactivity';

const props = defineProps<{
  lookup: string,
  fallback?: string
}>();

const languageStore = useLanguageStore();

const text = computed(() => {
  const string = languageStore.strings[props.lookup];
  if (!languageStore.show || !string) {
    return { value: props.fallback };
  }
  return { value: string.string };
});
</script>

<template>
{{text.value}}
</template>
