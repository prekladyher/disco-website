import { decodeEntries } from '@prekladyher/l10n-gettext';
import { defineStore } from "pinia";

/**
 * Language translation string.
 */
export interface LanguageString {

  /**
   * Translation key.
   */
  key: string;

  /**
   * Translated value.
   */
  string: string;

}

/**
 * Load PO file content as translation strings.
 */
async function loadStrings(files: File[]) {
  const strings = {} as Record<string, LanguageString>;
  for (const file of files) {
    for (const entry of decodeEntries(await file.text())) {
      if (entry.msgid !== '' && entry.msgctxt && entry.msgstr) {
        strings[entry.msgctxt] = {
          key: entry.msgctxt,
          string: entry.msgstr
        };
      }
    }
  }
  return strings;
}

/**
 * Use language translation store.
 */
export const useLanguageStore = defineStore({
  id: "language",
  state: () => {
    return {

      /**
       * Whether to show translated strings.
       */
      show: true,

      /**
       * Currently loaded files.
       */
      files: [] as File[],

      /**
       * Translation strings.
       */
      strings: {} as Record<string, LanguageString>

    };
  },
  actions: {

    async loadFiles(files: File[]) {
      this.files = files;
      this.loadStrings();
    },

    async loadStrings() {
      this.strings = this.files ? await loadStrings(this.files) : {};
    },

    async toggleShow() {
      this.show = !this.show;
    }

  }
});
