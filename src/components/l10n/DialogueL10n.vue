<script setup lang="ts">
import ResolvedL10n from "@/components/l10n/ResolvedL10n.vue";
import { useLanguageStore } from "@/stores/language";
import type { DialogueEntryType } from "@/types";
import { ref, watchEffect } from "vue";

const props = defineProps<{
  entry: DialogueEntryType,
  kind: string
}>();

const languageStore = useLanguageStore();

const source = ref<string>();
const target = ref<string>();

watchEffect(() => {
  const fields = props.entry.fields;
  source.value = fields[props.kind];
  target.value = languageStore.activeStrings?.[`${props.kind}/${fields["Articy Id"]}`]?.target
});
</script>

<template>
  <ResolvedL10n :source="source" :target="target" />
</template>
