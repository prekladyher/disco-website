import { decodeEntries } from "@prekladyher/l10n-toolbox-gettext";
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
 * Read file system entry as file.
 */
function entryToFile(entry: FileSystemFileEntry) {
  return new Promise<File>((resolve, reject) => entry.file(resolve, reject));
}

/**
 * List child file system entries of the given directory entry.
 */
function listChildEntries(entry: FileSystemDirectoryEntry) {
  return new Promise<FileSystemEntry[]>((resolve, reject) => entry.createReader().readEntries(resolve, reject));
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
      loadedFiles: {} as Record<string, FileSystemFileEntry>,

      /**
       * Loaded translation strings.
       */
      stringTables: {} as Record<string, Record<string, LanguageString>>,

    };
  },
  getters: {

    /**
     * Number of currently loaded files.
     */
    loadedCount: state => Object.keys(state.loadedFiles).length,

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
      await Promise.all(Object.values(this.loadedFiles).map(entry => this.loadFile(entry)));
    },

    /**
     * Load strings from PO files contained in the given FS entries.
     */
    async loadFiles(entries: FileSystemEntry[], limit = 10) {
      for (const entry of entries) {
        if (entry.isDirectory) {
          if (limit === 0) {
            console.error(`Directory traversal limit reached: ${entry.fullPath}`);
          } else {
            await this.loadFiles(await listChildEntries(entry as FileSystemDirectoryEntry), limit - 1);
          }
        } else if (entry.isFile) {
          await this.loadFile(entry as FileSystemFileEntry);
        } else {
          console.error(`Unknown entry type: ${entry.fullPath}`);
        }
      }
    },

    /**
     * Load strings from the given PO file entry.
     */
    async loadFile(entry: FileSystemFileEntry) {
      try {
        const file = await entryToFile(entry);
        if (!file.name.endsWith(`.po`)) {
          console.error(`Ignoring invalid filename extension: ${file.name}`);
          return;
        }
        const { header, strings } = await readFile(file);
        this.loadStrings(header.Language || "", strings);
        this.loadedFiles[entry.fullPath] = entry;
      } catch (error) {
        console.error(`Error loading file ${entry.fullPath}:`, error);
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
