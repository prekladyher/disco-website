import { decodeEntries } from "@prekladyher/l10n-gettext";
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
   * Source string.
   */
  source: string;

  /**
   * Translated string.
   */
  target?: string;

}


/**
 * Parse PO file header.
 */
function parseHeader(value: string) {
  const header: Record<string, string> = {};
  for (const line of value.trim().split("\n")) {
    const split = line.indexOf(": ");
    if (split >= 0) {
      header[line.substring(0, split)] = line.substring(split + 2);
    }
  }
  return header;
}

/**
 * Read PO file contents.
 */
async function readFile(file: File) {
  const header: Record<string, string> = {};
  const strings: Record<string, LanguageString> = {};
  for (const entry of decodeEntries(await file.text())) {
    if (entry.msgid === "") {
      Object.assign(header, parseHeader(entry.msgstr || ""));
    } else if (entry.msgctxt) {
      strings[entry.msgctxt] = {
        key: entry.msgctxt,
        source: entry.msgid,
        target: entry.msgstr
      };
    }
  }
  return { header, strings };
}

/**
 * Use language translation store.
 */
export const useLanguageStore = defineStore({
  id: "language",
  state: () => {
    return {

      /**
       * Currently active locale.
       */
      activeLocale: "",

      /**
       * Currently loaded files.
       */
      loadedFiles: {} as Record<string, File>,

      /**
       * Loaded translation strings.
       */
      stringTables: {} as Record<string, Record<string, LanguageString>>,

    };
  },
  getters: {

    /**
     * All available locales.
     */
    availableLocales: state => Object.keys(state.stringTables),

    /**
     * Currently active language strings.
     */
    activeStrings: state => {
      return state.stringTables[state.activeLocale];
    }

  },
  actions: {

    /**
     * Clear stored strings and file references.
     */
    clear() {
      this.loadedFiles = {};
      this.stringTables = {};
    },

    /**
     * Reload loaded files.
     */
    async reloadFiles() {
      await this.loadFiles(Object.values(this.loadedFiles));
    },

    /**
     * Load strings from the given PO files.
     */
    async loadFiles(files: File[]) {
      for (const file of files) {
        await this.loadFile(file);
      }
    },

    /**
     * Load strings from the given PO file.
     */
    async loadFile(file: File) {
      try {
        const { header, strings } = await readFile(file);
        this.loadStrings(header.Language || "", strings);
        this.loadedFiles[file.name] = file;
      } catch (error) {
        console.error(`Error loading file ${file.name}:`, error);
      }
    },

    /**
     * Load language strings for the given locale.
     */
    loadStrings(locale: string, strings: Record<string, LanguageString>) {
      if (!this.stringTables[locale]) {
        this.stringTables[locale] = {};
      }
      Object.assign(this.stringTables[locale], strings);
    }

  }
});
